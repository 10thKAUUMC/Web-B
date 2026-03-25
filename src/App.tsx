import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  return (
    <div className="todo-container">
      <h1 className="todo-container__header">Min TODO</h1>
      <TodoInput />
      <TodoList />
    </div>
  );
}

export default App;