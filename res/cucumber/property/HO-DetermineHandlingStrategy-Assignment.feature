@homeowners @HO-DetermineHandlingStrategy-Assignment @suite
Feature: Assignment ~ HO_DetermineHandlingStrategy_Assignment

  As an adjuster,
  I want to reassign claims manually and automated using assignment rules.

  Background:
    Given I am a user with the "Adjuster" role

  @23860-GW
  Scenario: Reassign an existing Homeowners claim through automated assignment
    Given a Homeowners claim
    And the claim segment is "Property - mid complexity"
    And the claim loss location is in state "California"
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is property, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I reassign the claim through automated assignment
    Then the claim should be assigned to a user in "Claim Organization" group

  @23860-GW
  Scenario: Manually reassigning an existing Homeowners claim
    Given a Homeowners claim
    When I manually reassign the claim to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    Then the claim should be assigned to group "Toggle Auto East Zone APD Handlers Group 1"
    And the claim should be assigned to user "Justin Silvers"

  @23860-GW
  Scenario: Manually reassigning an exposure on a Homeowners claim
    Given a Homeowners claim
    And the claim has a "Personal Liability" exposure
    And the exposure is assigned to group "Toggle Auto East Zone Generalist Group 1" and user "Alexander Sleeman"
    When I manually reassign the exposure to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    Then the exposure should be assigned to group "Toggle Auto East Zone APD Handlers Group 1"
    And the exposure should be assigned to user "Justin Silvers"

  @23860-GW
  Scenario: Manually reassigning an activity on a Homeowners claim
    Given a Homeowners claim
    And the claim has an activity
    And the activity is assigned to group "Toggle Auto East Zone Generalist Group 1" and user "Alexander Sleeman"
    When I manually reassign the activity to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    Then the activity should be assigned to group "Toggle Auto East Zone APD Handlers Group 1"
    And the activity should be assigned to user "Justin Silvers"