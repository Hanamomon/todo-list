import Todo from "../todo";

import {isValid, format, parseISO} from "date-fns";

export default class EventManager {
    constructor(projectHandler, sidebar, mainContent) {
        this.projectHandler = projectHandler;
        this.sidebar = sidebar;
        this.mainContent = mainContent;
    }

    sidebarEvents() {
        const addDialog = document.getElementById("project-add-dialog");
        this.sidebar.sidebarDiv.addEventListener("click", (e) => {
            if (e.target.id === "project-head-div" || e.target.tagName === "H2") {
                if (e.target.id === "project-head-div")
                    e.target.classList.add("project-list-selected");
                else
                    e.target.parentNode.classList.add("project-list-selected");
                this.mainContent.display("project-view");
            }
            else if (e.target.className === "project-item" || e.target.classList.contains("active-project-sidebar") || e.target.tagName === "LI") {
                this.projectHandler.selectActiveProject(e.target.textContent);
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
            else if (e.target.id === "project-add-button")
                addDialog.showModal();
            else if (e.target.tagName === "IMG") {
                this.projectHandler.removeProject(e.target.previousElementSibling.textContent);
                if (e.target.parentNode.firstChild.textContent === this.projectHandler.activeProject.name) {
                    this.projectHandler.selectActiveProject("Inbox");
                    this.mainContent.display("project-todos");
                }
                this.sidebar.display();
            }
        });
    }

    addProjectModal() {
        const addDialog = document.getElementById("project-add-dialog");
        const projectName = addDialog.querySelector("input");
        const confirmBtn = document.getElementById("confirm-btn");
        const closeBtn = document.getElementById("close-btn");

        closeBtn.addEventListener("click", (e) => {
            projectName.value = "";
            addDialog.close(projectName.value);
        })

        confirmBtn.addEventListener("click", (e) => {
            addDialog.close(projectName.value);
        })

        addDialog.addEventListener("close", () => {
            if (addDialog.returnValue !== "default" && addDialog.returnValue !== "cancel") {
                let projectDuplicate = false;
                projectName.value = "";
                this.projectHandler.projects.forEach((project) => {
                    if (project.name === addDialog.returnValue) {
                        alert("Project already exists!");
                        projectDuplicate = true;
                    }
                });
                if (!projectDuplicate && addDialog.returnValue.length > 2 && addDialog.returnValue.length < 20) {
                    this.projectHandler.addProject(addDialog.returnValue);
                    this.projectHandler.selectActiveProject(addDialog.returnValue);
                    this.sidebar.display();
                    this.mainContent.display("project-todos");
                }
            }
        })
    }

    contentEvents() {
        this.mainContent.contentDiv.addEventListener("click", (e) => {
            if (e.target.className === "todo-item-delete") {
                this.projectHandler.activeProject.removeTodo(e.target.parentNode.parentNode.dataset.id);
                this.mainContent.display("project-todos");
            }
            else if (e.target.className === "todo-item-edit") {
                let currentIndex = this.projectHandler.activeProject.findTodoIndex(e.target.parentNode.parentNode.dataset.id);
                this.openEditModal(currentIndex);
            }
            else if (e.target.parentNode.className === "todo-item" || e.target.parentNode.classList.contains("todo-complete")) {
                let clickedTodoTitle = e.target.parentNode.querySelector("p").textContent;
                this.projectHandler.activeProject.todos.forEach((todo) => {
                    if (todo.title === clickedTodoTitle)
                        this.mainContent.display("single-todo", todo);
                })
            }
            else if (e.target.className === "todo-item" || e.target.classList.contains("todo-complete")) {
                let clickedTodoTitle = e.target.querySelector("p").textContent;
                this.projectHandler.activeProject.todos.forEach((todo) => {
                    if (todo.title === clickedTodoTitle)
                        this.mainContent.display("single-todo", todo);
                })
            }
            else if (e.target.parentNode.id === "project-todos-head" && e.target.tagName === "BUTTON") {
                this.openAddModal();
            }
            else if (e.target.id === "complete-status-input") {
                let currentIndex = this.projectHandler.activeProject.findTodoIndex(e.target.parentNode.parentNode.dataset.id);
                e.target.checked = e.target.checked;
                this.projectHandler.activeProject.todos[currentIndex].complete = e.target.checked;
                this.mainContent.display("project-todos");
            }
        })
    }
    
    openAddModal() {
        const addTodoDialog = document.getElementById("todo-add-dialog");
        addTodoDialog.dataset.mode = "add";
        addTodoDialog.showModal();
    }

    openEditModal(todoIndex) {
        const addTodoDialog = document.getElementById("todo-add-dialog");
        const todoItem = this.projectHandler.activeProject.todos[todoIndex];
        addTodoDialog.dataset.mode = "edit";
        addTodoDialog.dataset.index = todoIndex;

        const formElements = addTodoDialog.querySelector("form").elements;
        formElements["todo-title"].value = todoItem.title;
        if (todoItem.description)
            formElements["todo-description"].value = todoItem.description;
        if (isValid(todoItem.dueDate))
            formElements["todo-date"].value = format(todoItem.dueDate, "yyyy-MM-dd");
        formElements["todo-priority"].value = todoItem.priority;
        formElements["todo-notes"].value = todoItem.notes;
        addTodoDialog.showModal();
    }

    addTodoModal() {
        const addTodoDialog = document.getElementById("todo-add-dialog");
        const confirmBtn = document.getElementById("todo-confirm-btn");
        const closeBtn = document.getElementById("todo-close-btn");
        const form = document.querySelector("form");

        addTodoDialog.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                form.reset();
                addTodoDialog.close("cancel");
            }
        })

        closeBtn.addEventListener("click", () => {
            form.reset();
            addTodoDialog.close("cancel");
        })

        confirmBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const formData = new FormData(form, confirmBtn);
            let formResult = {};
            let formValid = true;

            for (const [key, value] of formData) {
                if (key === "todo-title" && value === "") {
                    alert("Enter a title for the task!");
                    formValid = false;
                }
                formResult[key] = value;
            }
            if (formValid) {
                form.reset();
                addTodoDialog.close(JSON.stringify(formResult));
            }
        })

        addTodoDialog.addEventListener("close", () => {
            if (addTodoDialog.returnValue !== "default" && addTodoDialog.returnValue !== "cancel") {
                const dialogResult = JSON.parse(addTodoDialog.returnValue);
                if (addTodoDialog.dataset.mode === "add")
                    this.projectHandler.activeProject.addTodo(new Todo(dialogResult["todo-title"], dialogResult["todo-description"], parseISO(dialogResult["todo-date"]), dialogResult["todo-priority"], dialogResult["todo-notes"]));
                else if (addTodoDialog.dataset.mode === "edit") {
                    this.projectHandler.activeProject.todos[addTodoDialog.dataset.index].title = dialogResult["todo-title"];
                    this.projectHandler.activeProject.todos[addTodoDialog.dataset.index].description = dialogResult["todo-description"];
                    this.projectHandler.activeProject.todos[addTodoDialog.dataset.index].dueDate = parseISO(dialogResult["todo-date"]);
                    this.projectHandler.activeProject.todos[addTodoDialog.dataset.index].priority = dialogResult["todo-priority"];
                    this.projectHandler.activeProject.todos[addTodoDialog.dataset.index].notes = dialogResult["todo-notes"];
                }
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
        })
    }
}