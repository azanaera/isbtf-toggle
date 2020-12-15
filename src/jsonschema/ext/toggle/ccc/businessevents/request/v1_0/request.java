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
@Generated(comments = "ext.toggle.ccc.businessevents.request-1.0#/definitions/request", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class request extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.request-1.0#/definitions/request";

  public request() {
    super();
  }

  private request(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static request wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new request(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static request parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static request parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<request> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), request::wrap);
  }

  public static List<request> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), request::wrap);
  }

  @Autocreate
  public cCCBusinessEventTransaction getcCCBusinessEventTransaction() {
    return cCCBusinessEventTransaction.wrap(getTyped("cCCBusinessEventTransaction"));
  }

  public void setcCCBusinessEventTransaction(cCCBusinessEventTransaction value) {
    put("cCCBusinessEventTransaction", value == null ? null : value.unwrap());
  }

  public String getinternal_id() {
    return getTyped("internal-id");
  }

  public void setinternal_id(String value) {
    put("internal-id", value);
  }

}
