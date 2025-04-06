import { IMouseMove, ITask } from "@/ifaces";
import { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { convertSecondToOutput } from "@/utils";
import styles from "./TrelloColumn.module.scss";
import LongArrowRight from "@rsuite/icons/legacy/LongArrowRight";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";

const TrelloTask = ({
  task,
  taskIndex,
  columnIndex,
}: {
  task: ITask;
  taskIndex: number;
  columnIndex: number;
}) => {
  const taskRef = useRef<HTMLDivElement | null>(null);
  const [mouseMove, setMouseMove] = useState<IMouseMove>({
    x: 0,
    y: 0,
    xOffset: 0,
    yOffset: 0,
    isPressed: false,
  });
  const [taskPress, setTaskPress] = useState<boolean>(false);
  const [upperFake, setUpperFake] = useState<number>(0);
  const [underFake, setUnderFake] = useState<number>(0);
  const [outputTime, setOutputTime] = useState<string>(
    convertSecondToOutput(task),
  );
  const users = useUserStore((store) => store.userListId);
  const isMove = useTrelloStore((store) => store.isMove);
  const [selectedMoveColumn, selectedMoveTask] = useTrelloStore((store) => [
    store.selectedMoveColumn,
    store.selectedMoveTask,
  ]);
  const moveTask = useTrelloStore((store) => store.moveTask);
  const [setIsMove, setSelectedMoveTask, setSelectedMoveColumn] =
    useTrelloStore((store) => [
      store.setIsMove,
      store.setSelectedMoveTask,
      store.setSelectedMoveColumn,
    ]);

  const onMouseMove = (event: MouseEvent) => {
    if (
      mouseMove.isPressed ||
      (taskPress &&
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
    if (upperFake + underFake > 0) {
      if (upperFake > 0) {
        moveTask(selectedMoveColumn, columnIndex, selectedMoveTask, taskIndex);
      } else if (underFake > 0) {
        moveTask(
          selectedMoveColumn,
          columnIndex,
          selectedMoveTask,
          taskIndex + 1,
        );
      }
      setUpperFake(0);
      setUnderFake(0);
    }
    if (taskPress && event.button === 0) {
      if (mouseMove.x === event.clientX && mouseMove.y === event.clientY) {
        console.log("Клик по таску");
      }
      setMouseMove({
        ...mouseMove,
        x: event.clientX,
        y: event.clientY,
        isPressed: false,
      });
      setIsMove(false);
      setTaskPress(false);
      setSelectedMoveTask(-1);
      setSelectedMoveColumn(-1);
    }
  };

  const onMouseMoveCurrentTask = (event: MouseEvent) => {
    if (taskPress || !isMove || !taskRef.current || selectedMoveTask === -1) {
      return;
    }
    const percentMove = event.layerY / taskRef.current.clientHeight;
    if (
      percentMove <= 0.5 &&
      (taskIndex - selectedMoveTask !== 1 || columnIndex !== selectedMoveColumn)
    ) {
      setUpperFake(taskRef.current.clientHeight);
      setUnderFake(0);
    } else if (
      percentMove > 0.5 &&
      (taskIndex - selectedMoveTask !== -1 ||
        columnIndex !== selectedMoveColumn)
    ) {
      setUnderFake(taskRef.current.clientHeight);
      setUpperFake(0);
    }
  };

  const onFirstClick = (event: MouseEvent) => {
    // @ts-ignore
    if (event.target.className === styles.taskContent && event.button === 0) {
      setMouseMove({
        x: event.clientX,
        y: event.clientY,
        xOffset: event.layerX,
        yOffset: event.layerY,
        isPressed: false,
      });
      setTaskPress(true);
      setIsMove(true);
      setSelectedMoveTask(taskIndex);
      setSelectedMoveColumn(columnIndex);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOutputTime(convertSecondToOutput(task));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    addEventListener("mousemove", onMouseMove);
    addEventListener("mouseup", onMouseClick);
    return () => {
      removeEventListener("mousemove", onMouseMove);
      removeEventListener("mouseup", onMouseClick);
    };
  }, [mouseMove.isPressed, taskPress, upperFake, underFake]);

  useEffect(() => {
    if (taskRef && taskRef.current) {
      taskRef.current.addEventListener("mousemove", onMouseMoveCurrentTask);
      taskRef.current.addEventListener("mousedown", onFirstClick);
      return () => {
        if (taskRef.current) {
          taskRef.current.removeEventListener(
            "mousemove",
            onMouseMoveCurrentTask,
          );
          taskRef.current.removeEventListener("mousedown", onFirstClick);
        }
      };
    }
  }, [
    taskRef,
    isMove,
    mouseMove.isPressed,
    taskPress,
    underFake,
    upperFake,
    selectedMoveColumn,
    selectedMoveTask,
  ]);

  return (
    <div
      style={{
        zIndex: mouseMove.isPressed ? "13" : "12",
        pointerEvents: mouseMove.isPressed ? "none" : "all",
        position: mouseMove.isPressed ? "fixed" : "relative",
      }}
      onMouseLeave={() => {
        if (upperFake !== 0) {
          setUpperFake(0);
        }
        if (underFake !== 0) {
          setUnderFake(0);
        }
      }}
    >
      {upperFake !== 0 && isMove && (
        <div className="fake" style={{ height: `${upperFake}px` }}></div>
      )}
      <div
        style={{
          top: `${mouseMove.y - mouseMove.yOffset}px`,
          left: `${mouseMove.x - mouseMove.xOffset}px`,
          position: mouseMove.isPressed ? "fixed" : "unset",
        }}
      >
        <div
          className={styles.task}
          ref={taskRef}
          style={{
            opacity: mouseMove.isPressed ? "0.8" : "1",
          }}
        >
          <div
            className={styles.taskContent}
            style={{
              borderLeft: `3px solid ${task.color}`,
            }}
          >
            {task.content}
          </div>
          <div
            style={{
              borderLeft: `3px solid ${task.color}`,
            }}
            className={styles.taskData}
          >
            <div className={styles.space}>
              <div>{users[task.createdUserId].label}</div>
              {task.executorUserId !== -1 &&
                task.executorUserId !== task.createdUserId && (
                  <>
                    <LongArrowRight />
                    <div>{users[task.executorUserId].label}</div>
                  </>
                )}
            </div>
            <div className={styles.space}>
              <div>{moment(task.dateCreate).format("DD-MM-YYYY")}</div>
              {outputTime !== "" && (
                <>
                  <LongArrowRight />
                  <div className={styles.outputTime}>{outputTime}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {underFake !== 0 && isMove && (
        <div className="fake" style={{ height: `${underFake}px` }}></div>
      )}
    </div>
  );
};

export default TrelloTask;
