import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ThemeToggle } from "../changeTheme/ThemeToggle";
import InterviewHeader from "./InterviewHeader";
import EditorSection from "./EditorSection";
import { ParticipantCard } from "./card/ParticipantCard";
import { MyMicToggle } from "./card/MyMicToggle";
import WebRTCAudio from "../audioWRTC/WebRTCAudio";
import { ErrorModal } from "../../components/message/ErrorModal";

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
  const [roomId, setRoomId] = useState<string | null>(() => getCookie(`room_${interviewId}`));
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");

  const startRoom = async () => {
    try {
      const res = await fetch("http://20.63.88.120/8280/services/be/stream-service/room/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interviewerId: interviewId, participants }),
      });

      if (res.status === 401) {
        setErrorMessage("Debes tener iniciada sesión.");
        setErrorOpen(true);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("userRole");
        Cookies.remove("userEmail");
        Cookies.remove("id");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setRoomId(data.roomId);
        setCookie(`room_${interviewId}`, data.roomId);
      } else {
        setErrorMessage(data.message || "No se pudo crear la sala.");
        setErrorOpen(true);
      }
    } catch {
      setErrorMessage("Error de red al crear la sala.");
      setErrorOpen(true);
    }
  };

  useEffect(() => {
    if (isAdmin || roomId) return;

    const controller = new AbortController();

    const fetchExistingRoom = async () => {
      try {
        const res = await fetch(`http://20.63.88.120/8280/services/be/stream-service/room/${interviewId}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          setErrorMessage("Debes tener iniciada sesión.");
          setErrorOpen(true);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("userRole");
          Cookies.remove("userEmail");
          Cookies.remove("id");
          setTimeout(() => navigate("/"), 2000);
          controller.abort();
          return;
        }

        if (res.ok) {
          const { roomId: id } = await res.json();
          if (id) {
            setRoomId(id);
            setCookie(`room_${interviewId}`, id);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setErrorMessage("Error al consultar la sala de entrevista.");
          setErrorOpen(true);
        }
      }
    };

    fetchExistingRoom();
    const pollId = setInterval(fetchExistingRoom, 5000);
    return () => {
      clearInterval(pollId);
      controller.abort();
    };
  }, [interviewId, isAdmin, roomId, token, navigate]);

  return (
    <>
      <div className="relative min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 px-4 py-8">
        <ThemeToggle />

        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 space-y-6">
          <InterviewHeader email={email} />

          {isAdmin && !roomId && (
            <div className="flex justify-center">
              <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition" onClick={startRoom}>
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
                  <ParticipantCard key={p} email={p} color={colors[i % colors.length]} />
                ))}
              </section>

              <div className="flex justify-center">
                <MyMicToggle userEmail={email} stream={localStream} />
              </div>

              <EditorSection interviewId={roomId} email={email} />

              <WebRTCAudio userId={email} roomId={roomId} onStreamReady={setLocalStream} />
            </>
          )}
        </div>
      </div>

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}