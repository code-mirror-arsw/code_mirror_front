interface InterviewHeaderProps {
  email: string;
}

export default function InterviewHeader({ email }: InterviewHeaderProps) {
  return (
    <header className="border-b pb-4">
      <h1 className="text-3xl font-bold text-primary dark:text-light">🧑‍💻 Interview Room</h1>
      <p className="text-sm text-muted dark:text-gray-400 mt-1">Usuario: {email}</p>
    </header>
  );
}
