import { Button, DatePicker, Input, Modal, SelectPicker } from "rsuite";
import useTrelloStore from "../useTrelloStore/useTrelloStore";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import styles from "./TrelloColumn.module.scss";
import moment from "moment/moment";
import { ISelectPickerData } from "@/ifaces";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import useUserStore from "@/modules/useUserStore/useUserStore";

const ModalEditTask = () => {
  const [selectedColor, setSelectedColor] = useState<string>("#f0f");
  const [content, setContent] = useState<string>("");
  const [executorId, setExecutorId] = useState<null | number>(null);
  const [dateEnd, setDateEnd] = useState<null | Date>(null);
  const [trelloList, selectedTrello] = useSelectTrelloStore((store) => [
    store.trelloList,
    store.selectedTrello,
  ]);
  const [selfUserId, usersId] = useUserStore((store) => [
    store.userId,
    store.userListId,
  ]);
  const [users, setUsers] = useState<ISelectPickerData[]>([]);
  const [columns, isOpen, setIsOpen, editTask, editColumnIndex, editTaskIndex] =
    useTrelloStore((store) => [
      store.columns,
      store.isModalEditTask,
      store.setIsModalEditTask,
      store.editTask,
      store.editColumnIndex,
      store.editTaskIndex,
    ]);
  const editCurrentTask = () => {
    if (content.length < 3) {
      return;
    }
    editTask(
      executorId ? executorId : -1,
      dateEnd
        ? ~~(
            (dateEnd?.getTime() -
              columns[editColumnIndex].tasks[
                editTaskIndex
              ].dateCreate.getTime()) /
            1000
          )
        : -1,
      content,
      selectedColor,
    );
    setIsOpen(false);
  };
  useEffect(() => {
    if (
      isOpen &&
      columns[editColumnIndex] &&
      columns[editColumnIndex].tasks[editTaskIndex]
    ) {
      setSelectedColor(columns[editColumnIndex].tasks[editTaskIndex].color);
      setContent(columns[editColumnIndex].tasks[editTaskIndex].content);
      setExecutorId(
        columns[editColumnIndex].tasks[editTaskIndex].executorUserId,
      );
      if (columns[editColumnIndex].tasks[editTaskIndex].timeEnd > 0) {
        setDateEnd(
          moment(
            columns[editColumnIndex].tasks[editTaskIndex].timeEnd * 1000 +
              columns[editColumnIndex].tasks[
                editTaskIndex
              ].dateCreate.getTime(),
          ).toDate(),
        );
      }
      if (Object.keys(trelloList).includes(selectedTrello.toString())) {
        setUsers(
          [
            ...trelloList[selectedTrello].accessUsers,
            trelloList[selectedTrello].createdUser,
          ]
            .filter((value) => value !== selfUserId)
            .map((value) => {
              return {
                label: usersId[value].label,
                value,
              };
            }),
        );
      }
    }
  }, [isOpen]);
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header className="modalHeader">
        <Modal.Title>Изменение задачи</Modal.Title>
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
              onPressEnter={editCurrentTask}
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
                format="dd-MM-yyy"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          appearance="primary"
          color="green"
          onClick={() => editCurrentTask()}
          disabled={content.length < 3}
        >
          Изменить
        </Button>
        <Button
          appearance="primary"
          color="red"
          onClick={() => setIsOpen(false)}
        >
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditTask;
