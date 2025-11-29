import Todo from "../todo";
import Project from "../project";

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      e.name === "QuotaExceededError" &&
      storage &&
      storage.length !== 0
    );
  }
}

export default class projectStorage {
  constructor(projectHandler) {
    this.projectHandler = projectHandler;
  }

  buildProjectHandler() {
    const projectHandlerData = JSON.parse(localStorage.getItem("projectHandler"));
    let i = 0;
    projectHandlerData.projects.forEach((project) => {
      let projectObject = new Project(project.name);
      project.todos.map((todo) => {
        let parsedDate = todo.dueDate ? new Date(todo.dueDate) : "Invalid Date";
        let todoObject = new Todo(todo.title, todo.description, parsedDate, todo.priority, todo.notes);
        todoObject.complete = todo.complete;
        todoObject.id = todo.id;
        projectObject.addTodo(todoObject);
      })
      this.projectHandler.projects[i] = projectObject;
      i++;
    })
    this.projectHandler.selectActiveProject(projectHandlerData.activeProject.name);
  }

  populateStorage() {
    localStorage.setItem("projectHandler", JSON.stringify(this.projectHandler));
    this.buildProjectHandler();
  }

  firstLoadStorage() {
    if (!localStorage.getItem("projectHandler")) {
      this.populateStorage();
    }
    else
      this.buildProjectHandler();
  }
}