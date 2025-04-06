"use client";
import styles from "./TrelloObject.module.scss";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import { Button } from "rsuite";
import TrelloColumn from "@/modules/TrelloColumn/TrelloColumn";
import ModalAddColumn from "@/modules/TrelloObject/ModalAddColumn";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { useEffect } from "react";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";

export default function TrelloObject({ trelloId }: { trelloId: number }) {
  const [trelloList, setSelectedTrello] = useSelectTrelloStore((store) => [
    store.trelloList,
    store.setSelectedTrello,
  ]);
  const isEdit = useUserStore((store) => store.isEdit);
  const [columns, setIsOpenModalAddColumn, setColumns] = useTrelloStore(
    (store) => [store.columns, store.setIsOpenModalAddColumn, store.setColumns],
  );
  useEffect(() => {
    if (Object.keys(trelloList).includes(trelloId.toString())) {
      setSelectedTrello(trelloId);
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
    </div>
  );
}
