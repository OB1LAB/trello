"use client";
import styles from "./TrelloObject.module.scss";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import { Button } from "rsuite";
import TrelloColumn from "@/modules/TrelloColumn/TrelloColumn";
import ModalAddColumn from "@/modules/TrelloObject/ModalAddColumn";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { useEffect } from "react";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import UserCursor from "@/modules/TrelloColumn/UserCursor";
import ConfirmModal from "@/modules/ModalConfirm/ConfirmModal";
import ModalEditColumn from "@/modules/TrelloObject/ModalEditColumn";
import ModalEditTask from "@/modules/TrelloColumn/ModalEditTask";

export default function TrelloObject({ trelloId }: { trelloId: number }) {
  const [trelloList, setSelectedTrello, selectedTrello] = useSelectTrelloStore(
    (store) => [
      store.trelloList,
      store.setSelectedTrello,
      store.selectedTrello,
    ],
  );
  const isEdit = useUserStore((store) => store.isEdit);
  const [columns, setIsOpenModalAddColumn, setColumns] = useTrelloStore(
    (store) => [store.columns, store.setIsOpenModalAddColumn, store.setColumns],
  );
  const [removeColumnOrTask, isModalConfirmDelete, setIsModalConfirmDelete] =
    useTrelloStore((store) => [
      store.removeColumnOrTask,
      store.isModalConfirmDelete,
      store.setIsModalConfirmDelete,
    ]);
  const [selectedRemoveColumnIndex, selectedRemoveTaskIndex] = useTrelloStore(
    (store) => [store.selectedRemoveColumnIndex, store.selectedRemoveTaskIndex],
  );
  useEffect(() => {
    if (Object.keys(trelloList).includes(trelloId.toString())) {
      if (selectedTrello !== trelloId) {
        setSelectedTrello(trelloId);
      }
      setColumns(trelloList[trelloId].trello);
    }
  }, []);
  if (!Object.keys(trelloList).includes(trelloId.toString())) {
    return <div>Трелло с ID {trelloId} не найден</div>;
  }
  return (
    <div className={styles.columns}>
      {columns.map((column, columnIndex) => {
        return (
          <TrelloColumn
            key={columnIndex}
            column={column}
            columnIndex={columnIndex}
          />
        );
      })}
      {isEdit && (
        <Button
          appearance="primary"
          color="green"
          className={styles.addColumn}
          onClick={() => setIsOpenModalAddColumn(true)}
          disabled={columns.length >= 5}
        >
          +
        </Button>
      )}
      <ModalAddColumn />
      <ModalEditColumn />
      <ModalEditTask />
      <ConfirmModal
        content={
          selectedRemoveTaskIndex === -1
            ? `Вы точно хотите удалить столбец ${columns[selectedRemoveColumnIndex] !== undefined ? `"${columns[selectedRemoveColumnIndex].title}" ?` : ""}`
            : `Вы точно хотите удалить задание ${columns[selectedRemoveColumnIndex].tasks[selectedRemoveTaskIndex] !== undefined ? `"${columns[selectedRemoveColumnIndex].tasks[selectedRemoveTaskIndex].content}" ?` : ""}`
        }
        isOpen={isModalConfirmDelete}
        setIsOpen={setIsModalConfirmDelete}
        actionOnConfirm={removeColumnOrTask}
      />
      <UserCursor />
    </div>
  );
}
