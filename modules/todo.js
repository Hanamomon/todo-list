export default class Todo {
    constructor(title, description, dueDate, priority, notes, checklist) {
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.complete = false;
    }

    setComplete() {
        this.complete = !this.complete;
    }
}