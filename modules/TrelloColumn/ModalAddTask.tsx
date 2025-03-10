import { Button, DatePicker, Input, Modal, SelectPicker } from "rsuite";
import useTrelloStore from "../useTrelloStore/useTrelloStore";
import { useState } from "react";
import { setTimeout } from "node:timers";
import useUserStore from "@/modules/useUserStore/useUserStore";
import styles from "./TrelloColumn.module.scss";

const ModalAddTask = () => {
  const [content, setContent] = useState<string>("");
  const [executorId, setExecutorId] = useState<null | number>(null);
  const [dateEnd, setDateEnd] = useState<null | Date>(null);
  const users = useUserStore((store) => store.userList);
  const [isOpen, setIsOpen, addTask] = useTrelloStore((store) => [
    store.isOpenModalAddTask,
    store.setIsOpenModalAddTask,
    store.addTask,
  ]);
  const addNewTask = () => {
    if (content.length < 3) {
      return;
    }
    addTask(
      executorId ? executorId : -1,
      dateEnd ? ~~((dateEnd?.getTime() - new Date().getTime()) / 1000) : -1,
      content,
    );
    setIsOpen(-1, false);
    setTimeout(() => {
      setContent("");
      setExecutorId(null);
      setDateEnd(null);
    }, 500);
  };
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(-1, false);
      }}
    >
      <Modal.Header>
        <Modal.Title>Добавление задачи</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <Input
          value={content}
          onChange={setContent}
          as="textarea"
          onPressEnter={addNewTask}
          placeholder="Задача"
        />
        <div className={styles.taskPicker}>
          <SelectPicker
            className={styles.pickUser}
            locale={{ searchPlaceholder: "Поиск..." }}
            data={users}
            value={executorId}
            onChange={setExecutorId}
            placeholder="Исполнитель (Опционально)"
          />
          <DatePicker
            isoWeek
            className={styles.date}
            value={dateEnd}
            onChange={setDateEnd}
            placeholder="Месяц-День-Год"
            format="MM-dd-yyy"
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          appearance="primary"
          color="green"
          onClick={() => addNewTask()}
          disabled={content.length < 3}
        >
          Добавить
        </Button>
        <Button
          appearance="primary"
          color="red"
          onClick={() => setIsOpen(-1, false)}
        >
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddTask;
