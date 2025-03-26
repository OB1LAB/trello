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
    { value: 1, label: "datav3nom", isAdmin: true },
    { value: 2, label: "testUser1", isAdmin: false },
    { value: 3, label: "testUser2", isAdmin: false },
  ],
  userListId: {
    [0]: { value: 0, label: "OB1CHAM", isAdmin: true },
    [1]: { value: 1, label: "datav3nom", isAdmin: true },
    [2]: { value: 2, label: "testUser1", isAdmin: false },
    [3]: { value: 2, label: "testUser1", isAdmin: false },
  },
  setIsEdit(isEdit) {
    set({ isEdit });
  },
}));
