import { Button, Modal, SelectPicker } from "rsuite";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import styles from "./ModalSelectTrello.module.scss";

const ModalSelectTrello = () => {
  const [isOpen, setIsOpen] = useSelectTrelloStore((store) => [
    store.isModal,
    store.setIsModal,
  ]);
  const selectData = useSelectTrelloStore((store) => store.selectData);
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header className="modalHeader">
        <Modal.Title>Выбрать доску</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <SelectPicker
          locale={{ searchPlaceholder: "Поиск..." }}
          data={selectData}
          // data={users}
          // value={executorId}
          // onChange={setExecutorId}
          placeholder="Исполнитель (Опционально)"
        />
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          appearance="primary"
          color="green"
          // onClick={() => addNewTask()}
          // disabled={content.length < 3}
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

export default ModalSelectTrello;
