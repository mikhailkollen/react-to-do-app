import { ListItem } from "../ListItem/ListItem";
import { ListProps, Task } from "../../types";
import "./List.css";

export const List = ({ tasks,
  titleText,
  listClassName }: ListProps) => {  

  return (
    <div className="list">
      <h2 className="list-title">{titleText}</h2>
      <ul className={listClassName}>
        {tasks.map((task: Task) => {
          return (
            <ListItem
              task={task} isModalTask={false}
              key={task._id}
            />
          );
        })}
      </ul>
    </div>
  );
};