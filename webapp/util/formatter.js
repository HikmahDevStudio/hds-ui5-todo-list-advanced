sap.ui.define([], function () {
  "use strict";

  return {
    getDialogTitle(isEditMode) {
      console.log("+++ getDialogTitle --- isEditMode -- ", isEditMode);
      const oResourceBundle = this.getOwnerComponent()
        .getModel("i18n")
        .getResourceBundle();

      switch (isEditMode) {
        case true:
          return oResourceBundle.getText("TaskDialogTitleEditMode");
        case false:
          return oResourceBundle.getText("TaskDialogTitle");
        default:
          return oResourceBundle.getText("TaskDialogTitleEditMode");
      }
    },

    getTaskTitleStyleClass(taskStatus) {
      console.log("++++ getTaskTitleStyleClass - taskStatus -- ", taskStatus);
      return taskStatus === "Completed" ? "taskCompleted" : "";
    },
  };
});
