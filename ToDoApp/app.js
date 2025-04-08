// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // if you have static CSS/JS files

// Set the view engine to EJS
app.set('view engine', 'ejs');

// MongoDB connection DB CONNECTION CODE 
mongoose.connect('mongodb://127.0.0.1:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Mongoose Model
const todoSchema = new mongoose.Schema({
  heading: String,
  description: String,
  date: String,
  time: String,
});
const Todo = mongoose.model('Todo', todoSchema);

// Routes
// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Add Todo
app.post('/api/todo/add', async (req, res) => {
  const { heading, description, date, time } = req.body;
  console.log("📥 Received Todo:", req.body);  // <-- Add this line
  try {
    const newTodo = new Todo({ heading, description, date, time });
    await newTodo.save();
    res.json({ message: "✅ Todo added!" });
  } catch (err) {
    console.error("❌ Error saving todo:", err); // <-- Catch error
    res.status(500).json({ error: err.message });
  }
});

// Get all Todos
app.get('/api/todo/all', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Todo
app.delete('/api/todo/delete/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Todo deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Todo
app.put('/api/todo/update/:id', async (req, res) => {
  const { heading, description, date, time } = req.body;
  try {
    await Todo.findByIdAndUpdate(req.params.id, { heading, description, date, time });
    res.json({ message: "✏️ Todo updated!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Start server
const PORT = 5500;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
