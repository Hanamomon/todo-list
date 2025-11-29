import "./styles.css";

import ProjectHandler from "../modules/projectHandler.js";

import Sidebar from "../modules/dom/sidebar.js";

import MainContent from "../modules/dom/content.js";

import EventManager from "../modules/dom/event.js";

import projectStorage from "../modules/dom/storage.js";

const project = new ProjectHandler();

const mainContent = new MainContent(project);

const sidebar = new Sidebar(project, mainContent);

const storage = new projectStorage(project);

const eventManager = new EventManager(project, sidebar, mainContent, storage);

storage.firstLoadStorage();

sidebar.display();
mainContent.display("project-todos");

eventManager.sidebarEvents();
eventManager.addProjectModal();
eventManager.contentEvents();
eventManager.addTodoModal();