// HTML 요소 타입 지정
const input = document.getElementById("todoInput") as HTMLInputElement | null;
const todoList = document.getElementById("todoList") as HTMLUListElement | null;
const doneList = document.getElementById("doneList") as HTMLUListElement | null;

// Todo 타입 정의
type Todo = {
  text: string;
  completed: boolean;
};

// localStorage에서 불러오기
let todos: Todo[] = [];
try {
  const data = localStorage.getItem("todos");
  todos = data ? JSON.parse(data) : [];
} catch {
  todos = [];
}

// 화면 그리기
function render(): void {
  if (!todoList || !doneList) return;

  todoList.innerHTML = "";
  doneList.innerHTML = "";

  todos.forEach((todo: Todo, index: number) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.innerText = todo.text;

    if (todo.completed) {
      span.classList.add("completed");
    }

    const btnGroup = document.createElement("div");
    btnGroup.classList.add("btn-group");

    // 완료 버튼
    const completeBtn = document.createElement("button");
    completeBtn.innerText = "완료";
    completeBtn.classList.add("complete-btn");

    completeBtn.onclick = (): void => {
      const target = todos[index];
      if (!target) return;

      target.completed = !target.completed;
      save();
      render();
    };

    // 삭제 버튼
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "삭제";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.onclick = (): void => {
      if (index < 0 || index >= todos.length) return;

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
    } else {
      todoList.appendChild(li);
    }
  });
}

// 저장
function save(): void {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 입력 이벤트
if (input) {
  input.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      const text = input.value.trim();
      if (text === "") return;

      todos.push({
        text,
        completed: false
      });

      input.value = "";
      save();
      render();
    }
  });
}

// 시작
render();