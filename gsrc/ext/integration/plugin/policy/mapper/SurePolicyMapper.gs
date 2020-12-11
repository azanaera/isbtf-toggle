package ext.integration.plugin.policy.mapper

uses gw.api.util.TypecodeMapper
uses gw.api.util.TypecodeMapperUtil
uses gw.surepath.suite.integration.logging.StructuredLogger


uses java.text.SimpleDateFormat
uses java.time.LocalDateTime
uses java.time.ZoneId

class SurePolicyMapper {
  private static var _logger = StructuredLogger.PLUGIN

  private static var POLICYNUM_REGEX = "[A-Z0-9]{10}"

  static function validatePolicyNumber(policyNumber : String) : boolean {
    var valid = policyNumber.matches(POLICYNUM_REGEX)
    return valid
  }

  static function determineEffectiveDate(createdAt : Date, policyEffectiveDate : Date) : Date {
    if (createdAt.before(policyEffectiveDate)) {
      return policyEffectiveDate
    } else {
      return createdAt
    }
  }

  static function formatDateWithTimeZone(date : Date) : Date {
    _logger.trace("Converting Sure DateTime to Server DateTime :method = SurePersonalAutoService#formatDateWithTimeZone(date : Date) "
        , :parameters = ({"Sure DateTime" -> String.valueOf(date)}))
    var instant = date.toInstant()
    var timeZone = ZoneId.systemDefault()
    var localDate = String.valueOf(LocalDateTime.ofInstant(instant, timeZone))
    var format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm")
    var formattedDate = format.parse(localDate)
    _logger.trace("Converted Sure DateTime to Server DateTime :method = SurePersonalAutoService#formatDateWithTimeZone(date : Date) "
        , :parameters = ({"Sure DateTime" -> String.valueOf(date), "Server DateTime" -> String.valueOf(formattedDate)}))
    return formattedDate
  }

  static function formatServerDateWithUTCTimeZone(date : Date) : Date {
    _logger.trace("Converting Server DateTime to UTC DateTime :method = SurePersonalAutoService#formatServerDateWithUTCTimeZone(date : Date) "
        , :parameters = ({"Server DateTime" -> String.valueOf(date)}))
    var instant = date.toInstant()
    var timeZone = ZoneId.of("UTC")
    var localDate = String.valueOf(LocalDateTime.ofInstant(instant, timeZone))
    var format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm")
    var formattedDate = format.parse(localDate)
    _logger.trace("Converted Server DateTime to UTC DateTime :method = SurePersonalAutoService#formatServerDateWithUTCTimeZone(date : Date) "
        , :parameters = ({"Server DateTime" -> String.valueOf(date), "UTC DateTime" -> String.valueOf(formattedDate)}))
    return formattedDate
  }
}