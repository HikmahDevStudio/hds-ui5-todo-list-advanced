sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment"],
  (Controller, Fragment) => {
    "use strict";

    return Controller.extend("hds.ui5.todolistadvance.controller.View1", {
      onInit() {},
      openAddTaskDialog() {
        // const sInputTask = this.getView().byId("idInputTask").getValue();

        // if (!sInputTask.trim()) {
        //   this.getView().byId("idInputTask").setValue("");
        //   return;
        // }

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
        const oView = this.getView();
        const taskDescription = this.getView()
          .byId("idInputTaskDescription")
          .getValue();
        const taskDueDate = this.getView()
          .byId("idDatePickerInputTask")
          .getValue();
        const taskPriority = this.getView()
          .byId("idPriorityInputTask")
          .getSelectedItem()
          .getText();
        const taskCategory = this.getView()
          .byId("idCategoryInputTask")
          .getSelectedItem()
          .getText();

        this.byId("idDialogMain").close();
        this.getView().byId("idInputTask").setValue("");
      },

      cancelTaskDialogBoxHandler() {
        this.byId("idDialogMain").close();
      },
    });
  }
);
