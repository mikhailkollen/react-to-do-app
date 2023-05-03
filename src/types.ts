type Id = string;
type Tasks = Task[];
type SetAllTasks = React.Dispatch<React.SetStateAction<Tasks>>;

interface ButtonProps {
  text?: string;
  onClick: () => void;
  className?: string;
}

interface ListItemProps {
  task: Task;
  isModalTask?: boolean;
  setAllTasks?: SetAllTasks;
  allTasks?: Tasks;


}

interface ListProps {
  filteredTasks: Tasks;
  allTasks: Tasks;
  setAllTasks: SetAllTasks;
  titleText: string;
  listClassName: string;
}

interface ModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allTasks: Tasks;
  setAllTasks: SetAllTasks;
}

interface TodayTasksModalProps {
  setIsTodayTasksModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  todayTasks: Tasks;
}

interface AllListsProps {
  allTasks: Tasks;
  setAllTasks: SetAllTasks;
}

interface WeatherData {
  current: {
    condition: {
      icon: string;
    };
    temp_c: number;
  };
  location: {
    name: string;
  };
}


interface Task {
  _id?: Id;
  title: string;
  isCompleted: boolean;
  tag: string;
  date: Date;
  updatedAt?: Date;
}


export type { Task, Tasks, Id, ButtonProps, ListItemProps, SetAllTasks, ListProps, WeatherData, ModalProps, TodayTasksModalProps, AllListsProps };