import styles from "@/modules/TrelloColumn/TrelloColumn.module.scss";
import { Button } from "rsuite";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import { useEffect, useRef, useState } from "react";
import useUserStore from "@/modules/useUserStore/useUserStore";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";
import { ClientEvents } from "@/consts";

const ButtonAddTask = ({
  columnIndex,
  taskLength,
}: {
  columnIndex: number;
  taskLength: number;
}) => {
  const selfUserId = useUserStore((store) => store.userId);
  const socket = useSocketStore((store) => store.socket);
  const grabTask = useTrelloStore((store) => store.grabTask);
  const isHoverSocket = useTrelloStore((store) => store.isHoverSocket);
  const fakeSize = useTrelloStore((store) => store.fakeSize);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [upperFake, setUpperFake] = useState<number>(0);
  const [selectedMoveTask, selectedMoveColumn] = useTrelloStore((store) => [
    store.selectedMoveTask,
    store.selectedMoveColumn,
  ]);
  const [isMove, setIsOpenModalAddTask] = useTrelloStore((store) => [
    store.isMove,
    store.setIsOpenModalAddTask,
  ]);
  const [setSelectedMoveTask, setSelectedMoveColumn] = useTrelloStore(
    (store) => [store.setSelectedMoveTask, store.setSelectedMoveColumn],
  );
  const moveTask = useTrelloStore((store) => store.moveTask);

  const onMouseMoveCurrentTask = () => {
    if (
      !isMove ||
      !buttonRef.current ||
      (selectedMoveColumn === columnIndex &&
        taskLength - selectedMoveTask === 1) ||
      selectedMoveTask === -1 ||
      (grabTask.isMove && grabTask.userId !== selfUserId) ||
      upperFake !== 0
    ) {
      return;
    }
    socket?.emit(ClientEvents.fakeSize, -1, columnIndex, "top", 105, true);
    setUpperFake(105);
  };

  const onMouseUnClick = () => {
    if (upperFake > 0) {
      moveTask(selectedMoveColumn, columnIndex, selectedMoveTask, taskLength);
      socket?.emit(ClientEvents.fakeSize, -1, columnIndex, "top", 0, true);
      setUpperFake(0);
      setSelectedMoveTask(-1);
      setSelectedMoveColumn(-1);
    }
  };

  useEffect(() => {
    addEventListener("mouseup", onMouseUnClick);
    return () => {
      removeEventListener("mouseup", onMouseUnClick);
    };
  }, [upperFake, grabTask.isMove]);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.addEventListener("mousemove", onMouseMoveCurrentTask);
      return () => {
        if (buttonRef.current) {
          buttonRef.current.removeEventListener(
            "mousemove",
            onMouseMoveCurrentTask,
          );
        }
      };
    }
  }, [buttonRef, isMove, selectedMoveTask, grabTask.isMove]);
  return (
    <div
      onMouseLeave={() => {
        if (upperFake > 0) {
          socket?.emit(ClientEvents.fakeSize, -1, columnIndex, "top", 0, true);
          setUpperFake(0);
        }
      }}
    >
      {(upperFake > 0 ||
        (grabTask.isMove &&
          fakeSize.taskIndex === -1 &&
          fakeSize.columnIndex === columnIndex &&
          fakeSize.isButtonAddTask &&
          fakeSize.side === "top")) && (
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
          className={isHoverSocket ? "fake hovered" : "fake"}
          style={{ height: `${upperFake === 0 ? fakeSize.size : upperFake}px` }}
        />
      )}
      <Button
        appearance="primary"
        ref={buttonRef}
        onClick={() => setIsOpenModalAddTask(columnIndex, true)}
        className={styles.newTask}
      >
        Новая задача
      </Button>
    </div>
  );
};

export default ButtonAddTask;
