"use client";
import styles from "./TrelloObject.module.scss";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import { Button } from "rsuite";
import TrelloColumn from "@/modules/TrelloColumn/TrelloColumn";
import ModalAddColumn from "@/modules/TrelloObject/ModalAddColumn";
import useUserStore from "@/modules/useUserStore/useUserStore";

export default function TrelloObject() {
  const isEdit = useUserStore((store) => store.isEdit);
  const [columns, setIsOpenModalAddColumn] = useTrelloStore((store) => [
    store.columns,
    store.setIsOpenModalAddColumn,
  ]);
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
