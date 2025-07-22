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
import { SuccessModal } from "../../components/message/SuccessModal";
import { ProblemModal } from "../interview/problem/ProblemModal";

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

interface Problem {
  title: string;
  description: string;
  language?: string;
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
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");

  const startRoom = async () => {
  try {
    console.log("🔐 Enviando token:", token);

    const res = await fetch("https://codemirrorstream-b6b9evcfaqe3c3cv.canadacentral-01.azurewebsites.net/services/be/stream-service/room/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ interviewerId: interviewId, participants }),
    });

    console.log("📡 startRoom status:", res.status);

    const text = await res.text();
    console.log("📦 startRoom response:", text);

    if (res.status === 401) {
      handleSessionExpired();
      return;
    }

    if (res.ok) {
      const data = JSON.parse(text);
      setRoomId(data.roomId);
      setCookie(`room_${interviewId}`, data.roomId);
    } else {
      setErrorMessage("Error: " + text);
      setErrorOpen(true);
    }
  } catch (e) {
    console.error("❌ Error de red al crear la sala:", e);
    setErrorMessage("Error de red al crear la sala.");
    setErrorOpen(true);
  }
};


  const handleSessionExpired = () => {
    setErrorMessage("Debes tener iniciada sesión.");
    setErrorOpen(true);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("userRole");
    Cookies.remove("userEmail");
    Cookies.remove("id");
    setTimeout(() => navigate("/"), 2000);
  };

  const fetchLanguage = async () => {
    try {
      const cached = localStorage.getItem(`language_${roomId}`);
      if (cached) {
        setLanguage(cached);
        return;
      }

      const res = await fetch(
        `https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/interview-service/interview/language?id=${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok && data.language?.language) {
        setLanguage(data.language.language);
        localStorage.setItem(`language_${roomId}`, data.language.language);
      } else {
        setLanguage("java");
      }
    } catch {
      setLanguage("java");
    }
  };

  const fetchAdminEmail = async () => {
    try {
      const res = await fetch(
        `https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/interview-service/interview/admin?id=${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok && data.email) {
        setAdminEmail(data.email);
      }
    } catch {
      console.error("No se pudo obtener el adminEmail.");
    }
  };

  const fetchProblem = async () => {
    if (!roomId) return;

    const cached = localStorage.getItem(`problem_${roomId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      setProblem(parsed);
      setShowProblemModal(true);
      return;
    }

    setSuccessMessage("Cargando...");
    setSuccessOpen(true);

    try {
      const res = await fetch(`https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/code-service/code?roomId=${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: language || "java" }),
      });

      const data = await res.json();
      if (res.ok) {
        const prob = { title: data.title, description: data.description };
        setProblem(prob);
        localStorage.setItem(`problem_${roomId}`, JSON.stringify(prob));
        setShowProblemModal(true);
      } else {
        setErrorMessage("No se pudo cargar el problema.");
        setErrorOpen(true);
      }
    } catch {
      setErrorMessage("Error de red al consultar el problema.");
      setErrorOpen(true);
    } finally {
      setTimeout(() => {
        setSuccessOpen(false);
      }, 200);
    }
  };

  const submitCode = async () => {
    if (!roomId) return;

    const editor = document.querySelector(".ql-editor");
    const solutionCode = editor?.textContent?.trim();
    if (!solutionCode) {
      setErrorMessage("No hay código para enviar.");
      setErrorOpen(true);
      return;
    }

    const existingResult = localStorage.getItem(`result_${roomId}`);
    if (existingResult) {
      const parsed = JSON.parse(existingResult);
      const {  score, feedback } = parsed;
      const msg = `✅ Evaluado con éxito\nPuntaje: ${score}/100\n\n💬 ${feedback}`;
      setSuccessMessage(msg);
      setSuccessOpen(true);
      return;
    }

    const payload = {
      solutionCode,
      participants,
      adminEmail,
    };

    setSuccessMessage("Enviando código...");
    setSuccessOpen(true);

    try {
      const res = await fetch(
        `https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/code-service/code/grade?roomId=${roomId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        const { success, score, feedback } = data;
        const msg = success
          ? `✅ Evaluado con éxito\nPuntaje: ${score}/100\n\n💬 ${feedback}`
          : `❌ Falló la evaluación\n\n💬 ${feedback || "Revisa tu código"}`;
        setSuccessMessage(msg);
        localStorage.setItem(`result_${roomId}`, JSON.stringify(data));
      } else {
        setErrorMessage(data.message || "No se pudo evaluar el código.");
        setErrorOpen(true);
      }
    } catch {
      setErrorMessage("Error de red al enviar el código.");
      setErrorOpen(true);
    } finally {
      setTimeout(() => {
        setSuccessOpen(false);
      }, 5000);
    }
  };

  useEffect(() => {
    if (isAdmin || roomId) return;

    const controller = new AbortController();

    const fetchExistingRoom = async () => {
      try {
        const res = await fetch(`https://codemirrorstream-b6b9evcfaqe3c3cv.canadacentral-01.azurewebsites.net/services/be/stream-service/room/${interviewId}`, {
          signal: controller.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          handleSessionExpired();
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

  useEffect(() => {
    if (roomId) {
      fetchLanguage();
      fetchAdminEmail();
    }
  }, [roomId]);

  return (
    <>
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
              💬 La llamada aún no está disponible.<br />
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
              <div className="flex justify-center gap-4">
                <button
                  onClick={fetchProblem}
                  className="mb-4 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  📘 Ver problema
                </button>
                <button
                  onClick={submitCode}
                  className="mb-4 px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  🚀 Enviar código
                </button>
              </div>
              <EditorSection interviewId={roomId} email={email} />
              <WebRTCAudio userId={email} roomId={roomId} onStreamReady={setLocalStream} />
            </>
          )}
        </div>
      </div>
      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
      <SuccessModal open={successOpen} message={successMessage} onClose={() => setSuccessOpen(false)} />
      {problem && (
        <ProblemModal
          open={showProblemModal}
          title={problem.title}
          description={`${problem.description}\n\nLenguaje: ${problem.language || language || "java"}`}
          onClose={() => setShowProblemModal(false)}
        />
      )}
    </>
  );
}
