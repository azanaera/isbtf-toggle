package ext.integration.plugin.policy.mapper

uses ext.integration.plugin.policy.SurePolicyService
uses gw.api.system.server.ServerUtil
uses gw.api.util.TypecodeMapperUtil
uses gw.surepath.suite.integration.logging.StructuredLogger
uses com.surepolicy.rest.model.InlineResponse2001
uses com.surepolicy.rest.model.LongPolicyNumberCoverageVariables
uses com.surepolicy.rest.model.LongPolicyNumberFarmersDrivers
uses com.surepolicy.rest.model.LongPolicyNumberFarmersEndorsements
uses com.surepolicy.rest.model.LongPolicyNumberFarmersVehicles
uses com.surepolicy.rest.model.LongPolicyNumberGarageAddress
uses com.surepolicy.rest.model.LongPolicyNumberPersonAddress
uses com.surepolicy.rest.model.LongPolicyNumberVariables
uses entity.Address
uses gw.api.financials.CurrencyAmount
uses gw.api.util.CurrencyUtil
uses gw.api.util.DateUtil
uses gw.api.util.DisplayableException


class PersonalAutoMapper extends SurePolicyMapper {
  private static var _logger = StructuredLogger.PLUGIN
  private static var mapper = TypecodeMapperUtil.getTypecodeMapper()
  private static var pasNamespace = "tog:PAS"
  private static var pasNamespacePA = "tog:PAS:PA"
  /**
   * Function takes the returned policy from Sure and creates policy summaries for PersonalAuto
   *
   * @param criteria Search criteria from the UI
   * @return a PolicySearchResultSet containing the results of the search
   */
  public static function createPolicySummaries(surePolicyList : List<com.surepolicy.rest.model.InlineResponse2001>, lossDate : Date) : PolicySearchResultSet {
    _logger.debug("Creating Policy Summary")
    var policySummaries = new PolicySearchResultSet()
    for (surePolicy in surePolicyList) {
      _logger.trace("Creating policy Summary for Policy From Sure PAS :method = SurePolicyService#createPolicySummaries(List<com.surepolicy.rest.model.InlineResponse2001>)"
          , :parameters = {"Policy Number" -> surePolicy.PolicyNumber})
      var newSummary = new PolicySummary()
      var statusCode : String = surePolicy.Status != null ? mapper.getInternalCodeByAlias("PolicyStatus", pasNamespace, surePolicy.Status) : null
      newSummary.PolicyType = PolicyType.TC_PERSONALAUTO
      newSummary.PolicyNumber = surePolicy.PolicyNumber
      newSummary.EffectiveDate = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.StartsAt))
      newSummary.ExpirationDate = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.EndsAt))
      var pni = getPNIFromDrivers(surePolicy.FarmersDrivers)
      newSummary.InsuredName = "${pni.Person.FirstName} ${pni.Person.LastName}"
      newSummary.AddressLine1 = surePolicy.RatingAddress.Line1
      newSummary.AddressLine2 = surePolicy.RatingAddress.Line2
      newSummary.City = surePolicy.RatingAddress.City
      newSummary.PostalCode = surePolicy.RatingAddress.Postal
      newSummary.State = typekey.State.getTypeKey(surePolicy.RatingAddress.Region.Code)
      newSummary.Status = typekey.PolicyStatus.getTypeKey(statusCode)
      for (currentVehicleEntry in surePolicy.FarmersVehicles) {
        var aVehicle = new PolicySummaryVehicle()
        aVehicle.VehicleNumber = currentVehicleEntry.NewVenturesVehicleId
        aVehicle.Make = currentVehicleEntry.Make
        aVehicle.Model = currentVehicleEntry.Model
        aVehicle.Vin = currentVehicleEntry.Vin
        newSummary.addToVehicles(aVehicle)
      }
      newSummary.LossDate = lossDate
      policySummaries.addToSummaries(newSummary)
      _logger.trace("Policy Summary created for Policy From Sure PAS :method = SurePersonalAutoService#createPolicySummaries(List<com.surepolicy.rest.model.InlineResponse2001>)"
          , :parameters = {"Policy Number" -> surePolicy.PolicyNumber})
    }
    _logger.debug("Exiting Policy Summary creation")
    return policySummaries
  }


  static function createPolicyDetails(resultList : List<InlineResponse2001>, lossDate : Date) : PolicyRetrievalResultSet {
    _logger.debug("Creating Policy Details")
    var resultSet = new PolicyRetrievalResultSet()
    var surePolicy = resultList[0]
    var policy = new entity.Policy()
    addPolicyDetails(policy, surePolicy)
    addPolicyPNI(policy, getPNIFromDrivers(surePolicy.FarmersDrivers), surePolicy.RatingAddress)
    addPolicyContacts(policy, surePolicy.FarmersDrivers.where(\contact -> contact.RelationshipToInsured != "self"))
    addVehicleRUCoverages(policy, surePolicy.FarmersVehicles, surePolicy.Status, surePolicy.CoverageVariables.where(\cov -> cov.Purchased))
    addPolicyEndorsements(policy, surePolicy.FarmersEndorsements)
    resultSet.Result = policy
    return resultSet
  }

  private static function addPolicyEndorsements(policy : Policy, farmersEndorsements : List<LongPolicyNumberFarmersEndorsements>) {
    _logger.trace("Adding Endorsements to Policy :method = SurePersonalAutoService#addPolicyEndorsements(policy : Policy, farmersEndorsements : List<LongPolicyNumberFarmersEndorsements>)"
        , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
        , "Sure Endorsements" -> String.valueOf(farmersEndorsements)}))
    for (endorsement in farmersEndorsements) {
      _logger.debug("Creating Policy Endorsements")
      var anEndorsement = new Endorsement()
      anEndorsement.FormNumber = endorsement.FormCode
      anEndorsement.Description = endorsement.Description
      anEndorsement.PolicySystemId = endorsement.Id
      var createdAt = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(endorsement.CreatedAt))
      anEndorsement.EffectiveDate = determineEffectiveDate(createdAt, policy.EffectiveDate)
      anEndorsement.Edition_Ext = endorsement.FormEdition
      anEndorsement.Vehicle_Ext = maybeAddAssciatedVehicle(policy, endorsement.VehicleId)
      anEndorsement.ExpirationDate = endorsement.Deleted != null ? formatDateWithTimeZone(DateUtil.UTCDateStringToDate(endorsement.Deleted)) : policy.ExpirationDate
      policy.addToEndorsements(anEndorsement)
      _logger.trace("Added Endorsement to Policy :method = SurePersonalAutoService#addPolicyEndorsements(policy : Policy, farmersEndorsements : List<LongPolicyNumberFarmersEndorsements>)"
          , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
          , "Endorsement" -> String.valueOf(anEndorsement)}))
    }
  }



  private static function maybeAddAssciatedVehicle(policy : Policy, vehicleId : Integer) : Vehicle {
    var endorsedVehicle : Vehicle
    if (vehicleId != null){
      for (VehicleRU in policy.Vehicles){
        if (VehicleRU.Vehicle.PolicySystemId == String.valueOf(vehicleId)){
          endorsedVehicle = VehicleRU.Vehicle
        }
      }
    }
    return endorsedVehicle
  }

  private static function addVehicleRUCoverages(policy : Policy, farmersVehicles : List<LongPolicyNumberFarmersVehicles>, policyStatus : String, policyCovs : List<LongPolicyNumberCoverageVariables>) {
    _logger.trace("Adding vehicles and VehicleRU Coverages Policy :method = SurePersonalAutoService#addVehicleRUCoverages(policy : Policy, farmersVehicles : List<LongPolicyNumberFarmersVehicles>, policyStatus : String)"
        , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
        , "Sure Vehicles" -> String.valueOf(farmersVehicles)}))
    for (vehicle in farmersVehicles) {
      var aVehicle = new Vehicle()
      aVehicle.PolicySystemId = String.valueOf(vehicle.Id)
      aVehicle.Make = vehicle.Make
      aVehicle.Model = vehicle.Model
      aVehicle.Vin = vehicle.Vin
      aVehicle.State = typekey.Jurisdiction.getTypeKey(vehicle.GarageAddress.Region.Code)
      aVehicle.Style = VehicleStyle.TC_PASSENGERCAR
      if (vehicle.Lienholder != null) {
        aVehicle.addToLienholders(addLienHolderDetails(vehicle.Lienholder))
      }
      aVehicle.Year = vehicle.Year
      aVehicle.EffectiveDate_Ext = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(vehicle.AddDate))
      aVehicle.ExpirationDate_Ext = vehicle.Deleted != null ? formatDateWithTimeZone(DateUtil.UTCDateStringToDate(vehicle.Deleted)) : policy.ExpirationDate
      aVehicle.VehicleStatus_Ext = determineVehicleStatus(vehicle.Deleted, policyStatus)
      aVehicle.RideshareUse_Ext = vehicle.RideshareUse
      aVehicle.BusinessUse_Ext = vehicle.BusinessUse
      var aVehicleRU = new VehicleRU()
      aVehicleRU.RUNumber = vehicle.NewVenturesVehicleId
      aVehicleRU.Vehicle = aVehicle
      var polLocation = new PolicyLocation()
      polLocation.Address = createPolicyAddress(vehicle.GarageAddress)
      aVehicleRU.VehicleLocation = polLocation
      for (polCov in policyCovs) {
        var aPolicyCoverage = new VehicleCoverage()
        var covTypeCode = mapper.getInternalCodeByAlias("CoverageType", pasNamespacePA, polCov.Variable)
        if (covTypeCode == null) {
          _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria),
              :parameters = {"Policy Number" -> policy.PolicyNumber, "Coverage Code" -> polCov.Variable})
          throw new DisplayableException("Policy Search service Failed. Unknown Coverage sent from Policy System. Please contact support. Time of Error: " + ServerUtil.systemDateTime() + ", Error Message: Unknown Coverage: " + polCov.Variable)
        }
        aPolicyCoverage.Type = typekey.CoverageType.getTypeKey(covTypeCode)
        aPolicyCoverage.Currency = CurrencyUtil.DefaultCurrency
        var createdAt = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(polCov.EffectiveDate))
        aPolicyCoverage.EffectiveDate = determineEffectiveDate(createdAt, policy.EffectiveDate)
        aPolicyCoverage.ExpirationDate = polCov.Deleted != null ? formatDateWithTimeZone(DateUtil.UTCDateStringToDate(polCov.Deleted)) : policy.ExpirationDate
        if (polCov.Value != null) {
          aPolicyCoverage.ExposureLimit = new CurrencyAmount(polCov.Value)
        }
        if (polCov.LimitOfOccurrence != null) {
          aPolicyCoverage.IncidentLimit = new CurrencyAmount(polCov.LimitOfOccurrence)
        }
        aVehicleRU.addToCoverages(aPolicyCoverage)
      }
      for (vehicleCov in vehicle.Variables.where(\vehCov -> vehCov.Purchased)) {
        var covTypeCode = mapper.getInternalCodeByAlias("CoverageType", pasNamespacePA, vehicleCov.Variable)
        if (covTypeCode == null){
          _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria),
              :parameters = {"Policy Number" -> policy.PolicyNumber, "Coverage Code" -> vehicleCov.Variable})
          throw new DisplayableException("Policy Search service Failed. Unknown Coverage sent from Policy System. Please contact support. Time of Error: " + ServerUtil.systemDateTime() + ", Error Message: Unknown Coverage: " + vehicleCov.Variable)
        }
        var aVehicleCov = new VehicleCoverage()
        aVehicleCov.Type = typekey.CoverageType.getTypeKey(covTypeCode)
        aVehicleCov.Currency = CurrencyUtil.DefaultCurrency
        var createdAt = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(vehicleCov.EffectiveDate))
        aVehicleCov.EffectiveDate = determineEffectiveDate(createdAt, policy.EffectiveDate)
        aVehicleCov.ExpirationDate = vehicleCov.Deleted != null ? formatDateWithTimeZone(DateUtil.UTCDateStringToDate(vehicleCov.Deleted)) : policy.ExpirationDate
        if (vehicleCov.Variable == "ridesharing") {
          var covTerm = new FinancialCovTerm()
          var covTermMapper = mapper.getInternalCodeByAlias("CovTermPattern", pasNamespacePA, vehicleCov.Variable)
          covTerm.FinancialAmount = CurrencyAmount.getStrict(new CurrencyAmount("500"), Currency.TC_USD)
          covTerm.CovTermPattern = CovTermPattern.getTypeKey(covTermMapper)
          covTerm.ModelAggregation = CovTermModelAgg.TC_EW_EXT
          var sideHustleCovTerm = new NumericCovTerm()
          sideHustleCovTerm.CovTermPattern = CovTermPattern.getTypeKey(covTermMapper)
          sideHustleCovTerm.Units = CovTermModelVal.TC_WEEKS_EXT
          sideHustleCovTerm.NumericValue = 4
          aVehicleCov.addToCovTerms(sideHustleCovTerm)
          aVehicleCov.addToCovTerms(covTerm)
        }
        if (vehicleCov.Value != null) {
          assignCovTermValues(vehicleCov, aVehicleCov)
        }
        if (vehicleCov.LimitOfOccurrence != null) {
          aVehicleCov.IncidentLimit = new CurrencyAmount(vehicleCov.LimitOfOccurrence)
        }
        if (aVehicleCov.Policy == null){
          aVehicleCov.Policy=policy
        }
        aVehicleRU.addToCoverages(aVehicleCov)
      }
      policy.addToRiskUnits(aVehicleRU)
      _logger.trace("Added Vehicle and VehicleRU Coverages to Policy :method = SurePersonalAutoService#addVehicleRUCoverages(policy : Policy, farmersVehicles : List<LongPolicyNumberFarmersVehicles>, policyStatus : String)"
          , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
          , "VehicleRU" -> String.valueOf(aVehicleRU), "Vehicle" -> String.valueOf(aVehicle)}))
    }
  }

  private static function assignCovTermValues(vehicleCov : LongPolicyNumberVariables, aVehicleCov : VehicleCoverage) {
    var covTerm = new entity.FinancialCovTerm()
    var covTermMapper = mapper.getInternalCodeByAlias("CovTermPattern", pasNamespacePA, vehicleCov.Variable)
    if (covTermMapper == null){
      _logger.error("Error occured when calling Mapping CovTerms from Sure system", PersonalAutoMapper#assignCovTermValues(LongPolicyNumberVariables, VehicleCoverage),
          :parameters = {"Sure Vehicle Cov" -> String.valueOf(vehicleCov), "Coverage Code" -> aVehicleCov.Type.DisplayName})
      throw new DisplayableException("Policy Search service Failed. Unknown Coverage sent from Policy System. Please contact support. Time of Error: " + ServerUtil.systemDateTime() + ", Error Message: Unknown Coverage: ${vehicleCov.Variable}")
    }
    covTerm.CovTermPattern = CovTermPattern.getTypeKey(covTermMapper)
    covTerm.FinancialAmount = CurrencyAmount.getStrict(new CurrencyAmount(vehicleCov.Value), Currency.TC_USD)
    if (covTerm.CovTermPattern == CovTermPattern.TC_PATMPRIDECOV_EXT) {
      covTerm.ModelAggregation = CovTermModelAgg.TC_PD_EXT
      var tmpRideCovCovTerm = new NumericCovTerm()
      tmpRideCovCovTerm.CovTermPattern = CovTermPattern.getTypeKey(covTermMapper)
      tmpRideCovCovTerm.Units = CovTermModelVal.TC_DAYS
      tmpRideCovCovTerm.NumericValue = 20
      aVehicleCov.addToCovTerms(tmpRideCovCovTerm)
    }
    aVehicleCov.addToCovTerms(covTerm)
  }

  private static function addPolicyContacts(policy : Policy, contacts : List<LongPolicyNumberFarmersDrivers>) {
    for (contact in contacts) {
      _logger.trace("Adding contact to Policy :method = SurePersonalAutoService#addPolicyContacts(policy : Policy, contacts : List<LongPolicyNumberFarmersDrivers>)"
          , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
          , "Sure Contact" -> String.valueOf(contact)}))
      var polContact = new Person()
      polContact.PolicySystemId = contact.Person.Id
      polContact.FirstName = contact.Person.FirstName
      polContact.LastName = contact.Person.LastName
      polContact.LicenseNumber = contact.DrivingLicenseNumber
      polContact.LicenseState = Jurisdiction.getTypeKey(contact.DrivingLicenseState)
      polContact.MaritalStatus = MaritalStatus.getTypeKey(contact.Person.MaritalStatus)
      polContact.DateOfBirth = DateUtil.UTCDateStringToDate(contact.Person.Dob)
      polContact.CellPhone = contact.Person.PhoneNumber
      polContact.EmailAddress1 = contact.Person.Email
      polContact.PrimaryAddress = getPrimaryAddress(contact.Person.Address)
      var contactRole = contact.IsExcluded ? ContactRole.TC_EXCLUDEDPARTY : ContactRole.TC_COVEREDPARTY
      var claimContactRole = policy.addRole(contactRole, polContact)
      updateClaimContactandRole(claimContactRole, contact)
      _logger.trace("Contact added to Policy :method = SurePersonalAutoService#addPolicyContacts(policy : Policy, contacts : List<LongPolicyNumberFarmersDrivers>)"
          , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
          , "Policy Contact" -> String.valueOf(contactRole)}))
    }
  }

  private static function addPolicyPNI(policy : Policy, pni : LongPolicyNumberFarmersDrivers, ratingAddress : com.surepolicy.rest.model.LongPolicyNumberGarageAddress) {
    _logger.trace("Adding PNI to Policy :method = SurePersonalAutoService#addPolicyPNI(policy : Policy, pni : LongPolicyNumberFarmersDrivers, ratingAddress : com.surepolicy.rest.model.LongPolicyNumberGarageAddress)"
        , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
        , "Sure PNI" -> String.valueOf(pni), "Sure Rating Address" -> String.valueOf(ratingAddress)}))
    var insured = new Person()
    _logger.debug("Creating Policy Insured Details")
    insured.PolicySystemId = pni.Person.Id
    insured.FirstName = pni.Person.FirstName
    insured.LastName = pni.Person.LastName
    insured.LicenseState = Jurisdiction.getTypeKey(pni.DrivingLicenseState)
    insured.LicenseNumber = pni.DrivingLicenseNumber
    insured.MaritalStatus = MaritalStatus.getTypeKey(pni.Person.MaritalStatus)
    insured.DateOfBirth = DateUtil.UTCDateStringToDate(pni.Person.Dob)
    insured.CellPhone = pni.Person.PhoneNumber
    insured.EmailAddress1 = pni.Person.Email
    var insuredAddress = createPolicyAddress(ratingAddress)
    insured.PrimaryAddress = insuredAddress
    policy.insured = insured
    var pniClaimContactRole = policy.getClaimContactRoleByRole(ContactRole.TC_INSURED)
    updateClaimContactandRole(pniClaimContactRole, pni)
    _logger.trace("PNI Added to Policy :method = SurePersonalAutoService#addPolicyPNI(policy : Policy, pni : LongPolicyNumberFarmersDrivers, ratingAddress : com.surepolicy.rest.model.LongPolicyNumberGarageAddress) Insured: " +
        policy.insured)
  }

  private static function updateClaimContactandRole(claimContactRole : ClaimContactRole, sureDriver : LongPolicyNumberFarmersDrivers) {
    var coveredPartyType = sureDriver.Role != null ? mapper.getInternalCodeByAlias("CoveredPartyType", pasNamespacePA, sureDriver.Role) : null
    claimContactRole.AddDate_Ext = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(sureDriver.AddDate))
    claimContactRole.CoveredPartyType = typekey.CoveredPartyType.getTypeKey(coveredPartyType)
    claimContactRole.IsExcluded_Ext = sureDriver.IsExcluded
    var claimContact = claimContactRole.ClaimContact
    claimContact.NonDriverReason_Ext = NonDriverReason_Ext.getTypeKey(sureDriver.NonDriverReason)
    claimContact.RelationshipToInsured_Ext = PersonRelationType.getTypeKey(sureDriver.RelationshipToInsured)
    claimContact.HasSR22Response_Ext = sureDriver.HasSr22Response
    claimContact.RevokedSuspendedLicense_Ext = sureDriver.RevokedSuspendedLicense
  }

  private static function createPolicyAddress(sureAddress : LongPolicyNumberGarageAddress) : Address {
    _logger.trace("Creating Address :method = SurePersonalAutoService#createPolicyAddress(sureAddress : LongPolicyNumberGarageAddress)"
        , :parameters = ({"Sure Address" -> String.valueOf(sureAddress)}))
    var address = new Address()
    address.AddressLine1 = sureAddress.Line1
    address.AddressLine2 = sureAddress.Line2
    address.AddressType = AddressType.TC_HOME
    address.City = sureAddress.City
    address.State = State.getTypeKey(sureAddress.Region.Code)
    address.Country = Country.getTypeKey(sureAddress.Country.Alpha2)
    address.PostalCode = sureAddress.Postal
    _logger.trace("Address Created :method = SurePersonalAuto#createPolicyAddress(sureAddress : LongPolicyNumberGarageAddress)"
        , :parameters = ({"Address" -> String.valueOf(address)}))
    return address
  }

  private static function addPolicyDetails(policy : Policy, surePolicy : InlineResponse2001) {
    _logger.trace("Adding Policy Details for Policy From Sure PAS :method = SurePersonalAutoService#addPolicyDetails(policy : Policy, surePolicy : InlineResponse2001)"
        , :parameters = ({"SurePolicy Policy Number" -> surePolicy.PolicyNumber, "SurePolicy Effective Date" -> surePolicy.StartsAt}))
    var statusCode = surePolicy.Status != null ? mapper.getInternalCodeByAlias("PolicyStatus", pasNamespace, surePolicy.Status) : null
    policy.PolicyType = typekey.PolicyType.TC_PERSONALAUTO
    policy.Status = typekey.PolicyStatus.getTypeKey(statusCode)
    policy.PolicyNumber = surePolicy.PolicyNumber
    policy.EffectiveDate = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.StartsAt))
    policy.ExpirationDate = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.EndsAt))
    policy.TotalVehicles = surePolicy.FarmersVehicles.Count
    policy.CancellationDate = surePolicy.CanceledAt != null ? formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.CanceledAt)) : null
    policy.Currency = Currency.TC_USD
    policy.Edition_Ext = surePolicy.EditionNumber
    policy.FormNumber_Ext = surePolicy.FormNumber
    policy.PolicyState_Ext = State.getTypeKey(surePolicy.State)
    policy.CreatedAt_Ext = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.CreatedAt))
    policy.SurePolicySystemPeriodID_Ext = surePolicy.Id
    policy.Term_Ext = surePolicy.TermNumber
    policy.RenewalCadence_Ext = surePolicy.Service.RenewalCadence
    policy.UnderwritingCo = UnderwritingCompanyType.getTypeKey(surePolicy.CompanyCode)

    _logger.trace("Policy Details added for Policy From Sure PAS :method = SurePersonalAutoService#addPolicyDetails(policy : Policy, surePolicy : InlineResponse2001)"
        , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
        , "SurePolicy Policy Number" -> surePolicy.PolicyNumber, "SurePolicy Effective Date" -> surePolicy.StartsAt}))
  }

  private static function getPrimaryAddress(address : LongPolicyNumberPersonAddress) : Address {
    _logger.trace("Creating Address :method = SurePersonalAutoService#createPolicyAddress(address : LongPolicyNumberPersonAddress)"
        , :parameters = ({"Sure Address" -> String.valueOf(address)}))
    var contactAddress = new Address()
    contactAddress.AddressLine1 = address.Line1
    contactAddress.AddressLine2 = address.Line2
    contactAddress.City = address.City
    contactAddress.County = address.County
    contactAddress.PostalCode = address.Postal
    contactAddress.Country = Country.getTypeKey(address.Country.Alpha2)
    contactAddress.State = typekey.State.getTypeKey(address.Region.Code)
    _logger.trace("Creating Address :method = SurePersonalAutoService#createPolicyAddress(address : LongPolicyNumberPersonAddress)"
        , :parameters = ({"Address" -> String.valueOf(contactAddress)}))
    return contactAddress
  }

  private static function determineVehicleStatus(vehicleDeleted : String, status : String) : PolicyStatus {
    _logger.trace("Setting Vehicle Status :method = SurePersonalAutoService#determineVehicleStatus(vehicle : LongPolicyNumberFarmersVehicles, status : String)"
        , :parameters = ({"Policy Status" -> status, "Sure Vehicle" -> vehicleDeleted}))
    var vehicleStatus : PolicyStatus
    switch (status) {
      case "inforce":
        vehicleStatus = vehicleDeleted == null ? PolicyStatus.TC_INFORCE : PolicyStatus.TC_EXPIRED
        break
      case "canceled_non_payment":
        vehicleStatus = PolicyStatus.TC_CANCELED
        break
      case "canceled":
        vehicleStatus = PolicyStatus.TC_CANCELED
        break
      case "lapsed_payment":
        vehicleStatus = vehicleDeleted == null ? PolicyStatus.TC_INFORCE : PolicyStatus.TC_EXPIRED
        break
      case "out_of_force":
        vehicleStatus = PolicyStatus.TC_EXPIRED
        break
      case "renewed":
        vehicleStatus = vehicleDeleted == null ? PolicyStatus.TC_INFORCE : PolicyStatus.TC_EXPIRED
        break
      default:
        vehicleStatus = vehicleDeleted == null ? PolicyStatus.TC_INFORCE : PolicyStatus.TC_EXPIRED
        break
    }
    _logger.trace("Vehicle Status set :method = SurePersonalAutoService#determineVehicleStatus(vehicleDeleted : String, status : String)"
        , :parameters = ({"Policy Status" -> status, "Vehicle Status" -> String.valueOf(vehicleStatus)}))
    return vehicleStatus
  }

  private static function addLienHolderDetails(lienholder : com.surepolicy.rest.model.LongPolicyNumberLienholder) : VehicleOwner {
    _logger.trace("Adding Lienholder details :method = SurePersonalAutoService#addLienHolderDetails(lienholder : com.surepolicy.rest.model.LongPolicyNumberLienholder) "
        , :parameters = ({"Sure Lienholder" -> String.valueOf(lienholder)}))
    var vehicleOwner = new VehicleOwner()
    var aLienholder = new Company()
    aLienholder.Name = lienholder.Name
    var lienholderAddress = new Address()
    lienholderAddress.AddressLine1 = lienholder.Address.Line1
    lienholderAddress.AddressLine2 = lienholder.Address.Line2
    lienholderAddress.City = lienholder.Address.City
    lienholderAddress.County = lienholder.Address.County
    lienholderAddress.PostalCode = lienholder.Address.Postal
    lienholderAddress.Country = Country.getTypeKey(lienholder.Address.Country.Alpha2)
    lienholderAddress.State = typekey.State.getTypeKey(lienholder.Address.Region.Code)
    aLienholder.addAddress(lienholderAddress)
    vehicleOwner.setLienholder(aLienholder)
    _logger.trace("Lienholder details created :method = SurePersonalAutoService#addLienHolderDetails(lienholder : com.surepolicy.rest.model.LongPolicyNumberLienholder) "
        , :parameters = ({"Lienholder" -> String.valueOf(aLienholder)}))
    return vehicleOwner
  }

  private static function getPNIFromDrivers(farmersDrivers : List<LongPolicyNumberFarmersDrivers>) : LongPolicyNumberFarmersDrivers {
    var pni = farmersDrivers.firstWhere(\driver -> driver.RelationshipToInsured == "self")
    return pni
  }

}