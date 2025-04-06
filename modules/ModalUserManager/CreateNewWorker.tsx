import styles from "@/modules/ModalUserManager/ModalUserManager.module.scss";
import { Button, Checkbox, Input } from "rsuite";
import { useState } from "react";
import useUserManagerStore from "@/modules/ModalUserManager/useUserManagerStore";

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
  return (
    <div className={styles.createWorker}>
      <Input
        value={createUserName}
        onChange={setCreateUserName}
        placeholder="Номер карты воркера"
      />
      <Input
        value={createUserPassword}
        onChange={setCreateUserPassword}
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
        loading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await createUser();
          setIsLoading(false);
        }}
      >
        Создать
      </Button>
    </div>
  );
};

export default CreateNewWorker;
