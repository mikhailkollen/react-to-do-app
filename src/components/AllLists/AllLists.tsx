import { List } from "../List/List";
import { Task } from "../../types";
import { sortTasksByUpdatedAt } from "../../utils";
import { useAppSelector } from "../../app/hooks";
import { useMemo } from 'react';

const AllLists = () => {
  const allTasks = useAppSelector((state) => state.tasks.filteredTasks);

  const filterTasksOnIsCompleted = (boolean: boolean, tasks: Task[]) => {
    const filteredTasks = tasks.filter((task: Task) => task.isCompleted === boolean);
    return sortTasksByUpdatedAt(filteredTasks);
  };
  
  const unfinishedTasks = useMemo(() => filterTasksOnIsCompleted(false, allTasks), [allTasks]);
  const completedTasks = useMemo(() => filterTasksOnIsCompleted(true, allTasks), [allTasks]);

  const completedTasksList = (
    <List
      tasks={completedTasks}
      titleText="Completed Tasks"
      listClassName="completed-tasks-list"
    />
  );

  const unfinishedTasksList = (
    <List
      tasks={unfinishedTasks}
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