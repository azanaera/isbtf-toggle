package ext.integration.toggle.ccc.businessevents

uses gw.api.json.JsonConfigAccess
uses gw.api.json.mapping.TransformResult

uses jsonschema.ext.toggle.ccc.businessevents.request.v1_0.request
uses ext.integration.toggle.ccc.businessevents.dto.MessageHeader
uses ext.integration.toggle.ccc.businessevents.dto.TransactionResponse

@Export
class APIHandler {

  function postBusinessEvent(body : request) : TransformResult {

    print("Internal id:" + body.internal_id)

    var bodyMH = body.cCCBusinessEventTransaction.getmessageHeader()
    var mh = new MessageHeader(){
      :PrimaryInsuranceCompany = bodyMH.primaryInsuranceCompany,
      :UniqueTransactionID = bodyMH.uniqueTransactionID,
      :TransactionDateTime = bodyMH.transactionDateTime,
      :LossReferenceID = bodyMH.lossReferenceID
    }

    var r = new TransactionResponse() {
      :Code = "000",
      :MessageHeader = mh,
      :Description = "Success"
    }

   return JsonConfigAccess.getMapper("ext.toggle.ccc.businessevents.response-1.0", "response").transformObject(r)
  }
}