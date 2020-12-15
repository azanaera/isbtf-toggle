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
@Generated(comments = "ext.toggle.ccc.businessevents.request-1.0#/definitions/businessEvent", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class businessEvent extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.request-1.0#/definitions/businessEvent";

  public businessEvent() {
    super();
  }

  private businessEvent(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static businessEvent wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new businessEvent(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static businessEvent parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static businessEvent parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<businessEvent> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), businessEvent::wrap);
  }

  public static List<businessEvent> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), businessEvent::wrap);
  }

  public String geteventCode() {
    return getTyped("eventCode");
  }

  public void seteventCode(String value) {
    put("eventCode", value);
  }

  public String geteventDateTime() {
    return getTyped("eventDateTime");
  }

  public void seteventDateTime(String value) {
    put("eventDateTime", value);
  }

  public String geteventDescription() {
    return getTyped("eventDescription");
  }

  public void seteventDescription(String value) {
    put("eventDescription", value);
  }

  @Autocreate
  public recipientDetailsExtension geteventExtensionData() {
    return recipientDetailsExtension.wrap(getTyped("eventExtensionData"));
  }

  public void seteventExtensionData(recipientDetailsExtension value) {
    put("eventExtensionData", value == null ? null : value.unwrap());
  }

  public String geteventNotes() {
    return getTyped("eventNotes");
  }

  public void seteventNotes(String value) {
    put("eventNotes", value);
  }

  public String getsourceUserID() {
    return getTyped("sourceUserID");
  }

  public void setsourceUserID(String value) {
    put("sourceUserID", value);
  }

}
