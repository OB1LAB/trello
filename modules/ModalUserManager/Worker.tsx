import { IUser } from "@/ifaces";
import { Button, Checkbox, Input } from "rsuite";
import styles from "./ModalUserManager.module.scss";
import { useState } from "react";
import useUserManagerStore from "@/modules/ModalUserManager/useUserManagerStore";

const Worker = ({ user }: { user: IUser }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(user.isAdmin);
  const [password, setPassword] = useState<string>("");
  const [passwordRetry, setPasswordRetry] = useState<string>("");
  const editUser = useUserManagerStore((store) => store.editUser);
  return (
    <div className={styles.worker}>
      <div className={styles.data}>Воркер: {user.label}</div>
      <div className={styles.row}>
        <Checkbox
          checked={isAdmin}
          onChange={(_, value) => setIsAdmin(value)}
          disabled={user.isAdmin}
        >
          Админ
        </Checkbox>
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          placeholder={"Новый CVV код"}
          disabled={user.isAdmin}
        />
        <Input
          value={passwordRetry}
          onChange={setPasswordRetry}
          type="password"
          placeholder={"Повторение CVV"}
          disabled={user.isAdmin}
        />
        <Button
          appearance="primary"
          color="blue"
          disabled={user.isAdmin}
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            if (
              await editUser(
                user.value,
                user.isAdmin,
                isAdmin,
                password,
                passwordRetry,
              )
            ) {
              setPassword("");
              setPasswordRetry("");
            }
            setIsLoading(false);
          }}
        >
          Изменить
        </Button>
      </div>
    </div>
  );
};

export default Worker;
