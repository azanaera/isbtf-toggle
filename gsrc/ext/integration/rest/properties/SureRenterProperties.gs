package ext.integration.rest.properties

uses gw.api.properties.RuntimePropertyRetriever

class SureRenterProperties extends RuntimePropertyRetriever {

  construct() {
    super(RuntimePropertyGroup.TC_SUREPOLICY_EXT)
  }

  /**
   * Get the path for Sure Renter Api.
   *
   * @return the path for Sure Renter Api.
   */
  public property get SureRenterPath() : String {
    return this.getRequiredStringProperty("SureRenterPath")
  }

  /**
   * Get the X-Space for Sure Renter Api.
   *
   * @return the X-Space for Sure Renter Api.
   */
  public property get SureRenterXSpace() : String {
    return this.getRequiredStringProperty("SureRenterXSpace")
  }

  /**
   * Get the Auth Token for Sure Api.
   *
   * @return Auth Token for Sure Api.
   */
  public property get SureToken() : String {
    return this.getRequiredStringProperty("SureToken")
  }

  /**
   * Get the Med pay max limit for renters.
   *
   * @return med pay limit.
   */
  public property get MedPayLimit() : Integer {
    return this.getRequiredIntegerProperty("MedPayLimit")
  }

  /**
   * Get the blanket limit for renters.
   *
   * @return med pay limit.
   */
  public property get BlanketLimit() : Integer {
    return this.getRequiredIntegerProperty("BlanketLimit")
  }

  /**
   * Get the pet max limit for renters.
   *
   * @return med pay limit.
   */
  public property get PetLimit() : Integer {
    return this.getRequiredIntegerProperty("PetLimit")
  }

  /**
   * Get the side hustle legal fees limit for renters.
   *
   * @return side hustle legal fees limit.
   */
  public property get SHLegalFeesLimit() : Integer {
    return this.getRequiredIntegerProperty("SHLegalFeesLimit")
  }

  /**
   * Get the side hustle loss of income limit for renters.
   *
   * @return side hustle loss of income limit.
   */
  public property get SHLossIncomeLimit() : Integer {
    return this.getRequiredIntegerProperty("SHLLossIncomeLimit")
  }

  /**
   * Get the side hustle loss of income limit for renters.
   *
   * @return side hustle loss of income limit.
   */
  public property get SHLossIncomePerWeekLimit() : Integer {
    return this.getRequiredIntegerProperty("SHLLossIncomePerWeekLimit")
  }
}