package jsonschema.ext.toggle.ccc.businessevents.response.v1_0;

import com.guidewire.pl.json.runtime.JsonWrapperList;
import gw.api.json.JsonDeserializationOptions;
import gw.api.json.JsonObject;
import gw.api.json.JsonParser;
import gw.api.json.JsonValidationResult;
import gw.api.json.JsonWrapper;
import gw.lang.Autocreate;
import gw.lang.SimplePropertyProcessing;

import javax.annotation.processing.Generated;
import java.util.List;

@SimplePropertyProcessing
@Generated(comments = "ext.toggle.ccc.businessevents.response-1.0#/definitions/cCCTransactionResponse", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class cCCTransactionResponse extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.response-1.0#/definitions/cCCTransactionResponse";

  public cCCTransactionResponse() {
    super();
  }

  private cCCTransactionResponse(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static cCCTransactionResponse wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new cCCTransactionResponse(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static cCCTransactionResponse parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static cCCTransactionResponse parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<cCCTransactionResponse> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), cCCTransactionResponse::wrap);
  }

  public static List<cCCTransactionResponse> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), cCCTransactionResponse::wrap);
  }

  public String getcode() {
    return getTyped("code");
  }

  public void setcode(String value) {
    put("code", value);
  }

  public String getdescription() {
    return getTyped("description");
  }

  public void setdescription(String value) {
    put("description", value);
  }

  @Autocreate
  public messageHeader getmessageHeader() {
    return messageHeader.wrap(getTyped("messageHeader"));
  }

  public void setmessageHeader(messageHeader value) {
    put("messageHeader", value == null ? null : value.unwrap());
  }

}
