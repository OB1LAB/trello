import { Button, Modal, SelectPicker } from "rsuite";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import BodyAddTrello from "@/modules/ModalSelectTrello/BodyAddTrello";
import BodyEditTrello from "@/modules/ModalSelectTrello/BodyEditTrello";
import useUserStore from "@/modules/useUserStore/useUserStore";

const ModalSelectTrello = () => {
  const [selfUserId, isAdmin] = useUserStore((store) => [
    store.userId,
    store.isAdmin,
  ]);
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
  const [create, edit] = useSelectTrelloStore((store) => [
    store.create,
    store.edit,
  ]);
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
          placeholder="Нет трелло для отображения"
          locale={{
            searchPlaceholder: "Поиск...",
            noResultsText: "Ничего не найдено .-.",
          }}
          data={
            isAdmin ? selectData : selectData.filter((value) => value.value > 0)
          }
          value={selectedTrello}
          cleanable={false}
          onChange={setSelectedTrello}
        />
        {selectedTrello === -1 && isAdmin ? (
          <BodyAddTrello />
        ) : (
          selfUserId === trelloList[selectedTrello].createdUser && (
            <BodyEditTrello
              trelloId={selectedTrello}
              trelloName={trelloList[selectedTrello].trelloName}
            />
          )
        )}
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        {selectedTrello === -1 && isAdmin ? (
          <Button
            appearance="primary"
            color="green"
            disabled={trelloList[selectedTrello].trelloName.length < 3}
            onClick={create}
          >
            Добавить
          </Button>
        ) : (
          <Button
            appearance="primary"
            color="green"
            disabled={
              trelloList[selectedTrello].trelloName.length < 3 ||
              selfUserId !== trelloList[selectedTrello].createdUser
            }
            onClick={edit}
          >
            Изменить
          </Button>
        )}
        <Button
          appearance="primary"
          color="red"
          onClick={() => setIsOpen(false)}
        >
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSelectTrello;
