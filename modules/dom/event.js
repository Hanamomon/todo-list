import Todo from "../todo";

export default class EventManager {
    constructor(projectHandler, sidebar, mainContent) {
        this.projectHandler = projectHandler;
        this.sidebar = sidebar;
        this.mainContent = mainContent;
    }

    sidebarEvents() {
        const addDialog = document.getElementById("project-add-dialog");
        this.sidebar.sidebarDiv.addEventListener("click", (e) => {
            if (e.target.tagName === "H2") {
                this.mainContent.display("project-view");
            }
            else if (e.target.className === "project-item") {
                this.projectHandler.selectActiveProject(e.target.textContent);
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
            else if (e.target.tagName === "LI") {
                this.projectHandler.selectActiveProject(e.target.textContent);
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
            else if (e.target.id === "project-add-button")
                addDialog.showModal();
            else if (e.target.tagName === "IMG") {
                this.projectHandler.removeProject(e.target.previousElementSibling.textContent);
                this.projectHandler.selectActiveProject("Inbox");
                this.sidebar.display();
                this.mainContent.display("project-todos");
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
        const addTodoDialog = document.getElementById("todo-add-dialog");
        this.mainContent.contentDiv.addEventListener("click", (e) => {
            if (e.target.parentNode.className === "todo-item") {
                let clickedTodoTitle = e.target.parentNode.firstChild.textContent;
                this.projectHandler.activeProject.todos.forEach((todo) => {
                    if (todo.title === clickedTodoTitle)
                        this.mainContent.display("single-todo", todo);
                })
            }
            else if (e.target.className === "todo-item") {
                let clickedTodoTitle = e.target.firstChild.textContent;
                this.projectHandler.activeProject.todos.forEach((todo) => {
                    if (todo.title === clickedTodoTitle)
                        this.mainContent.display("single-todo", todo);
                })
            }
            else if (e.target.parentNode.id === "project-todos-head" && e.target.tagName === "BUTTON") {
                addTodoDialog.showModal();
            }
        })
    }

    addTodoModal() {
        const addTodoDialog = document.getElementById("todo-add-dialog");
        const confirmBtn = document.getElementById("todo-confirm-btn");
        const closeBtn = document.getElementById("todo-close-btn");
        const form = document.querySelector("form");

        closeBtn.addEventListener("click", (e) => {
            addTodoDialog.close("cancel");
        })

        confirmBtn.addEventListener("click", (e) => {
            const formData = new FormData(form, confirmBtn);
            let formResult = {};
            let formValid = true;

            for (const [key, value] of formData) {
                console.log(`${key}: ${value}`);
                if (key === "todo-title" && value === "") {
                    alert("Enter a title for the task!");
                    formValid = false;
                }
                formResult[key] = value;
            }
            if (formValid) {
                addTodoDialog.close(JSON.stringify(formResult));
            }
        })

        addTodoDialog.addEventListener("close", () => {
            if (addTodoDialog.returnValue !== "default" && addTodoDialog.returnValue !== "cancel") {
                const dialogResult = JSON.parse(addTodoDialog.returnValue);
                this.projectHandler.activeProject.addTodo(new Todo(dialogResult["todo-title"], dialogResult["todo-description"], dialogResult["todo-date"], dialogResult["todo-priority"], dialogResult["todo-notes"]));
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
        })
    }
}