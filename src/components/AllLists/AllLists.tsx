import { List } from "../List/List";
import { Task, AllListsProps } from "../../types";
import { sortTasksByUpdatedAt } from "../../utils";

const AllLists = ({ allTasks, setAllTasks }: AllListsProps) => {

  const filterTasksOnIsCompleted = (boolean: boolean) => {
    const filteredTasks = allTasks.filter((task: Task) => task.isCompleted === boolean);
    return sortTasksByUpdatedAt(filteredTasks);
  };
  const unfinishedTasks = filterTasksOnIsCompleted(false);
  const completedTasks = filterTasksOnIsCompleted(true);

  const completedTasksList = (
    <List
      filteredTasks={completedTasks}
      allTasks={allTasks}
      setAllTasks={setAllTasks}
      titleText="Completed Tasks"
      listClassName="completed-tasks-list"
    />
  );

  const unfinishedTasksList = (
    <List
      filteredTasks={unfinishedTasks}
      allTasks={allTasks}
      setAllTasks={setAllTasks}
      titleText="All Tasks"
      listClassName="unfinished-tasks-list"
    />
  );

  return (
    <div className="all-lists">
      {unfinishedTasks.length > 0 && unfinishedTasksList}
      {completedTasks.length > 0 && completedTasksList}
    </div>
  );
};

export default AllLists;