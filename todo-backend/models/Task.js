// models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
