"use client";
import styles from "./TrelloObject.module.scss";
import useTrelloStore from "@/modules/useTrelloStore/useTrelloStore";
import { Button } from "rsuite";
import TrelloColumn from "@/modules/TrelloColumn/TrelloColumn";
import ModalAddColumn from "@/modules/TrelloObject/ModalAddColumn";

export default function TrelloObject() {
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
      <div className={styles.addColumn}>
        <Button
          appearance="subtle"
          onClick={() => setIsOpenModalAddColumn(true)}
          disabled={columns.length >= 6}
        >
          +
        </Button>
      </div>
      <ModalAddColumn />
    </div>
  );
}
