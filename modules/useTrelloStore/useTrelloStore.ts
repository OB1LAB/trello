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
  setIsOpenModalAddColumn: (isOpenModalAddColumn: boolean) => void;
  setIsOpenModalAddTask: (
    selectedColumnIndex: number,
    isOpenModalAddTask: boolean,
  ) => void;
  addTask: (executorUserId: number, timeEnd: number, content: string) => void;
  editTask: (
    taskIndex: number,
    executorUserId: number,
    timeEnd: number,
    content: string,
  ) => void;
  moveTask: (
    oldColumnIndex: number,
    newColumnIndex: number,
    oldTaskIndex: number,
    newTaskIndex: number,
  ) => void;
}

export default create<IColumnStore>((set, get) => ({
  columns: [],
  isOpenModalAddColumn: false,
  isOpenModalAddTask: false,
  selectedColumnIndex: 0,
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
    columns[oldColumnIndex] = columns[newColumnIndex];
    columns[newColumnIndex] = tempElement;
    set({ columns });
  },
  addTask(executorUserId, timeEnd, content) {
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
    });
  },
  editTask(taskIndex, executorUserId, timeEnd, content) {},
  moveTask(oldColumnIndex, newColumnIndex, oldTaskIndex, newTaskIndex) {},
}));
