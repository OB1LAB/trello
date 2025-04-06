"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { IUser } from "@/ifaces";
import { toast } from "react-toastify";
import UserService, { IAuthResponse } from "@/services/UserService";
import axios from "axios";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import useSocketStore from "@/modules/useSocketStore/useSocketStore";

interface IUserStore {
  isAuthLoading: boolean;
  isModalAuthOpen: boolean;
  isModalChangePassword: boolean;
  isModalManageUsers: boolean;
  isAdmin: boolean;
  inputUsername: string;
  inputPassword: string;
  newPassword: string;
  newPasswordRetype: string;
  isAuth: boolean;
  isEdit: boolean;
  userId: number;
  userName: string;
  userList: IUser[];
  userListId: {
    [userId: number]: IUser;
  };
  setNewPassword: (newPassword: string) => void;
  setNewPasswordRetype: (newPasswordRetype: string) => void;
  setIsModalAuthOpen: (isModalAuthOpen: boolean) => void;
  setIsModalChangePassword: (isModalChangePassword: boolean) => void;
  setIsModalManageUsers: (isModalManageUsers: boolean) => void;
  setInputUsername: (inputUsername: string) => void;
  setInputPassword: (inputPassword: string) => void;
  setIsEdit: (isEdit: boolean) => void;
  login: () => void;
  changePassword: () => void;
  checkAuth: () => Promise<void>;
  getUsers: (selfUserId: number) => Promise<void>;
  logout: () => void;
}

export default create<IUserStore>((set, get) => ({
  isAuthLoading: true,
  isModalAuthOpen: false,
  isModalChangePassword: false,
  isModalManageUsers: false,
  isAdmin: false,
  inputUsername: "",
  inputPassword: "",
  newPassword: "",
  newPasswordRetype: "",
  isAuth: false,
  isEdit: false,
  userId: -1,
  userName: "",
  userList: [],
  userListId: {},
  setNewPassword(newPassword) {
    set({ newPassword });
  },
  setNewPasswordRetype(newPasswordRetype) {
    set({ newPasswordRetype });
  },
  async login() {
    try {
      const data = get();
      const res = await UserService.login(
        data.inputUsername,
        data.inputPassword,
      );
      await get().getUsers(res.data.id);
      set({
        isAuth: true,
        userName: res.data.name,
        userId: res.data.id,
        isModalAuthOpen: false,
        isAdmin: res.data.isAdmin,
      });
      localStorage.setItem("token", res.data.accessToken);
      toast("Успешная авторизация", {
        // @ts-ignore
        render: "Успешная авторизация",
        type: "success",
        autoClose: 3000,
      });
      useSelectTrelloStore.getState().get();
      useSocketStore.getState().setSocket(res.data.accessToken);
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
  async changePassword() {
    try {
      const data = get();
      await UserService.changePassword(data.newPassword);
      toast("Пароль изменён", {
        // @ts-ignore
        render: "Пароль изменён",
        type: "success",
        autoClose: 3000,
      });
      set({ isModalChangePassword: false });
      setTimeout(() => {
        set({
          newPassword: "",
          newPasswordRetype: "",
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
      await get().getUsers(res.data.id);
      set({
        isAuth: true,
        userId: res.data.id,
        userName: res.data.name,
        isAdmin: res.data.isAdmin,
        isModalAuthOpen: false,
      });
      localStorage.setItem("token", res.data.accessToken);
      toast("Успешная авторизация", {
        // @ts-ignore
        render: "Успешная авторизация",
        type: "success",
        autoClose: 3000,
      });
      useSelectTrelloStore.getState().get();
      useSocketStore.getState().setSocket(res.data.accessToken);
    } catch (error) {
      console.log(error);
    } finally {
      set({ isAuthLoading: false });
    }
  },
  async getUsers(selfUserId) {
    try {
      if (selfUserId === -1) {
        selfUserId = get().userId;
      }
      const users = await UserService.getUsers();
      users.data.sort((a, b) => a.id - b.id);
      const userList = users.data
        .filter((user) => user.id !== selfUserId)
        .map((user) => {
          return {
            value: user.id,
            label: user.name,
            isAdmin: user.isAdmin,
          };
        });
      const userListId: {
        [userId: number]: IUser;
      } = {};
      for (const user of users.data) {
        userListId[user.id] = {
          value: user.id,
          label: user.name,
          isAdmin: user.isAdmin,
        };
      }
      set({ userList, userListId });
    } catch (e) {
      console.log(e);
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
      useSocketStore.getState().removeSocket();
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
  setIsModalChangePassword(isModalChangePassword) {
    set({ isModalChangePassword });
  },
  setIsModalManageUsers(isModalManageUsers) {
    set({ isModalManageUsers });
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
