var todoInput = document.getElementById('todo-input');
var todoForm = document.getElementById('todo-form');
var todoList = document.getElementById('todo-list');
var doneList = document.getElementById('done-list');
var todos = [];
var doneTasks = [];
var renderTasks = function () {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        var li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach(function (todo) {
        var li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};
var getTodoText = function () {
    return todoInput.value.trim();
};
var addTodo = function (text) {
    todos.push({ id: Date.now(), text: text });
    todoInput.value = '';
    renderTasks();
};
[
    { id: 1, text: '할 일 1' },
    { id: 2, text: '할 일 2' },
];
var completeTodo = function (todo) {
    todos = todos.filter(function (t) { return t.id !== todo.id; });
    doneTasks.push(todo);
    renderTasks();
};
var deleteTodo = function (todo) {
    doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
    renderTasks();
};
var createTodoElement = function (todo, isDone) {
    var li = document.createElement('li');
    li.classList.add('render-container_item');
    li.textContent = todo.text;
    var button = document.createElement('button');
    button.classList.add('render-container_item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    button.addEventListener('click', function () {
        if (isDone) {
            deleteTodo(todo);
        }
        else {
            completeTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
};
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
