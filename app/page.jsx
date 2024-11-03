"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");

  const joinRoom = () => {
    router.push(`/client/${roomName || Math.random().toString(36).slice(2)}`)
  }

  return (
    <main className="home">
      
    </main>
  );
}
