import { useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  let socket = useRef(
    io("https://ultrashare-api.vercel.app", {
      autoConnect: false,
        withCredentials: true,
        transports: ['websocket', 'polling']
    })
  )

  return {socket}
};

export default useSocket
