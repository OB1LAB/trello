import { Button, Input, Modal } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";
import styles from "./ModalAuth.module.scss";

const ModalAuth = () => {
  const [isOpen, setIsOpen] = useUserStore((store) => [
    store.isModalAuthOpen,
    store.setIsModalAuthOpen,
  ]);
  const [login, setLogin] = useUserStore((store) => [
    store.inputUsername,
    store.setInputUsername,
  ]);
  const [password, setPassword] = useUserStore((store) => [
    store.inputPassword,
    store.setInputPassword,
  ]);
  const toLogin = useUserStore((store) => store.login);
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
        <Input placeholder="Номер карты" value={login} onChange={setLogin} />
        <Input
          placeholder="CVV код"
          value={password}
          onChange={setPassword}
          onPressEnter={toLogin}
          type="password"
        />
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button appearance="primary" color="green" onClick={toLogin}>
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
