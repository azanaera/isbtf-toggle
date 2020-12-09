package gw.api.assignment

@Export
enhancement AssignmentPopupEnhancement : AssignmentPopup {
  /**
   * @return true if any non {@link AssignmentSelectionType#TC_FROMLIST} is selected,
   * false otherwise.
   */
  property get IsAnySearchTypeSelected(): boolean {

    return this.SelectionType == AssignmentSelectionType.TC_FROMSEARCH or
           this.SelectionType == AssignmentSelectionType.TC_FROMPROXIMITYSEARCH
  }

  property get Assignables_Ext(): CCAssignable[]{
    return this.getAssignables() as CCAssignable[]

  }
}
