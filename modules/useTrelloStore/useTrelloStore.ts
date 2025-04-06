"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IColumn, ITask } from "@/ifaces";
import useUserStore from "@/modules/useUserStore/useUserStore";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";
import { ClientEvents } from "@/consts";

interface IColumnStore {
  columns: IColumn[];
  addColumn: (title: string) => void;
  removeColumn: (columnIndex: number) => void;
  moveColumn: (oldColumnIndex: number, newColumnIndex: number) => void;
  isOpenModalAddColumn: boolean;
  isOpenModalAddTask: boolean;
  selectedColumnIndex: number;
  isMove: boolean;
  selectedMoveColumn: number;
  selectedMoveTask: number;
  setIsOpenModalAddColumn: (isOpenModalAddColumn: boolean) => void;
  setIsOpenModalAddTask: (
    selectedColumnIndex: number,
    isOpenModalAddTask: boolean,
  ) => void;
  addTask: (
    executorUserId: number,
    timeEnd: number,
    content: string,
    color: string,
  ) => void;
  socketAddTask: (userId: number, columnIndex: number, task: ITask) => void;
  socketAddColumn: (userId: number, title: string) => void;
  setColumns: (columns: IColumn[]) => void;
  socketRemoveColumn: (userId: number, columnIndex: number) => void;
  socketMoveColumn: (
    userId: number,
    oldColumnIndex: number,
    newColumnIndex: number,
  ) => void;
  editTask: (
    taskIndex: number,
    executorUserId: number,
    timeEnd: number,
    content: string,
    color: string,
  ) => void;
  moveTask: (
    oldColumnIndex: number,
    newColumnIndex: number,
    oldTaskIndex: number,
    newTaskIndex: number,
  ) => void;
  socketMoveTask: (
    userId: number,
    oldColumnIndex: number,
    newColumnIndex: number,
    oldTaskIndex: number,
    newTaskIndex: number,
    offset: number,
  ) => void;
  setIsMove: (isMove: boolean) => void;
  setSelectedMoveColumn: (selectedMoveColumn: number) => void;
  setSelectedMoveTask: (selectedMoveTask: number) => void;
}

export default create<IColumnStore>((set, get) => ({
  columns: [],
  isOpenModalAddColumn: false,
  isOpenModalAddTask: false,
  selectedMoveColumn: -1,
  selectedMoveTask: -1,
  selectedColumnIndex: 0,
  isMove: false,
  setIsOpenModalAddColumn(isOpenModalAddColumn) {
    set({ isOpenModalAddColumn });
  },
  setIsOpenModalAddTask(selectedColumnIndex, isOpenModalAddTask) {
    set({ selectedColumnIndex, isOpenModalAddTask });
  },
  setColumns(columns: IColumn[]) {
    set({ columns });
    useSocketStore.getState().socket?.removeAllListeners();
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.addColumn, get().socketAddColumn);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.removeColumn, get().socketRemoveColumn);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.moveColumn, get().socketMoveColumn);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.addTask, get().socketAddTask);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.moveTask, get().socketMoveTask);
  },
  addColumn(title) {
    useSocketStore.getState().socket?.emit(ClientEvents.addColumn, title);
    const columns = get().columns;
    columns.push({
      title,
      tasks: [],
    });
    set({ columns });
  },
  socketAddColumn(userId, title) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    columns.push({
      title,
      tasks: [],
    });
    set({ columns });
  },
  removeColumn(columnIndex) {
    useSocketStore
      .getState()
      .socket?.emit(ClientEvents.removeColumn, columnIndex);
    const columns = get().columns;
    columns.splice(columnIndex, 1);
    set({ columns });
  },
  socketRemoveColumn(userId, columnIndex) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    columns.splice(columnIndex, 1);
    set({ columns });
  },
  moveColumn(oldColumnIndex, newColumnIndex) {
    useSocketStore
      .getState()
      .socket?.emit(ClientEvents.moveColumn, oldColumnIndex, newColumnIndex);
    const columns = get().columns;
    columns.splice(newColumnIndex, 0, columns[oldColumnIndex]);
    columns.splice(
      oldColumnIndex + (oldColumnIndex > newColumnIndex ? 1 : 0),
      1,
    );
    set({ columns });
  },
  socketMoveColumn(userId, oldColumnIndex, newColumnIndex) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    columns.splice(newColumnIndex, 0, columns[oldColumnIndex]);
    columns.splice(
      oldColumnIndex + (oldColumnIndex > newColumnIndex ? 1 : 0),
      1,
    );
    set({ columns });
  },
  addTask(executorUserId, timeEnd, content, color) {
    const currentDate = new Date();
    const secondsOffset =
      currentDate.getHours() * 3600 +
      currentDate.getMinutes() * 60 +
      currentDate.getSeconds() +
      86400;
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    timeEnd = timeEnd !== -1 ? ~~secondsOffset + timeEnd : -1;
    const columnIndex = get().selectedColumnIndex;
    useSocketStore
      .getState()
      .socket?.emit(
        ClientEvents.addTask,
        executorUserId,
        currentDate,
        timeEnd,
        content,
        color,
        columnIndex,
      );
    const columns = get().columns;
    columns[columnIndex].tasks.push({
      createdUserId: useUserStore.getState().userId,
      executorUserId,
      dateCreate: currentDate,
      timeEnd,
      content,
      color,
    });
    set({ columns });
  },
  socketAddTask(userId, columnIndex, task) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    task.dateCreate = new Date(task.dateCreate);
    columns[columnIndex].tasks.push(task);
    set({ columns });
  },
  editTask(taskIndex, executorUserId, timeEnd, content, color) {},
  moveTask(oldColumnIndex, newColumnIndex, oldTaskIndex, newTaskIndex) {
    useSocketStore
      .getState()
      .socket?.emit(
        ClientEvents.moveTask,
        oldColumnIndex,
        newColumnIndex,
        oldTaskIndex,
        newTaskIndex,
      );
    const columns = get().columns;
    const task = columns[oldColumnIndex].tasks.splice(oldTaskIndex, 1)[0];
    const offset =
      oldColumnIndex === newColumnIndex
        ? newTaskIndex > oldTaskIndex
          ? -1
          : 0
        : 0;
    columns[newColumnIndex].tasks.splice(newTaskIndex + offset, 0, task);
    set({ columns, isMove: false });
  },
  socketMoveTask(
    userId,
    oldColumnIndex,
    newColumnIndex,
    oldTaskIndex,
    newTaskIndex,
    offset,
  ) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    const task = columns[oldColumnIndex].tasks.splice(oldTaskIndex, 1)[0];
    columns[newColumnIndex].tasks.splice(newTaskIndex + offset, 0, task);
    set({ columns, isMove: false });
  },
  setIsMove(isMove) {
    set({ isMove });
  },
  setSelectedMoveColumn(selectedMoveColumn) {
    set({ selectedMoveColumn });
  },
  setSelectedMoveTask(selectedMoveTask) {
    set({ selectedMoveTask });
  },
}));
