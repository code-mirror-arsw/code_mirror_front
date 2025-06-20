import CollaborativeEditor  from "../../components/editor/CollaborativeEditor";

interface EditorSectionProps {
  interviewId: string;
  email: string;
}

export default function EditorSection({ interviewId, email }: EditorSectionProps) {
  return (
    <div className="space-y-4">
      <CollaborativeEditor roomId={interviewId} />
      
      <div className="flex justify-end">
        <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Enviar ▶️
        </button>
      </div>
    </div>
  );
}
