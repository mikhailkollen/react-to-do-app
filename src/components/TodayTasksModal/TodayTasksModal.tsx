import { setModalShown, setCorrectTitle } from "../../utils";
import { ListItem } from "../ListItem/ListItem";
import Button from "../Button/Button";
import { Task, TodayTasksModalProps } from "../../types";
import "./TodayTasksModal.css"
import { useCallback, useEffect } from "react";


const TodayTasksModal = ({ todayTasks, setIsTodayTasksModalOpen }: TodayTasksModalProps) => {

  useEffect(() => {
    setModalShown();
    return () => { };
  }, []);

  const closeModal = useCallback(() => {
    setIsTodayTasksModalOpen(false);
  }, [setIsTodayTasksModalOpen]);

  return (
    <div className="today-tasks-modal modal">
      <h2 className="list-title">{setCorrectTitle()}</h2>
      <p className="today-tasks-modal-text">
        You have {todayTasks.length} task(s) planned for today:
      </p>
      <ul className="today-tasks-modal-list">
        {(todayTasks.length > 0) && todayTasks.map((task: Task) => {
          return (
            <ListItem task={task} isModalTask={true} key={task._id} />
          );
        })}
      </ul>
      <Button className="today-tasks-modal-button" text="OK" onClick={closeModal} />
    </div>
  );
};

export default TodayTasksModal;