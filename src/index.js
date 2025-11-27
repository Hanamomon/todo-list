import "./styles.css";

import ProjectHandler from "../modules/projectHandler.js";

import Sidebar from "../modules/dom/sidebar.js";

import MainContent from "../modules/dom/content.js";

import EventManager from "../modules/dom/event.js";

import Todo from "../modules/todo.js";

const project = new ProjectHandler();

const mainContent = new MainContent(project);

const sidebar = new Sidebar(project, mainContent);

const eventManager = new EventManager(project, sidebar, mainContent);

project.addProject("proj1");
project.projects[1].addTodo(new Todo("a"));
project.projects[1].addTodo(new Todo("n"));
project.projects[1].addTodo(new Todo("c"));
project.addProject("work");

project.projects[2].addTodo(new Todo("a"));
project.projects[2].addTodo(new Todo("b", "this is a description"));
project.projects[2].addTodo(new Todo("b", "this is a description", new Date("2003-01-01"), "medium", "these are some notes"));

sidebar.display();
mainContent.display("project-todos");

eventManager.sidebarEvents();
eventManager.addProjectModal();
eventManager.contentEvents();
eventManager.addTodoModal();

const inputBox = document.querySelector("input");

/* inputBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        addDOMTodo(project);
        mainContent.display("project-todos");
    }
}); */