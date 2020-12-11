package ext.integration.rest.properties

uses gw.api.properties.RuntimePropertyRetriever

class SurePolicyProperties extends RuntimePropertyRetriever {

  construct() {
    super(RuntimePropertyGroup.TC_SUREPOLICY_EXT)
  }



}