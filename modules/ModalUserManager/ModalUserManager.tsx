import { Modal } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";
import Worker from "@/modules/ModalUserManager/Worker";
import CreateNewWorker from "@/modules/ModalUserManager/CreateNewWorker";
import styles from "./ModalUserManager.module.scss";

const ModalUserManager = () => {
  const [isOpen, setIsOpen] = useUserStore((store) => [
    store.isModalManageUsers,
    store.setIsModalManageUsers,
  ]);
  const users = useUserStore((store) => store.userList);
  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
    >
      <Modal.Header className="modalHeader">
        <Modal.Title>Управление пользователями</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBody">
        <CreateNewWorker />
        <div className={styles.workers}>
          {users.map((user) => {
            return <Worker user={user} key={user.value} />;
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUserManager;
