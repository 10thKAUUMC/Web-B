import { useState } from 'react';
import { useTheme } from './context/ThemeContext';

type Task = {
  id: number;
  text: string;
};

function App() {
  const { dark, toggleTheme } = useTheme();

  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: input,
    };

    setTodos([...todos, newTask]);
    setInput('');
  };

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (task: Task) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
  };

  return (
    <div
      className={
        dark
          ? 'bg-black text-white min-h-screen p-5'
          : 'bg-white text-black min-h-screen p-5'
      }
    >
      <h1 className="text-3xl font-bold mb-4 text-center">YONG TODO</h1>

      {/* 🌙 다크모드 버튼 */}
      <div className="text-center mb-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          모드 변경
        </button>
      </div>

      {/* 입력 */}
      <form onSubmit={addTodo} className="flex gap-2 mb-4 justify-center">
        <input
          value={input}
          onChange={handleChange}
          className="border px-2 py-1 rounded text-black"
          placeholder="할 일 입력"
        />
        <button className="bg-green-500 text-white px-3 rounded">
          추가
        </button>
      </form>

      <div className="flex gap-10 justify-center">
        {/* 할 일 */}
        <div>
          <h2 className="text-xl mb-2 text-center">할 일</h2>
          <ul>
            {todos.map((task) => (
              <li key={task.id} className="flex gap-2 mb-2">
                <span>{task.text}</span>
                <button
                  onClick={() => completeTask(task)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 */}
        <div>
          <h2 className="text-xl mb-2 text-center">완료</h2>
          <ul>
            {doneTasks.map((task) => (
              <li key={task.id} className="flex gap-2 mb-2">
                <span>{task.text}</span>
                <button
                  onClick={() => deleteTask(task)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
