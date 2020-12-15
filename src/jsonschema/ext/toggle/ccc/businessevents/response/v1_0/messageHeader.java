package jsonschema.ext.toggle.ccc.businessevents.response.v1_0;

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
@Generated(comments = "ext.toggle.ccc.businessevents.response-1.0#/definitions/messageHeader", value = "com.guidewire.pl.json.codegen.SchemaWrappersGenerator")
public class messageHeader extends JsonWrapper {

  private static final String FQN = "ext.toggle.ccc.businessevents.response-1.0#/definitions/messageHeader";

  public messageHeader() {
    super();
  }

  private messageHeader(JsonObject jsonObject) {
    super(jsonObject);
  }

  public static messageHeader wrap(JsonObject jsonObject) {
    return jsonObject == null ? null : new messageHeader(jsonObject);
  }

  public static String getFullyQualifiedName() {
    return FQN;
  }

  public static messageHeader parse(String json) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN));
  }

  public static messageHeader parse(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : wrap(JsonParser.OBJECT.parse(json, FQN, jsonValidationResult, jsonDeserializationOptions));
  }

  public static List<messageHeader> parseArray(String json) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN), messageHeader::wrap);
  }

  public static List<messageHeader> parseArray(String json, JsonValidationResult jsonValidationResult, JsonDeserializationOptions jsonDeserializationOptions) {
    return json == null ? null : new JsonWrapperList<>(JsonParser.OBJECT.parseArray(json, FQN, jsonValidationResult, jsonDeserializationOptions), messageHeader::wrap);
  }

  public String getechoField() {
    return getTyped("echoField");
  }

  public void setechoField(String value) {
    put("echoField", value);
  }

  public String getestimatingSystem() {
    return getTyped("estimatingSystem");
  }

  public void setestimatingSystem(String value) {
    put("estimatingSystem", value);
  }

  public String getlossReferenceID() {
    return getTyped("lossReferenceID");
  }

  public void setlossReferenceID(String value) {
    put("lossReferenceID", value);
  }

  public String getprimaryInsuranceCompany() {
    return getTyped("primaryInsuranceCompany");
  }

  public void setprimaryInsuranceCompany(String value) {
    put("primaryInsuranceCompany", value);
  }

  public String gettransactionDateTime() {
    return getTyped("transactionDateTime");
  }

  public void settransactionDateTime(String value) {
    put("transactionDateTime", value);
  }

  public String getuniqueTransactionID() {
    return getTyped("uniqueTransactionID");
  }

  public void setuniqueTransactionID(String value) {
    put("uniqueTransactionID", value);
  }

}
