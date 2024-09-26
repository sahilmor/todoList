// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Task = require('./models/Task');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://sahilmor:sahilmor@cluster0.npwt2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// CRUD Operations
// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { taskName, taskDescription } = req.body;
  const task = new Task({ taskName, taskDescription });
  await task.save();
  res.status(201).json(task);
});

// Read all tasks
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update a task
app.put('/api/tasks/:id', async (req, res) => {
  const { taskName, taskDescription } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.id, { taskName, taskDescription }, { new: true });
  res.json(task);
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
