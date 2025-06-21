import { useState, useEffect } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

interface MyMicToggleProps {
  userEmail: string;
  stream: MediaStream | null;
}

export function MyMicToggle({ userEmail, stream }: MyMicToggleProps) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = enabled; // Activa o desactiva el audio
      });
    }
  }, [enabled, stream]);

  const toggleMic = () => {
    setEnabled(prev => !prev);
    console.log(`[🎙️] ${enabled ? "Mic off" : "Mic on"} for ${userEmail}`);
  };

  return (
    <button
      onClick={toggleMic}
      className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg
        ${enabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
    >
      {enabled ? (
        <>
          <FaMicrophone size={20} />
          Micrófono activo
        </>
      ) : (
        <>
          <FaMicrophoneSlash size={20} />
          Micrófono apagado
        </>
      )}
    </button>
  );
}
