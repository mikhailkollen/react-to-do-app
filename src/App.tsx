import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import AllLists from "./components/AllLists/AllLists";
import Button from "./components/Button/Button";
import { Modal } from "./components/Modal/Modal";
import { WeatherWidget } from "./components/WeatherWidget/WeatherWidget";
import { filterTodayTasks, checkIfModalShownToday, sortTasksByUpdatedAt, tagLabels } from "./utils";
import TodayTasksModal from "./components/TodayTasksModal/TodayTasksModal";
import "./styles/css-reset.css";
import "./styles/index.css";
import { Task, Tasks } from "./types";
import { filterTasks, setIsTodayTasksModalOpen, setIsModalOpen } from "./features/tasks/tasksSlice";
import { getTasks } from "./features/tasks/tasksThunk";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";


function App() {

  const [searchParams, setSearchParams] = useSearchParams({});
  const searchValue = searchParams.get('q');
  const location = useLocation();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentTag, setCurrentTag] = useState<string>(location.pathname.split('/')[1]);

  const tasks = useAppSelector((state) => state.tasks);
  const { allTasks, todayTasks, isTodayTasksModalOpen, isModalOpen } = tasks;


  useEffect(() => {
    dispatch(getTasks());
    return () => { };
  }, []);

  useEffect(() => {
    dispatch(setIsTodayTasksModalOpen(true))
    return () => { };
  }, [todayTasks]);

  useEffect(() => {

    handleSearch();
  }, [searchInputRef.current?.value, allTasks]);

  useEffect(() => {
    if (searchValue) {
      searchInputRef.current!.value = searchValue;
      dispatch(filterTasks({ searchValue: searchValue, tag: currentTag }));
    }
  }, [searchValue, dispatch]);

  const handleSearch = useCallback(() => {
    if (!searchInputRef.current) return;
    setSearchParams({ q: searchInputRef.current?.value || '' });
    const inputValue = searchInputRef.current?.value;
    navigate(`/${currentTag}?q=${inputValue}`);
    dispatch(filterTasks({ searchValue: inputValue!, tag: currentTag }));
  }, [searchInputRef, dispatch, currentTag]);

  const openModal = useCallback(() => {
    dispatch(setIsModalOpen(true));
  }, []);

  const closeModal = useCallback(() => {
    dispatch(setIsModalOpen(false));
    dispatch(setIsTodayTasksModalOpen(false))
  }, []);

  const handleTagFilterChange = useCallback((event: any) => {
    navigate(`/${event.target.value}/?q=${searchInputRef.current!.value}`);
    setCurrentTag(event.target.value);
    dispatch(filterTasks({ tag: event.target.value, searchValue: searchInputRef.current!.value }));
  }, []);

  const resetTags = useCallback(() => {
    navigate(`/?q=${searchInputRef.current!.value}`);
    setCurrentTag('');
    dispatch(filterTasks({ tag: '', searchValue: searchInputRef.current!.value }));
  }, []);

  const tagsInputs = useMemo(() => {
    return tagLabels.map((tag) => (
              <label
                key={tag.id}
                className="tag-label"
                style={{
                  border: currentTag === tag.tag ? `1px solid ${tag.color}` : "none",
                  backgroundColor: tag.bgColor,
                  color: tag.color,
                  transition: "border 0.6s ease-in-out",
                }}
              >
                {tag.tag}
                <input
                  type="radio"
                  name="tag"
                  value={tag.tag}
                  className="tag-filter-button"
                  onClick={(e) => handleTagFilterChange(e)}
                />
              </label>
            ));
  }, [currentTag]);
  return (
    <div className="app">
      {(isModalOpen || isTodayTasksModalOpen) && (
        <div
          className="overlay"
          onClick={() => closeModal()}
        />
      )}

      {isModalOpen && (
        <Modal />
      )}

      {isTodayTasksModalOpen && (
        <TodayTasksModal />
      )}

      <header className="header">
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
            onClick={() => openModal()}
            className="add-task-button"
          />
        </div>
        <div className="tag-filter-container">
          <p>Filter by tag</p>
          <div className="tag-filter">
            {tagsInputs}
            <button className="tag-label filter-all-tasks-button" onClick={resetTags}
            style={{
                  border: currentTag === "" ? `1px solid #555` : "none",
                  
                }}
            >all</button>
          </div>
        </div>
      </header>
      <AllLists />
    </div>
  );
}

export default App;