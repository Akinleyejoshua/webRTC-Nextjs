import { useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  let socket = useRef(
    io("https://ultrashare-api.onrender.com", {
      autoConnect: false,
      withCredentials: true,
      transports: ['polling', 'websocket'], // Notice polling is first
    })
  )

  return {socket}
};

export default useSocket
