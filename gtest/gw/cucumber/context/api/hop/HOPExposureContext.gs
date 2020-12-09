package gw.cucumber.context.api.hop

uses gw.cucumber.context.api.common.ExposureContext

/**
 * Methods related to hop homeowners exposure
 */
interface HOPExposureContext extends ExposureContext {

  /**
   * Create a dwelling exposure on claim that referencing the dwelling incident
   */
  function addDwellingExposureReferencingIncident()

  /**
   * Verify the dwelling exposure on claim references the dwelling incident
   */
  function verifyExposureReferencingDwellingIncident()

  /**
   * Create a blanket exposure on claim
   */
  function addBlanketExposure()

  /**
   * Verify the blanket exposure on claim references the personal property incident
   */
  function verifyExposureReferencingPersonalPropertyIncident()
}