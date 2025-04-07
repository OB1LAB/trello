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
  isAdmin: boolean;
}

export interface ITrello {
  accessUsers: number[];
  createdUser: number;
  trello: IColumn[];
  trelloName: string;
}

export interface ISelectPickerData {
  label: string;
  value: number;
}

export interface ITrelloList {
  [trelloId: number]: ITrello;
}

export interface IMouseMove {
  x: number;
  y: number;
  xOffset: number;
  yOffset: number;
  isPressed: boolean;
}

export interface IFakeSize {
  userId: number;
  taskIndex: number;
  columnIndex: number;
  side: IFakeSizeSide;
  size: number;
  isButtonAddTask: boolean;
}

export interface IPressMove {
  x: number;
  y: number;
  isPress: boolean;
}

export type IFakeSizeSide = "top" | "right" | "bottom" | "left";
