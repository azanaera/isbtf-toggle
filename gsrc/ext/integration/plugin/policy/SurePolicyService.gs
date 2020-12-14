package ext.integration.plugin.policy

uses ext.integration.plugin.policy.mapper.PersonalAutoMapper
uses ext.integration.plugin.policy.mapper.RenterAutoMapper
uses ext.integration.rest.client.SureClient
uses ext.integration.rest.client.SureHOClient
uses ext.integration.rest.properties.SurePASProperties
uses ext.integration.util.service.AbstractServiceBase
uses feign.FeignException
uses gw.api.util.DateUtil
uses gw.api.util.DisplayableException
uses gw.surepath.suite.integration.logging.StructuredLogger

class SurePolicyService extends AbstractServiceBase implements PolicyService  {
  private static var xSpace : String
  private static var pasNamespace = "tog:PAS"
  private static var pasNamespacePA = "tog:PAS:PA"
  private static var _logger = StructuredLogger.PLUGIN
  private static var sureClient : SureClient = new SureClient()
  private static var _properties = new SurePASProperties()

  /**
   * Function which queries the Sure and creates policy summaries for PersonalAuto
   *
   * @param criteria Search criteria from the UI
   * @return a PolicySearchResultSet containing the results of the search
   * @throws(FeignException, "If there is an error thrown by Sure during REST call")
   */
  public function searchForPersonalAutoPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    _logger.info("Beginning Policy Search ", :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)},
        :method = SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria))

    var searchResultSet = new PolicySearchResultSet()
    var resultList : List<com.surepolicy.rest.model.InlineResponse2001>
    var policyNumber = criteria.PolicyNumber

    var validPolicyNumber = PersonalAutoMapper.validatePolicyNumber(policyNumber)
    if (not validPolicyNumber){
      _logger.warn("Incorrect format Policy Number used for PolicySearch", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria),
          :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
      throw new DisplayableException("Incorrect format of Policy Number" + policyNumber + ". Format should be 10 Alphanumeric characters")
    }
    try {
      xSpace = _properties.SurePASXSpace
      var policyNum = criteria.PolicyNumber
      var utcLossDate = PersonalAutoMapper.formatServerDateWithUTCTimeZone(criteria.LossDate)
      var lossDate = DateUtil.dateToYYYY_MM_DD_Ext(utcLossDate)

      var client = new SureClient()
      var api = client.createClient()
      resultList = api.longPull(policyNum, null, lossDate, xSpace)
      searchResultSet = PersonalAutoMapper.createPolicySummaries(resultList, criteria.LossDate)
    } catch (exception : FeignException) {
      if (exception.status() == 429) {
        _logger.warn("Rate Limit exceeded for policy search", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria), exception,
            :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
        throw new DisplayableException("Policy Search service search limit reached. Please wait 5 minutes and try again")
      } else {
        _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria), exception,
            :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
        throw new DisplayableException("Policy Search service unavailable. Please contact support. Time of Error: , Error Code: " + exception.status())
      }
    } catch (exception : Exception) {
      _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria), exception,
          :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
      throw new DisplayableException("Policy Retrieve service unavailable. Please contact support. Time of Error: ,Error Message: " + exception.Message)
    }
    _logger.info("Returning Policy Summary ", :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)},
        :method = SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria))
    _logger.debug("Exiting Policy Search")
    return searchResultSet
  }

  /**
   * Function which queries the Sure and creates policy data for PersonalAuto Claim
   *
   * @param policySummary Selected policy summary to retrieve detailed policy info for
   * @return a PolicyRetrievalResultSet containing the results of the search
   * @throws(FeignException, "If there is an error thrown by Sure during REST call")
   */
  public function retrievePersonalAutoPolicy(policySummary : PolicySummary) : PolicyRetrievalResultSet {
    _logger.info("Beginning Policy Retrieval ", :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)},
        :method = SurePolicyService#retrievePersonalAutoPolicy(PolicySummary))

    var client = new SureClient()
    var api = client.createClient()
    var retrievalResultSet = new PolicyRetrievalResultSet()

    try {
      xSpace = _properties.SurePASXSpace
      var polNum = policySummary.PolicyNumber
      var utcLossDate = PersonalAutoMapper.formatServerDateWithUTCTimeZone(policySummary.LossDate)
      var lossDate = DateUtil.dateToYYYY_MM_DD_Ext(utcLossDate)
      var resultList = api.longPull(polNum, null, lossDate, xSpace)

      if (resultList.Empty) {
        _logger.error("No results found", SurePolicyService#retrievePersonalAutoPolicy(PolicySummary),
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        throw new DisplayableException("No results found for Policy: " + policySummary.PolicyNumber + "/LossDate: " + policySummary.LossDate)
      } else if (resultList.Count > 1) {
        _logger.error("More than one result found during Policy Retrieve. Results Found: " + resultList.Count, SurePolicyService#retrievePersonalAutoPolicy(PolicySummary),
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        retrievalResultSet.NotUnique = true
        throw new DisplayableException("More than one policy matched the criteria")
      } else {
        retrievalResultSet.NotUnique = false
        _logger.debug("Retrieving full policy details for Policy Number: " + polNum + ", Loss Date: " +  lossDate)
      }

      retrievalResultSet = PersonalAutoMapper.createPolicyDetails(resultList, policySummary.LossDate)

    } catch (exception : FeignException) {
      if (exception.status() == 429) {
        _logger.warn("Rate Limit exceeded for policy search", SurePolicyService#retrievePersonalAutoPolicy(PolicySummary), exception,
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        throw new DisplayableException("Policy Retrieve service search limit reached. Please wait 5 minutes and try again")
      } else {
        _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#retrievePersonalAutoPolicy(PolicySummary), exception,
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        throw new DisplayableException("Policy Search service unavailable. Please contact support. Time of Error: , Error Code: " + exception.status())
      }
    } catch (exception : Exception) {
      _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#retrievePersonalAutoPolicy(PolicySummary), exception,
          :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
      throw new DisplayableException("Policy Retrieve service unavailable. Please contact support. Time of Error: ,Error Message: " + exception.Message)
    }
    _logger.info("Policy Details retrieved successfully ", :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)},
        :method = SurePolicyService#retrievePersonalAutoPolicy(PolicySummary))

    return retrievalResultSet
  }

  /**
   * Function which queries the Sure and creates policy data for PersonalAuto Claim
   *
   * @param policySummary Selected policy summary to retrieve detailed policy info for
   * @return a PolicyRetrievalResultSet containing the results of the search
   * @throws(FeignException, "If there is an error thrown by Sure during REST call")
   */
  public function retrievePersonalAutoPolicyFromPolicy(policyNumber : String, policyLossDate : Date) : PolicyRetrievalResultSet {
    _logger.info("Beginning Policy Refresh ", :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)},
        :method = SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date))

    var client = new SureClient()
    var api = client.createClient()
    var retrievalResultSet = new PolicyRetrievalResultSet()

    try {
      xSpace = _properties.SurePASXSpace
      var utcLossDate = PersonalAutoMapper.formatServerDateWithUTCTimeZone(policyLossDate)
      var lossDate = DateUtil.dateToYYYY_MM_DD_Ext(utcLossDate)
      var resultList = api.longPull(policyNumber, null, lossDate, xSpace)

      retrievalResultSet = PersonalAutoMapper.createPolicyDetails(resultList, policyLossDate)

      if (resultList.Empty) {
        _logger.error("No results found", SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date),
            :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)})
        throw new DisplayableException("No results found for Policy: " + policyNumber + "/LossDate: " + policyLossDate)
      } else if (resultList.Count > 1) {
        _logger.error("More than one result found during Policy Refresh. Results Found: " + resultList.Count, SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date),
            :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)})
        retrievalResultSet.NotUnique = true
        throw new DisplayableException("More than one policy matched the criteria")
      } else {
        retrievalResultSet.NotUnique = false
        _logger.debug("Refreshing full policy details for Policy Number: " + policyNumber + ", Loss Date: " + policyLossDate)
      }
    } catch (exception : FeignException) {
      if (exception.status() == 429) {
        _logger.warn("Rate Limit exceeded for policy search", SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date), exception,
            :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)})
        throw new DisplayableException("Policy Retrieve service search limit reached. Please wait 5 minutes and try again")
      } else {
        _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date), exception,
            :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)})
        throw new DisplayableException("Policy Search service unavailable. Please contact support. Time of Error: , Error Code: " + exception.status())
      }
    } catch (exception : Exception) {
      _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date), exception,
          :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)})
      throw new DisplayableException("Policy Retrieve service unavailable. Please contact support. Time of Error: ,Error Message: " + exception.Message)
    }
    _logger.info("Policy Refresh successful ", :parameters = {"Policy Number" -> policyNumber, "Loss Date" -> String.valueOf(policyLossDate)},
        :method = SurePolicyService#retrievePersonalAutoPolicyFromPolicy(String, Date))
    return retrievalResultSet
  }


  public function searchForRenterPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    _logger.info("Beginning Policy Search ", :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)},
        :method = SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria))

    var searchResultSet = new PolicySearchResultSet()

    var validPolicyNumber = PersonalAutoMapper.validatePolicyNumber(criteria.PolicyNumber)
/*  TODO: Uncomment this when policy number search works correctly, as it is currently using policy term id which is not a valid format
    if (not validPolicyNumber){
      _logger.warn("Incorrect format Policy Number used for PolicySearch", SurePolicyService#searchForPersonalAutoPolicies(PolicySearchCriteria),
          :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
      throw new DisplayableException("Incorrect format of Policy Number " + criteria.PolicyNumber + ". Format should be 10 Alphanumeric characters")
    }
*/
    try {
      xSpace = "farmers"
      var policyNum = criteria.PolicyNumber
      var utcLossDate = PersonalAutoMapper.formatServerDateWithUTCTimeZone(criteria.LossDate)
      var lossDate = DateUtil.dateToYYYY_MM_DD_Ext(utcLossDate)

      var client = new SureHOClient()
      var api = client.createClient()
      var result = api.policyIdGet(policyNum, xSpace)
      print(result)
      searchResultSet = RenterAutoMapper.createPolicySummaries(result, criteria.LossDate)

    } catch (exception : FeignException) {
      if (exception.status() == 404) {
        _logger.info("No results found: ", :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)},
            :method = SurePolicyService#searchForRenterPolicies(PolicySearchCriteria))
        _logger.debug("Exiting Policy Search")
        return searchResultSet
      } else if (exception.status() == 429) {
        _logger.warn("Rate Limit exceeded for policy search", SurePolicyService#searchForRenterPolicies(PolicySearchCriteria), exception,
            :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
        throw new DisplayableException("Policy Search service search limit reached. Please wait 5 minutes and try again")
      } else {
        _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#searchForRenterPolicies(PolicySearchCriteria), exception,
            :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
        throw new DisplayableException("Policy Search service unavailable. Please contact support. Time of Error: , Error Code: " + exception.status())
      }
    } catch (exception : Exception) {
      _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#searchForRenterPolicies(PolicySearchCriteria), exception,
          :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)})
      throw new DisplayableException("Policy Search service unavailable. Please contact support. Time of Error: , Error Message: " + exception.LocalizedMessage)
    }
    _logger.info("Returning Policy Summary ", :parameters = {"Policy Number" -> criteria.PolicyNumber, "Loss Date" -> String.valueOf(criteria.LossDate)},
        :method = SurePolicyService#searchForRenterPolicies(PolicySearchCriteria))
    _logger.debug("Exiting Policy Search")
    return searchResultSet
  }

  /**
   * Function which queries the Sure and creates policy data for PersonalAuto Claim
   *
   * @param policySummary Selected policy summary to retrieve detailed policy info for
   * @return a PolicyRetrievalResultSet containing the results of the search
   * @throws(FeignException, "If there is an error thrown by Sure during REST call")
   */
  public function retrieveRenterPolicy(policySummary : PolicySummary) : PolicyRetrievalResultSet {
    _logger.info("Beginning Policy Retrieval ", :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)},
        :method = SurePolicyService#retrieveRenterPolicy(PolicySummary))

    var retrievalResultSet = new PolicyRetrievalResultSet()

    try {
      xSpace = "farmers"
      var polNum = policySummary.PolicyNumber
      var utcLossDate = PersonalAutoMapper.formatServerDateWithUTCTimeZone(policySummary.LossDate)
      var lossDate = DateUtil.dateToYYYY_MM_DD_Ext(utcLossDate)

      var client = new SureHOClient()
      var api = client.createClient()
      var result = api.policyIdGet(polNum, xSpace)
      retrievalResultSet = RenterAutoMapper.createPolicyDetails(result, policySummary.LossDate)
      retrievalResultSet.NotUnique = false
      _logger.debug("Retrieving full policy details for Policy Number: " + polNum + ", Loss Date: " +  lossDate)

    } catch (exception : FeignException) {
      if (exception.status() == 429) {
        _logger.warn("Rate Limit exceeded for policy search", SurePolicyService#retrieveRenterPolicy(PolicySummary), exception,
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        throw new DisplayableException("Policy Retrieve service search limit reached. Please wait 5 minutes and try again")
      } else if (exception.status() == 404) {
        _logger.error("No results found", SurePolicyService#retrieveRenterPolicy(PolicySummary),
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        throw new DisplayableException("No results found for Policy: " + policySummary.PolicyNumber + "/LossDate: " + policySummary.LossDate)
      } else {
        _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#retrievePersonalAutoPolicy(PolicySummary), exception,
            :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
        throw new DisplayableException("Policy Search service unavailable. Please contact support. Time of Error: , Error Code: " + exception.status())
      }
    } catch (exception : Exception) {
      _logger.error("Error occured when calling PolicySearchApi", SurePolicyService#retrievePersonalAutoPolicy(PolicySummary), exception,
          :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)})
      throw new DisplayableException("Policy Retrieve service unavailable. Please contact support. Time of Error: ,Error Message: " + exception.Message)
    }
    _logger.info("Policy Details retrieved successfully ", :parameters = {"Policy Number" -> policySummary.PolicyNumber, "Loss Date" -> String.valueOf(policySummary.LossDate)},
        :method = SurePolicyService#retrievePersonalAutoPolicy(PolicySummary))

    return retrievalResultSet
  }


  override function getServiceName() : String {
    return SERVICENAME
  }

}