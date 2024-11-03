import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const useWebRTC = () => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:4000');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);

        peerConnection.current = new RTCPeerConnection();

        stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('candidate', event.candidate);
          }
        };

        peerConnection.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
        };

        socket.current.on('offer', async (offer) => {
          if (!peerConnection.current) return;
          if (peerConnection.current.signalingState !== 'stable') return;

          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.current.emit('answer', answer);
        });

        socket.current.on('answer', async (answer) => {
          if (!peerConnection.current) return;
          if (peerConnection.current.signalingState !== 'have-local-offer') return;

          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.current.on('candidate', async (candidate) => {
          if (!peerConnection.current) return;
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        });
      });

    return () => {
      if (socket.current) socket.current.disconnect();
      if (peerConnection.current) peerConnection.current.close();
    };
  }, []);

  const createOffer = async () => {
    if (!peerConnection.current) return;
    if (peerConnection.current.signalingState !== 'stable') return;

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.current.emit('offer', offer);
  };

  return { stream, remoteStream, createOffer };
};

export default useWebRTC;
