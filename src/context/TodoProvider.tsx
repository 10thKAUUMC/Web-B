import { createContext, useContext, useState, ReactNode } from 'react';

type Task = {
  id: number;
  text: string;
};

interface TodoContextType {
  input: string;
  todos: Task[];
  doneTasks: Task[];
  setInput: (value: string) => void;
  addTodo: () => void;
  completeTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input }]);
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
    <TodoContext.Provider value={{ input, todos, doneTasks, setInput, addTodo, completeTask, deleteTask }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 반드시 TodoProvider 안에서 사용해야 해요');
  }
  return context;
};