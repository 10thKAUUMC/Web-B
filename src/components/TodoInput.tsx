import { useTodo } from '../context/TodoProvider';

const TodoInput = () => {
  const { input, setInput, addTodo } = useTodo();

  return (
    <div className="todo-container__form">
      <input
        className="todo-container__input"
        placeholder="할 일 입력"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="todo-container__button" onClick={addTodo}>
        할 일 추가
      </button>
    </div>
  );
};

export default TodoInput;