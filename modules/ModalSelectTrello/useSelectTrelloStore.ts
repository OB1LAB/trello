"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { ISelectPickerData, ITrelloList } from "@/ifaces";
import TrelloService from "@/services/TrelloService";
import { toast } from "react-toastify";
import { convertTrelloData } from "@/utils";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";
import { ClientEvents } from "@/consts";
import { redirect } from "next/navigation";

interface ISelectTrelloStore {
  isModal: boolean;
  isLoading: boolean;
  selectedTrello: number;
  newTrelloName: string;
  trelloList: ITrelloList;
  newUserList: number[];
  setNewTrelloName: (newTrelloName: string) => void;
  setIsModal: (isModal: boolean) => void;
  selectData: ISelectPickerData[];
  setAccessUsers: (accessUsers: number[]) => void;
  setNewUserList: (newUserList: number[]) => void;
  setTrelloName: (trelloName: string) => void;
  setSelectedTrello: (selectedTrello: number | null) => void;
  create: () => Promise<void>;
  edit: () => Promise<void>;
  disable: (trelloId: number) => Promise<void>;
  get: () => void;
}

export default create<ISelectTrelloStore>((set, get) => ({
  isModal: false,
  isLoading: true,
  newTrelloName: "",
  selectedTrello: -1,
  newUserList: [],
  trelloList: {
    [-1]: {
      accessUsers: [],
      createdUser: -1,
      trello: [],
      trelloName: "Добавить",
    },
  },
  selectData: [{ label: "Добавить", value: -1 }],
  setIsModal(isModal) {
    set({ isModal });
  },
  setAccessUsers(accessUsers) {
    const trelloList = get().trelloList;
    const selectedTrello = get().selectedTrello;
    trelloList[selectedTrello].accessUsers = accessUsers;
    set({ trelloList });
  },
  setNewTrelloName(newTrelloName) {
    set({ newTrelloName });
  },
  setNewUserList(newUserList) {
    set({ newUserList });
  },
  setTrelloName(trelloName) {
    const trelloList = get().trelloList;
    const selectedTrello = get().selectedTrello;
    trelloList[selectedTrello].trelloName = trelloName;
    set({ trelloList });
  },
  setSelectedTrello(selectedTrello) {
    const trelloList = get().trelloList;
    if (selectedTrello) {
      set({
        selectedTrello,
        newTrelloName: trelloList[selectedTrello].trelloName,
        newUserList: trelloList[selectedTrello].accessUsers,
      });
      if (selectedTrello > 0) {
        useSocketStore
          .getState()
          .socket?.emit(ClientEvents.selectTrello, selectedTrello);
        setTimeout(() => {
          redirect(`/${selectedTrello}`);
        }, 0);
      } else {
        redirect(`/`);
      }
    }
  },
  async get() {
    const res = await TrelloService.get();
    set({ ...convertTrelloData(res.data), isLoading: false });
  },
  async create() {
    const data = get();
    try {
      const res = await TrelloService.create(
        data.trelloList[data.selectedTrello].trelloName,
        data.trelloList[data.selectedTrello].accessUsers,
      );
      toast(
        `Трелло ${data.trelloList[data.selectedTrello].trelloName} создано`,
        {
          // @ts-ignore
          render: `Трелло ${data.trelloList[data.selectedTrello].trelloName} создано`,
          type: "success",
          autoClose: 3000,
        },
      );
      set({
        ...convertTrelloData(res.data.trello),
      });
      get().setSelectedTrello(res.data.trelloId);
    } catch (e) {
      console.log(e);
      // @ts-ignore
      toast(e.response.data.message, {
        // @ts-ignore
        render: e.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
  async edit() {
    try {
      const trelloList = get().trelloList;
      const trelloId = get().selectedTrello;
      const trelloName = get().newTrelloName;
      const accessUsers = get().newUserList;
      if (
        trelloList[trelloId].trelloName === trelloName &&
        trelloList[trelloId].accessUsers === accessUsers
      ) {
        toast("Изменений нет", {
          // @ts-ignore
          render: "Изменений нет",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }
      const res = await TrelloService.edit(trelloId, trelloName, accessUsers);
      toast(`Трелло ${trelloName} изменено`, {
        // @ts-ignore
        render: `Трелло ${trelloName} изменено`,
        type: "success",
        autoClose: 3000,
      });
      set({
        ...convertTrelloData(res.data),
      });
    } catch (e) {
      console.log(e);
      // @ts-ignore
      toast(e.response.data.message, {
        // @ts-ignore
        render: e.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
  async disable(trelloId) {
    try {
      const res = await TrelloService.disable(trelloId);
      toast(`Трелло удалено`, {
        // @ts-ignore
        render: `Трелло удалено`,
        type: "success",
        autoClose: 3000,
      });
      set({
        ...convertTrelloData(res.data),
      });
      get().setSelectedTrello(-1);
    } catch (e) {
      console.log(e);
      // @ts-ignore
      toast(e.response.data.message, {
        // @ts-ignore
        render: e.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
}));
