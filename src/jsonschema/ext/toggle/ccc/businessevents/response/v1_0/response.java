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
@Generated(comments = "ext.toggle.ccc.businessevents.response-1.0#/definitions/response", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class response extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.response-1.0#/definitions/response";

  public response() {
    super();
  }

  private response(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static response wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new response(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static response parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static response parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<response> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), response::wrap);
  }

  public static List<response> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), response::wrap);
  }

  @Autocreate
  public cCCTransactionResponse getcCCTransactionResponse() {
    return cCCTransactionResponse.wrap(getTyped("cCCTransactionResponse"));
  }

  public void setcCCTransactionResponse(cCCTransactionResponse value) {
    put("cCCTransactionResponse", value == null ? null : value.unwrap());
  }

}
