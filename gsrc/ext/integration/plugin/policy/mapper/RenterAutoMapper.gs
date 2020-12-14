package ext.integration.plugin.policy.mapper

uses com.surepolicyrent.rest.model.Policy
uses com.surepolicyrent.rest.model.PolicyDetailsVariables
uses gw.api.financials.CurrencyAmount
uses gw.api.util.DateUtil
uses gw.api.util.TypecodeMapperUtil
uses gw.surepath.suite.integration.logging.StructuredLogger


class RenterAutoMapper extends SurePolicyMapper {
  private static var _logger = StructuredLogger.PLUGIN
  private static var mapper = TypecodeMapperUtil.getTypecodeMapper()
  private static var rentNamespace = "tog:RENT"
  private static var rentNamespacePA = "tog:RENT:HO"
  private static var pasNamespace = "tog:PAS"
  /**
   * Function takes the returned policy from Sure and creates policy summaries for PersonalAuto
   *
   * @param criteria Search criteria from the UI
   * @return a PolicySearchResultSet containing the results of the search
   */
  public static function createPolicySummaries(surePolicy: Policy, lossDate : Date) : PolicySearchResultSet {
    _logger.debug("Creating Policy Summary")
    var policySummaries = new PolicySearchResultSet()

    _logger.trace("Creating policy Summary for Policy From Sure Renters :method = RenterAutoMapper#createPolicySummaries(com.surepolicyrent.rest.model.Policy)"
        , :parameters = {"Policy Number" -> surePolicy.PolicyNumber})
    var newSummary = new PolicySummary()
    var statusCode : String = surePolicy.Status != null ? mapper.getInternalCodeByAlias("PolicyStatus", pasNamespace, surePolicy.Status) : null
    newSummary.PolicyType = PolicyType.TC_HOPHOMEOWNERS
    newSummary.PolicyNumber = surePolicy.Id
    newSummary.EffectiveDate = surePolicy.StartsAt
    newSummary.ExpirationDate = surePolicy.EndsAt

    var insured = surePolicy.PolicyHolders.where(\h -> h.getPositionOnPolicy() == 1).first()
    newSummary.InsuredName = "${insured.Person.FirstName} ${insured.Person.LastName}"
    newSummary.AddressLine1 = insured.Person.Address.Line1
    newSummary.AddressLine2 = insured.Person.Address.Line2
    newSummary.City = insured.Person.Address.City
    newSummary.PostalCode = insured.Person.Address.Postal
    newSummary.State = State.getTypeKey(insured.Person.Address.Region.Code)
    newSummary.Status = PolicyStatus.getTypeKey(statusCode)
    newSummary.LossDate = lossDate

    var propSummary = new PolicySummaryProperty()
    propSummary.AddressLine1 = surePolicy.RatingAddress.Line1
    propSummary.AddressLine2 = surePolicy.RatingAddress.Line2
    propSummary.City = surePolicy.RatingAddress.City
    newSummary.addToProperties(propSummary)

    policySummaries.addToSummaries(newSummary)
    _logger.trace("Policy Summary created for Policy From Sure PAS :method = SurePersonalAutoService#createPolicySummaries(List<com.surepolicy.rest.model.InlineResponse2001>)"
        , :parameters = {"Policy Number" -> surePolicy.PolicyNumber})

    _logger.debug("Exiting Policy Summary creation")
    return policySummaries
  }


  static function createPolicyDetails(surePolicy : Policy, lossDate : Date) : PolicyRetrievalResultSet {
    _logger.debug("Creating Policy Details")
    var resultSet = new PolicyRetrievalResultSet()
    var policy = new entity.Policy()
    addPolicyDetails(policy, surePolicy)
    addPolicyLocation(policy, surePolicy)
    addPolicyContacts(policy, surePolicy)
    addCoverages(policy, surePolicy)
    resultSet.Result = policy
    return resultSet
  }

  private static function addPolicyDetails(policy : entity.Policy, surePolicy : Policy) {
    _logger.trace("Adding Policy Details for Policy From Sure PAS :method = RenterAutoMapper#addPolicyDetails(policy : Policy, surePolicy : InlineResponse2001)"
        , :parameters = ({"SurePolicy Policy Number" -> surePolicy.PolicyNumber, "SurePolicy Effective Date" -> surePolicy.StartsAt.toString()}))
    var statusCode = surePolicy.Status != null ? mapper.getInternalCodeByAlias("PolicyStatus", pasNamespace, surePolicy.Status) : null
    policy.PolicyType = PolicyType.TC_HOPHOMEOWNERS
    policy.Status = typekey.PolicyStatus.getTypeKey(statusCode)
    policy.PolicyNumber = surePolicy.PolicyNumber
    policy.EffectiveDate = surePolicy.StartsAt
    policy.ExpirationDate = surePolicy.EndsAt
    policy.CancellationDate = surePolicy.CanceledAt != null ? formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.CanceledAt)) : null
    policy.Currency = Currency.TC_USD
   // policy.Edition_Ext = surePolicy.EditionNumber
   // policy.FormNumber_Ext = surePolicy.FormNumber
    policy.PolicyState_Ext = State.getTypeKey(surePolicy.RatingAddress.Region.Code)
    policy.CreatedAt_Ext = formatDateWithTimeZone(DateUtil.UTCDateStringToDate(surePolicy.CreatedAt))
    policy.SurePolicySystemPeriodID_Ext = surePolicy.Id
   // policy.Term_Ext = surePolicy.RenewalOffer
    policy.RenewalCadence_Ext = surePolicy.BillingCadence



        //policy.UnderwritingCo = UnderwritingCompanyType.getTypeKey(surePolicy.C)
    _logger.trace("Policy Details added for Policy From Sure PAS :method = SurePersonalAutoService#addPolicyDetails(policy : Policy, surePolicy : InlineResponse2001)"
        , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
        , "SurePolicy Policy Number" -> surePolicy.PolicyNumber, "SurePolicy Effective Date" -> surePolicy.StartsAt.toString()}))
  }


  private static function addPolicyLocation(policy : entity.Policy, surePolicy : Policy) {
    _logger.trace("Adding Policy Details for Policy From Sure PAS :method = RenterAutoMapper#addPolicyLocation(policy : entity.Policy, surePolicy : Policy)"
        , :parameters = ({"SurePolicy Policy Number" -> surePolicy.PolicyNumber, "SurePolicy Effective Date" -> surePolicy.StartsAt.toString()}))

    var location = policy.createPolicyLocation()
    var locAddress = new Address()
    locAddress.AddressLine1 = surePolicy.RatingAddress.Line1
    locAddress.AddressLine2 = surePolicy.RatingAddress.Line2
    locAddress.City = surePolicy.RatingAddress.City
    locAddress.PostalCode = surePolicy.RatingAddress.Postal
    locAddress.State = State.getTypeKey(surePolicy.RatingAddress.Region.Code)
    location.Address = locAddress
    location.LocationNumber = "1"
    location.Policy = policy
    location.PrimaryLocation = true

    var po = new PropertyOwner()
    var polContact = new Person()
    //polContact.PolicySystemId = surePolicy.Details.InterestedParty.
    polContact.Name = surePolicy.Details.InterestedParty.BusinessName
    polContact.LastName = polContact.Name
    polContact.CellPhone = surePolicy.Details.InterestedParty.PhoneNumber
    polContact.EmailAddress1 = surePolicy.Details.InterestedParty.Email
    var address = new Address()
    address.AddressLine1 = surePolicy.Details.InterestedParty.Address.Line1
    address.AddressLine2 = surePolicy.Details.InterestedParty.Address.Line2
    address.City = surePolicy.Details.InterestedParty.Address.City
    address.PostalCode = surePolicy.Details.InterestedParty.Address.Postal
    address.State = State.getTypeKey(surePolicy.Details.InterestedParty.Address.Region.Code)
    polContact.PrimaryAddress = address
    po.Lienholder = polContact
    po.Property = location
    po.OwnerType = OwnerType.TC_SOLE_OWNER
    po.Property = location

    var ru = policy.createLocationBasedRU(LocationBasedRU)
    ru.PolicyLocation = location
    ru.Policy = policy
    ru.RUNumber = 1
    ru.addToLienholders(po)

    addLocationCoverages(ru, surePolicy.Details.Variables)
    location.addToLienholders(po)
    location.addToLocationBasedRisks(ru)
    policy.addToPolicyLocations(location)
    //policy.addToRiskUnits(ru)

    //policy.UnderwritingCo = UnderwritingCompanyType.getTypeKey(surePolicy.C)
    _logger.trace("Policy Details added for Policy From Sure PAS :method = SurePersonalAutoService#addPolicyLocation(policy : entity.Policy, surePolicy : Policy)"
        , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)
        , "SurePolicy Policy Number" -> surePolicy.PolicyNumber, "SurePolicy Effective Date" -> surePolicy.StartsAt.toString()}))
  }

  private static function addPolicyContacts(policy : entity.Policy, surePolicy : Policy) { {
      _logger.trace("Adding contacts to Policy :method = RenterAutoMapper#addPolicyContacts(policy : entity.Policy, surePolicy : Policy)"
          , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)}))

    for (holder in surePolicy.PolicyHolders) {
      var polContact = new Person()
      polContact.PolicySystemId = holder.Id
      polContact.FirstName = holder.Person.FirstName
      polContact.LastName = holder.Person.LastName
      polContact.MaritalStatus = MaritalStatus.getTypeKey(holder.Person.MaritalStatus)
      polContact.DateOfBirth = holder.Person.Dob
      polContact.CellPhone = holder.Person.PhoneNumber
      polContact.EmailAddress1 = holder.Person.Email
      var address = new Address()
      address.AddressLine1 = holder.Person.Address.Line1
      address.AddressLine2 = holder.Person.Address.Line2
      address.City = holder.Person.Address.City
      address.PostalCode = holder.Person.Address.Postal
      address.State = State.getTypeKey(holder.Person.Address.Region.Code)
      polContact.PrimaryAddress = address
      if ((holder.PositionOnPolicy) > 1) {
        var contactRole = ContactRole.TC_COVEREDPARTY
        policy.addRole(contactRole, polContact)
      } else {
        //var contactRole = ContactRole.TC_INSURED
        //policy.addRole(contactRole, polContact)
        var mainContactRole = ContactRole.TC_MAINCONTACT
        policy.addRole(mainContactRole, polContact)
        policy.policyholder = polContact
      }
    }
      _logger.trace("Contact added to Policy :method = RenterAutoMapper#addPolicyContacts(policy : entity.Policy, surePolicy : Policy)"
          , :parameters = ({"Policy" -> String.valueOf(policy), "Policy Effective Date" -> String.valueOf(policy.EffectiveDate)}))
    }
  }

  private static function addCoverages(policy : entity.Policy, surePolicy : Policy) {
    var liabCov = new PolicyCoverage()
    liabCov.Type = CoverageType.TC_HOPERSLIAB_TOGL_EXT
    liabCov.IncidentLimit = new CurrencyAmount(surePolicy.Details.Variables.LiabilityLimit)
    liabCov.Policy = policy
    policy.addCoverage(liabCov)

    var blanketCov = new PolicyCoverage()
    blanketCov.Type = CoverageType.TC_HOPERSPROPBLANKET_TOGL_EXT
    blanketCov.IncidentLimit = new CurrencyAmount(1000)
    liabCov.Policy = policy
    policy.addCoverage(blanketCov)

    var medPayCov = new PolicyCoverage()
    medPayCov.Type = CoverageType.TC_HOMEDPAYTOOTHERS_TOGL_EXT
    medPayCov.IncidentLimit = new CurrencyAmount(1000)
    liabCov.Policy = policy
    policy.addCoverage(medPayCov)

  }

  /*
            "contents_replacement_cost": true,
            "id_theft": true,
            "side_hustle": true,
   */
  private static function addLocationCoverages(locationRU : entity.LocationBasedRU, variables : PolicyDetailsVariables) {
    if (variables.AdditionalLivingLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.AdditionalLivingLimit, CoverageType.TC_HOTEMPLIVINGCOST_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      locationRU.addToCoverages(cov)
    }
    if (variables.AdventureLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.AdventureLimit, CoverageType.TC_HOPERSPROPACTIVE_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      locationRU.addToCoverages(cov)
    }
    if (variables.TechLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.TechLimit, CoverageType.TC_HOPERSPROPTECHNOLOGY_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      /* TODO: add tech term
      if (variables.IsTechSiasl) {
        var covTerm = new CovTerm()
        covTerm.CovTermPattern = ??
        cov.addToCovTerms(covTerm)
      }
      */
      locationRU.addToCoverages(cov)
    }
    if (variables.CreativeLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.CreativeLimit, CoverageType.TC_HOPERSPROPCREATIVEANDMAKER_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      locationRU.addToCoverages(cov)
    }
    if (variables.FashionLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.FashionLimit, CoverageType.TC_HOPERSPROPFASHIONANDJEWELRY_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      /* TODO: add fashion term
      if (variables.IsFashionSiasl) {
        var covTerm = new CovTerm()
        covTerm.CovTermPattern = ??
            cov.addToCovTerms(covTerm)
      }
      */
      locationRU.addToCoverages(cov)
    }
    if (variables.FurnishingsLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.FurnishingsLimit, CoverageType.TC_HOPERSPROPFURNITUREANDAPPLIANCES_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      locationRU.addToCoverages(cov)
    }
    if (variables.CollectiblesLimit > 0) {
      var cov = addCoverageWithLimit(locationRU, variables.CollectiblesLimit, CoverageType.TC_HOPERSPROPCOLLECT_TOGL_EXT)
      cov.addToCovTerms(addDeductible(variables.Deductible))
      /* TODO: add collectable term
      if (variables.IsCollectibleSiasl) {
        var covTerm = new CovTerm()
        covTerm.CovTermPattern = ??
        cov.addToCovTerms(covTerm)
      }
      */
      locationRU.addToCoverages(cov)
    }
    if (variables.PetLover == true) {
        if (variables.DogBiteHistory == true) {
          var cov = addCoverageWithLimit(locationRU, 500, CoverageType.TC_HOPETPARENTCOVGLIM_TOGL_EXT)
          cov.addToCovTerms(addDeductible(variables.Deductible))
          locationRU.addToCoverages(cov)
        } else {
          var cov = addCoverageWithLimit(locationRU, 500, CoverageType.TC_HOPETPARENTCOVG_TOGL_EXT)
          cov.addToCovTerms(addDeductible(variables.Deductible))
          locationRU.addToCoverages(cov)
        }
    }
  }

  private static function addCoverageWithLimit(locationRU : entity.LocationBasedRU, limit : Integer, type : CoverageType) : PropertyCoverage{
    var cov = new PropertyCoverage()
    cov.Type=type
    cov.IncidentLimit=new CurrencyAmount(limit)
    cov.Policy=locationRU.Policy
    return cov
  }

  private static function addDeductible( ded : Integer) : CovTerm {
    var covTerm = new FinancialCovTerm()
    covTerm.CovTermPattern = CovTermPattern.TC_HOPSCHEDULEDPERSONALPROPERTYITEMDEDUCTIBLE
   // covTerm.ModelRestriction = CovTermModelRest.TC_PD
    covTerm.FinancialAmount = new CurrencyAmount(ded)
    return covTerm
  }

}