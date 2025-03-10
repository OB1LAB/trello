export interface IColumn {
  title: string;
  tasks: ITask[];
}

export interface ITask {
  createdUserId: number;
  executorUserId: number;
  dateCreate: Date;
  timeEnd: number;
  content: string;
}

export interface IUser {
  value: number;
  label: string;
}
