package ext.integration.plugin.policy

uses ext.integration.util.service.AbstractServiceBase

class StubSurePolicyService extends AbstractServiceBase implements PolicyService {

    override function getServiceName() : String {
    return SERVICENAME
    }

  override function searchForPersonalAutoPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    return null
  }

  override function searchForRenterPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet {
    return null
  }

  override function retrievePersonalAutoPolicy(policySummary : PolicySummary) : PolicyRetrievalResultSet {
    return null
  }

  override function retrievePersonalAutoPolicyFromPolicy(policyNumber : String, policyLossDate : Date) : PolicyRetrievalResultSet {
    return null
  }

}