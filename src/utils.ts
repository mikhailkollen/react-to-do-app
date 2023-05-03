import { Task, Id, Tasks } from "./types";

export const tagLabels = [
  { id: 1, tag: "health", bgColor: "#3c86f44f", color: "#0053CF" },
  { id: 2, tag: "work", bgColor: "#E8D7FF", color: "#9747FF" },
  { id: 3, tag: "home", bgColor: "#E2F7E2", color: "#639462" },
  { id: 4, tag: "other", bgColor: "#FFECC7", color: "#EA8C00" },
];

export const checkIfToday = (date: Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const checkIfTomorrow = (date: Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() + 1 === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

export const sortTasksByUpdatedAt = (tasks: Task[]): Tasks => {
  return tasks.sort((a, b) => {
    const dateA = new Date(a.updatedAt!);
    const dateB = new Date(b.updatedAt!);
    return dateB.getTime() - dateA.getTime();
  });
};

export const addTaskToTheServer = async (task: Task) => {
  const API_URL = import.meta.env.VITE_DATA_API_URL;
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }

};

export const deleteTaskFromTheServer = async (id: Id) => {
  const API_URL = import.meta.env.VITE_DATA_API_URL;
  try {
    const response = await fetch(`${API_URL}${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateTaskOnTheServer = async (task: Task) => {
  const API_URL = import.meta.env.VITE_DATA_API_URL;
  try {
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
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const checkIfModalShownToday = (): boolean => {
  const localStorageModal = localStorage.getItem("todayTasksShown");
  if (!localStorageModal) {
    return false;
  }
  const today = new Date();
  const todayDate = `${today.getDate()}.${today.getMonth() + 1
    }.${today.getFullYear()}`;
  return localStorageModal === todayDate;
};

export const setModalShown = (): void => {
  const today = new Date();
  const todayDate = `${today.getDate()}.${today.getMonth() + 1
    }.${today.getFullYear()}`;
  localStorage.setItem("todayTasksShown", todayDate);
};

export const filterTodayTasks = (tasks: Task[]): Tasks | [] => {
  const todayTasks = tasks.filter((task) => {
    if (!task.isCompleted) {
      return checkIfToday(task.date);
    }
  });

  if (todayTasks.length) {
    return todayTasks;
  } else {
    setModalShown();
    return [];
  }
};

export const formatDate = (date: Date): string => {
  if (checkIfToday(date)) {
    return "Today";
  } else if (checkIfTomorrow(date)) {
    return "Tomorrow";
  } else {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
    }).format(new Date(date))
  }
};

export const setCorrectTitle = (): string => {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 6 && hours < 12) {
    return "Good morning";
  } else if (hours >= 12 && hours < 18) {
    return "Good afternoon";
  } else if (hours >= 18 && hours < 24) {
    return "Good evening";
  } else if (hours >= 0 && hours < 6) {
    return "Good night";
  } else {
    return "Good morning";
  }
};