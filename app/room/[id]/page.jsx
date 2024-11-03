"use client"

import useSocket from "@/hooks/useSockets";
import useWebRTC from "@/hooks/useWebRTC";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io } from 'socket.io-client';


const config = {
    iceServers: [
        {
            urls: ["stun:stun.l.google.com:19302"],
        }
    ],
};


export default function Room() {
    const { socket: socketRef } = useSocket();
    const { id: roomName } = useParams();    
    const [roomId, setRoomId] = useState(roomName);
    const [streaming, setStreaming] = useState(false);

    const videoRef = useRef();
    const peerConnectionRef = useRef();

    useEffect(() => {
        socketRef.current.connect();
        socketRef.current.on('viewerJoined', async ({ viewerId }) => {
            console.log('Viewer joined, creating peer connection');
            try {
                const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
                peerConnectionRef.current = new RTCPeerConnection(configuration);

                // Add the local stream to the peer connection
                const stream = videoRef.current.srcObject;
                stream.getTracks().forEach(track => {
                    peerConnectionRef.current.addTrack(track, stream);
                });

                // Handle ICE candidates
                peerConnectionRef.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socketRef.current.emit('iceCandidate', {
                            candidate: event.candidate,
                            roomId,
                            to: viewerId
                        });
                    }
                };

                socketRef.current.on('iceCandidate', async ({ candidate }) => {
                    try {
                        if (peerConnectionRef.current) {
                            await peerConnectionRef.current.addIceCandidate(candidate);
                        }
                    } catch (error) {
                        console.error('Error adding ICE candidate:', error);
                    }
                });

                // Create and send offer
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socketRef.current.emit('offer', { offer, roomId, viewerId });
            } catch (error) {
                console.error('Error creating offer:', error);
            }
        });

        socketRef.current.on('answer', async ({ answer, viewerId }) => {
            console.log('Received answer from viewer');
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                }
            } catch (error) {
                console.error('Error setting remote description:', error);
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
    }, [roomName])

    const startStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;

            const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
            peerConnectionRef.current = new RTCPeerConnection(configuration);

            stream.getTracks().forEach(track => {
                peerConnectionRef.current.addTrack(track, stream);
            });

            // const generatedRoomId = Math.random().toString(36).substring(7);
            setRoomId(roomName);
            socketRef.current.emit('createRoom', { roomId: roomName });
            setStreaming(true);
        } catch (error) {
            console.error('Error starting stream:', error);
        }
    };

    const stopStream = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        socketRef.current.emit('leaveRoom', { roomId });
        setStreaming(false);
        setRoomId('');
    };

    return (
        <main className="room">
          
        </main>
    );
}
