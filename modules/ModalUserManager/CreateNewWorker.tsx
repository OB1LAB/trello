import styles from "@/modules/ModalUserManager/ModalUserManager.module.scss";
import { Button, Checkbox, Input } from "rsuite";
import { useState } from "react";
import useUserManagerStore from "@/modules/ModalUserManager/useUserManagerStore";
import { toast } from "react-toastify";

const CreateNewWorker = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createUserName, setCreateUserName] = useUserManagerStore((store) => [
    store.createUserName,
    store.setCreateUserName,
  ]);
  const [createUserPassword, setCreateUserPassword] = useUserManagerStore(
    (store) => [store.createUserPassword, store.setCreateUserPassword],
  );
  const [createUserIsAdmin, setCreateUserIsAdmin] = useUserManagerStore(
    (store) => [store.createUserIsAdmin, store.setCreateUserIsAdmin],
  );
  const createUser = useUserManagerStore((store) => store.createUser);
  const actCreateUser = async () => {
    if (createUserName.length < 3 || createUserPassword.length < 3) {
      let msgError = "";
      if (createUserName.length < 3 && createUserPassword.length < 3) {
        msgError = "Длина номеры карты и CVV кода воркера меньше 3 символов";
      } else if (createUserName.length < 3) {
        msgError = "Длина номеры карты меньше 3 символов";
      } else {
        msgError = "Длина CVV кода меньше 3 символов";
      }
      return toast(msgError, {
        // @ts-ignore
        render: msgError,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return;
    }
    setIsLoading(true);
    await createUser();
    setIsLoading(false);
  };
  return (
    <div className={styles.createWorker}>
      <Input
        value={createUserName}
        onChange={setCreateUserName}
        onPressEnter={actCreateUser}
        placeholder="Номер карты воркера"
      />
      <Input
        value={createUserPassword}
        onChange={setCreateUserPassword}
        onPressEnter={actCreateUser}
        type="password"
        placeholder="CVV код воркера"
      />
      <Checkbox
        checked={createUserIsAdmin}
        onChange={(_, value) => setCreateUserIsAdmin(value)}
      >
        Админ
      </Checkbox>
      <Button
        appearance="primary"
        color="green"
        disabled={createUserName.length < 3 || createUserPassword.length < 3}
        loading={isLoading}
        onClick={actCreateUser}
      >
        Создать
      </Button>
    </div>
  );
};

export default CreateNewWorker;
