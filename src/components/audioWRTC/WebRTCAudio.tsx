import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

interface WebRTCAudioProps {
  userId: string;
  roomId: string;
  onStreamReady: (stream: MediaStream) => void;
}

export default function WebRTCAudio({ userId, roomId, onStreamReady }: WebRTCAudioProps) {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const stompClientRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const log = (msg: string) => console.log("[WebRTC]", msg);

    const sendSignal = (payload: any) => {
      stompClientRef.current.send(
        `/app/room/${roomId}`,
        {},
        JSON.stringify({ userId, roomId, payload })
      );
    };

    const createPeer = async () => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      streamRef.current?.getTracks().forEach((track) => {
        pc.addTrack(track, streamRef.current!);
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({ candidate: event.candidate });
        }
      };

      pc.ontrack = (event) => {
        const audio = new Audio();
        audio.srcObject = event.streams[0];
        audio.autoplay = true;
        log("🎧 Audio remoto recibido");
      };

      peerRef.current = pc;
      return pc;
    };

    const connect = async () => {
      const socket = new SockJS("http://localhost:8084/ws");
      const stompClient = Stomp.over(socket);
      stompClient.debug = () => {};
      stompClient.connect(
        {},
        async () => {
          log("🌐 Conectado a WebSocket con SockJS");
          stompClientRef.current = stompClient;

          stompClient.subscribe(`/topic/room/${roomId}`, async (message) => {
            const signal = JSON.parse(message.body);
            if (signal.userId === userId) return;

            log("📡 Señal recibida");

            if (!peerRef.current) await createPeer();
            const pc = peerRef.current!;
            const payload = signal.payload;

            if (payload.type === "offer") {
              await pc.setRemoteDescription(new RTCSessionDescription(payload));
              const answer = await pc.createAnswer();
              await pc.setLocalDescription(answer);
              sendSignal(answer);
            } else if (payload.type === "answer") {
              await pc.setRemoteDescription(new RTCSessionDescription(payload));
            } else if (payload.candidate) {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            }
          });

          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            onStreamReady(stream); // Aquí avisamos que el stream ya está listo
            log("🎤 Micrófono activo");
            await createPeer();
            const offer = await peerRef.current!.createOffer();
            await peerRef.current!.setLocalDescription(offer);
            sendSignal(offer);
          } catch (err) {
            log("❌ Error al acceder al micrófono: " + err);
          }
        }
      );
    };

    connect();

    return () => {
      stompClientRef.current?.disconnect();
      peerRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, userId, onStreamReady]);

  return null;
}
