package ext.integration.plugin.policy.mapper

uses ext.integration.plugin.policy.stub.BindStubSurePolicy
uses gw.api.test.CCUnitTestClassBase

uses java.text.SimpleDateFormat

class WhenSearchingPAPoliciesTest extends CCUnitTestClassBase {

  function testWeGetBackOnePolicy() {
    // GIVEN
    var inlineResponse = new BindStubSurePolicy().generate("3421012536_long.json")
    var lossDate = new SimpleDateFormat("yyyy-MM-dd").parse("2020-10-01")

    // WHEN
    gw.transaction.Transaction.runWithNewBundle(\bundle -> {
      var policySearchResultSet = new PersonalAutoMapper().createPolicySummaries(inlineResponse, lossDate)

      // THEN
      gw.testharness.v3.PLAssertions.assertThat(policySearchResultSet.Summaries[0].PolicyNumber == "3421012536").as("Policy Number not found")
    }, "su")
  }

}