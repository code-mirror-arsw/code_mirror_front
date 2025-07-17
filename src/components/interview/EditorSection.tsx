import CollaborativeEditor from "../../components/editor/CollaborativeDoc";

interface EditorSectionProps {
  interviewId: string;
  email: string;
}

export default function EditorSection({ interviewId, email }: EditorSectionProps) {
  return (
    <div className="space-y-4">
      <CollaborativeEditor roomId={interviewId} userId={email} />
      <div className="flex justify-end">
      </div>
    </div>
  );
}
