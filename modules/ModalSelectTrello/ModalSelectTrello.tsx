import { Button, Modal, SelectPicker } from "rsuite";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import BodyEditTrello from "@/modules/ModalSelectTrello/BodyEditTrello";
import styles from "./ModalSelectTrello.module.scss";

const ModalSelectTrello = () => {
  const [isOpen, setIsOpen] = useSelectTrelloStore((store) => [
    store.isModal,
    store.setIsModal,
  ]);
  const [trelloList, selectData] = useSelectTrelloStore((store) => [
    store.trelloList,
    store.selectData,
  ]);
  const [selectedTrello, setSelectedTrello] = useSelectTrelloStore((store) => [
    store.selectedTrello,
    store.setSelectedTrello,
  ]);
  const create = useSelectTrelloStore((store) => store.create);
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
          locale={{
            searchPlaceholder: "Поиск...",
            noResultsText: "Ничего не найдено .-.",
          }}
          data={selectData}
          value={selectedTrello}
          cleanable={false}
          onChange={setSelectedTrello}
        />
        {selectedTrello === -1 && <BodyEditTrello />}
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        {selectedTrello === -1 && (
          <Button
            appearance="primary"
            color="green"
            disabled={trelloList[selectedTrello].trelloName.length < 3}
            onClick={async () => {
              await create();
            }}
          >
            Добавить
          </Button>
        )}
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
