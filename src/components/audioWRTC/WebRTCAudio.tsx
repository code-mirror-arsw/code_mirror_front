import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

interface WebRTCAudioProps {
  userId: string;
  roomId: string;
  onStreamReady: (stream: MediaStream) => void;
}

export default function WebRTCAudio({
  userId,
  roomId,
  onStreamReady,
}: WebRTCAudioProps) {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const stompRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    const sendSignal = (payload: any) => {
      stompRef.current.send(
        `/app/room/${roomId}`,
        {},
        JSON.stringify({ userId, roomId, payload })
      );
    };

    const createPeer = () => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      localStreamRef.current
        ?.getTracks()
        .forEach((t) => pc.addTrack(t, localStreamRef.current!));

      pc.onicecandidate = (e) => {
        if (e.candidate) sendSignal({ candidate: e.candidate });
      };

      pc.ontrack = (e) => {
        const audio = new Audio();
        audio.srcObject = e.streams[0];
        audio.autoplay = true;
      };

      peerRef.current = pc;
      return pc;
    };

    const start = async () => {
      const socket = new SockJS(
      "https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/stream-service/ws",
      undefined,
      {
        // @ts-expect-error 'withCredentials' no está en los tipos pero es útil evitar cookies
        withCredentials: false,
      }
    );


      const stomp = Stomp.over(socket);
      stomp.debug = () => {};
      stompRef.current = stomp;

      stomp.connect({}, async () => {
        subscriptionRef.current = stomp.subscribe(
          `/topic/room/${roomId}`,
          async (msg: any) => {
            const { userId: uid, payload } = JSON.parse(msg.body);
            if (uid === userId) return;

            const pc = peerRef.current ?? createPeer();

            if (payload.type === "offer") {
              await pc.setRemoteDescription(payload);
              const answer = await pc.createAnswer();
              answer.sdp = answer.sdp!.replace(
                /useinbandfec=1/,
                "useinbandfec=1; stereo=1; maxaveragebitrate=510000"
              );
              await pc.setLocalDescription(answer);
              sendSignal(answer);
            } else if (payload.type === "answer") {
              await pc.setRemoteDescription(payload);
            } else if (payload.candidate) {
              await pc.addIceCandidate(payload.candidate);
            }
          }
        );

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 2,
            sampleRate: 48000,
            sampleSize: 16,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: false,
        });

        localStreamRef.current = stream;
        onStreamReady(stream);

        const pc = createPeer();
        const offer = await pc.createOffer();
        offer.sdp = offer.sdp!.replace(
          /useinbandfec=1/,
          "useinbandfec=1; stereo=1; maxaveragebitrate=510000"
        );
        await pc.setLocalDescription(offer);
        sendSignal(offer);
      });
    };

    start();

    return () => {
      subscriptionRef.current?.unsubscribe();
      stompRef.current?.disconnect();
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomId, userId, onStreamReady]);

  return null;
}
