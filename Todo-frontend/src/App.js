import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file
import pencilImage from './clipart-pencil-8.png'; // Import the pencil image

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('#000000');
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const colorInputRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const isBlackColor = (color) => {
    return color.toLowerCase() === '#000000' || color.toLowerCase() === 'black';
  };

  const addOrUpdateTask = () => {
    if (newTask.trim()) {
      if (isBlackColor(newTaskColor)) {
        alert('Black color text task won\'t be seen. Please choose another color.');
        return;
      }
      const taskData = {
        task: newTask,
        color: newTaskColor,
        timestamp: new Date().toLocaleString(), 
      };
      if (isEditing) {
        axios.put(`http://localhost:5000/tasks/${editTaskId}`, taskData)
          .then(response => {
            setTasks(tasks.map(task => task.id === editTaskId ? response.data : task));
            resetTaskInput();
          })
          .catch(error => console.error('Error updating task:', error));
      } else {
        axios.post('http://localhost:5000/tasks', taskData)
          .then(response => setTasks([...tasks, response.data]))
          .catch(error => console.error('Error adding task:', error));
        resetTaskInput();
      }
    }
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.error('Error deleting task:', error));
  };

  const editTask = (id, task, color) => {
    setIsEditing(true);
    setEditTaskId(id);
    setNewTask(task);
    setNewTaskColor(color);
  };

  const resetTaskInput = () => {
    setNewTask('');
    setNewTaskColor('#000000');
    setIsEditing(false);
    setEditTaskId(null);
  };

  const openColorPicker = () => {
    colorInputRef.current.click();
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="add-task">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="color-picker-button button-common" onClick={openColorPicker}>
          <img src={pencilImage} alt="Pick Color" />
        </button>
        <input
          type="color"
          value={newTaskColor}
          onChange={(e) => setNewTaskColor(e.target.value)}
          style={{ display: 'none' }}
          ref={colorInputRef}
        />
        <button className="button-common" onClick={addOrUpdateTask}>
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
        {isEditing && <button className="button-common" onClick={resetTaskInput}>Cancel</button>}
      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item" style={{ backgroundColor: task.color || '#f9f9f9' }}>
            <div>
              <span className="task-text">{task.task}</span>
              <span className="timestamp">{task.timestamp}</span>
            </div>
            <div className="task-buttons">
              <button onClick={() => editTask(task.id, task.task, task.color)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
