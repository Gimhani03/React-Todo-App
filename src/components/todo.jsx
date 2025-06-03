import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const TodoApp = () => {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('All'); 

  const addTodo = async () => {
    if (newTodo.trim() === '') return;

    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const toggleCompleted = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // ✅ STEP 4: Filtering logic
  const getFilteredTodos = () => {
    if (filter === 'Active') return todos.filter(todo => !todo.completed);
    if (filter === 'Completed') return todos.filter(todo => todo.completed);
    return todos;
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') callback();
  };

  return (
    <>
      <div>
        <div className="container">
          <h1>Todo App</h1>
          <p>Stay Organized and Productive</p>
        </div>

        <div className="todo-container">
          <input
            type="text"
            placeholder="Add a new task"
            className="input-field"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, addTodo)}
          />
          <button className="add-button" onClick={addTodo}>Add Task</button>
        </div>

        <div className="filter-buttons">
          <button onClick={() => setFilter('All')} className={filter === 'All' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('Active')} className={filter === 'Active' ? 'active' : ''}>Active</button>
          <button onClick={() => setFilter('Completed')} className={filter === 'Completed' ? 'active' : ''}>Completed</button>
        </div>

        <div>
          {getFilteredTodos().map((todo) => (
            <div key={todo.id} className="todo-item">
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className='edit-input'
                  />
                  <div className='buttons1'>
                    <button onClick={() => saveEdit(todo.id)} className='savebutton'>Save</button> 
                    <button onClick={cancelEditing} className='cancelbutton'>Cancel</button>
                  </div>
                </>
              ) : (
                <div className='todo-content'>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(todo.id)}
                  />
                  <div className='todoText'>
                    <p className={todo.completed ? 'completed' : ''}>{todo.text}</p>
                  </div>
                  <div className='buttons'>
                    <button onClick={() => startEditing(todo.id, todo.text)} className='editbutton'><FiEdit /></button>
                    <button onClick={() => deleteTodo(todo.id)} className='deletebutton'><FiTrash2 /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TodoApp;
