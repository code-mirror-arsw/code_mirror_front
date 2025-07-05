import { useState, useEffect } from "react";
import { ThemeToggle } from "../changeTheme/ThemeToggle";
import InterviewHeader from "./InterviewHeader";
import EditorSection from "./EditorSection";
import { ParticipantCard } from "./card/ParticipantCard";
import { MyMicToggle } from "./card/MyMicToggle";
import WebRTCAudio from "../audioWRTC/WebRTCAudio";

function getCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(name: string, value: string, secs = 60 * 60) {
  document.cookie = `${name}=${encodeURIComponent(value)};max-age=${secs};path=/`;
}

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

interface InterviewLayoutProps {
  email: string;
  participants?: string[];
  interviewId: string;
  isAdmin: boolean;
}

export default function InterviewLayout({
  email,
  participants = [],
  interviewId,
  isAdmin,
}: InterviewLayoutProps) {
  const [roomId, setRoomId] = useState<string | null>(
    () => getCookie(`room_${interviewId}`)
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  const startRoom = async () => {
    try {
      const res = await fetch("http://localhost:8084/room/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewerId: interviewId,
          participants,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRoomId(data.roomId);
        setCookie(`room_${interviewId}`, data.roomId);
      } else {
        alert("❌ " + data.message);
      }
    } catch {
      alert("❌ Error de red al crear la sala");
    }
  };

  useEffect(() => {
    if (isAdmin || roomId) return; 

    const fetchExistingRoom = async () => {
      try {
        const res = await fetch(`http://localhost:8084/room/${interviewId}`);
        if (res.ok) {
          const { roomId: id } = await res.json();
          setRoomId(id);
          setCookie(`room_${interviewId}`, id);
        }
      } catch {
      }
    };

    fetchExistingRoom();
    const pollId = setInterval(fetchExistingRoom, 5000);
    return () => clearInterval(pollId);
  }, [interviewId, isAdmin, roomId]);

  return (
    <div className="relative min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 px-4 py-8">
      <ThemeToggle />

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 space-y-6">
        <InterviewHeader email={email} />

        {isAdmin && !roomId && (
          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={startRoom}
            >
              Iniciar entrevista 🎙️
            </button>
          </div>
        )}

        {!isAdmin && !roomId && (
          <div className="text-center text-yellow-600 font-medium">
            💬 La llamada aún no está disponible.
            <br />
            Por favor, espera a que el entrevistador la inicie.
          </div>
        )}

        {roomId && (
          <>
            <section className="flex justify-center gap-4 flex-wrap">
              {participants.map((p, i) => (
                <ParticipantCard
                  key={p}
                  email={p}
                  color={colors[i % colors.length]}
                />
              ))}
            </section>

            <div className="flex justify-center">
              <MyMicToggle userEmail={email} stream={localStream} />
            </div>

            <EditorSection interviewId={roomId} email={email}/>

            <WebRTCAudio
              userId={email}
              roomId={roomId}
              onStreamReady={setLocalStream}
            />
          </>
        )}
      </div>
    </div>
  );
}
