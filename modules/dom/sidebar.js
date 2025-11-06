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
    constructor(todoList) {
        this.todoList = todoList;
        this.sidebarDiv = document.getElementById("sidebar");
    }

    display() {
        const heading = createAnElement("h1", "", "", "Todo List");

        const inbox = document.createElement("h3");
        inbox.textContent = this.todoList.projects[0].name;
        this.sidebarDiv.append(heading, inbox);

        this.updateSidebar();
    }

    updateSidebar() {
        const projectHead = createAnElement("div", "", "project-add-div");
        const projectHeading = createAnElement("h2", "", "", "My Projects");
        const projectAdd = createAnElement("button", "", "", "+");
        projectHeading.textContent = "My Projects";
        projectHead.append(projectHeading, projectAdd);

        const projectList = createAnElement("ul", "", "project-list");
        this.todoList.projects.forEach((project) => {
            const projectElement = createAnElement("li", "", "", project.name);
            if (project.name === this.todoList.activeProject.name) {
                projectElement.classList.toggle("active-project-sidebar");
            }
            projectElement.addEventListener("click", () => {
                this.todoList.selectActiveProject(project.name);
                // Change content view to display active project
            })
            projectList.appendChild(projectElement);
        });

        this.sidebarDiv.append(projectHead, projectList);
    }
}