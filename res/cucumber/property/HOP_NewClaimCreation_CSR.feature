@homeowners @suite
Feature: New Claim Creation ~ HOP_NewClaimCreation_CSR

  As a customer service representative,
  I want to file claims against verified policies.

  Background:
    Given I am a user with the "Customer Service Associate" role

  Scenario Outline: Filing a new Homeowners claim with a loss cause
    Given a Homeowners policy
    And a Homeowners policy in the state of "California"
    When I start filing a claim
    And I set claim loss cause to "<Loss Cause>"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim loss cause should be "<Loss Cause>"

    Examples:
      | Loss Cause         |
      | Water              |
      | Earthquake         |
      | Structural failure |

  Scenario Outline: Filing a new Homeowners claim with a fire loss cause and a dwelling incident
    Given a Homeowners policy
    And a Homeowners policy in the state of "California"
    When I start filing a claim
    And I set claim loss cause to "Fire/Smoke"
    And I add a dwelling incident
      | Damage Description  | <Damage Description> |
      | Materials Damaged   | <Materials Damaged>  |
      | Estimate Received?  | <Estimate Received?> |
      | Already Repaired?   | <Already Repaired?>  |
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim loss cause should be "Fire/Smoke"
    And the following dwelling incident should exist on the claim
      | Damage Description  | <Damage Description> |
      | Materials Damaged   | <Materials Damaged>  |
      | Estimate Received?  | <Estimate Received?> |
      | Already Repaired?   | <Already Repaired?>  |

    Examples:
      | Damage Description                                   | Materials Damaged | Estimate Received? | Already Repaired? |
      | Electrical fault that caused fire in the living room | Carpet and floors | Yes                | No                |
