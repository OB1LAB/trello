"use client";
import { IColumn } from "@/ifaces";
import { Button, IconButton } from "rsuite";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import styles from "./TrelloColumn.module.scss";
import CloseIcon from "@rsuite/icons/Close";
import ModalAddTask from "@/modules/TrelloColumn/ModalAddTask";
import TrelloTask from "@/modules/TrelloColumn/TrelloTask";

export default function TrelloColumn({
  column,
  columnIndex,
}: {
  column: IColumn;
  columnIndex: number;
}) {
  const [removeColumn, setIsOpenModalAddTask, columns] = useTrelloStore(
    (store) => [store.removeColumn, store.setIsOpenModalAddTask, store.columns],
  );
  return (
    <div className={styles.column}>
      <div className={styles.tittle}>
        <div>{column.title}</div>
        <IconButton
          onClick={() => removeColumn(columnIndex)}
          appearance="link"
          color="red"
          icon={<CloseIcon />}
        />
      </div>
      <div className={styles.tasks}>
        {columns[columnIndex].tasks.map((task, taskIndex) => (
          <TrelloTask key={taskIndex} task={task} />
        ))}
        <Button
          appearance="primary"
          onClick={() => setIsOpenModalAddTask(columnIndex, true)}
          className={styles.newTask}
        >
          Новая задача
        </Button>
      </div>
      <ModalAddTask />
    </div>
  );
}
