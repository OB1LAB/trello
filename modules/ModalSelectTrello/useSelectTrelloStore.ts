"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { ISelectPickerData, ITrelloList } from "@/ifaces";
import TrelloService from "@/services/TrelloService";
import { toast } from "react-toastify";
import { convertTrelloData } from "@/utils";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";
import { ClientEvents } from "@/consts";

interface ISelectTrelloStore {
  isModal: boolean;
  isLoading: boolean;
  selectedTrello: number;
  trelloList: ITrelloList;
  setIsModal: (isModal: boolean) => void;
  selectData: ISelectPickerData[];
  setAccessUsers: (accessUsers: number[]) => void;
  setTrelloName: (trelloName: string) => void;
  setSelectedTrello: (selectedTrello: number | null) => void;
  create: () => Promise<void>;
  get: () => void;
}

export default create<ISelectTrelloStore>((set, get) => ({
  isModal: false,
  isLoading: true,
  selectedTrello: -1,
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
  setTrelloName(trelloName) {
    const trelloList = get().trelloList;
    const selectedTrello = get().selectedTrello;
    trelloList[selectedTrello].trelloName = trelloName;
    set({ trelloList });
  },
  setSelectedTrello(selectedTrello) {
    if (selectedTrello) {
      if (selectedTrello > 0) {
        useSocketStore
          .getState()
          .socket?.emit(ClientEvents.selectTrello, selectedTrello);
      }
      set({ selectedTrello });
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
        selectedTrello: res.data.trelloId,
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
}));
