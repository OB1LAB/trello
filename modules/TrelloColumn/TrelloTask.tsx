import { ITask } from "@/ifaces";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { convertSecondToOutput } from "@/utils";

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
    <div>
      <div>Задача: {task.content}</div>
      <div>Заказчик: {users[task.createdUserId].label}</div>
      {task.executorUserId !== -1 && (
        <div>Исполнитель: {users[task.executorUserId].label}</div>
      )}
      <div>Создан: {moment(task.dateCreate).format("DD-MM-YYYY")}</div>
      {outputTime !== "" && <div>Осталось: {outputTime}</div>}
    </div>
  );
};

export default TrelloTask;
