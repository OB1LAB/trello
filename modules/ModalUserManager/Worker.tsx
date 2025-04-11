import { IUser } from "@/ifaces";
import { Button, Checkbox, Input } from "rsuite";
import styles from "./ModalUserManager.module.scss";
import { useState } from "react";
import useUserManagerStore from "@/modules/ModalUserManager/useUserManagerStore";
import { toast } from "react-toastify";

const Worker = ({ user }: { user: IUser }) => {
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(user.isAdmin);
  const [password, setPassword] = useState<string>("");
  const [passwordRetry, setPasswordRetry] = useState<string>("");
  const [editUser, disableUser] = useUserManagerStore((store) => [
    store.editUser,
    store.disableUser,
  ]);
  const actEditUser = async () => {
    setIsLoading(true);
    if (
      await editUser(user.value, user.isAdmin, isAdmin, password, passwordRetry)
    ) {
      setPassword("");
      setPasswordRetry("");
    }
    setIsLoading(false);
  };
  const actDeleteUser = async () => {
    if (name !== user.label) {
      return toast(
        "Вводимый номер карты не совпадает с номером карты воркера",
        {
          // @ts-ignore
          render: "Вводимый номер карты не совпадает с номером карты воркера",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        },
      );
    }
    setIsLoadingDelete(true);
    await disableUser(user.value);
    setIsLoadingDelete(false);
  };
  return (
    <div className={styles.worker}>
      <div className={styles.data}>
        <div>Воркер: {user.label}</div>
        {!user.isAdmin && (
          <div className={styles.delete}>
            <Input
              value={name}
              onChange={setName}
              onPressEnter={actDeleteUser}
              placeholder="Номер карты"
            />
            <Button
              appearance="primary"
              color="red"
              loading={isLoadingDelete}
              onClick={actDeleteUser}
              disabled={name !== user.label}
            >
              Удалить
            </Button>
          </div>
        )}
      </div>
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
          onPressEnter={actEditUser}
        />
        <Input
          value={passwordRetry}
          onChange={setPasswordRetry}
          type="password"
          placeholder={"Повторение CVV"}
          disabled={user.isAdmin}
          onPressEnter={actEditUser}
        />
        <Button
          appearance="primary"
          color="blue"
          disabled={user.isAdmin}
          loading={isLoading}
          onClick={actEditUser}
        >
          Изменить
        </Button>
      </div>
    </div>
  );
};

export default Worker;
