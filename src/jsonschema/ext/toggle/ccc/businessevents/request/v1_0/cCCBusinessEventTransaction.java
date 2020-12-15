package jsonschema.ext.toggle.ccc.businessevents.request.v1_0;

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
@Generated(comments = "ext.toggle.ccc.businessevents.request-1.0#/definitions/cCCBusinessEventTransaction", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class cCCBusinessEventTransaction extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.request-1.0#/definitions/cCCBusinessEventTransaction";

  public cCCBusinessEventTransaction() {
    super();
  }

  private cCCBusinessEventTransaction(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static cCCBusinessEventTransaction wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new cCCBusinessEventTransaction(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static cCCBusinessEventTransaction parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static cCCBusinessEventTransaction parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<cCCBusinessEventTransaction> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), cCCBusinessEventTransaction::wrap);
  }

  public static List<cCCBusinessEventTransaction> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), cCCBusinessEventTransaction::wrap);
  }

  @Autocreate
  public businessEvent getbusinessEvent() {
    return businessEvent.wrap(getTyped("businessEvent"));
  }

  public void setbusinessEvent(businessEvent value) {
    put("businessEvent", value == null ? null : value.unwrap());
  }

  @Autocreate
  public messageHeader getmessageHeader() {
    return messageHeader.wrap(getTyped("messageHeader"));
  }

  public void setmessageHeader(messageHeader value) {
    put("messageHeader", value == null ? null : value.unwrap());
  }

}
