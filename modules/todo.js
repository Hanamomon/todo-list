export default class Todo {
    constructor(title, description, dueDate, priority, notes = "") {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.complete = false;
        this.id = crypto.randomUUID();
    }

    setComplete() {
        this.complete = !this.complete;
    }
}