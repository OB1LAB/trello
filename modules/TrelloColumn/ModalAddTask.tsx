import { Button, DatePicker, Input, Modal, SelectPicker } from "rsuite";
import useTrelloStore from "../useTrelloStore/useTrelloStore";
import { useState } from "react";
import { setTimeout } from "node:timers";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { SketchPicker } from "react-color";
import styles from "./TrelloColumn.module.scss";

const ModalAddTask = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#f0f");
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
      selectedColor,
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
      <Modal.Header className="modalHeader">
        <Modal.Title>Добавление задачи</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <div className={styles.contentInput}>
          <SketchPicker
            color={selectedColor}
            onChange={(color) => setSelectedColor(color.hex)}
          />
          <div className={styles.content}>
            <Input
              value={content}
              onChange={setContent}
              as="textarea"
              placeholder="Задача"
              onPressEnter={addNewTask}
            />
            <div className={styles.taskPicker}>
              <SelectPicker
                className={styles.pickUser}
                locale={{
                  searchPlaceholder: "Поиск...",
                  noResultsText: "Ничего не найдено .-.",
                }}
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
                placeholder="Месяц-День-Год (Опционально)"
                format="MM-dd-yyy"
              />
            </div>
          </div>
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
