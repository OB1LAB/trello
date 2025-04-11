import styles from "./ModalSelectTrello.module.scss";
import { Button, CheckPicker, Input } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import { useState } from "react";
import { toast } from "react-toastify";

const BodyEditTrello = ({
  trelloId,
  trelloName,
}: {
  trelloId: number;
  trelloName: string;
}) => {
  const users = useUserStore((store) => store.userList);
  const [confirmDisable, setConfirmDisable] = useState<string>("");
  const [newTrelloName, setNewTrelloName] = useSelectTrelloStore((store) => [
    store.newTrelloName,
    store.setNewTrelloName,
  ]);
  const [newUserList, setNewUserList] = useSelectTrelloStore((store) => [
    store.newUserList,
    store.setNewUserList,
  ]);
  const disable = useSelectTrelloStore((store) => store.disable);
  const actDisable = async () => {
    if (confirmDisable !== trelloName) {
      return toast("Введённое значение не совпадает с названием трелло", {
        // @ts-ignore
        render: "Введённое значение не совпадает с названием трелло",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
    await disable(trelloId);
  };
  return (
    <div className={styles.editTrello}>
      <div>
        <div className={styles.row}>
          <Input
            placeholder="Название трелло"
            value={confirmDisable}
            onChange={setConfirmDisable}
            onPressEnter={actDisable}
          />
          <Button
            appearance="primary"
            color="red"
            disabled={confirmDisable !== trelloName}
            onClick={actDisable}
          >
            Удалить
          </Button>
        </div>
      </div>
      <div className={styles.row}>
        <Input
          value={newTrelloName}
          onChange={setNewTrelloName}
          placeholder="Название трелло"
          style={{ width: "275px" }}
        />
        <CheckPicker
          style={{ width: "275px" }}
          value={newUserList}
          onChange={setNewUserList}
          placeholder="Участники"
          locale={{
            searchPlaceholder: "Поиск...",
            noResultsText: "Ничего не найдено .-.",
          }}
          data={users}
        />
      </div>
    </div>
  );
};

export default BodyEditTrello;
