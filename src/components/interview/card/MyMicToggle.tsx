import { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

interface MyMicToggleProps {
  userEmail: string;
}

export function MyMicToggle({ userEmail }: MyMicToggleProps) {
  const [enabled, setEnabled] = useState(true);

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
