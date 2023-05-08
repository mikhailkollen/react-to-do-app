import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Filter, Task, Tasks, TaskState } from "../../types";

import { getTasks, addTask, deleteTask, updateTask } from "./tasksThunk";
import { checkIfModalShownToday, filterTodayTasks, setModalShown, sortTasksByUpdatedAt } from "../../utils";



const initialState: TaskState = {
  allTasks: [],
  filteredTasks: [],
  todayTasks: [],
  counter: 0,
  isLoading: true,
  isTodayTasksModalOpen: false,
  isModalOpen: false,
  editedTask: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    filterTasks: (state, action: PayloadAction<Filter>) => {
      const { searchValue, tag } = action.payload;
      if (searchValue === "" && tag === "") {
        state.filteredTasks = state.allTasks;
        return;
      } else if (searchValue && tag) {
      console.log("Search", action.payload.searchValue,"Tag", action.payload.tag);

      const searchTasks = state.allTasks.filter((task: Task) =>
        task.title.toLowerCase().includes(searchValue!.toLowerCase()) && task.tag === tag
      );
      state.filteredTasks = sortTasksByUpdatedAt(searchTasks);
      } else if (searchValue && !tag) {
        const searchTasks = state.allTasks.filter((task: Task) =>
        task.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      state.filteredTasks = sortTasksByUpdatedAt(searchTasks);
      } else if (!searchValue && tag) {
        const searchTasks = state.allTasks.filter((task: Task) =>
        task.tag === tag
      );
      state.filteredTasks = sortTasksByUpdatedAt(searchTasks);
      }
    },
    toggleTaskCompleted: (state, action: PayloadAction<Tasks>) => {
      state.allTasks = action.payload;
    },
    setAllTasks: (state, action: PayloadAction<Tasks>) => {
      state.allTasks = action.payload;
    },
    setIsTodayTasksModalOpen: (state, action: PayloadAction<boolean>) => {
      if (action.payload === true && checkIfModalShownToday() === false && state.todayTasks.length > 0) {
        state.isTodayTasksModalOpen = true;
      }
      if (action.payload === false) {
        state.isTodayTasksModalOpen = false;
        setModalShown();
      }
    },
    setIsModalOpen: (state, action: PayloadAction<boolean>) => {
      if (action.payload === false) {
        state.editedTask = null;
      }
      state.isModalOpen = action.payload;
    },
    editTask: (state, action: PayloadAction<Task | null>) => {
      state.editedTask = action.payload;
      state.isModalOpen = true;
      
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allTasks = sortTasksByUpdatedAt(action.payload);
      state.filteredTasks = sortTasksByUpdatedAt(action.payload);
      state.todayTasks = filterTodayTasks(action.payload);

    });
    builder.addCase(getTasks.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addTask.pending, (state) => {
      state.isLoading = true;
    }
    );
    builder.addCase(addTask.fulfilled, (state, action) => {
      action.payload.date = new Date(action.payload.date).toISOString()
      state.allTasks = [action.payload, ...state.allTasks];
      state.filteredTasks = sortTasksByUpdatedAt(state.allTasks);
      state.todayTasks = filterTodayTasks(state.allTasks);
    }
    );
    builder.addCase(addTask.rejected, (state) => {
      state.isLoading = false;
    }
    );
    builder.addCase(deleteTask.pending, (state) => {
      state.isLoading = true;
    }
    );
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.allTasks = [...state.allTasks.filter((task) => task._id !== action.payload)];
      state.filteredTasks = sortTasksByUpdatedAt(state.allTasks);
      state.todayTasks = filterTodayTasks(state.allTasks);
    }
    );
    builder.addCase(deleteTask.rejected, (state) => {
      state.isLoading = false;
    }
    );
    builder.addCase(updateTask.pending, (state) => {
      state.isLoading = true;
    }
    );
    builder.addCase(updateTask.fulfilled, (state, action) => {
      state.allTasks = sortTasksByUpdatedAt(state.allTasks.map((task) => {
        if (task._id === action.payload._id) {
          task = action.payload;
        }
        return task;
      }
      ));
      state.filteredTasks = sortTasksByUpdatedAt(state.allTasks);
      
    }
    );
    builder.addCase(updateTask.rejected, (state) => {
      state.isLoading = false;
    }
    );
  },
});

export const { toggleTaskCompleted, editTask, setAllTasks, filterTasks, setIsTodayTasksModalOpen, setIsModalOpen } = tasksSlice.actions;
export default tasksSlice.reducer;