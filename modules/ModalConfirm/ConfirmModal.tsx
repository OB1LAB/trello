import { Button, Modal } from "rsuite";

const ConfirmModal = ({
  content,
  isOpen,
  setIsOpen,
  actionOnConfirm,
}: {
  content: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  actionOnConfirm: () => void;
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header className="modalHeader">
        <Modal.Title>Подтверждение действия</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody noWarp">{content}</Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          appearance="primary"
          color="green"
          onClick={() => {
            actionOnConfirm();
            setIsOpen(false);
          }}
        >
          Подтвердить
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

export default ConfirmModal;
