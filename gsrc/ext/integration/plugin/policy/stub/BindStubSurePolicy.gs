package ext.integration.plugin.policy.stub

uses com.surepolicy.rest.model.InlineResponse2001
uses com.surepolicy.rest.model.LongPolicyNumberCoverageVariables
uses com.surepolicy.rest.model.LongPolicyNumberFarmersDrivers
uses com.surepolicy.rest.model.LongPolicyNumberFarmersEndorsements
uses com.surepolicy.rest.model.LongPolicyNumberFarmersVehicles
uses com.surepolicy.rest.model.LongPolicyNumberGarageAddress
uses com.surepolicy.rest.model.LongPolicyNumberPerson
uses com.surepolicy.rest.model.LongPolicyNumberPersonAddress
uses com.surepolicy.rest.model.LongPolicyNumberPersonAddressCountry
uses com.surepolicy.rest.model.LongPolicyNumberPersonAddressRegion
uses com.surepolicy.rest.model.ShortPolicyNumberService
uses gw.lang.reflect.json.Json
uses gw.pl.util.FileUtil

uses java.io.File

class BindStubSurePolicy {

  private var PATH_JSON_FILE = "modules/configuration/gtest/ext/integration/plugin/policy/searchandretrieve/response/examples/"

  construct() {
  }

  construct(differentPath : String) {
    PATH_JSON_FILE = differentPath
  }


  public function generate(jsonFileName : String) : List<InlineResponse2001> {
    var jsonText = FileUtil.getContent(new File(PATH_JSON_FILE + jsonFileName))
    var jsonObj : Dynamic = Json.fromJson(jsonText)

    var root = jsonObj
    var listInlineResponse2001 = new ArrayList<InlineResponse2001>()

    for (r in root.value) {
      //service
      var serviceNode = r.service
      var service = generateShortPolicyNumberService(serviceNode.starts_at, serviceNode.renewal_cadence)

      //FarmerDrivers
      var listFarmerDriver = new ArrayList<LongPolicyNumberFarmersDrivers>()
      for (fd in r.farmers_drivers) {
        var personRoot = fd.person

        var personAddressRoot = personRoot.address
        var personAddress = personAddressRoot != null ? generateAddress(personAddressRoot.id, personAddressRoot.line1,
            personAddressRoot.line2, personAddressRoot.city, personAddressRoot.postal, personAddressRoot.timezone,
            personAddressRoot.region.id, personAddressRoot.region.name, personAddressRoot.region.code,
            personAddressRoot.country.id, personAddressRoot.country.name, personAddressRoot.country.alpha2) : null

        var person = generatePerson(personRoot.id, personRoot.first_name, personRoot.last_name,
            personRoot.email, personRoot.phone_number, personRoot.business_name, personRoot.company_name,
            personAddress, personRoot.dob, personRoot.marital_status)

        listFarmerDriver.add(generateLongPolicyNumberFarmersDrivers(
            fd.id,
            person,
            fd.add_date,
            fd.deleted,
            fd.relationship_to_insured,
            fd.role,
            fd.driving_license_number,
            fd.driving_license_state,
            fd.non_driver_reason))
      }

      //var farmers_vehicles
      //FarmerVehicles
      var listFarmerVehicles = new ArrayList<LongPolicyNumberFarmersVehicles>()
      for (fv in r.farmers_vehicles) {
        var garageRoot = fv.garage_address
        var garage = generateRatingAddress(garageRoot.id, garageRoot.line1,
            garageRoot.line2, garageRoot.city, garageRoot.county,
            garageRoot.postal, garageRoot.timezone,
            garageRoot.region.id, garageRoot.region.name, garageRoot.region.code,
            garageRoot.country.id, garageRoot.country.name, garageRoot.country.alpha2)

        listFarmerVehicles.add(generateLongPolicyNumberFarmersVehicles(
            fv.id,
            fv.make,
            fv.model,
            fv.style,
            fv.year,
            fv.vin,
            garage,
            fv.new_ventures_vehicle_id))
      }


      //coverage_variables
      var listCoverageVariables = new ArrayList<LongPolicyNumberCoverageVariables>()
      for (cv in r.coverage_variables) {
        listCoverageVariables.add(
            generateLongPolicyNumberCoverageVariables(cv.effective_date,
                cv.variable,
                cv.value,
                cv.limit_of_occurrence,
                cv.purchased,
                cv.deleted
            )
        )
      }


      //farmers_endorsements
      var listFarmeresEndorsements = new ArrayList<LongPolicyNumberFarmersEndorsements>()
      for (fe in r.farmers_endorsements) {
        listFarmeresEndorsements.add(generateLongPolicyNumberFarmersEndorsements(
            fe.id,
            fe.vehicle_id,
            fe.form_code,
            fe.form_edition,
            fe.description,
            fe.created_at,
            fe.deleted
        )
        )
      }


      //rating_address
      var ratingAddressNode = r.rating_address
      var ratingAddress = generateRatingAddress(ratingAddressNode.id, ratingAddressNode.line1,
          ratingAddressNode.line2, ratingAddressNode.city, ratingAddressNode.county,
          ratingAddressNode.postal, ratingAddressNode.timezone,
          ratingAddressNode.region.id, ratingAddressNode.region.name, ratingAddressNode.region.code,
          ratingAddressNode.country.id, ratingAddressNode.country.name, ratingAddressNode.country.alpha2)

      listInlineResponse2001.add(
          generateInlineResponse2001(r.id,
              r.status,
              r.policy_number,
              service,
              r.term_number,
              r.starts_at,
              r.ends_at,
              r.canceled_at,
              r.created_at,
              listFarmerDriver,
              listFarmerVehicles,
              listCoverageVariables,
              listFarmeresEndorsements,
              ratingAddress,
              r.company_code,
              r.company_name,
              r.state,
              r.edition_number,
              r.form_number
          ))

    }

    return listInlineResponse2001
  }


  //  main object - InlineResponse2001
  private function generateInlineResponse2001(id : String, status : String, policyNumber : String,
                                              service : ShortPolicyNumberService, termNumber : Integer,
                                              startsAt : String, endsAt : String, canceledAt : String,
                                              createdAt : String,
                                              farmerDrivers : List<LongPolicyNumberFarmersDrivers>,
                                              farmerVehicles : List<LongPolicyNumberFarmersVehicles>,
                                              coverageVariables : List<LongPolicyNumberCoverageVariables>,
                                              farmersEndorsements : List<LongPolicyNumberFarmersEndorsements>,
                                              ratingAddress : LongPolicyNumberGarageAddress,
                                              companyName : String, companyCode : String, state : String,
                                              editionNumber : String, formNumber : String) : InlineResponse2001 {
    var ir = new InlineResponse2001() {
      :Id = id,
      :Status = status,
      :PolicyNumber = policyNumber,
      :Service = service,
      :TermNumber = termNumber,
      :StartsAt = startsAt,
      :EndsAt = endsAt,
      :CanceledAt = canceledAt,
      :CreatedAt = createdAt,
      :FarmersDrivers = farmerDrivers,
      :FarmersVehicles = farmerVehicles,
      :CoverageVariables = coverageVariables,
      :FarmersEndorsements = farmersEndorsements,
      :RatingAddress = ratingAddress,
      :CompanyCode = companyCode,
      :CompanyName = companyName,
      :State = state,
      :EditionNumber = editionNumber,
      :FormNumber = formNumber
    }

    return ir
  }


  //service
  private function generateShortPolicyNumberService(startAt : String, renewalCadence : String) : ShortPolicyNumberService {
    var s = new ShortPolicyNumberService() {
      :StartsAt = startAt,
      :RenewalCadence = renewalCadence
    }
    return s
  }

  //farmer drivers
  private function generateLongPolicyNumberFarmersDrivers(id : String, person : LongPolicyNumberPerson,
                                                          addDate : String, deleted : String,
                                                          relationshipToInsured : String, role : String,
                                                          drivingLicenseNumber : String, drivingLicenseState : String,
                                                          nonDriverReason : String) : LongPolicyNumberFarmersDrivers {

    var fd = new LongPolicyNumberFarmersDrivers() {
      :Id = id,
      :Person = person,
      :AddDate = addDate,
      :Deleted = deleted,
      :RelationshipToInsured = relationshipToInsured,
      :Role = role,
      :DrivingLicenseNumber = drivingLicenseNumber,
      :DrivingLicenseState = drivingLicenseState,
      :NonDriverReason = nonDriverReason
    }

    return fd
  }


  //person
  private function generatePerson(id : String, firstName : String, lastName : String,
                                  email : String, phoneNumber : String, businessName : String,
                                  companyName : String, address : LongPolicyNumberPersonAddress, dob : String,
                                  maritalStatus : String) : LongPolicyNumberPerson {

    var p = new LongPolicyNumberPerson() {
      :Id = id,
      :FirstName = firstName,
      :LastName = lastName,
      :Email = email,
      :PhoneNumber = phoneNumber,
      :BusinessName = businessName,
      :CompanyName = companyName,
      :Address = address,
      :Dob = dob,
      :MaritalStatus = maritalStatus
    }
    return p
  }

  //farmers_vehicles
  private function generateLongPolicyNumberFarmersVehicles(id : Integer, make : String, model : String,
                                                           style : String, year : Integer, vin : String,
                                                           garageAddress : LongPolicyNumberGarageAddress,
                                                           newVenturesVehicleId : Integer) : LongPolicyNumberFarmersVehicles {
    var fv = new LongPolicyNumberFarmersVehicles() {
      :Id = id,
      :Make = make,
      :Model = model,
      :Style = style,
      :Year = year,
      :Vin = vin,
      :GarageAddress = garageAddress,
      :NewVenturesVehicleId = newVenturesVehicleId
    }
    return fv
  }


  //coverage_variables
  private function generateLongPolicyNumberCoverageVariables(effectiveDate : String, variable : String,
                                                             value : String, limitOfOccurrence : String,
                                                             purchased : Boolean, deleted : String) : LongPolicyNumberCoverageVariables {
    var cv = new LongPolicyNumberCoverageVariables() {
      :EffectiveDate = effectiveDate,
      :Variable = variable,
      :Value = value,
      :LimitOfOccurrence = limitOfOccurrence,
      :Purchased = purchased,
      :Deleted = deleted
    }
    return cv
  }

  //farmers_endorsements
  private function generateLongPolicyNumberFarmersEndorsements(id : String, vehicleId : Integer, formCode : String,
                                                               formEdition : String, description : String,
                                                               createdAt : String, deleted : String) : LongPolicyNumberFarmersEndorsements {
    var fe = new LongPolicyNumberFarmersEndorsements() {
      :Id = id,
      :VehicleId = vehicleId,
      :FormCode = formCode,
      :FormEdition = formEdition,
      :Description = description,
      :CreatedAt = createdAt,
      :Deleted = deleted
    }

    return fe
  }


  //address - Person
  private function generateAddress(id : String, line1 : String, line2 : String, city : String,
                                   postal : String, timezone : String, rId : Integer, rName : String,
                                   rCode : String, cId : Integer, cName : String, cAlpha2 : String) : LongPolicyNumberPersonAddress {
    var region = new LongPolicyNumberPersonAddressRegion() {
      :Id = rId,
      :Name = rName,
      :Code = rCode
    }

    var country = new LongPolicyNumberPersonAddressCountry() {
      :Id = cId,
      :Name = cName,
      :Alpha2 = cAlpha2
    }


    var aa = new LongPolicyNumberPersonAddress() {
      :Id = id,
      :Line1 = line1,
      :Line2 = line2,
      :City = city,
      :Region = region,
      :Country = country,
      :Postal = postal,
      :Timezone = timezone
    }
    return aa
  }

  //garage_address -- rating_address
  private function generateRatingAddress(id : String, line1 : String, line2 : String, city : String, county : String,
                                         postal : String, timezone : String, rId : Integer, rName : String,
                                         rCode : String, cId : Integer, cName : String, cAlpha2 : String) : LongPolicyNumberGarageAddress {

    var region = new LongPolicyNumberPersonAddressRegion() {
      :Id = rId,
      :Name = rName,
      :Code = rCode
    }

    var country = new LongPolicyNumberPersonAddressCountry() {
      :Id = cId,
      :Name = cName,
      :Alpha2 = cAlpha2
    }

    var ra = new LongPolicyNumberGarageAddress() {
      :Id = id,
      :Line1 = line1,
      :Line2 = line2,
      :City = city,
      :County = county,
      :Region = region,
      :Country = country,
      :Postal = postal,
      :Timezone = timezone
    }
    return ra
  }

}