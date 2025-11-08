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
        const todoDate = createAnElement ("p", "", "single-todo-date", todo.dueDate);
        todoDiv.append(todoTitle, todoDesc, todoDate);

        /*if (Array.isArray(todo.checklist)) {
            const todoChecklist = createAnElement("ul", "", "todo-checklist");
            todo.checklist.forEach((checkItem) => {
                const checkItemElement = createAnElement("li", "check-item");
                const checkItemBox = document.createElement("input");
                const checkItemText = createAnElement("label", "", "", checkItem);
                checkItemBox.type = "checkbox";

                checkItemElement.append(checkItemBox, checkItemText);

                todoChecklist.appendChild(checkItemElement);
            })

            todoDiv.appendChild(todoChecklist);
        }*/

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
            const todoItemPrio = createAnElement("div", "todo-item-prio", "", todo.priority);
            const todoItemDate = createAnElement("p", "todo-item-date", "", todo.dueDate);

            todoItemDiv.append(todoItemTitle, todoItemPrio, todoItemDate);

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