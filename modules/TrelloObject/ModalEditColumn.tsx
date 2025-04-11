import { Button, Input, Modal } from "rsuite";
import useTrelloStore from "../useTrelloStore/useTrelloStore";
import { useEffect, useState } from "react";

const ModalAddColumn = () => {
  const [title, setTitle] = useState<string>("");
  const [columns, isOpen, setIsOpen, editColumnAction, editColumnIndex] =
    useTrelloStore((store) => [
      store.columns,
      store.isModalEditColumn,
      store.setIsModalEditColumn,
      store.editColumn,
      store.editColumnIndex,
    ]);
  const editColumn = () => {
    if (title.length < 3) {
      return;
    }
    editColumnAction(title);
    setIsOpen(false);
  };
  useEffect(() => {
    if (isOpen && columns[editColumnIndex]) {
      setTitle(columns[editColumnIndex].title);
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
        <Modal.Title>Изменение столбца</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <Input
          value={title}
          onChange={setTitle}
          onPressEnter={editColumn}
          placeholder="Название столбца"
        />
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          appearance="primary"
          color="green"
          onClick={() => editColumn()}
          disabled={title.length < 3}
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

export default ModalAddColumn;
