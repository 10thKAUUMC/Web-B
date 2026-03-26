import { useState } from "react";
import type { FormEvent } from "react"
import type { TTodo } from "../types/todo";

const Todo = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newTodo: TTodo = {
            id: Date.now(),
            text: input,
        };

        setTodos([...todos, newTodo]);
        setInput('');
    };

    const handleComplete = (targetTodo: TTodo) => {
        setTodos(todos.filter(todo => todo.id !== targetTodo.id));
        setDoneTodos([...doneTodos, targetTodo]);
    };

    const handleDeleteDone = (id: number) => {
        setDoneTodos(doneTodos.filter(todo => todo.id !== id));
    };

    return (
        <div className='todo-container'>
            <h1 className='todo-container__head'>UMC TODO</h1>
            
            <form className='todo-container__form' onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    className='todo-container__input' 
                    placeholder="할 일 입력"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                />
                <button type="submit" className='todo-container__button'>
                    할 일 추가
                </button> 
            </form>

            <div className="render-container">  
                <div className="render-container__section">
                    <h2 className="render-container__title">할 일</h2>
                    <ul className='render-container__list'>
                        {todos.map((todo) => (
                            <li key={todo.id} className='render-container__item'>
                                <span className='render-container__item-text'>{todo.text}</span>
                                <div className="button-group">
                                    <button 
                                        onClick={() => handleComplete(todo)}
                                        style={{ backgroundColor: '#28a745' }}
                                        className='render-container__item-button'
                                    >
                                        완료
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div> 

                <div className="render-container__section">
                    <h2 className="render-container__title">완료</h2>
                    <ul className='render-container__list'>
                        {doneTodos.map((todo) => (
                            <li key={todo.id} className='render-container__item'>
                                <span className='render-container__item-text'>
                                    {todo.text}
                                </span>
                                <button 
                                    onClick={() => handleDeleteDone(todo.id)}
                                    style={{ backgroundColor: '#dc3545' }}
                                    className='render-container__item-button'
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
};

export default Todo;