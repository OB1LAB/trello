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
  color: string;
}

export interface IUser {
  value: number;
  label: string;
}

export interface IMouseMove {
  x: number;
  y: number;
  xOffset: number;
  yOffset: number;
  isPressed: boolean;
}
