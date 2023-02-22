import { Socket } from "socket.io-client";
import { TOPIC_CLIENT, TOPIC_SERVER } from "./const";

export const initSetup = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  socket.on(TOPIC_SERVER, (arg: any) => {
    console.log('-->', arg);
  });

  socket.emit(TOPIC_CLIENT, 'from-client');
};

export type DefaultEventsMap = any;
