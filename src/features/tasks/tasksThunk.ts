import { createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '../../types';

const API_URL = import.meta.env.VITE_DATA_API_URL;

export const getTasks = createAsyncThunk(
  'tasks/getTasksFromTheServer',
  async () => {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
    const tasks = await response.json();
    return tasks;
  }
);

export const addTask = createAsyncThunk('tasks/addTask', async (task: Task) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    localStorage.setItem("updatedAt", JSON.stringify(data.updatedAt));
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
});

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    try {
      const response = await fetch(`${API_URL}${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
      localStorage.setItem("updatedAt", JSON.stringify(data.updatedAt));
      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/changeTaskStatus',
  async (task: Task) => {
    const response = await fetch(
      `${API_URL}${task._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      }
    );
    const data = await response.json();
    localStorage.setItem("updatedAt", JSON.stringify(data.updatedAt));
    console.log(data);
    return data;
  }
);