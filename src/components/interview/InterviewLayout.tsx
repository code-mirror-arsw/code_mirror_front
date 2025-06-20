import { ThemeToggle } from "../changeTheme/ThemeToggle";
import InterviewHeader from "../interview/InterviewHeader";
import EditorSection from "../interview/EditorSection";
import { ParticipantCard } from "../interview/card/ParticipantCard";
import { MyMicToggle } from "../interview/card/MyMicToggle";

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

interface InterviewLayoutProps {
  email: string;
  participants?: string[];
  interviewId: string;
}

export default function InterviewLayout({
  email,
  participants = [],
  interviewId
}: InterviewLayoutProps) {
  return (
    <div className="relative min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 px-4 py-8">
      <ThemeToggle />

      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 space-y-6">
        <InterviewHeader email={email} />

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
          <MyMicToggle userEmail={email} />
        </div>

        <EditorSection interviewId={interviewId} email={email} />
      </div>
    </div>
  );
}
