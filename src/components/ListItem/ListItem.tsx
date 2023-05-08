import { useCallback, useMemo } from "react";
import { tagLabels, formatDate } from "../../utils";
import { ListItemProps } from "../../types";
import "./ListItem.css";
import Button from "../Button/Button";
import CheckIcon from "./assets/check-icon.svg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteTask as deleteTaskFromTheServer, updateTask as updateTaskOnTheServer } from "../../features/tasks/tasksThunk";
import { setAllTasks, editTask } from "../../features/tasks/tasksSlice";

export const ListItem = ({ task, isModalTask }: ListItemProps) => {
  const allTasks = useAppSelector((state) => state.tasks.allTasks);
  const dispatch = useAppDispatch();
  const tag = useMemo(() => tagLabels.find((item) => item.tag === task.tag), [task.tag]);
  const style = useMemo(
    () => ({
      backgroundColor: `${tag?.bgColor}`,
      color: `${tag?.color}`,
    }),
    [tag?.bgColor, tag?.color]
  );

  const changeStatus = useCallback(() => {
    dispatch(updateTaskOnTheServer({...task, isCompleted: !task.isCompleted}));
  }, [allTasks, task, dispatch]);
  
  const changeTaskDetails = useCallback(() => {
    dispatch(editTask(task))
    // dispatch(updateTaskOnTheServer({...task, title: newTitle}));
  }, [allTasks, task, dispatch]);


  const deleteTask = useCallback(() => {
  dispatch(deleteTaskFromTheServer(task._id!));
  const updatedTasks = allTasks.filter((t) => t._id !== task._id);
  dispatch(setAllTasks(updatedTasks));
}, [allTasks, task, dispatch]);

  return (
    <li>
      <label className={`list-item ${task.isCompleted ? "completed" : ""}`}>
        {!isModalTask && (
          <input
            type="checkbox"
            className="list-item-checkbox"
            checked={task.isCompleted}
            onChange={() => changeStatus()
            }
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
      {
        !task.isCompleted && !isModalTask && (
          <div className="item-button-container">
            <Button className="edit-button" onClick={changeTaskDetails} />
            <Button className="delete-button" onClick={deleteTask} />
          </div>)
      }
    </li>
  );
};