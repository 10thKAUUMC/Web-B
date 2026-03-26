import { useTodo } from '../context/TodoProvider';

type Task = {
  id: number;
  text: string;
};

interface TodoItemProps {
  task: Task;
  isDone: boolean;
  onComplete?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TodoItem = ({ task, isDone, onComplete, onDelete }: TodoItemProps) => {
  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{task.text}</span>
      {isDone ? (
        <button
          className="render-container__item-button"
          onClick={() => onDelete?.(task)}
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button"
          style={{ backgroundColor: '#28a745' }}
          onClick={() => onComplete?.(task)}
        >
          완료
        </button>
      )}
    </li>
  );
};

export default TodoItem;