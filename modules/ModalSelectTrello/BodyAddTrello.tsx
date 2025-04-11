import styles from "./ModalSelectTrello.module.scss";
import { CheckPicker, Input } from "rsuite";
import useUserStore from "@/modules/useUserStore/useUserStore";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import { toast } from "react-toastify";

const BodyAddTrello = () => {
  const users = useUserStore((store) => store.userList);
  const setTrelloName = useSelectTrelloStore((store) => store.setTrelloName);
  const [trelloList, selectedTrello, setAccessUsers, create] =
    useSelectTrelloStore((store) => [
      store.trelloList,
      store.selectedTrello,
      store.setAccessUsers,
      store.create,
    ]);
  return (
    <div className={styles.editTrello}>
      <div className={styles.row}>
        <Input
          value={trelloList[selectedTrello].trelloName}
          onChange={setTrelloName}
          placeholder="Название трелло"
          onPressEnter={() => {
            if (trelloList[selectedTrello].trelloName.length < 3) {
              return toast(
                "Длина названия трелло не может быть меньше 3 символов",
                {
                  // @ts-ignore
                  render:
                    "Длина названия трелло не может быть меньше 3 символов",
                  type: "error",
                  isLoading: false,
                  autoClose: 3000,
                },
              );
            }
            create();
          }}
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
    </div>
  );
};

export default BodyAddTrello;
