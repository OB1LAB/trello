"use client";
import { IColumn, IMouseMove } from "@/ifaces";
import { IconButton } from "rsuite";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import styles from "./TrelloColumn.module.scss";
import CloseIcon from "@rsuite/icons/Close";
import ModalAddTask from "@/modules/TrelloColumn/ModalAddTask";
import TrelloTask from "@/modules/TrelloColumn/TrelloTask";
import { useEffect, useRef, useState } from "react";
import ButtonAddTask from "@/modules/TrelloColumn/ButtonAddTask";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { ClientEvents } from "@/consts";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";

export default function TrelloColumn({
  column,
  columnIndex,
}: {
  column: IColumn;
  columnIndex: number;
}) {
  const selfUserId = useUserStore((store) => store.userId);
  const socket = useSocketStore((store) => store.socket);
  const columnRef = useRef<null | HTMLDivElement>(null);
  const isEdit = useUserStore((store) => store.isEdit);
  const [columnPress, setColumnPress] = useState<boolean>(false);
  const [leftFake, setLeftFake] = useState<number>(0);
  const [rightFake, setRightFake] = useState<number>(0);
  const grabTask = useTrelloStore((store) => store.grabTask);
  const isHoverSocket = useTrelloStore((store) => store.isHoverSocket);
  const fakeSize = useTrelloStore((store) => store.fakeSize);
  const [lastTimeSend, setLastTimeSend] = useState<number>(
    new Date().getTime(),
  );
  const [mouseMove, setMouseMove] = useState<IMouseMove>({
    x: 0,
    y: 0,
    xOffset: 0,
    yOffset: 0,
    isPressed: false,
  });
  const [isMove, setIsMove] = useTrelloStore((store) => [
    store.isMove,
    store.setIsMove,
  ]);
  const moveColumn = useTrelloStore((store) => store.moveColumn);
  const [
    selectedMoveTask,
    selectedMoveColumn,
    setSelectedMoveColumn,
    setSelectedMoveTask,
  ] = useTrelloStore((store) => [
    store.selectedMoveTask,
    store.selectedMoveColumn,
    store.setSelectedMoveColumn,
    store.setSelectedMoveTask,
  ]);
  const [removeColumn, columns] = useTrelloStore((store) => [
    store.removeColumn,
    store.columns,
  ]);

  const onFirstClick = (event: MouseEvent) => {
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
    // @ts-ignore
    if (event.target.className === styles.tittleDiv && event.button === 0) {
      setMouseMove({
        x: event.clientX,
        y: event.clientY,
        xOffset: event.layerX + 15,
        yOffset: event.layerY + 5,
        isPressed: false,
      });
      setColumnPress(true);
      setIsMove(true);
      setSelectedMoveColumn(columnIndex);
      setSelectedMoveTask(-1);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
    if (
      mouseMove.isPressed ||
      (columnPress &&
        (mouseMove.x !== event.clientX || mouseMove.y !== event.clientY))
    ) {
      const nowTime = new Date().getTime();
      if (nowTime - lastTimeSend > 16) {
        socket?.emit(
          ClientEvents.grabTask,
          -1,
          columnIndex,
          mouseMove.xOffset,
          mouseMove.yOffset,
          event.clientX,
          event.clientY,
          true,
        );
        setLastTimeSend(nowTime);
      }
      setMouseMove({
        ...mouseMove,
        x: event.clientX,
        y: event.clientY,
        isPressed: true,
      });
    }
  };

  const onMouseClick = (event: MouseEvent) => {
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
    if (leftFake + rightFake > 0) {
      if (leftFake > 0) {
        moveColumn(selectedMoveColumn, columnIndex);
        setTimeout(() => {
          socket?.emit(ClientEvents.fakeSize, -1, -1, "left", 0, false);
        }, 10);
      } else if (rightFake > 0) {
        moveColumn(selectedMoveColumn, columnIndex + 1);
        setTimeout(() => {
          socket?.emit(ClientEvents.fakeSize, -1, -1, "right", 0, false);
        }, 10);
      }
      setLeftFake(0);
      setRightFake(0);
    }
    if (columnPress && event.button === 0) {
      if (mouseMove.x === event.clientX && mouseMove.y === event.clientY) {
        console.log("Клик по колонке");
      }
      setMouseMove({
        ...mouseMove,
        x: event.clientX,
        y: event.clientY,
        isPressed: false,
      });
      socket?.emit(
        ClientEvents.grabTask,
        -1,
        columnIndex,
        mouseMove.xOffset,
        mouseMove.yOffset,
        event.clientX,
        event.clientY,
        false,
      );
      setIsMove(false);
      setColumnPress(false);
      setSelectedMoveColumn(-1);
    }
  };

  const onMouseMoveCurrentTask = (event: MouseEvent) => {
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
    if (
      columnPress ||
      mouseMove.isPressed ||
      !isMove ||
      !columnRef.current ||
      selectedMoveTask !== -1
    ) {
      return;
    }
    const percentMove = event.offsetX / columnRef.current.clientWidth;
    if (
      percentMove <= 0.5 &&
      columnIndex - selectedMoveColumn !== 1 &&
      leftFake === 0
    ) {
      socket?.emit(ClientEvents.fakeSize, -1, columnIndex, "left", 300, false);
      setLeftFake(300);
      setRightFake(0);
    } else if (
      percentMove > 0.5 &&
      columnIndex - selectedMoveColumn !== -1 &&
      rightFake === 0
    ) {
      socket?.emit(ClientEvents.fakeSize, -1, columnIndex, "right", 300, false);
      setRightFake(300);
      setLeftFake(0);
    }
  };

  useEffect(() => {
    addEventListener("mousemove", onMouseMove);
    addEventListener("mouseup", onMouseClick);
    return () => {
      removeEventListener("mousemove", onMouseMove);
      removeEventListener("mouseup", onMouseClick);
    };
  }, [
    mouseMove.isPressed,
    columnPress,
    leftFake,
    rightFake,
    grabTask.isMove,
    lastTimeSend,
  ]);

  useEffect(() => {
    if (columnRef && columnRef.current) {
      columnRef.current.addEventListener("mousemove", onMouseMoveCurrentTask);
      columnRef.current.addEventListener("mousedown", onFirstClick);
      return () => {
        if (columnRef.current) {
          columnRef.current.removeEventListener(
            "mousemove",
            onMouseMoveCurrentTask,
          );
          columnRef.current.removeEventListener("mousedown", onFirstClick);
        }
      };
    }
  }, [
    columnRef,
    isMove,
    mouseMove.isPressed,
    columnPress,
    selectedMoveColumn,
    leftFake,
    rightFake,
    grabTask.isMove,
  ]);

  return (
    <div
      style={{
        zIndex:
          (grabTask.isMove &&
            grabTask.taskIndex === -1 &&
            grabTask.columnIndex === columnIndex) ||
          mouseMove.isPressed
            ? "20"
            : "auto",
      }}
      className={styles.fakeColumn}
      onMouseLeave={() => {
        if (leftFake !== 0) {
          socket?.emit(ClientEvents.fakeSize, -1, -1, "left", 0, false);
          setLeftFake(0);
        }
        if (rightFake !== 0) {
          socket?.emit(ClientEvents.fakeSize, -1, -1, "right", 0, false);
          setRightFake(0);
        }
      }}
    >
      {(leftFake > 0 ||
        (grabTask.isMove &&
          fakeSize.taskIndex === -1 &&
          fakeSize.columnIndex === columnIndex &&
          fakeSize.side === "left" &&
          !fakeSize.isButtonAddTask)) && (
        <div
          onMouseEnter={() => {
            if (isMove) {
              socket?.emit(ClientEvents.hovered, true);
            }
          }}
          onMouseLeave={() => {
            if (isMove) {
              socket?.emit(ClientEvents.hovered, false);
            }
          }}
          className={isHoverSocket ? "fake hovered column" : "fake column"}
          style={{ width: `${leftFake === 0 ? fakeSize.size : leftFake}px` }}
        ></div>
      )}
      <div className={styles.paddingColumn} ref={columnRef}>
        <div
          style={{
            top: `${grabTask.isMove && grabTask.taskIndex === -1 && grabTask.columnIndex === columnIndex && grabTask.userId !== selfUserId ? grabTask.y - grabTask.yOffset : mouseMove.y - mouseMove.yOffset}px`,
            left: `${grabTask.isMove && grabTask.taskIndex === -1 && grabTask.columnIndex === columnIndex && grabTask.userId !== selfUserId ? grabTask.x - grabTask.xOffset : mouseMove.x - mouseMove.xOffset}px`,
            position:
              (grabTask.isMove &&
                grabTask.taskIndex === -1 &&
                grabTask.columnIndex === columnIndex) ||
              mouseMove.isPressed
                ? "fixed"
                : "unset",
            pointerEvents:
              (grabTask.isMove &&
                grabTask.taskIndex === -1 &&
                grabTask.columnIndex === columnIndex) ||
              mouseMove.isPressed
                ? "none"
                : "all",
            height:
              (grabTask.isMove &&
                grabTask.taskIndex === -1 &&
                grabTask.columnIndex === columnIndex) ||
              mouseMove.isPressed
                ? "min-content"
                : "100%",
            opacity:
              (grabTask.isMove &&
                grabTask.taskIndex === -1 &&
                grabTask.columnIndex === columnIndex) ||
              mouseMove.isPressed
                ? "0.8"
                : "1",
          }}
          className={styles.column}
        >
          <div className={isEdit ? styles.tittle : styles.normalTittle}>
            <div className={styles.tittleDiv}>{column.title}</div>
            {isEdit && (
              <IconButton
                onClick={() => removeColumn(columnIndex)}
                appearance="link"
                color="red"
                icon={<CloseIcon />}
              />
            )}
          </div>
          <div className={styles.tasks}>
            {columns[columnIndex].tasks.map((task, taskIndex) => (
              <TrelloTask
                key={`${taskIndex}${task.content}${task.timeEnd}${task.createdUserId}${task.createdUserId}${task.color}`}
                task={task}
                taskIndex={taskIndex}
                columnIndex={columnIndex}
              />
            ))}
            <ButtonAddTask
              columnIndex={columnIndex}
              taskLength={columns[columnIndex].tasks.length}
            />
          </div>
          <ModalAddTask />
        </div>
      </div>
      {(rightFake > 0 ||
        (grabTask.isMove &&
          fakeSize.taskIndex === -1 &&
          fakeSize.columnIndex === columnIndex &&
          fakeSize.side === "right" &&
          !fakeSize.isButtonAddTask)) && (
        <div
          onMouseEnter={() => {
            if (isMove) {
              socket?.emit(ClientEvents.hovered, true);
            }
          }}
          onMouseLeave={() => {
            if (isMove) {
              socket?.emit(ClientEvents.hovered, false);
            }
          }}
          className={isHoverSocket ? "fake hovered column" : "fake column"}
          style={{ width: `${rightFake === 0 ? fakeSize.size : rightFake}px` }}
        ></div>
      )}
    </div>
  );
}
