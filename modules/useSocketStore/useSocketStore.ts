import { create } from "zustand";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { io, Socket } from "socket.io-client";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";

export interface IUseSocket {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  setSocket: (accessToken: string) => void;
  removeSocket: () => void;
}

const useAuthStore = create<IUseSocket>()((set, get) => ({
  socket: null,
  setSocket: (accessToken: string) => {
    const socket = io(
      (process.env.NEXT_PUBLIC_API_URL as string).split("/api")[0],
      {
        transports: ["websocket"],
        auth: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    socket.on("connect", () => {
      if (socket.recovered) {
        useSelectTrelloStore.getState().get();
        useSelectTrelloStore
          .getState()
          .setSelectedTrello(useSelectTrelloStore.getState().selectedTrello);
      }
    });
    set({ socket });
  },
  removeSocket: () => {
    //@ts-ignore
    get().socket?.disconnect();
    get().socket?.removeAllListeners();
    set({ socket: null });
  },
}));

export default useAuthStore;
