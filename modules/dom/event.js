export default class EventManager {
    constructor(projectHandler, sidebar, mainContent) {
        this.projectHandler = projectHandler;
        this.sidebar = sidebar;
        this.mainContent = mainContent;
    }

    sidebarEvents() {
        this.sidebar.sidebarDiv.addEventListener("click", (e) => {
            if (e.target.tagName === "H2") {
                this.mainContent.display("project-view");
            }
            else if (e.target.tagName === "LI") {
                this.projectHandler.selectActiveProject(e.target.textContent);
                this.sidebar.display();
                this.mainContent.display("project-todos");
            }
        });
    }

}