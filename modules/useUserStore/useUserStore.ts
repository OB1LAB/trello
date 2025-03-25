"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IUser } from "@/ifaces";

interface IUserStore {
  isAuth: boolean;
  isEdit: boolean;
  userId: number;
  userName: string;
  userList: IUser[];
  userListId: {
    [userId: number]: IUser;
  };
  setIsEdit: (isEdit: boolean) => void;
}

export default create<IUserStore>((set, get) => ({
  isAuth: true,
  isEdit: false,
  userId: 0,
  userName: "OB1CHAM",
  userList: [
    { value: 0, label: "OB1CHAM" },
    { value: 1, label: "datav3nom" },
    { value: 2, label: "testUser1" },
    { value: 3, label: "testUser2" },
  ],
  userListId: {
    [0]: { value: 0, label: "OB1CHAM" },
    [1]: { value: 1, label: "datav3nom" },
    [2]: { value: 2, label: "testUser1" },
    [3]: { value: 2, label: "testUser1" },
  },
  setIsEdit(isEdit) {
    set({ isEdit });
  },
}));
