package jsonschema.ext.toggle.ccc.businessevents.request.v1_0;

import com.guidewire.pl.json.runtime.JsonWrapperList;
import gw.api.json.JsonDeserializationOptions;
import gw.api.json.JsonObject;
import gw.api.json.JsonParser;
import gw.api.json.JsonValidationResult;
import gw.api.json.JsonWrapper;
import gw.lang.SimplePropertyProcessing;

import javax.annotation.processing.Generated;
import java.util.List;

@SimplePropertyProcessing
@Generated(comments = "ext.toggle.ccc.businessevents.request-1.0#/definitions/recipient", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class recipient extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.request-1.0#/definitions/recipient";

  public recipient() {
    super();
  }

  private recipient(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static recipient wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new recipient(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static recipient parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static recipient parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<recipient> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), recipient::wrap);
  }

  public static List<recipient> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), recipient::wrap);
  }

  public String getcompanyName() {
    return getTyped("companyName");
  }

  public void setcompanyName(String value) {
    put("companyName", value);
  }

  public String getpersonCompanyIndicator() {
    return getTyped("personCompanyIndicator");
  }

  public void setpersonCompanyIndicator(String value) {
    put("personCompanyIndicator", value);
  }

  public String getrecipientID() {
    return getTyped("recipientID");
  }

  public void setrecipientID(String value) {
    put("recipientID", value);
  }

  public String getrecipientType() {
    return getTyped("recipientType");
  }

  public void setrecipientType(String value) {
    put("recipientType", value);
  }

}
