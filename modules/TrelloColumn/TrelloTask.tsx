import { IMouseMove, ITask } from "@/ifaces";
import { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { convertSecondToOutput } from "@/utils";
import styles from "./TrelloColumn.module.scss";
import LongArrowRight from "@rsuite/icons/legacy/LongArrowRight";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";
import { ClientEvents } from "@/consts";

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
  const selfUserId = useUserStore((store) => store.userId);
  const [mouseMove, setMouseMove] = useState<IMouseMove>({
    x: 0,
    y: 0,
    xOffset: 0,
    yOffset: 0,
    isPressed: false,
  });
  const [lastTimeSend, setLastTimeSend] = useState<number>(
    new Date().getTime(),
  );
  const isHoverSocket = useTrelloStore((store) => store.isHoverSocket);
  const fakeSize = useTrelloStore((store) => store.fakeSize);
  const socket = useSocketStore((store) => store.socket);
  const grabTask = useTrelloStore((store) => store.grabTask);
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
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
    if (
      mouseMove.isPressed ||
      (taskPress &&
        (mouseMove.x !== event.clientX || mouseMove.y !== event.clientY))
    ) {
      const nowTime = new Date().getTime();
      if (nowTime - lastTimeSend > 16) {
        socket?.emit(
          ClientEvents.grabTask,
          taskIndex,
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
    if (upperFake + underFake > 0) {
      if (upperFake > 0) {
        moveTask(selectedMoveColumn, columnIndex, selectedMoveTask, taskIndex);
        socket?.emit(ClientEvents.fakeSize, -1, -1, "top", 0, false);
      } else if (underFake > 0) {
        moveTask(
          selectedMoveColumn,
          columnIndex,
          selectedMoveTask,
          taskIndex + 1,
        );
        socket?.emit(ClientEvents.fakeSize, -1, -1, "bottom", 0, false);
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
      socket?.emit(
        ClientEvents.grabTask,
        taskIndex,
        columnIndex,
        mouseMove.xOffset,
        mouseMove.yOffset,
        event.clientX,
        event.clientY,
        false,
      );
      setIsMove(false);
      setTaskPress(false);
      setSelectedMoveTask(-1);
      setSelectedMoveColumn(-1);
    }
  };

  const onMouseMoveCurrentTask = (event: MouseEvent) => {
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
    if (taskPress || !isMove || !taskRef.current || selectedMoveTask === -1) {
      return;
    }
    const percentMove = event.layerY / taskRef.current.clientHeight;
    if (
      percentMove <= 0.5 &&
      (taskIndex - selectedMoveTask !== 1 ||
        columnIndex !== selectedMoveColumn) &&
      upperFake === 0 &&
      selectedMoveTask !== -1
    ) {
      socket?.emit(
        ClientEvents.fakeSize,
        taskIndex,
        columnIndex,
        "top",
        taskRef.current.clientHeight,
        false,
      );
      setUpperFake(taskRef.current.clientHeight);
      setUnderFake(0);
    } else if (
      percentMove > 0.5 &&
      (taskIndex - selectedMoveTask !== -1 ||
        columnIndex !== selectedMoveColumn) &&
      underFake === 0 &&
      selectedMoveTask !== -1
    ) {
      socket?.emit(
        ClientEvents.fakeSize,
        taskIndex,
        columnIndex,
        "bottom",
        taskRef.current.clientHeight,
        false,
      );
      setUnderFake(taskRef.current.clientHeight);
      setUpperFake(0);
    }
  };

  const onFirstClick = (event: MouseEvent) => {
    if (grabTask.isMove && grabTask.userId !== selfUserId) {
      return;
    }
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
  }, [
    mouseMove.isPressed,
    lastTimeSend,
    taskPress,
    upperFake,
    underFake,
    grabTask.isMove,
  ]);

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
    grabTask.isMove,
  ]);

  return (
    <div
      style={{
        zIndex:
          (grabTask.isMove &&
            grabTask.taskIndex === taskIndex &&
            grabTask.columnIndex === columnIndex) ||
          mouseMove.isPressed
            ? "13"
            : "12",
        pointerEvents:
          (grabTask.isMove &&
            grabTask.taskIndex === taskIndex &&
            grabTask.columnIndex === columnIndex) ||
          mouseMove.isPressed
            ? "none"
            : "all",
        position:
          (grabTask.isMove &&
            grabTask.taskIndex === taskIndex &&
            grabTask.columnIndex === columnIndex) ||
          mouseMove.isPressed
            ? "fixed"
            : "relative",
      }}
      onMouseLeave={() => {
        if (upperFake !== 0) {
          setUpperFake(0);
          socket?.emit(ClientEvents.fakeSize, -1, -1, "top", 0, false);
        }
        if (underFake !== 0) {
          socket?.emit(ClientEvents.fakeSize, -1, -1, "bottom", 0, false);
          setUnderFake(0);
        }
      }}
    >
      {((upperFake !== 0 && isMove) ||
        (grabTask.isMove &&
          fakeSize.taskIndex === taskIndex &&
          fakeSize.columnIndex === columnIndex &&
          fakeSize.side === "top")) && (
        <div
          className={isHoverSocket ? "fake hovered" : "fake"}
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
          style={{
            height: `${upperFake !== 0 && isMove ? upperFake : fakeSize.size}px`,
          }}
        ></div>
      )}
      <div
        style={{
          top: `${grabTask.isMove && grabTask.taskIndex === taskIndex && grabTask.columnIndex === columnIndex && grabTask.userId !== selfUserId ? grabTask.y - grabTask.yOffset : mouseMove.y - mouseMove.yOffset}px`,
          left: `${grabTask.isMove && grabTask.taskIndex === taskIndex && grabTask.columnIndex === columnIndex && grabTask.userId !== selfUserId ? grabTask.x - grabTask.xOffset : mouseMove.x - mouseMove.xOffset}px`,
          position:
            (grabTask.isMove &&
              grabTask.taskIndex === taskIndex &&
              grabTask.columnIndex === columnIndex) ||
            mouseMove.isPressed
              ? "fixed"
              : "unset",
        }}
      >
        <div
          className={styles.task}
          ref={taskRef}
          style={{
            opacity:
              (grabTask.isMove &&
                grabTask.taskIndex === taskIndex &&
                grabTask.columnIndex === columnIndex) ||
              mouseMove.isPressed
                ? "0.8"
                : "1",
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
      {((underFake !== 0 && isMove) ||
        (grabTask.isMove &&
          fakeSize.taskIndex === taskIndex &&
          fakeSize.columnIndex === columnIndex &&
          fakeSize.side === "bottom")) && (
        <div
          className={isHoverSocket ? "fake hovered" : "fake"}
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
          style={{
            height: `${underFake !== 0 && isMove ? underFake : fakeSize.size}px`,
          }}
        ></div>
      )}
    </div>
  );
};

export default TrelloTask;
