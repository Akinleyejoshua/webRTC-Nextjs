import { useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  let socket = useRef(
    io("https://ultrashare-api.vercel.app/", {
      autoConnect: false,
    })
  )

  return {socket}
};

export default useSocket
