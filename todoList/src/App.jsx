import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

const App = () => {
  const [todos, setTodos] = useState([]); // State to store all tasks
  const [taskName, setTaskName] = useState(""); // State to store task name
  const [taskDescription, setTaskDescription] = useState(""); // State to store task description
  const [editingId, setEditingId] = useState(null); // State to keep track of the task being edited

  // Load all tasks from the backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      alert("Failed to load tasks. Please try again later."); // User feedback
    }
  };

  useEffect(() => {
    loadTasks(); // Fetch tasks when the component mounts
  }, []);

  // Create a new task
  const handleAddTask = async () => {
    if (!taskName || !taskDescription) {
      alert("Please provide both task name and description!");
      return;
    }

    const newTask = {
      taskName,
      taskDescription,
    };

    try {
      const response = await axios.post(API_URL, newTask);
      setTodos([...todos, response.data]); // Add the newly created task to the state
      setTaskName("");
      setTaskDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again."); // User feedback
    }
  };

  // Update an existing task
  const handleUpdateTask = async () => {
    const updatedTask = {
      taskName,
      taskDescription,
    };

    try {
      const response = await axios.put(`${API_URL}/${editingId}`, updatedTask);
      const updatedTasks = todos.map((task) =>
        task._id === editingId ? response.data : task // Update the edited task
      );
      setTodos(updatedTasks);
      setTaskName("");
      setTaskDescription("");
      setEditingId(null);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again."); // User feedback
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const filteredTasks = todos.filter((task) => task._id !== id);
      setTodos(filteredTasks); // Update the state after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again."); // User feedback
    }
  };

  // Load a task into the input fields for editing
  const handleEditTask = (task) => {
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
    setEditingId(task._id); // Use _id for the backend
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-4xl text-center font-bold mb-6">Todo List</h1>

      <div className="flex justify-between items-center mb-[2vw]">
        <Input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-[20%]"
        />
        <Input
          type="text"
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="w-[68%]"
        />
        {editingId ? (
          <Button
            onClick={handleUpdateTask}
            className="bg-blue-500 text-white p-2 rounded w-[8%]"
          >
            Update Task
          </Button>
        ) : (
          <Button
            onClick={handleAddTask}
            className="bg-green-500 text-white p-2 rounded w-[10%]"
          >
            Add Task
          </Button>
        )}
      </div>

      <ul>
        {todos.length > 0 ? (
          todos.map((task) => (
            <li key={task._id} className="flex justify-between items-center w-[100%] mb-3">
              <Accordion
                type="single"
                collapsible
                className="w-[80%] px-4"
              >
                <AccordionItem value={`item-${task._id}`}>
                  <AccordionTrigger className="task-name">{task.taskName}</AccordionTrigger>
                  <AccordionContent className="task-description">{task.taskDescription}</AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-between items-center w-[18%]">
                <Button
                  onClick={() => handleEditTask(task)}
                  className="bg-zinc-400 text-white p-1 rounded mr-2 w-[50%]"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white p-1 rounded w-[50%]"
                >
                  Delete
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p>No tasks added yet.</p>
        )}
      </ul>
    </div>
  );
};

export default App;
