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

export default function TrelloColumn({
  column,
  columnIndex,
}: {
  column: IColumn;
  columnIndex: number;
}) {
  const columnRef = useRef<null | HTMLDivElement>(null);
  const isEdit = useUserStore((store) => store.isEdit);
  const [columnPress, setColumnPress] = useState<boolean>(false);
  const [leftFake, setLeftFake] = useState<number>(0);
  const [rightFake, setRightFake] = useState<number>(0);
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
  const [selectedMoveTask, selectedMoveColumn, setSelectedMoveColumn] =
    useTrelloStore((store) => [
      store.selectedMoveTask,
      store.selectedMoveColumn,
      store.setSelectedMoveColumn,
    ]);
  const [removeColumn, columns] = useTrelloStore((store) => [
    store.removeColumn,
    store.columns,
  ]);

  const onFirstClick = (event: MouseEvent) => {
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
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (
      mouseMove.isPressed ||
      (columnPress &&
        (mouseMove.x !== event.clientX || mouseMove.y !== event.clientY))
    ) {
      setMouseMove({
        ...mouseMove,
        x: event.clientX,
        y: event.clientY,
        isPressed: true,
      });
    }
  };

  const onMouseClick = (event: MouseEvent) => {
    if (leftFake + rightFake > 0) {
      if (leftFake > 0) {
        moveColumn(selectedMoveColumn, columnIndex);
      } else if (rightFake > 0) {
        moveColumn(selectedMoveColumn, columnIndex + 1);
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
      setIsMove(false);
      setColumnPress(false);
      setSelectedMoveColumn(-1);
    }
  };

  const onMouseMoveCurrentTask = (event: MouseEvent) => {
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
    if (percentMove <= 0.5 && columnIndex - selectedMoveColumn !== 1) {
      setLeftFake(300);
      setRightFake(0);
    } else if (percentMove > 0.5 && columnIndex - selectedMoveColumn !== -1) {
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
  }, [mouseMove.isPressed, columnPress, leftFake, rightFake]);

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
  }, [columnRef, isMove, mouseMove.isPressed, columnPress, selectedMoveColumn]);

  return (
    <div
      style={{
        zIndex: mouseMove.isPressed ? "20" : "auto",
      }}
      className={styles.fakeColumn}
      onMouseLeave={() => {
        if (leftFake !== 0) {
          setLeftFake(0);
        }
        if (rightFake !== 0) {
          setRightFake(0);
        }
      }}
    >
      {leftFake > 0 && (
        <div className="fake column" style={{ width: `${leftFake}px` }}></div>
      )}
      <div className={styles.paddingColumn} ref={columnRef}>
        <div
          style={{
            top: `${mouseMove.y - mouseMove.yOffset}px`,
            left: `${mouseMove.x - mouseMove.xOffset}px`,
            position: mouseMove.isPressed ? "fixed" : "unset",
            pointerEvents: mouseMove.isPressed ? "none" : "all",
            height: mouseMove.isPressed ? "min-content" : "100%",
            opacity: mouseMove.isPressed ? "0.8" : "1",
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
      {rightFake > 0 && (
        <div className="fake column" style={{ width: `${rightFake}px` }}></div>
      )}
    </div>
  );
}
