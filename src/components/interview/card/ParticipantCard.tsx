

interface ParticipantCardProps {
  email: string;
  color: string;
}

export function ParticipantCard({ email, color }: ParticipantCardProps) {
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="w-24 text-center flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <p className="text-xs break-all text-gray-700 dark:text-gray-300">{email}</p>
    </div>
  );
}
