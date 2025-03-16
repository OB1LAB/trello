import { ITask } from "@/ifaces";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { convertSecondToOutput } from "@/utils";
import styles from "./TrelloColumn.module.scss";
import LongArrowRight from "@rsuite/icons/legacy/LongArrowRight";

const TrelloTask = ({ task }: { task: ITask }) => {
  const [outputTime, setOutputTime] = useState<string>(
    convertSecondToOutput(task),
  );
  const users = useUserStore((store) => store.userListId);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setOutputTime(convertSecondToOutput(task));
    }, 500);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className={styles.task}>
      <div className={styles.taskContent}>{task.content}</div>
      <div className={styles.taskData}>
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
  );
};

export default TrelloTask;
