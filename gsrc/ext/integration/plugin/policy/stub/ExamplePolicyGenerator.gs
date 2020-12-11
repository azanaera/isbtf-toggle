package ext.integration.plugin.policy.stub

uses com.surepolicy.rest.model.InlineResponse2001

class ExamplePolicyGenerator {
  private var bm : BindStubSurePolicy

  construct() {
    bm = new BindStubSurePolicy()
  }

  //Mock where we will put our test data
  function mock1() : List<InlineResponse2001> {
    var jsonFileName = "3421012536_short.json"
    return bm.generate(jsonFileName)
  }

  function mock2() : List<InlineResponse2001> {
    var jsonFileName = "3450848191_short.json"
    return bm.generate(jsonFileName)
  }


}