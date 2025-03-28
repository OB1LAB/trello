import { AxiosResponse } from "axios";
import $api from "@/services/api";

export interface IAuthResponse {
  id: number;
  name: string;
  accessToken: string;
}

export default class UserService {
  static login(
    name: string,
    password: string,
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post("/user/login", { name, password });
  }
  static logout(): Promise<AxiosResponse> {
    return $api.get("/user/logout");
  }
}
