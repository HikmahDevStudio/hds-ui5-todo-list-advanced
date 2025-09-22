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

        const oInputTask = {
          id: new Date().getTime(),
          title: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate,
          Status: "Pending",
        };

        const oModel = this.getView().getModel();
        const aTaskList = oModel.getProperty("/tasks") || [];
        oModel.setProperty("/tasks", [...aTaskList, oInputTask]);

        this.byId("idDialogMain").close();

        this.getView().byId("idInputTaskDescription").setValue("");
        this.getView().byId("idDatePickerInputTask").setValue(null);
        this.getView().byId("idPriorityInputTask").setSelectedItem(null);
        this.getView().byId("idCategoryInputTask").setSelectedItem(null);
      },

      cancelTaskDialogBoxHandler() {
        this.byId("idDialogMain").close();
      },

      deleteTaskHandler(event) {
        const { id } = event.getSource().getBindingContext().getObject();

        const oModel = this.getView().getModel();
        const aTask = oModel.getProperty("/tasks") || [];

        const aUpdatedTask = aTask.filter((task) => task.id !== id);

        oModel.setProperty("/tasks", aUpdatedTask);
      },

      editTaskHandler() {},

      markCompleteteTaskHandler() {},
    });
  }
);
