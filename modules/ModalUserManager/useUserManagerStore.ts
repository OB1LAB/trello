"use client";
import { createWithEqualityFn as create } from "zustand/traditional";
import { toast } from "react-toastify";
import UserService from "@/services/UserService";
import useUserStore from "@/modules/useUserStore/useUserStore";

interface IUserManager {
  createUserName: string;
  createUserPassword: string;
  createUserIsAdmin: boolean;
  setCreateUserName: (createUserName: string) => void;
  setCreateUserPassword: (createUserPassword: string) => void;
  setCreateUserIsAdmin: (createUserIsAdmin: boolean) => void;
  createUser: () => Promise<void>;
  editUser: (
    userId: number,
    primaryIsAdmin: boolean,
    isAdmin: boolean,
    password: string,
    passwordRetry: string,
  ) => Promise<boolean>;
  disableUser: (userId: number) => Promise<boolean>;
}

export default create<IUserManager>((set, get) => ({
  createUserName: "",
  createUserPassword: "",
  createUserIsAdmin: false,
  setCreateUserName(createUserName) {
    set({ createUserName });
  },
  setCreateUserPassword(createUserPassword) {
    set({ createUserPassword });
  },
  setCreateUserIsAdmin(createUserIsAdmin) {
    set({ createUserIsAdmin });
  },
  async editUser(userId, primaryIsAdmin, isAdmin, password, passwordRetry) {
    try {
      if (password !== passwordRetry) {
        toast("Пароли не совпадают", {
          // @ts-ignore
          render: "Пароли не совпадают",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return false;
      } else if (password === "" && isAdmin === primaryIsAdmin) {
        toast("Изменений нет", {
          // @ts-ignore
          render: "Изменений нет",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return false;
      }
      await UserService.edit(userId, password, isAdmin);
      await useUserStore.getState().getUsers(-1);
      toast("Пользователь успешно изменён", {
        // @ts-ignore
        render: "Пользователь успешно изменён",
        type: "success",
        autoClose: 3000,
      });
      return true;
    } catch (e) {
      toast("Произошла ошибка", {
        // @ts-ignore
        render: "Произошла ошибка",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return false;
    }
  },
  async disableUser(userId) {
    try {
      await UserService.disable(userId);
      await useUserStore.getState().getUsers(-1);
      toast("Пользователь успешно удалён", {
        // @ts-ignore
        render: "Пользователь успешно удалён",
        type: "success",
        autoClose: 3000,
      });
      return true;
    } catch (e) {
      toast("Произошла ошибка", {
        // @ts-ignore
        render: "Произошла ошибка",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return false;
    }
  },
  async createUser() {
    try {
      const data = get();
      await UserService.create(
        data.createUserName,
        data.createUserPassword,
        data.createUserIsAdmin,
      );
      await useUserStore.getState().getUsers(-1);
      toast("Пользователь успешно создан", {
        // @ts-ignore
        render: "Пользователь успешно создан",
        type: "success",
        autoClose: 3000,
      });
      set({
        createUserName: "",
        createUserPassword: "",
        createUserIsAdmin: false,
      });
    } catch (e) {
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
