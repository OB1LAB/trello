import { Button, Input, Modal } from "rsuite";
import useTrelloStore from "../useTrelloStore/useTrelloStore";
import { useState } from "react";
import { setTimeout } from "node:timers";

const ModalAddColumn = () => {
  const [title, setTitle] = useState<string>("");
  const [isOpen, setIsOpen, addColumn] = useTrelloStore((store) => [
    store.isOpenModalAddColumn,
    store.setIsOpenModalAddColumn,
    store.addColumn,
  ]);
  const addNewColumn = () => {
    if (title.length < 3) {
      return;
    }
    addColumn(title);
    setIsOpen(false);
    setTimeout(() => {
      setTitle("");
    }, 500);
  };
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>Добавление столбца</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <Input
          value={title}
          onChange={setTitle}
          onPressEnter={addNewColumn}
          placeholder="Название столбца"
        />
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          appearance="primary"
          color="green"
          onClick={() => addNewColumn()}
          disabled={title.length < 3}
        >
          Добавить
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

export default ModalAddColumn;
