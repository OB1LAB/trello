"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IUser } from "@/ifaces";
import { toast } from "react-toastify";
import UserService, { IAuthResponse } from "@/services/UserService";
import axios from "axios";

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
  login: () => void;
  checkAuth: () => void;
  logout: () => void;
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
  async login() {
    try {
      const data = get();
      const res = await UserService.login(
        data.inputUsername,
        data.inputPassword,
      );
      set({
        isAuth: true,
        userName: res.data.name,
        userId: res.data.id,
        isModalAuthOpen: false,
      });
      toast("Успешная авторизация", {
        // @ts-ignore
        render: "Успешная авторизация",
        type: "success",
        autoClose: 3000,
      });
      setTimeout(() => {
        set({
          inputUsername: "",
          inputPassword: "",
        });
      }, 500);
    } catch (error) {
      // @ts-ignore
      toast(error.response.data.message, {
        // @ts-ignore
        render: error.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
  async checkAuth() {
    try {
      const res = await axios.get<IAuthResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/user/refresh`,
        { withCredentials: true },
      );
      set({
        isAuth: true,
        userName: res.data.name,
        userId: res.data.id,
        isModalAuthOpen: false,
      });
      toast("Успешная авторизация", {
        // @ts-ignore
        render: "Успешная авторизация",
        type: "success",
        autoClose: 3000,
      });
    } catch (e) {
      // @ts-ignore
      toast(error.response.data.message, {
        // @ts-ignore
        render: error.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  },
  async logout() {
    try {
      await UserService.logout();
      localStorage.removeItem("token");
      set({
        isAuth: false,
        userId: -1,
        userName: "",
      });
      toast("Выход", {
        // @ts-ignore
        render: "Выход",
        type: "success",
        autoClose: 3000,
      });
    } catch (e) {
      toast("Произошла ошибка", {
        // @ts-ignore
        render: "Произошла ошибка",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
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
