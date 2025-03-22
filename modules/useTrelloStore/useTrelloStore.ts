"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IColumn } from "@/ifaces";
import useUserStore from "@/modules/useUserStore/useUserStore";

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
  addColumn(title) {
    const columns = get().columns;
    columns.push({
      title,
      tasks: [],
    });
    set({ columns });
  },
  removeColumn(columnIndex) {
    const columns = get().columns;
    columns.splice(columnIndex, 1);
    set({ columns });
  },
  moveColumn(oldColumnIndex, newColumnIndex) {
    const columns = get().columns;
    const tempElement = columns[oldColumnIndex];
    const offset = newColumnIndex > oldColumnIndex ? -1 : 0;
    columns[oldColumnIndex] = columns[newColumnIndex + offset];
    columns[newColumnIndex + offset] = tempElement;
    set({ columns });
  },
  addTask(executorUserId, timeEnd, content, color) {
    const columns = get().columns;
    const columnIndex = get().selectedColumnIndex;
    const currentDate = new Date();
    const secondsOffset =
      currentDate.getHours() * 3600 +
      currentDate.getMinutes() * 60 +
      currentDate.getSeconds() +
      86400;
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    columns[columnIndex].tasks.push({
      createdUserId: useUserStore.getState().userId,
      executorUserId,
      dateCreate: currentDate,
      timeEnd: timeEnd !== -1 ? ~~secondsOffset + timeEnd : -1,
      content,
      color,
    });
  },
  editTask(taskIndex, executorUserId, timeEnd, content, color) {},
  moveTask(oldColumnIndex, newColumnIndex, oldTaskIndex, newTaskIndex) {
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
