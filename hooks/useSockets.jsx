import { useRef } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  let socket = useRef(
    io("http://localhost:4000/", {
      autoConnect: false,
    })
  )

  return {socket}
};

export default useSocket