import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const TodoApp = () => {

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('All'); 

  useEffect(() => {
  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
    }
  };
  fetchTodos();
}, []);


 const addTodo = async () => {
  if (newTodo.trim() === '') return;

  try {
    const response = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newTodo,
        completed: false,
      }),
    });

    const savedTodo = await response.json(); // The todo returned by the backend
    setTodos([savedTodo, ...todos]); // Add it to the local list
    setNewTodo('');
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};


 const deleteTodo = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    setTodos(todos.filter(todo => todo._id !== id));
  } catch (err) {
    console.error('Failed to delete:', err);
  }
};


  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingText('');
  };

  const saveEdit = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/todos/${id}`, { text: editingText });
    setTodos(todos.map(todo =>
      todo._id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  } catch (err) {
    console.error('Failed to update:', err);
  }
};


  const toggleCompleted = async (id) => {
  const todo = todos.find(todo => todo._id === id);
  try {
    await axios.put(`http://localhost:5000/api/todos/${id}`, {
      completed: !todo.completed
    });
    setTodos(todos.map(t =>
      t._id === id ? { ...t, completed: !t.completed } : t
    ));
  } catch (err) {
    console.error('Failed to toggle:', err);
  }
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
            <div key={todo._id} className="todo-item">
              {editingId === todo._id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className='edit-input'
                  />
                  <div className='buttons1'>
                    <button onClick={() => saveEdit(todo._id)} className='savebutton'>Save</button> 
                    <button onClick={cancelEditing} className='cancelbutton'>Cancel</button>
                  </div>
                </>
              ) : (
                <div className='todo-content'>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(todo._id)}
                  />
                  <div className='todoText'>
                    <p className={todo.completed ? 'completed' : ''}>{todo.text}</p>
                  </div>
                  <div className='buttons'>
                    <button onClick={() => startEditing(todo._id, todo.text)} className='editbutton'><FiEdit /></button>
                    <button onClick={() => deleteTodo(todo._id)} className='deletebutton'><FiTrash2 /></button>
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
