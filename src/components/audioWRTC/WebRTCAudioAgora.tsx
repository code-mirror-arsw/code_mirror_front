import { useEffect, useRef } from "react";
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack } from "agora-rtc-sdk-ng";

interface Props {
  userId: string;
  roomId: string;
  onStreamReady: (stream: MediaStream) => void;
}

const appId = "704a4d16bdcc4878af92fff7c4e3938b"; 
const token = "007eJxTYEjLNb+XtfH43zdBWjV9rvr7NPaKHWLInLXldObsxRfjBcUVGMwNTBJNUgzNklKSk00szC0S0yyN0tLSzJNNUo0tjS2SBE43ZDQEMjI0LdzLzMgAgSA+C0NBUX4KAwMAckMgIw=="; 

export default function WebRTCAudioAgora({ userId, roomId, onStreamReady }: Props) {
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const trackRef = useRef<ILocalAudioTrack | null>(null);

  useEffect(() => {
    const joinAgora = async () => {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        if (mediaType === "audio") {
          remoteUser.audioTrack?.play();
        }
      });

      await client.join(appId, roomId, token, userId);

      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: "music_standard_stereo", // Opcional
      });

      trackRef.current = audioTrack;
      await client.publish([audioTrack]);

      // Exponemos el stream para control externo (opcional)
      const stream = new MediaStream([audioTrack.getMediaStreamTrack()]);
      onStreamReady(stream);
    };

    joinAgora();

    return () => {
      trackRef.current?.stop();
      trackRef.current?.close();
      clientRef.current?.leave();
    };
  }, [userId, roomId]);

  return null;
}
