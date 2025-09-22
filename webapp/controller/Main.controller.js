sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment"],
  (Controller, Fragment) => {
    "use strict";

    return Controller.extend("hds.ui5.todolistadvance.controller.View1", {
      onInit() {},

      onTaskSubmit() {
        this.addTaskDialogBoxHandler();
      },

      inputTaskOnChangeHandler(oEvent) {
        const sInput = oEvent.getParameter("value");
        console.log(sInput);
      },

      openAddTaskDialog() {
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
        const taskDescription = this.getView()
          .byId("idInputTaskDescription")
          .getValue();

        if (!taskDescription.trim()) {
          const oInputDesc = this.getView().byId("idInputTaskDescription");
          oInputDesc.setValueState("Error");
          oInputDesc.setValueStateText("This field is mandatory!");

          return;
        }

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
          id: new Date().getTime().toString(),
          title: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate,
          category: taskCategory,
          Status: "Pending",
        };

        const oModel = this.getView().getModel();
        const aTaskList = oModel.getProperty("/tasks") || [];
        oModel.setProperty("/tasks", [...aTaskList, oInputTask]);
        this.byId("idDialogMain").close();
      },

      resetInputTasksFields() {
        const oInputDesc = this.getView().byId("idInputTaskDescription");
        oInputDesc.setValueState("None");
        oInputDesc.setValueStateText(null);

        this.getView().byId("idInputTaskDescription").setValue("");
        this.getView().byId("idDatePickerInputTask").setValue(null);
        this.getView().byId("idPriorityInputTask").setSelectedItem(null);
        this.getView().byId("idCategoryInputTask").setSelectedItem(null);
      },

      cancelTaskDialogBoxHandler() {
        this.byId("idDialogMain").close();
      },

      deleteTaskHandler(oEvent) {
        const { id } = oEvent.getSource().getBindingContext().getObject();

        const oModel = this.getView().getModel();
        const aTask = oModel.getProperty("/tasks") || [];
        const aUpdatedTask = aTask.filter((task) => task.id !== id);

        oModel.setProperty("/tasks", aUpdatedTask);
      },

      editTaskHandler(oEvent) {
        const { id, Status, title, priority, dueDate, category } = oEvent
          .getSource()
          .getBindingContext()
          .getObject();
        this.openAddTaskDialog();

        this.getView()
          .byId("idDatePickerInputTask")
          .setDateValue(new Date(dueDate));

        this.getView().byId("idInputTaskDescription").setValue(title);
        this.getView().byId("idPriorityInputTask").setSelectedKey(priority);
        this.getView().byId("idCategoryInputTask").setSelectedKey(category);
      },

      markCompleteteTaskHandler(oEvent) {
        const { id } = oEvent.getSource().getBindingContext().getObject();

        const oModel = this.getView().getModel();
        const aAllTask = oModel.getProperty("/tasks") || [];

        const aUpdatedTask = aAllTask.map((task) => {
          if (task.id === id) {
            return {
              ...task,
              Status: "Completed",
            };
          } else {
            return task;
          }
        });

        oModel.setProperty("/tasks", aUpdatedTask);
      },
    });
  }
);
