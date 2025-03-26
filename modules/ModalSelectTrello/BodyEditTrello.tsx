import styles from "./ModalSelectTrello.module.scss";
import { CheckPicker, Input } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";

const BodyEditTrello = () => {
  const users = useUserStore((store) => store.userList);
  const [setTrelloName] = useSelectTrelloStore((store) => [
    store.setTrelloName,
  ]);
  const [trelloList, selectedTrello, setAccessUsers] = useSelectTrelloStore(
    (store) => [store.trelloList, store.selectedTrello, store.setAccessUsers],
  );
  return (
    <div className={styles.editTrello}>
      <Input
        value={trelloList[selectedTrello].trelloName}
        onChange={setTrelloName}
        placeholder="Название трелло"
        style={{ width: "275px" }}
      />
      <CheckPicker
        style={{ width: "275px" }}
        value={trelloList[selectedTrello].accessUsers}
        onChange={setAccessUsers}
        placeholder="Участники"
        locale={{
          searchPlaceholder: "Поиск...",
          noResultsText: "Ничего не найдено .-.",
        }}
        data={users}
      />
    </div>
  );
};

export default BodyEditTrello;
