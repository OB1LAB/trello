import { Button, Input, Modal } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";
import styles from "./ModalAuth.module.scss";

const ModalAuth = () => {
  const [isOpen, setIsOpen] = useUserStore((store) => [
    store.isModalAuthOpen,
    store.setIsModalAuthOpen,
  ]);
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header className="modalHeader">
        <Modal.Title>Авторизоваться</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <Input placeholder="Номер карты" />
        <Input
          placeholder="CVV код"
          onPressEnter={console.log}
          type="password"
        />
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button appearance="primary" color="green">
          Логин
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

export default ModalAuth;
