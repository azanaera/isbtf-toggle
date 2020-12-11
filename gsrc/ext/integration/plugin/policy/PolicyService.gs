package ext.integration.plugin.policy

interface PolicyService {

  public static final var SERVICENAME : String = "PolicyService"

  public function searchForPersonalAutoPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet
  public function searchForRenterPolicies(criteria : PolicySearchCriteria) : PolicySearchResultSet
  public function retrievePersonalAutoPolicy(policySummary : PolicySummary) : PolicyRetrievalResultSet
  public function retrievePersonalAutoPolicyFromPolicy(policyNumber : String, policyLossDate : Date) : PolicyRetrievalResultSet

}