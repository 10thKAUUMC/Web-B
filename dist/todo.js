"use strict";
const input = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");
let todos = JSON.parse(localStorage.getItem("todos") || "[]");
function render() {
    todoList.innerHTML = "";
    doneList.innerHTML = "";
    todos.forEach((todo, index) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.innerText = todo.text;
        if (todo.completed) {
            span.classList.add("completed");
        }
        const btnGroup = document.createElement("div");
        btnGroup.classList.add("btn-group");
        const completeBtn = document.createElement("button");
        completeBtn.innerText = "완료";
        completeBtn.classList.add("complete-btn");
        completeBtn.onclick = () => {
            todos[index].completed = !todos[index].completed;
            save();
            render();
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "삭제";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = () => {
            todos.splice(index, 1);
            save();
            render();
        };
        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(btnGroup);
        if (todo.completed) {
            doneList.appendChild(li);
        }
        else {
            todoList.appendChild(li);
        }
    });
}
function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const text = input.value.trim();
        if (text === "")
            return;
        todos.push({
            text: text,
            completed: false
        });
        input.value = "";
        save();
        render();
    }
});
render();
