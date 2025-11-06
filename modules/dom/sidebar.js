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

        const inbox = document.createElement("h3");
        inbox.textContent = this.todoList.projects[0].name;
        this.sidebarDiv.append(heading, inbox);

        this.displayProjects();
    }

    displayProjects() {
        const sidebarProjects = createAnElement("div", "", "sidebar-projects");
        const projectHead = createAnElement("div", "", "project-head-div");
        const projectHeading = createAnElement("h2", "", "", "My Projects");
        const projectAdd = createAnElement("button", "", "project-add-button", "+");
        projectHeading.textContent = "My Projects";
        projectHeading.addEventListener("click", () => {
            this.mainContent.display("project-view");
        })

        projectHead.append(projectHeading, projectAdd);

        const projectList = createAnElement("ul", "", "project-list");
        this.todoList.projects.forEach((project) => {
            const projectElement = createAnElement("li", "", "", project.name);
            if (project.name === this.todoList.activeProject.name) {
                projectElement.classList.toggle("active-project-sidebar");
            }
            projectElement.addEventListener("click", () => {
                this.todoList.selectActiveProject(project.name);
                this.display();
                this.mainContent.display("project-todos");
            }) // Move to standalone event file
            projectList.appendChild(projectElement);
        });

        sidebarProjects.append(projectHead, projectList);
        this.sidebarDiv.appendChild(sidebarProjects);
    }
}