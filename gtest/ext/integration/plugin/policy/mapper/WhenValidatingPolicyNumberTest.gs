package ext.integration.plugin.policy.mapper

uses gw.api.test.CCUnitTestClassBase
uses gw.testharness.v3.PLAssertions

class WhenValidatingPolicyNumberTest extends CCUnitTestClassBase {

  function testThatValidPolicyNumberReturnsTrue() {
    // GIVEN
    var validPolicyNumber = "0123456789"

    // WHEN
    var validatePolicyReturnValue = new SurePolicyMapper().validatePolicyNumber(validPolicyNumber)

    // THEN
    gw.testharness.v3.PLAssertions.assertThat(validatePolicyReturnValue).as("Policy Number is not valid")

  }

  function testThatInvalidPolicyNumberReturnsFalse() {
    // GIVEN
    var invalidPolicyNumber = "0123-56789"

    // WHEN
    var validatePolicyReturnValue = new SurePolicyMapper().validatePolicyNumber(invalidPolicyNumber)

    // THEN
    gw.testharness.v3.PLAssertions.assertThat(validatePolicyReturnValue == false).as("Policy Number is valid")

  }

}