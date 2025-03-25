"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IColumn } from "@/ifaces";

interface ISelectTrelloStore {
  isModal: boolean;
  selectedTrello: string;
  permissionUsers: number[];
  trelloList: {
    [trelloName: string]: IColumn[];
  };
  setIsModal: (isModal: boolean) => void;
  selectData: {
    label: string;
    value: number;
  }[];
}

export default create<ISelectTrelloStore>((set, get) => ({
  isModal: false,
  selectedTrello: "",
  permissionUsers: [],
  trelloList: {},
  selectData: [{ label: "Добавить", value: -1 }],
  setIsModal(isModal) {
    set({ isModal });
  },
}));
