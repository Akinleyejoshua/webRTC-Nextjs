"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");

  const joinRoom = () => {
    router.push(`/client/${roomName}`)
  }

  const createRoom = () => {
    router.push(`/room/${roomName || Math.random().toString(36).slice(2)}`)
  }

  return (
    <main className="home">
      <div className="center">
        <h1>Create & Join Room</h1>
        <br />
        <div className="flex col">
          <input type="text" placeholder="Insert a Room Name" onChange={e => setRoomName(e.target.value)}/>
          <br />
          <div className="flex">
            <button onClick={createRoom}>Create Room</button>
            <div className="s"></div>
            <button onClick={joinRoom}>Join Room</button>
          </div>
        </div>
        
      </div>
    </main>
  );
}
