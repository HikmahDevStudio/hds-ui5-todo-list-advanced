sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "hds/ui5/todolistadvance/util/formatter",
  ],
  (Controller, Fragment, MessageToast, Formatter) => {
    "use strict";

    return Controller.extend("hds.ui5.todolistadvance.controller.View1", {
      onInit() {},
      formatter: Formatter,
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

      openAddTaskDialog({ isEditMode = false } = {}) {
        this.getView().getModel().setProperty("/isEditMode", isEditMode);
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "hds.ui5.todolistadvance.view.fragment.TaskDetailsDialog",
          });
        }

        this.pDialog.then((oDialog) => oDialog.open());
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

        const isEditMode = this.getView().getModel().getProperty("/isEditMode");

        function getTaskId(_this) {
          const taskId = isEditMode
            ? _this.idCurrentSelectedTask
            : new Date().getTime().toString();

          return taskId;
        }

        const oInputTask = {
          id: getTaskId(this),
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

        if (isEditMode) {
          const aUpdatedTask = aTaskList.map((task) =>
            task.id === this.idCurrentSelectedTask ? oInputTask : task
          );
          oModel.setProperty("/tasks", [...aUpdatedTask]);
        } else {
          oModel.setProperty("/tasks", [...aTaskList, oInputTask]);
        }

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

      getConfirmationDeleteTask() {
        if (!this.deleteTaskDialog) {
          this.deleteTaskDialog = this.loadFragment({
            name: "hds.ui5.todolistadvance.view.fragment.TaskDeleteConfirmation",
          });
        }

        this.deleteTaskDialog.then((oDialog) => oDialog.open());
      },

      closeDialogDeleteTask() {
        this.byId("idDialogDeleteTaskConfirmation").close();
      },

      proceedTaskDelete() {
        const oModel = this.getView().getModel();
        const aTask = oModel.getProperty("/tasks") || [];
        const aUpdatedTask = aTask.filter(
          (task) => task.id !== this.idSelectedTaskForDeletion
        );
        oModel.setProperty("/tasks", aUpdatedTask);
        this.closeDialogDeleteTask();
      },

      deleteTaskHandler(oEvent) {
        const { id } = oEvent.getSource().getBindingContext().getObject();
        this.idSelectedTaskForDeletion = id;
        this.getConfirmationDeleteTask();
      },

      editTaskHandler(oEvent) {
        this.openAddTaskDialog({ isEditMode: true });
        this.populateTaskDetailsInDialogBox(oEvent);
      },

      populateTaskDetailsInDialogBox(oEvent) {
        const { id, title, priority, dueDate, category } = oEvent
          .getSource()
          .getBindingContext()
          .getObject();

        this.idCurrentSelectedTask = id;

        this.getView()
          .byId("idDatePickerInputTask")
          .setDateValue(new Date(dueDate));

        this.getView().byId("idInputTaskDescription").setValue(title);

        this.getView()
          .byId("idPriorityInputTask")
          .setSelectedKey(priority.toUpperCase());

        this.getView()
          .byId("idCategoryInputTask")
          .setSelectedKey(category.toUpperCase());
      },

      markCompleteteTaskHandler(oEvent) {
        const { id } = oEvent.getSource().getBindingContext().getObject();
        const oModel = this.getView().getModel();
        const aAllTask = oModel.getProperty("/tasks") || [];

        const aUpdatedTask = aAllTask.map((task) =>
          task.id === id ? { ...task, Status: "Completed" } : task
        );

        oModel.setProperty("/tasks", aUpdatedTask);
      },
    });
  }
);
