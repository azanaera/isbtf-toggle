package ext.integration.util.service

uses ext.integration.plugin.policy.StubSurePolicyService
uses ext.integration.plugin.policy.PolicyService
uses ext.integration.plugin.policy.SurePolicyService
uses gw.lang.reflect.ReflectUtil
uses gw.surepath.suite.integration.logging.StructuredLogger

abstract class AbstractServiceBase {
  private static var _logger = StructuredLogger.INTEGRATION
  var _transactionID : String as TransactionID

  /**
   * This method executes a function of an object (service) instance
   */
  public static function invokeMethod(instance : Object, methodName : String, params : Object[]) : Object {

    org.apache.commons.lang.Validate.notNull(instance, "instance parameter cannot be null")
    org.apache.commons.lang.Validate.notNull(methodName, "method name cannot be null")

    var methodExists = (typeof instance).TypeInfo.Methods.firstWhere(\m -> m.DisplayName == methodName)
    if (methodExists == null) {
      throw new java.lang.IllegalArgumentException("method: " + methodName + " does not exist on " + (typeof instance).DisplayName)
    }

    var response : Object = null

    var service = (instance as AbstractServiceBase)
    service.TransactionID = service.getServiceName() + UUID.randomUUID().toString()
    response = ReflectUtil.invokeMethod(instance, methodName, params)

    return response
  }

  /**
   * This method returns either the local implementation of a service or the external implementation.
   * For each new service, this method needs to be modified to add the particular scenario in the switch block
   */
  public static function getServiceRef(serviceName : String) : AbstractServiceBase {
    org.apache.commons.lang.Validate.notNull(serviceName, "service name cannot be null")

    switch (serviceName) {
      case PolicyService.SERVICENAME: {
        return isEnableStubbedService(serviceName) ? new SurePolicyService(): new StubSurePolicyService()
      }
    }
    return null
  }

  protected static function isEnableStubbedService(serviceName : String) : boolean {
   /* var service = RuntimePropertyGroup.get(serviceName)
    var enabled = new ServiceProperties(service).Enabled
    return enabled */
    return false
  }

  abstract function getServiceName() : String
}