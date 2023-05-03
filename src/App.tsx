import { useCallback, useEffect, useRef, useState } from "react";
import AllLists from "./components/AllLists/AllLists";
import Button from "./components/Button/Button";
import { Modal } from "./components/Modal/Modal";
import { WeatherWidget } from "./components/WeatherWidget/WeatherWidget";
import { filterTodayTasks, checkIfModalShownToday, sortTasksByUpdatedAt } from "./utils";
import TodayTasksModal from "./components/TodayTasksModal/TodayTasksModal";
import "./styles/css-reset.css";
import "./styles/index.css";
import { Task, Tasks } from "./types";

function App() {
  const [allTasks, setAllTasks] = useState<Tasks>([]);
  const [filteredTasks, setFilteredTasks] = useState<Tasks>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTodayTasksModalOpen, setIsTodayTasksModalOpen] = useState(false);
  const [todayTasks, setTodayTasks] = useState<Tasks>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getTasksFromTheServer() {
      const API_URL = import.meta.env.VITE_DATA_API_URL;
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        });
        const tasks = await response.json();
        if (tasks) {
          setAllTasks(sortTasksByUpdatedAt(tasks));
          setTodayTasks(filterTodayTasks(tasks));
        }
      } catch (error) {
        console.error("Error fetching tasks", error);
      }
    }
    getTasksFromTheServer();

    return () => { };
  }, []);


  useEffect(() => {
    handleSearch();
  }, [searchInputRef.current?.value, allTasks]);


  useEffect(() => {
    if (checkIfModalShownToday() === false && todayTasks.length > 0) {
      setIsTodayTasksModalOpen(true);
    }

    return () => { };
  }, [allTasks]);

  const handleSearch = useCallback(() => {
    const inputValue = searchInputRef.current?.value;
    const searchTasks = allTasks.filter((task: Task) =>
      task.title.toLowerCase().includes(inputValue!.toLowerCase())
    );
    setFilteredTasks(sortTasksByUpdatedAt(searchTasks));
  }, [allTasks, searchInputRef]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsTodayTasksModalOpen(false);
  }, []);

  return (
    <div className="app">
      {(isModalOpen || isTodayTasksModalOpen) && (
        <div
          className="overlay"
          onClick={closeModal}
        />
      )}
      
      {isModalOpen && (
        <Modal
          setAllTasks={setAllTasks}
          allTasks={allTasks}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isTodayTasksModalOpen && (
        <TodayTasksModal
          todayTasks={todayTasks}
          setIsTodayTasksModalOpen={setIsTodayTasksModalOpen}
        />
      )}

      <div className="header">
        <div className="widgets-container">
          <h1 className="app-title">To Do List</h1>
          <WeatherWidget />
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Task"
            ref={searchInputRef}
            onInput={handleSearch}
          />
          <Button
            text="+ New Task"
            onClick={() => setIsModalOpen(true)}
            className="add-task-button"
          />
        </div>
      </div>
      <AllLists allTasks={filteredTasks} setAllTasks={setAllTasks} />
    </div>
  );
}

export default App;