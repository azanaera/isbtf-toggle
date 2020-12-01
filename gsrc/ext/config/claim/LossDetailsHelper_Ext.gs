package ext.config.claim

uses gw.api.database.IQueryBeanResult;
uses com.guidewire.commons.util.Relop
uses com.guidewire.pl.system.database.Query;
uses com.guidewire.pl.system.database.impl.QueryImpl;

class LossDetailsHelper_Ext {

  /**
   *  Sets the value of the claim Fault and FaultRating depending on the claims Loss Cause
   * @param claim
   */
  public static function DefaultClaimFaultAndFaultRating(claim : Claim){
    var lossCausePriority = claim.LossCause?.Priority
    if(lossCausePriority > 0 and lossCausePriority != 300 and !(lossCausePriority >= 30 and lossCausePriority < 120)){
      if(claim.FaultRating == null){
        claim.FaultRating = FaultRating.TC_NOFAULT
      }
      if(claim.Fault == null){
        claim.Fault = 0
      }
    }
  }
  public static function DefaultClaimFaultAndFaultRatingHO(claim : Claim){
    var lossCause = claim.LossCause
    if(lossCause == LossCause.TC_LIGHTNING_EXT
        or lossCause == LossCause.TC_MYST_DISP_EXT
        or lossCause == LossCause.TC_WIND
        or lossCause == LossCause.TC_EARTHQUAKE_HO_EXT
        or lossCause == LossCause.TC_FLOOD_HO_EXT
        or lossCause == LossCause.TC_HAIL_HO_EXT
        or lossCause == LossCause.TC_HURRICANE_HO_EXT
        or lossCause == LossCause.TC_VIRUS_EXT
        or lossCause == LossCause.TC_TORNADO_HO_EXT
        or lossCause == LossCause.TC_WILDFIRE_EXT
        or lossCause == LossCause.TC_IDEN_THEFT_EXT){
      if(claim.FaultRating == null){
        claim.FaultRating = FaultRating.TC_NOFAULT
      }
      if(claim.Fault == null){
        claim.Fault = 0
      }
    }
  }
  /**
   *  checks differentthe claims Loss Cause
   * @param claim
   */
  public static function CollisionLossCauses (claim : Claim) : boolean {
    switch (claim.LossCause) {
      case LossCause.TC_VEHCOLLISION:
      case LossCause.TC_LEFTCOLLISION:
      case LossCause.TC_BIKECOLLISION:
      case LossCause.TC_PEDCOLLISION:
      case LossCause.TC_TRAINBUSCOLL:
      case LossCause.TC_FIXEDOBJCOLL:
      case LossCause.TC_OTHEROBJCOLL:
      case LossCause.TC_ROLLOVER:
        return true

      default : return false
    }
 }


  /**
   * Returns active Catastrophes filtered by CatastropheType
   * @param type
   * @return
   */
  public static function getCatastrophes(type : CatastropheType) : IQueryBeanResult<Catastrophe> {
    var query : Query<Catastrophe> = new QueryImpl<Catastrophe>(Catastrophe.TYPE.get())
    var restrictions = query.getPrimaryTableObject().getRestriction()
        restrictions.compareEquals(Catastrophe.ACTIVE_PROP.get(), true, false)
        restrictions.compareEquals(Catastrophe.TYPE_PROP.get(), type, false)
    return query.getProcessor()
  }

}