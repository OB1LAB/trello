"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IColumn } from "@/ifaces";

interface ISelectTrelloStore {
  isModal: boolean;
  selectedTrello: number;
  trelloList: {
    [trelloId: number]: {
      accessUsers: number[];
      createdUser: number;
      trello: IColumn[];
      trelloName: string;
    };
  };
  setIsModal: (isModal: boolean) => void;
  selectData: {
    label: string;
    value: number;
  }[];
  setAccessUsers: (accessUsers: number[]) => void;
  setTrelloName: (trelloName: string) => void;
  setSelectedTrello: (selectedTrello: number | null) => void;
}

export default create<ISelectTrelloStore>((set, get) => ({
  isModal: false,
  selectedTrello: -1,
  trelloList: {
    [-1]: {
      accessUsers: [],
      createdUser: -1,
      trello: [],
      trelloName: "",
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
      set({ selectedTrello });
    }
  },
}));
