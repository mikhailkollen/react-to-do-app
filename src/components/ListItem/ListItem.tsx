import { useCallback, useMemo } from "react";
import { tagLabels, updateTaskOnTheServer, deleteTaskFromTheServer, sortTasksByUpdatedAt, formatDate } from "../../utils";
import { ListItemProps, Task } from "../../types";
import "./ListItem.css";
import Button from "../Button/Button";
import CheckIcon from "./assets/check-icon.svg";

export const ListItem = ({ task, isModalTask, allTasks, setAllTasks }: ListItemProps) => {
  const tag = useMemo(() => tagLabels.find((item) => item.tag === task.tag), [task.tag]);
  const style = useMemo(
    () => ({
      backgroundColor: `${tag?.bgColor}`,
      color: `${tag?.color}`,
    }),
    [tag?.bgColor, tag?.color]
  );

const changeStatus = useCallback((task: Task) => {
  const updatedTask = { ...task, isCompleted: !task.isCompleted };
  updateTaskOnTheServer(updatedTask).then((updatedTask) => {
    const newTasks = allTasks?.map((item) => (item._id === updatedTask._id ? updatedTask : item));
    if (newTasks && setAllTasks) {
      setAllTasks(sortTasksByUpdatedAt(newTasks));
    }
  });
}, [allTasks, setAllTasks]);

  const deleteTask = useCallback(() => {
  const newTasks = allTasks?.filter((item) => item._id !== task._id);

  (newTasks && setAllTasks) && setAllTasks(newTasks);
  if (task._id) {
    deleteTaskFromTheServer(task._id);
  }
}, [allTasks, setAllTasks]);

  return (
    <li>
      <label className={`list-item ${task.isCompleted ? "completed" : ""}`}>
        {!isModalTask && (
          <input
            type="checkbox"
            className="list-item-checkbox"
            checked={task.isCompleted}
            onChange={() => changeStatus(task)}
            style={{ backgroundImage: `url(${CheckIcon})` }}
          />
        )}
        <div className="list-item-tag-container">
          <p className="task-title">{task.title}</p>
          <div className="task-tag-container">
            <span className="tag-label" style={!task.isCompleted ? style : undefined}>
              {task.tag}
            </span>
            {!isModalTask && (
              <p className="deadline">
                {formatDate(task.date)}
              </p>
            )}
          </div>
        </div>
      </label>
      {!task.isCompleted && !isModalTask && <Button className="delete-button" onClick={deleteTask} />}
    </li>
  );
};