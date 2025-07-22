import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

interface WebRTCAudioProps {
  userId: string;
  roomId: string;
  onStreamReady: (stream: MediaStream) => void;
}

interface PeerMap {
  [key: string]: RTCPeerConnection;
}

export default function WebRTCAudio({ userId, roomId, onStreamReady }: WebRTCAudioProps) {
  const peersRef = useRef<PeerMap>({});
  const stompRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const subscriptionRef = useRef<any>(null);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createPeer = (targetUserId: string) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    localStreamRef.current?.getTracks().forEach(track =>
      pc.addTrack(track, localStreamRef.current!)
    );

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(targetUserId, { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
    };

    peersRef.current[targetUserId] = pc;
    return pc;
  };

  const sendSignal = (targetUserId: string, payload: any) => {
    if (stompRef.current?.connected) {
      stompRef.current.send(
        `/app/room/${roomId}`,
        {},
        JSON.stringify({ userId, roomId, targetUserId, payload })
      );
    }
  };

  const setupStomp = async () => {
    const socket = new SockJS(`https://codemirrorstream-b6b9evcfaqe3c3cv.canadacentral-01.azurewebsites.net/services/be/stream-service/ws`);
    const stomp = Stomp.over(socket);
    stomp.debug = () => {};
    stompRef.current = stomp;

    stomp.connect({}, async () => {
      console.log("✅ STOMP conectado");

      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
        reconnectIntervalRef.current = null;
      }

      subscriptionRef.current = stomp.subscribe(`/topic/room/${roomId}`, async (msg: any) => {
        const { userId: senderId, targetUserId, payload } = JSON.parse(msg.body);
        if (senderId === userId || targetUserId !== userId) return;

        const pc = peersRef.current[senderId] || createPeer(senderId);

        if (payload.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal(senderId, answer);
        } else if (payload.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(payload));
        } else if (payload.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
        }
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      localStreamRef.current = stream;
      onStreamReady(stream);
    }, (err: any) => {
      console.error("❌ Error STOMP:", err);
      if (!reconnectIntervalRef.current) {
        reconnectIntervalRef.current = setInterval(() => {
          console.log("🔄 Reintentando conexión STOMP...");
          setupStomp();
        }, 10000);
      }
    });
  };

  useEffect(() => {
    setupStomp();

    return () => {
      subscriptionRef.current?.unsubscribe();
      stompRef.current?.disconnect();
      Object.values(peersRef.current).forEach(pc => pc.close());
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
    };
  }, [roomId, userId]);

  return null;
}
