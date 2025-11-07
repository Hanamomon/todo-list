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
            else if (e.target.tagName === "LI") {
                this.projectHandler.selectActiveProject(e.target.textContent);
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
            else if (e.target.id === "project-add-button")
                addDialog.showModal();
        });
    }

    addProjectModal() {
        const addDialog = document.getElementById("project-add-dialog");
        const projectName = addDialog.querySelector("input");
        const confirmBtn = document.getElementById("confirm-btn");

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
}