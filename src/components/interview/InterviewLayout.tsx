import { useState } from "react";
import { ThemeToggle } from "../changeTheme/ThemeToggle";
import InterviewHeader from "./InterviewHeader";
import EditorSection from "./EditorSection";
import { ParticipantCard } from "./card/ParticipantCard";
import { MyMicToggle } from "./card/MyMicToggle";
import WebRTCAudio from "../audioWRTC/WebRTCAudio";

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

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
  isAdmin
}: InterviewLayoutProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  return (
    <div className="relative min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 px-4 py-8">
      <ThemeToggle />

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 space-y-6">
        <InterviewHeader email={email} />

        {isAdmin ? (
          <div className="text-center text-green-600 text-xl font-semibold">
            🎙️ Eres el administrador. Puedes iniciar la sala de audio.
            {/* Aquí podrías agregar botón para iniciar lógica de backend */}
          </div>
        ) : (
          <>
            <section className="flex justify-center gap-4 flex-wrap">
              {participants.map((p, index) => (
                <ParticipantCard
                  key={p}
                  email={p}
                  color={colors[index % colors.length]}
                />
              ))}
            </section>

            <div className="flex justify-center">
              <MyMicToggle userEmail={email} stream={localStream} />
            </div>

            <EditorSection interviewId={interviewId} email={email} />

            <WebRTCAudio
              userId={email}
              roomId={interviewId}
              onStreamReady={setLocalStream}
            />
          </>
        )}
      </div>
    </div>
  );
}
