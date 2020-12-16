@homeowners @suite
Feature: Assignment ~ HOP_Activity_CSR

  As a customer service representative,
  I want to create and assign claims manually and automated using assignment rules.

  Background:
    Given I am a user with the "Customer Service Associate" role

  Scenario: 1. Assigning a new Homeowners claim through automated assignment
    Given a Homeowners policy
    And a Homeowners policy in the state of "California"
    # And gosu rules to automatically assign the claim: GCAP00010 - If the claim loss type is property, this rule uses the loss type and claim segment to get the top two matching group type choices for assigning this claim.
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I set claim loss cause to "Water"
    And I add a "Third-party liability" injury incident
    And I add a bodily injury exposure
    And I assign the claim through automated assignment
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to a user in "Toggle Renters Claims Group 2" group

   Scenario: 2. Manually assigning a new Homeowners claim
    Given a Homeowners policy
     And a Homeowners policy in the state of "California"
    When I start filing a claim
     And I set claim loss cause to "Fire/Smoke"
    And I manually assign the claim to group "Toggle Renters Claims Group 1" and user "Matthew Armbruster"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to group "Toggle Renters Claims Group 1"
    And the claim should be assigned to user "Matthew Armbruster"

  @23860-GW-I
  Scenario: 3. Assigning a claim manually and an exposure through automated assignment on new Homeowners claim
    Given a Homeowners policy
    And a Homeowners policy in the state of "New York"
    When I start filing a claim
    And I set loss location to an address in state "New York"
    And I add a "Third-party liability" injury incident
    And I set claim loss cause to "Tornado"
    And I add a bodily injury exposure
    And I manually assign the claim individually to group "Toggle Renters Claims Group 1" and user "Matthew Armbruster"
    And I assign the "Personal Liability" exposure through automated assignment
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to group "Toggle Renters Claims Group 1"
    And the claim should be assigned to user "Matthew Armbruster"
    And the exposure should be assigned to group "Toggle Renters Claims Group 1"

  @23860-GW-I
  Scenario: 4. Assigning a claim through automated assignment and manually assigning an exposure on new Homeowners claim
    Given a Homeowners policy
    And a Homeowners policy in the state of "California"
    When I start filing a claim
    And I set loss location to an address in state "California"
    And I add a "Third-party liability" injury incident
    And I set claim loss cause to "Tornado"
    And I add a bodily injury exposure
    And I assign the claim individually through automated assignment
    And I manually assign the "Personal Liability" exposure to group "Toggle Auto East Zone APD Handlers Group 1" and user "Justin Silvers"
    And I finish filing the claim
    Then a "Homeowners" claim should be created
    And the claim should be assigned to a user in "Toggle Renters Claims Group 2" group
    And the exposure should be assigned to group "Toggle Auto East Zone APD Handlers Group 1"
    And the exposure should be assigned to user "Justin Silvers"