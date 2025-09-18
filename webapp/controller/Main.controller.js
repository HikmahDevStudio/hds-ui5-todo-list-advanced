sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment"],
  (Controller, Fragment) => {
    "use strict";

    return Controller.extend("hds.ui5.todolistadvance.controller.View1", {
      onInit() {},
      submitTaskHandler() {
        const sInputTask = this.getView().byId("idInputTask").getValue();

        if (!sInputTask.trim()) {
          this.getView().byId("idInputTask").setValue("");
          return;
        }

        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "hds.ui5.todolistadvance.view.fragment.TaskDetailsDialog",
          });
        }

        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },

      addTaskDialogBoxHandler() {
        this.byId("idDialogMain").close();

        // const sCurrentInputTask = this.getView().byId("idInputTask").getValue();
        this.getView().byId("idInputTask").setValue("");
      },

      cancelTaskDialogBoxHandler() {
        this.byId("idDialogMain").close();
      },
    });
  }
);
