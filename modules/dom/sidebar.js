import deleteIcon from "../../src/icons/delete.svg";

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

export default class Sidebar {
    constructor(todoList, mainContent) {
        this.todoList = todoList;
        this.mainContent = mainContent;
        this.sidebarDiv = document.getElementById("sidebar");
    }

    display() {
        this.sidebarDiv.innerHTML = "";
        const heading = createAnElement("h1", "", "", "Todo List");

        this.sidebarDiv.appendChild(heading);

        this.displayProjects();
    }

    displayProjects() {
        const sidebarProjects = createAnElement("div", "", "sidebar-projects");
        const projectHead = createAnElement("div", "", "project-head-div");
        const projectHeading = createAnElement("h2", "", "", "My Projects");
        const projectAdd = createAnElement("button", "", "project-add-button", "+");
        projectHeading.textContent = "My Projects";

        projectHead.append(projectHeading, projectAdd);

        const projectList = createAnElement("ul", "", "project-list");
        this.todoList.projects.forEach((project) => {
            const projectElement = createAnElement("div", "project-item")
            const projectName = createAnElement("li", "", "", project.name);
            if (project.name === this.todoList.activeProject.name) {
                projectElement.setAttribute("id", "active-project-sidebar");
            }
            if (project.name === "Inbox") {
                projectElement.appendChild(projectName);
                projectList.appendChild(projectElement);
            }
            else {
                const projectDelete = document.createElement("img");
                projectDelete.src = deleteIcon;
                projectElement.append(projectName, projectDelete);
                projectList.appendChild(projectElement);
            }
        });

        sidebarProjects.append(projectHead, projectList);
        this.sidebarDiv.appendChild(sidebarProjects);
    }
}