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
@Generated(comments = "ext.toggle.ccc.businessevents.request-1.0#/definitions/recipientDetailsExtension", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class recipientDetailsExtension extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.request-1.0#/definitions/recipientDetailsExtension";

  public recipientDetailsExtension() {
    super();
  }

  private recipientDetailsExtension(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static recipientDetailsExtension wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new recipientDetailsExtension(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static recipientDetailsExtension parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static recipientDetailsExtension parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<recipientDetailsExtension> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), recipientDetailsExtension::wrap);
  }

  public static List<recipientDetailsExtension> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), recipientDetailsExtension::wrap);
  }

  @Autocreate
  public recipient getoriginalRecipient() {
    return recipient.wrap(getTyped("originalRecipient"));
  }

  public void setoriginalRecipient(recipient value) {
    put("originalRecipient", value == null ? null : value.unwrap());
  }

  @Autocreate
  public recipient getreassignedRecipient() {
    return recipient.wrap(getTyped("reassignedRecipient"));
  }

  public void setreassignedRecipient(recipient value) {
    put("reassignedRecipient", value == null ? null : value.unwrap());
  }

}
