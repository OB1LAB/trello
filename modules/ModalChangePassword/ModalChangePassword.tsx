import { Button, Input, Modal } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";

const ModalChangePassword = () => {
  const [isOpen, setIsOpen] = useUserStore((store) => [
    store.isModalChangePassword,
    store.setIsModalChangePassword,
  ]);
  const [newPassword, setNewPassword] = useUserStore((store) => [
    store.newPassword,
    store.setNewPassword,
  ]);
  const [newPasswordRetype, setNewPasswordRetype] = useUserStore((store) => [
    store.newPasswordRetype,
    store.setNewPasswordRetype,
  ]);
  const changePassword = useUserStore((store) => store.changePassword);
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header className="modalHeader">
        <Modal.Title>Изменить пароль</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <Input
          id="password"
          type="password"
          placeholder="Новый CVV код"
          value={newPassword}
          onChange={setNewPassword}
        />
        <Input
          id="password"
          placeholder="Повторение нового CVV кода"
          value={newPasswordRetype}
          onChange={setNewPasswordRetype}
          onPressEnter={changePassword}
          type="password"
        />
      </Modal.Body>
      <Modal.Footer className="modalFooter">
        <Button
          disabled={newPassword !== newPasswordRetype || newPassword.length < 3}
          appearance="primary"
          color="green"
          onClick={changePassword}
        >
          Сменить
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

export default ModalChangePassword;
