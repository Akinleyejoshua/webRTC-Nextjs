import { useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  let socket = useRef(
    io("https://ultrashare-api.vercel.app", {
      autoConnect: false,
      withCredentials: true,
      transports: ['polling', 'websocket'], // Notice polling is first
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })
  )

  return {socket}
};

export default useSocket
