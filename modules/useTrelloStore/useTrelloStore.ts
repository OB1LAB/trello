"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IColumn, IFakeSize, IFakeSizeSide, ITask } from "@/ifaces";
import useUserStore from "@/modules/useUserStore/useUserStore";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";
import { ClientEvents } from "@/consts";

interface IGrabTask {
  userId: number;
  taskIndex: number;
  columnIndex: number;
  xOffset: number;
  yOffset: number;
  x: number;
  y: number;
  isMove: boolean;
}

interface IColumnStore {
  columns: IColumn[];
  grabTask: IGrabTask;
  fakeSize: IFakeSize;
  isModalConfirmDelete: boolean;
  selectedRemoveColumnIndex: number;
  selectedRemoveTaskIndex: number;
  isModalEditColumn: boolean;
  editColumnIndex: number;
  isModalEditTask: boolean;
  editTaskIndex: number;
  socketGrabTask: (
    userId: number,
    taskIndex: number,
    columnIndex: number,
    xOffset: number,
    yOffset: number,
    x: number,
    y: number,
    isMove: boolean,
  ) => void;
  setIsModalEditColumn: (isModalEditColumn: boolean) => void;
  setEditColumnIndex: (editColumnIndex: number) => void;
  setIsModalEditTask: (isModalEditTask: boolean) => void;
  setEditTaskIndex: (editTaskIndex: number) => void;
  addColumn: (title: string) => void;
  editColumn: (title: string) => void;
  setIsModalConfirmDelete: (isModalConfirmDelete: boolean) => void;
  setSelectedRemoveColumnIndex: (selectedRemoveColumnIndex: number) => void;
  setSelectedRemoveTaskIndex: (selectedRemoveTaskIndex: number) => void;
  removeColumnOrTask: () => void;
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
  socketEditColumn: (
    userId: number,
    title: string,
    columnIndex: number,
  ) => void;
  setColumns: (columns: IColumn[]) => void;
  socketFakeSize: (
    userId: number,
    taskIndex: number,
    columnIndex: number,
    side: IFakeSizeSide,
    size: number,
    isButtonAddTask: boolean,
  ) => void;
  socketRemoveColumn: (
    userId: number,
    columnIndex: number,
    taskIndex: number,
  ) => void;
  socketEditTask: (
    userId: number,
    executorUserId: number,
    timeEnd: number,
    content: string,
    color: string,
    columnIndex: number,
    taskIndex: number,
  ) => void;
  isHoverSocket: boolean;
  socketIsHover: (userId: number, isHover: boolean) => void;
  socketMoveColumn: (
    userId: number,
    oldColumnIndex: number,
    newColumnIndex: number,
  ) => void;
  editTask: (
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
  isHoverSocket: false,
  isOpenModalAddTask: false,
  selectedMoveColumn: -1,
  isModalEditColumn: false,
  isModalEditTask: false,
  editTaskIndex: -1,
  editColumnIndex: -1,
  selectedMoveTask: -1,
  fakeSize: {
    userId: -1,
    taskIndex: -1,
    columnIndex: -1,
    side: "bottom",
    size: 0,
    isButtonAddTask: false,
  },
  isModalConfirmDelete: false,
  selectedRemoveColumnIndex: -1,
  selectedRemoveTaskIndex: -1,
  selectedColumnIndex: 0,
  isMove: false,
  grabTask: {
    userId: -1,
    taskIndex: -1,
    columnIndex: -1,
    xOffset: 0,
    yOffset: 0,
    x: 0,
    y: 0,
    isMove: false,
  },
  setIsOpenModalAddColumn(isOpenModalAddColumn) {
    set({ isOpenModalAddColumn });
  },
  setIsOpenModalAddTask(selectedColumnIndex, isOpenModalAddTask) {
    set({ selectedColumnIndex, isOpenModalAddTask });
  },
  setIsModalConfirmDelete: (isModalConfirmDelete) => {
    set({ isModalConfirmDelete });
  },
  setSelectedRemoveColumnIndex: (selectedRemoveColumnIndex) => {
    set({ selectedRemoveColumnIndex });
  },
  setSelectedRemoveTaskIndex: (selectedRemoveTaskIndex) => {
    set({ selectedRemoveTaskIndex });
  },
  setIsModalEditColumn: (isModalEditColumn) => {
    set({ isModalEditColumn });
  },
  setEditColumnIndex: (editColumnIndex) => {
    set({ editColumnIndex });
  },
  setIsModalEditTask: (isModalEditTask) => {
    set({ isModalEditTask });
  },
  setEditTaskIndex: (editTaskIndex) => {
    set({ editTaskIndex });
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
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.fakeSize, get().socketFakeSize);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.hovered, get().socketIsHover);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.editColumn, get().socketEditColumn);
    useSocketStore
      .getState()
      .socket?.on(ClientEvents.editTask, get().socketEditTask);
    if (useUserStore.getState().isShowMove) {
      useSocketStore
        .getState()
        .socket?.on(ClientEvents.grabTask, get().socketGrabTask);
    }
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
  editColumn(title) {
    const editColumnIndex = get().editColumnIndex;
    useSocketStore
      .getState()
      .socket?.emit(ClientEvents.editColumn, title, editColumnIndex);
    const columns = get().columns;
    columns[editColumnIndex].title = title;
    set({ columns });
  },
  socketIsHover(userId, isHoverSocket) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    set({ isHoverSocket });
  },
  socketFakeSize(userId, taskIndex, columnIndex, side, size, isButtonAddTask) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    set({
      fakeSize: {
        userId,
        taskIndex,
        columnIndex,
        side,
        size,
        isButtonAddTask,
      },
    });
  },
  socketGrabTask(
    userId,
    taskIndex,
    columnIndex,
    xOffset,
    yOffset,
    x,
    y,
    isMove,
  ) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const grabTask: IGrabTask = {
      userId,
      taskIndex,
      columnIndex,
      xOffset,
      yOffset,
      x,
      y,
      isMove,
    };
    set({ grabTask });
  },
  socketEditColumn(userId, title, columnIndex) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    columns[columnIndex].title = title;
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
  removeColumnOrTask() {
    const columns = get().columns;
    const selectedRemoveColumnIndex = get().selectedRemoveColumnIndex;
    const selectedRemoveTaskIndex = get().selectedRemoveTaskIndex;
    useSocketStore
      .getState()
      .socket?.emit(
        ClientEvents.removeColumn,
        selectedRemoveColumnIndex,
        selectedRemoveTaskIndex,
      );
    if (selectedRemoveTaskIndex === -1) {
      columns.splice(selectedRemoveColumnIndex, 1);
    } else {
      columns[selectedRemoveColumnIndex].tasks.splice(
        selectedRemoveTaskIndex,
        1,
      );
    }
    set({ columns });
  },
  socketRemoveColumn(userId, columnIndex, taskIndex) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    if (taskIndex === -1) {
      columns.splice(columnIndex, 1);
    } else {
      columns[columnIndex].tasks.splice(taskIndex, 1);
    }
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
    const grabTask = get().grabTask;
    if (grabTask.isMove) {
      grabTask.isMove = false;
    }
    const columns = get().columns;
    columns.splice(newColumnIndex, 0, columns[oldColumnIndex]);
    columns.splice(
      oldColumnIndex + (oldColumnIndex > newColumnIndex ? 1 : 0),
      1,
    );
    set({ columns, grabTask, isMove: false });
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
  editTask(executorUserId, timeEnd, content, color) {
    const columns = get().columns;
    const columnIndex = get().editColumnIndex;
    const taskIndex = get().editTaskIndex;
    const currentDate = columns[columnIndex].tasks[taskIndex].dateCreate;
    const secondsOffset =
      currentDate.getHours() * 3600 +
      currentDate.getMinutes() * 60 +
      currentDate.getSeconds();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    timeEnd = timeEnd !== -1 ? ~~secondsOffset + timeEnd : -1;
    useSocketStore
      .getState()
      .socket?.emit(
        ClientEvents.editTask,
        executorUserId,
        timeEnd,
        content,
        color,
        columnIndex,
        taskIndex,
      );
    columns[columnIndex].tasks[taskIndex] = {
      createdUserId: useUserStore.getState().userId,
      executorUserId,
      dateCreate: currentDate,
      timeEnd,
      content,
      color,
    };
    set({ columns });
  },
  socketEditTask(
    userId,
    executorUserId,
    timeEnd,
    content,
    color,
    columnIndex,
    taskIndex,
  ) {
    if (userId === useUserStore.getState().userId) {
      return;
    }
    const columns = get().columns;
    columns[columnIndex].tasks[taskIndex] = {
      ...columns[columnIndex].tasks[taskIndex],
      executorUserId,
      timeEnd,
      content,
      color,
    };
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
    const grabTask = get().grabTask;
    if (grabTask.isMove) {
      grabTask.isMove = false;
    }
    const task = columns[oldColumnIndex].tasks.splice(oldTaskIndex, 1)[0];
    columns[newColumnIndex].tasks.splice(newTaskIndex + offset, 0, task);
    set({ columns, isMove: false, grabTask });
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
