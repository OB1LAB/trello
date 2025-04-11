import { AxiosResponse } from "axios";
import $api from "@/services/api";

export interface IAuthResponse {
  id: number;
  name: string;
  isAdmin: boolean;
  accessToken: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  isAdmin: boolean;
  createdByUserId: number;
}

export default class UserService {
  static login(
    name: string,
    password: string,
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post("/user/login", { name, password });
  }
  static create(
    name: string,
    password: string,
    isAdmin: boolean,
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post("/user/create", { name, password, isAdmin });
  }
  static edit(
    userId: number,
    password: string,
    isAdmin: boolean,
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post("/user/edit", { userId, password, isAdmin });
  }
  static disable(userId: number): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post("/user/edit", {
      userId,
      password: "_",
      isAdmin: false,
      isDeactivate: true,
    });
  }
  static changePassword(newPassword: string): Promise<AxiosResponse> {
    return $api.post("/user/changePassword", { newPassword });
  }
  static getUsers(): Promise<AxiosResponse<IUserResponse[]>> {
    return $api.get("/user");
  }
  static logout(): Promise<AxiosResponse> {
    return $api.get("/user/logout");
  }
}
