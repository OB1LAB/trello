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
}: {
  task: ITask;
  taskIndex: number;
}) => {
  const taskRef = useRef<HTMLDivElement | null>(null);
  const [mouseMove, setMouseMove] = useState<IMouseMove>({
    x: 0,
    y: 0,
    xOffset: 0,
    yOffset: 0,
    isPressed: false,
  });
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
  const [setIsMove, setSelectedMoveTask] = useTrelloStore((store) => [
    store.setIsMove,
    store.setSelectedMoveTask,
  ]);

  const onMouseMove = (event: MouseEvent) => {
    if (mouseMove.isPressed) {
      setMouseMove({
        x: event.clientX,
        y: event.clientY,
        xOffset: -(mouseMove.xOffset + mouseMove.x - event.clientX),
        yOffset: -(mouseMove.yOffset + mouseMove.y - event.clientY),
        isPressed: true,
      });
    }
  };

  const onMouseClick = (event: MouseEvent) => {
    if (mouseMove.isPressed && event.button === 0) {
      setMouseMove({
        x: event.clientX,
        y: event.clientY,
        xOffset: 0,
        yOffset: 0,
        isPressed: false,
      });
      setIsMove(false);
      setSelectedMoveTask(-1);
    }
  };

  const onMouseMoveCurrentTask = (event: MouseEvent) => {
    if (mouseMove.isPressed || !isMove || !taskRef.current) {
      return;
    }
    const percentMove = event.layerY / taskRef.current.clientHeight;
    if (
      percentMove <= 0.5 &&
      taskIndex - selectedMoveTask !== 1 &&
      upperFake === 0
    ) {
      setUpperFake(taskRef.current.clientHeight - 40);
      if (underFake !== 0) {
        setUnderFake(0);
      }
    } else if (
      percentMove > 0.5 &&
      taskIndex - selectedMoveTask !== -1 &&
      underFake === 0
    ) {
      setUnderFake(taskRef.current.clientHeight - 40);
      if (upperFake !== 0) {
        setUpperFake(0);
      }
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
  }, [mouseMove.isPressed]);

  useEffect(() => {
    if (taskRef && taskRef.current) {
      taskRef.current.addEventListener("mousemove", onMouseMoveCurrentTask);
      return () => {
        if (taskRef.current) {
          taskRef.current.removeEventListener(
            "mousemove",
            onMouseMoveCurrentTask,
          );
        }
      };
    }
  }, [
    taskRef,
    isMove,
    mouseMove.isPressed,
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
      {upperFake !== 0 && (
        <div
          style={{ height: upperFake }}
          // onMouseLeave={() => setUpperFake(0)}
        ></div>
      )}
      <div
        style={{
          transform: `translate3d(${mouseMove.xOffset}px, ${mouseMove.yOffset}px, 0px)`,
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
            onMouseDown={(e) => {
              setMouseMove({
                x: e.clientX,
                y: e.clientY,
                xOffset: 0,
                yOffset: 0,
                isPressed: true,
              });
              setIsMove(true);
              setSelectedMoveTask(taskIndex);
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
              {task.executorUserId !== -1 && (
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
      {underFake !== 0 && (
        <div
          style={{ height: underFake }}
          // onMouseLeave={() => setUnderFake(0)}
        ></div>
      )}
    </div>
  );
};

export default TrelloTask;
