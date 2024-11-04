import { useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  let socket = useRef(
    io("https://ultrashare-api.onrender.com", {
      autoConnect: false,
    })
  )

  return {socket}
};

export default useSocket
