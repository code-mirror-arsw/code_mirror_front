import CollaborativeEditor from "../../components/editor/CollaborativeDoc";

interface EditorSectionProps {
  interviewId: string;
  email: string;
  hasSubmitted: boolean;
}

export default function EditorSection({ interviewId, email, hasSubmitted }: EditorSectionProps) {
  return (
    <div className="space-y-4">
      <CollaborativeEditor roomId={interviewId} userId={email} submitted={hasSubmitted} />
    </div>
  );
}
