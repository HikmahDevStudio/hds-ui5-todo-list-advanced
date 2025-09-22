sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "sap/m/MessageToast"],
  (Controller, Fragment, MessageToast) => {
    "use strict";

    return Controller.extend("hds.ui5.todolistadvance.controller.View1", {
      onInit() {},

      onTaskSubmit() {
        this.addTaskDialogBoxHandler();
      },

      inputTaskLiveChange(oEvent) {
        const oInputDesc = this.getView().byId("idInputTaskDescription");
        const oTaskDueDate = this.getView().byId("idDatePickerInputTask");
        const oTaskPriority = this.getView().byId("idPriorityInputTask");
        const oTaskCategory = this.getView().byId("idCategoryInputTask");

        const selectedControldId = oEvent.getParameter("id");
        const selectedDropDownControl = oEvent
          .getParameter("selectedItem")
          ?.getId();

        // Input Task Description handling
        if (selectedControldId?.includes("idInputTaskDescription")) {
          const isValidInput = oEvent.getParameter("value")?.trim()?.length > 0;
          const isErrorState = oInputDesc.getValueState() === "Error";

          // Remove previously Error state set on input field if valid input provided
          if (isErrorState && isValidInput) oInputDesc.setValueState("None");
        }

        // Due Date input handling
        if (selectedControldId?.includes("idDatePickerInputTask")) {
          const isValidInput = oEvent.getParameter("value")?.length > 0;
          const isErrorState = oTaskDueDate.getValueState() === "Error";

          // Remove previously Error state set on input field if valid input provided
          if (isErrorState && isValidInput) oTaskDueDate.setValueState("None");
        }

        // Priority input handling
        if (selectedDropDownControl?.includes("idPriorityInputTask")) {
          const isValidInput = oEvent.getParameter("selectedItem").getKey();
          const isErrorState = oTaskPriority.getValueState() === "Error";

          // Remove previously Error state set on input field if valid input provided
          if (isErrorState && isValidInput) oTaskPriority.setValueState("None");
        }

        // Category input handling
        if (selectedDropDownControl?.includes("idCategoryInputTask")) {
          const isValidInput = oEvent.getParameter("selectedItem").getKey();
          const isErrorState = oTaskCategory.getValueState() === "Error";

          // Remove previously Error state set on input field if valid input provided
          if (isErrorState && isValidInput) oTaskCategory.setValueState("None");
        }
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

        const isMandatoryFieldMissing = this.validateTaskInputDetails();

        if (isMandatoryFieldMissing) {
          MessageToast.show("Please provide missing details", {
            width: "250px",
          });
          return;
        }

        const oModel = this.getView().getModel();
        const aTaskList = oModel.getProperty("/tasks") || [];
        oModel.setProperty("/tasks", [...aTaskList, oInputTask]);

        this.resetInputTasksFields();
        this.byId("idDialogMain").close();
      },

      validateTaskInputDetails() {
        const oInputDesc = this.getView().byId("idInputTaskDescription");
        const oTaskDueDate = this.getView().byId("idDatePickerInputTask");
        const oTaskPriority = this.getView().byId("idPriorityInputTask");
        const oTaskCategory = this.getView().byId("idCategoryInputTask");

        const sInputDesc = oInputDesc.getValue().trim();
        const sTaskDueDate = oTaskDueDate.getValue();
        const sTaskPriority = oTaskPriority.getSelectedKey();
        const sTaskCategory = oTaskCategory.getSelectedKey();

        let isMandatoryFieldsMissing = false;

        if (!sInputDesc) {
          isMandatoryFieldsMissing = true;
          oInputDesc.setValueState("Error");
        }

        if (!sTaskDueDate) {
          isMandatoryFieldsMissing = true;
          oTaskDueDate.setValueState("Error");
        }

        if (!sTaskPriority) {
          isMandatoryFieldsMissing = true;
          oTaskPriority.setValueState("Error");
        }

        if (!sTaskCategory) {
          isMandatoryFieldsMissing = true;
          oTaskCategory.setValueState("Error");
        }

        return isMandatoryFieldsMissing;
      },

      resetInputTasksFields() {
        const oInputDesc = this.getView().byId("idInputTaskDescription");
        const oTaskDueDate = this.getView().byId("idDatePickerInputTask");
        const oTaskPriority = this.getView().byId("idPriorityInputTask");
        const oTaskCategory = this.getView().byId("idCategoryInputTask");

        oInputDesc.setValue("");
        oInputDesc.setValueState("None");
        oInputDesc.setValueStateText(null);

        oTaskDueDate.setValue(null);
        oTaskDueDate.setValueState("None");

        oTaskPriority.setSelectedKey("");
        oTaskPriority.setValueState("None");

        oTaskCategory.setSelectedKey("");
        oTaskCategory.setValueState("None");
      },

      cancelTaskDialogBoxHandler() {
        this.resetInputTasksFields();
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
