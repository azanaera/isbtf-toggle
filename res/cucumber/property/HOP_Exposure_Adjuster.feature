@homeowners @suite
Feature: Exposure ~ HOP_Exposure_Adjuster

  As an adjuster,
  I want to create exposures while filing a new claim and on existing claims.

  Background:
    Given I am a user with the "Adjuster" role

  Scenario: Creating a blanket exposure on an existing Homeowners claim
    Given a Homeowners claim
    And I add a personal property incident with line items
    When I add a Blanket exposure
    Then a "Blanket" exposure should be created on the claim
    And the exposure should reference the personal property incident