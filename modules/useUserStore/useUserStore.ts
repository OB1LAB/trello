"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IUser } from "@/ifaces";

interface IUserStore {
  isModalAuthOpen: boolean;
  inputUsername: string;
  inputPassword: string;
  isAuth: boolean;
  isEdit: boolean;
  userId: number;
  userName: string;
  userList: IUser[];
  userListId: {
    [userId: number]: IUser;
  };
  setIsModalAuthOpen: (isModalAuthOpen: boolean) => void;
  setInputUsername: (inputUsername: string) => void;
  setInputPassword: (inputPassword: string) => void;
  setIsEdit: (isEdit: boolean) => void;
}

export default create<IUserStore>((set, get) => ({
  isModalAuthOpen: false,
  inputUsername: "",
  inputPassword: "",
  isAuth: false,
  isEdit: false,
  userId: -1,
  userName: "",
  userList: [
    // { value: 1, label: "datav3nom", isAdmin: true },
    // { value: 2, label: "testUser1", isAdmin: false },
    // { value: 3, label: "testUser2", isAdmin: false },
  ],
  userListId: {
    // [0]: { value: 0, label: "OB1CHAM", isAdmin: true },
    // [1]: { value: 1, label: "datav3nom", isAdmin: true },
    // [2]: { value: 2, label: "testUser1", isAdmin: false },
    // [3]: { value: 2, label: "testUser1", isAdmin: false },
  },
  setIsModalAuthOpen(isModalAuthOpen) {
    set({ isModalAuthOpen });
  },
  setInputUsername(inputUsername) {
    set({ inputUsername });
  },
  setInputPassword(inputPassword) {
    set({ inputPassword });
  },
  setIsEdit(isEdit) {
    set({ isEdit });
  },
}));
