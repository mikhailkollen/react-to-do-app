import { ListItem } from "../ListItem/ListItem";
import { ListProps, Task } from "../../types";
import "./List.css";

export const List = ({ filteredTasks,
  allTasks,
  setAllTasks,
  titleText,
  listClassName }: ListProps) => {

  return (
    <div className="list">
      <h2 className="list-title">{titleText}</h2>
      <ul className={listClassName}>
        {filteredTasks.map((task: Task) => {
          return (
            <ListItem
              task={task} isModalTask={false} allTasks={allTasks} setAllTasks={setAllTasks}
              key={task._id}
            />
          );
        })}
      </ul>
    </div>
  );
};