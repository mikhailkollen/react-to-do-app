import {Dispatch} from "redux";

type Id = string;
type Tasks = Task[];
type SetAllTasks = Dispatch<{ type: string, payload: Tasks }>;

interface TaskState {
  allTasks: Tasks;
  filteredTasks: Tasks;
  todayTasks: null | Tasks;
  isLoading?: boolean;
  isTodayTasksModalOpen: boolean;
  isModalOpen?: boolean;
  editedTask: Task | null;
}

interface ButtonProps {
  text?: string | number;
  onClick: () => void;
  className?: string;
}

interface Filter {
  searchValue: string;
  tag: string;

}

interface ListItemProps {
  task: Task;
  isModalTask?: boolean;
  allTasks?: Tasks;
}

interface ListProps {
  tasks: Tasks;
  titleText: string;
  listClassName: string;
}

interface ModalProps {
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  allTasks?: Tasks;
  setAllTasks?: SetAllTasks;
  task?: Task;
}

interface TodayTasksModalProps {
  setIsTodayTasksModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  todayTasks: Tasks;
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
  date: string;
  updatedAt?: Date;
}


export type { Task, Tasks, Id, ButtonProps, ListItemProps, SetAllTasks, ListProps, WeatherData, ModalProps, TodayTasksModalProps, TaskState, Filter };