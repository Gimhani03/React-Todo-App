// index.js

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/tododb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);


const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Lets us read JSON from frontend

// GET all todos
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find().sort({ _id: -1 });
  res.json(todos);
});

// POST new todo
app.post('/api/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.status(201).json(todo);
});

// PUT update todo
app.put('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
