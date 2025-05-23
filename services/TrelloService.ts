import $api from "@/services/api";
import { AxiosResponse } from "axios";
import { ITrelloList } from "@/ifaces";

interface ITrelloCreateResponse {
  trelloId: number;
  trello: ITrelloList;
}

export default class TrelloService {
  static create(
    trelloName: string,
    accessUsers: number[],
  ): Promise<AxiosResponse<ITrelloCreateResponse>> {
    return $api.post("/trello", { trelloName, accessUsers });
  }
  static get(): Promise<AxiosResponse<ITrelloList>> {
    return $api.get("/trello");
  }
  static edit(
    trelloId: number,
    trelloName: string,
    accessUsers: number[],
  ): Promise<AxiosResponse<ITrelloList>> {
    return $api.post("/trello/edit", { trelloId, trelloName, accessUsers });
  }
  static disable(trelloId: number): Promise<AxiosResponse<ITrelloList>> {
    return $api.post("/trello/disable", { trelloId });
  }
}
