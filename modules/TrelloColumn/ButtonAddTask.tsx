import styles from "@/modules/TrelloColumn/TrelloColumn.module.scss";
import { Button } from "rsuite";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import { useEffect, useRef, useState } from "react";

const ButtonAddTask = ({
  columnIndex,
  taskLength,
}: {
  columnIndex: number;
  taskLength: number;
}) => {
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
      selectedMoveTask === -1
    ) {
      return;
    }
    setUpperFake(105);
  };

  const onMouseUnClick = () => {
    if (upperFake > 0) {
      moveTask(selectedMoveColumn, columnIndex, selectedMoveTask, taskLength);
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
  }, [upperFake]);

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
  }, [buttonRef, isMove, selectedMoveTask]);
  return (
    <div
      onMouseLeave={() => {
        if (upperFake > 0) {
          setUpperFake(0);
        }
      }}
    >
      {upperFake > 0 && (
        <div className="fake" style={{ height: `${upperFake}px` }} />
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
