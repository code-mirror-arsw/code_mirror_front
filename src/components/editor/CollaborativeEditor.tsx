import { useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import Editor, { OnMount } from "@monaco-editor/react";
import { CursorsStyles } from "./CursorsStyles";

export default function CollaborativeEditor({
  roomId,
  userEmail,
}: {
  roomId: string;
  userEmail: string;
}) {
  const editorRef = useRef<any>(null);
  const awarenessRef = useRef<WebsocketProvider["awareness"] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;

    console.log("🔵 Editor montado, creando WebSocket para room:", roomId);

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:1234/room", roomId, ydoc);

    const yText = ydoc.getText("monaco");

    const awareness = provider.awareness;
    awareness.setLocalStateField("user", {
      name: userEmail,
      color: getColorForUser(userEmail),
    });
    awarenessRef.current = awareness;

    const binding = new MonacoBinding(
      yText,
      editor.getModel(),
      new Set([editor]),
      awareness
    );

    // Cleanup cuando se desmonta
    return () => {
      binding.destroy();
      provider.destroy();
      ydoc.destroy();
    };
  };

  return (
    <>
      <Editor
        height="60vh"
        defaultLanguage="javascript"
        theme="vs-dark"
        onMount={handleMount}
      />
      {awarenessRef.current && <CursorsStyles awareness={awarenessRef.current} />}
    </>
  );
}

function getColorForUser(email: string) {
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
  const hash = Array.from(email).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
