import deleteIcon from "../../src/icons/delete_dark.svg";
import editIcon from "../../src/icons/edit_dark.svg";

import {isValid, format} from "date-fns";

function createAnElement(tag, className, id, text) {
    const element = document.createElement(tag);
    if (className)
        element.classList.add(className);
    if (id)
        element.setAttribute("id", id);
    if (text)
        element.textContent = text;
    return element;
}

export default class MainContent {
    constructor(todoList) {
        this.todoList = todoList;
        this.contentDiv = document.getElementById("content");
    }

    display(type, todo) {
        this.contentDiv.innerHTML = "";

        switch (type) {
            case "project-todos":
                this.displayProjectTodos();
                break;
            case "project-view":
                this.displayProjects();
                break;
            case "single-todo":
                this.displaySingleTodo(todo);
                break;
        }
    }

    displaySingleTodo(todo) {
        const todoDiv = createAnElement("div", "", "single-todo")
        const todoTitle = createAnElement("h2", "", "single-todo-title", todo.title);
        const todoDesc = createAnElement("p", "", "single-todo-desc", todo.description);
        const todoPrio = createAnElement("p", "", "single-todo-prio", todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1));

        if (isValid(new Date(todo.dueDate))) {
            const todoDate = createAnElement ("p", "", "single-todo-date", format(todo.dueDate, "MMM do, yyyy"));
            todoDiv.append(todoTitle, todoDesc, todoDate);
        }
        else
            todoDiv.append(todoTitle, todoDesc);

        if (todo.priority !== "none") {
            todoPrio.classList.toggle(`single-todo-${todo.priority}`);
            todoDiv.appendChild(todoPrio);
        }

        if (todo.notes) {
            const todoNotes = createAnElement("p", "", "single-todo-notes", todo.notes);
            todoDiv.appendChild(todoNotes);
        }

        this.contentDiv.appendChild(todoDiv);
    }

    displayProjectTodos() {
        const {activeProject} = this.todoList;
        const projectTodosDiv = createAnElement("div", "", "project-todos");

        const projHeadDiv = createAnElement("div", "", "project-todos-head")
        const curProjectHeading = createAnElement("h2", "", "", activeProject.name);
        const todoAddBtn = createAnElement("button", "", "", "Add Todo");
        projHeadDiv.append(curProjectHeading , todoAddBtn);

        const todosDiv = createAnElement("div", "todo-group");
        activeProject.todos.forEach((todo) => {
            const todoItemDiv = createAnElement("div", "todo-item");
            const todoItemTitle = createAnElement("p", "todo-item-title", "", todo.title);

            const todoItemPrio = createAnElement("div", "todo-item-prio", "");
            const todoPrioCheck = createAnElement("input", "", "complete-status-input");
            const todoPrioLabel = document.createElement("label");

            const todoItemEdit = createAnElement("img", "todo-item-edit");
            const todoItemDelete = createAnElement("img", "todo-item-delete");
            const todoItemIcons = createAnElement("div", "todo-item-icons");

            todoPrioCheck.setAttribute("type", "checkbox");
            todoPrioCheck.setAttribute("name", "complete-status");
            todoPrioLabel.setAttribute("for", "complete-status-input");
            if (todo.complete) {
                todoPrioCheck.checked = true;
                todoItemDiv.classList.add("todo-complete");
            }
            switch (todo.priority) {
                case "low": {
                    todoItemPrio.classList.add("priority-low");
                    break;
                }
                case "medium": {
                    todoItemPrio.classList.add("priority-medium");
                    break;
                }
                case "high": {
                    todoItemPrio.classList.add("priority-high");
                    break;
                }
                default: {
                    todoItemPrio.classList.add("priority-none");
                }
            }
            todoItemPrio.append(todoPrioLabel ,todoPrioCheck);

            todoItemEdit.src = (editIcon);
            todoItemDelete.src = (deleteIcon);
            todoItemIcons.append(todoItemEdit, todoItemDelete);
            todoItemDiv.setAttribute("data-id", todo.id);

            if (isValid(todo.dueDate)) {
                const todoItemDate = createAnElement ("p", "todo-item-date", "", format(todo.dueDate, "MMM do, yyyy"));
                todoItemDiv.append(todoItemPrio, todoItemTitle, todoItemDate, todoItemIcons);
            }
            else
                todoItemDiv.append(todoItemPrio, todoItemTitle, todoItemIcons);

            todosDiv.appendChild(todoItemDiv);
        });

        projectTodosDiv.append(projHeadDiv, todosDiv);
        this.contentDiv.appendChild(projectTodosDiv);
    }

    displayProjects() {
        const projectViewDiv = createAnElement("div", "", "project-view");

        this.todoList.projects.forEach((project) => {
            const projectCard = createAnElement("div", "project-card");
            const projectName = createAnElement("h3", "", "", project.name);

            const projectTodos = document.createElement("ul");
            for (let i = 0; i < 3; i++) {
                if (project.todos[i]) {
                    const projectSingleTodo = createAnElement("li", "", "", project.todos[i].title);
                    projectTodos.appendChild(projectSingleTodo);
                }
            }

            projectCard.append(projectName, projectTodos);
            projectViewDiv.appendChild(projectCard);
        });

        this.contentDiv.appendChild(projectViewDiv);
    }
}