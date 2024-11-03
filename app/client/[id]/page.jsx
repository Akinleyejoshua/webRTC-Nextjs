"use client"
import useSocket from "@/hooks/useSockets";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Client() {
    const { socket: socketRef } = useSocket();
    const { id: roomName } = useParams();
    const [roomId, setRoomId] = useState(roomName);
    const [connected, setConnected] = useState(false);
    const videoRef = useRef();
    const peerConnectionRef = useRef();
    const router = useRouter();

    useEffect(() => {
        socketRef.current.connect();

        socketRef.current.on('offer', async ({ offer }) => {
            console.log('Received offer from broadcaster');
            try {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socketRef.current.emit('answer', { answer, roomId });
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        });

        socketRef.current.on('iceCandidate', async ({ candidate }) => {
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.addIceCandidate(candidate);
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [roomName]);

    const joinRoom = async () => {
        try {
            const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
            peerConnectionRef.current = new RTCPeerConnection(configuration);

            peerConnectionRef.current.ontrack = (event) => {
                console.log('Received remote track');
                if (videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                }
            };

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socketRef.current.emit('iceCandidate', {
                        candidate: event.candidate,
                        roomId
                    });
                }
            };

            socketRef.current.emit('joinRoom', { roomId });
            setConnected(true);
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const leaveRoom = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        socketRef.current.emit('leaveRoom', { roomId });
        setConnected(false);
        // setRoomId('');
    };

    return (
        <main className="room">
           
        </main>
    );
}