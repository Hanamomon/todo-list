import Project from "./project.js";

export default class ProjectHandler {
    constructor() {
        this.projects = [new Project("Inbox")];
        this.activeProject = this.projects[0];
    }

    addProject(name) {
        this.projects.push(new Project(name));
    }

    removeProject(projectName) {
        const foundProject = this.projects.find((project) => {projectName === project.name;})
        if (foundProject !== undefined)
            this.projects = foundProject;
    }

    selectActiveProject(projectName) {
        const foundProject = this.projects.find((project) => projectName === project.name);
        if (foundProject !== undefined)
            this.activeProject = foundProject;
    }
}