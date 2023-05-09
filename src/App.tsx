import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import AllLists from "./components/AllLists/AllLists";
import Button from "./components/Button/Button";
import { Modal } from "./components/Modal/Modal";
import { WeatherWidget } from "./components/WeatherWidget/WeatherWidget";
import { setModalShown, tagLabels } from "./utils";
import TodayTasksModal from "./components/TodayTasksModal/TodayTasksModal";
import "./styles/css-reset.css";
import "./styles/index.css";
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

  const { todayTasks, isTodayTasksModalOpen, isModalOpen } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  useEffect(() => {
    const handleStorageEvent = () => {
      dispatch(getTasks());
    };
    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [dispatch]);

  useEffect(() => {
    dispatch(setIsTodayTasksModalOpen(true))
    handleSearch();
  }, [todayTasks, dispatch]);


  useEffect(() => {
    if (searchValue && searchInputRef.current) {
      searchInputRef.current.value = searchValue;
      dispatch(filterTasks({ searchValue, tag: currentTag }));
    }
  }, [searchValue, currentTag, dispatch]);


  const handleSearch = useCallback(() => {
    if (!searchInputRef.current) return;
    const inputValue = searchInputRef.current.value;
    const encodedValue = encodeURIComponent(inputValue);
    setSearchParams({ q: encodedValue || '' });
    navigate(`/${currentTag}?q=${encodedValue}`);
    dispatch(filterTasks({ searchValue: inputValue, tag: currentTag }));
  }, [searchInputRef, setSearchParams, navigate, currentTag, dispatch]);

  const openModal = useCallback(() => {
    dispatch(setIsModalOpen(true));
  }, [dispatch]);

  const closeModal = useCallback(() => {
    dispatch(setIsModalOpen(false));
    dispatch(setIsTodayTasksModalOpen(false))
    setModalShown();
  }, [dispatch]);

  const resetTags = useCallback(() => {
    const inputValue = searchInputRef.current?.value;
    const encodedValue = encodeURIComponent(inputValue || '');
    navigate(`/?q=${encodedValue}`);
    setCurrentTag('');
    dispatch(filterTasks({ tag: '', searchValue: inputValue || '' }));
  }, [searchInputRef, navigate, setCurrentTag, dispatch]);

  const tagsInputs = useMemo(() => {
    const handleTagFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = searchInputRef.current!.value;
      const encodedValue = encodeURIComponent(inputValue);
      navigate(`/${event.target.value}?q=${encodedValue}`);
      setCurrentTag(event.target.value);
      dispatch(filterTasks({ tag: event.target.value, searchValue: inputValue }));
    };

    return tagLabels.map((tag) => (
      <label
        key={tag.id}
        className="tag-label"
        style={{
          border: currentTag === tag.tag ? `1px solid ${tag.color}` : "none",
          backgroundColor: tag.bgColor,
          color: tag.color,
        }}
      >
        {tag.tag}
        <input
          type="radio"
          name="tag"
          value={tag.tag}
          className="tag-filter-button"
          onChange={handleTagFilterChange}
          checked={currentTag === tag.tag}
        />
      </label>
    ));
  }, [currentTag, dispatch, navigate, searchInputRef]);

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
                border: currentTag === "" ? `1px solid #838383` : "none",
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