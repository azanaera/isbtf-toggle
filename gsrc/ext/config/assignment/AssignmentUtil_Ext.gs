package ext.config.assignment

uses gw.api.database.Query

class AssignmentUtil_Ext {
  private construct() {
    // Enforces static only access
  }

  static function updGrpTypeandAssign(AssignmentPopup : gw.api.assignment.AssignmentPopup, grpType : GroupType) : boolean {
    var ret : boolean
    gw.transaction.Transaction.runWithNewBundle(\newBundle -> {
      for (assgn in AssignmentPopup.Assignables_Ext) {
        if (assgn typeis Claim) {
          assgn = newBundle.add(assgn)
          assgn.SelGrpTypeForAssign_Ext = grpType
        } else if (assgn typeis Exposure) {
          assgn = newBundle.add(assgn)
          assgn.SelGrpTypeForAssign_Ext = grpType
        } else if (assgn typeis Activity) {
          assgn = newBundle.add(assgn)
          assgn.SelGrpTypeForAssign_Ext = grpType
        }
        ret = assgn.autoAssign()
      }
    }, User.util.CurrentUser)
    return ret
  }


  static function getGroupTypeClaim(ent : Claim) : GroupType {
    var retGroupType : GroupType = null
    if (ent.SelGrpTypeForAssign_Ext != null) {
      retGroupType = ent.SelGrpTypeForAssign_Ext
    } else if (ent.LossType == LossType.TC_AUTO) {
      retGroupType = GroupType.getTypeKey(ScriptParameters.ParentGroupType_Generalists_Ext)
    } else if (ent.LossType == LossType.TC_PR) {
      retGroupType = GroupType.getTypeKey(ScriptParameters.ParentGroupType_Renters_Ext)
    }
    return retGroupType
  }

  static function getGroupTypeExposure(ent : Exposure) : GroupType {
    var retGroupType : GroupType = null
    if (ent.SelGrpTypeForAssign_Ext != null) {
      retGroupType = ent.SelGrpTypeForAssign_Ext
    } else if (ent.Claim.LossType == LossType.TC_AUTO) {
      retGroupType = GroupType.getTypeKey(ScriptParameters.ParentGroupType_Generalists_Ext)
    } else if (ent.Claim.LossType == LossType.TC_PR) {
      retGroupType = GroupType.getTypeKey(ScriptParameters.ParentGroupType_Renters_Ext)
    }
    return retGroupType
  }

  static function getGroupTypeActivity(ent : Activity) : GroupType {
    var retGroupType : GroupType = null
    if (ent.SelGrpTypeForAssign_Ext != null) {
      retGroupType = ent.SelGrpTypeForAssign_Ext
    } else if (ent.Claim.LossType == LossType.TC_AUTO) {
      retGroupType = GroupType.getTypeKey(ScriptParameters.ParentGroupType_Generalists_Ext)
    } else if (ent.Claim.LossType == LossType.TC_PR) {
      retGroupType = GroupType.getTypeKey(ScriptParameters.ParentGroupType_Renters_Ext)
    }
    return retGroupType
  }

    static function getRootGroupClaim(ent:Claim, grpType : GroupType): Group{
      var retGroup : Group = null
      if (ScriptParameters.AllSharedServices_Ext.split(",").contains(grpType.Code)){
        retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_Shared_Ext)).select().first()
      } else if(grpType.hasCategory(LossType.TC_AUTO)){
        retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_Auto_Ext)).select().first()
      } else if(grpType.hasCategory(LossType.TC_PR)){
        retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_HOwn_Ext)).select().first()
      }
      return retGroup
    }
  static function getRootGroupExposure(ent:Exposure, grpType : GroupType): Group{
    var retGroup : Group = null
    if (ScriptParameters.AllSharedServices_Ext.split(",").contains(grpType.Code)){
      retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_Shared_Ext)).select().first()
    } else if(grpType.hasCategory(LossType.TC_AUTO)){
      retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_Auto_Ext)).select().first()
    } else if(grpType.hasCategory(LossType.TC_PR)){
      retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_HOwn_Ext)).select().first()
    }
    return retGroup
  }
  static function getRootGroupActivity(ent:Activity, grpType : GroupType): Group{
    var retGroup : Group = null
    if (ScriptParameters.AllSharedServices_Ext.split(",").contains(grpType.Code)){
      retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_Shared_Ext)).select().first()
    } else if(grpType.hasCategory(LossType.TC_AUTO)){
      retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_Auto_Ext)).select().first()
    } else if(grpType.hasCategory(LossType.TC_PR)){
      retGroup = Query.make(Group).compare(Group#GroupType, Equals, GroupType.getTypeKey(ScriptParameters.ParentGroupType_HOwn_Ext)).select().first()
    }
    return retGroup
  }
  static function getAssignmentLocn(claim:Claim):Address{
    if (claim.LossLocation.Country == Country.TC_US) {
      return claim.LossLocation
    } else {
        return claim.Policy.Addresses[0]
    }
  }
}