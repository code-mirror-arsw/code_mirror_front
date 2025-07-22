import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import ReactQuill, { Quill } from "react-quill";
import QuillCursors from "quill-cursors";
import ReconnectingModal from "../loading/ReconnectingModal";

import "react-quill/dist/quill.snow.css";
import "./css/code-editor.css";

Quill.register("modules/cursors", QuillCursors);

interface Props {
  roomId: string;
  userId: string;
  submitted: boolean;
}

interface TypingUser {
  id: string;
  name: string;
  color: string;
}

interface WebSocketMessage {
  type: string;
  sender?: string;
  timestamp?: number;
}

export default function CollaborativeDoc({ roomId, userId, submitted }: Props) {
  const quillRef = useRef<ReactQuill>(null);
  const [typing, setTyping] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return localStorage.getItem(`submitted_${roomId}`) === 'true';
  });
  const [submitter, setSubmitter] = useState<string | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  const wsUrl = `wss://codemirrorstream-b6b9evcfaqe3c3cv.canadacentral-01.azurewebsites.net/services/be/stream-service/yjs`;

  useEffect(() => {
    if (!quillRef.current) return;

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(wsUrl, roomId, ydoc);

    ydocRef.current = ydoc;
    providerRef.current = provider;

    provider.on("status", e => {
      setIsConnected(e.status === "connected");
    });

    const yText = ydoc.getText("quill");
    const quill = quillRef.current.getEditor();
    const cursors = quill.getModule("cursors") as QuillCursors;

    const palette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
    const colorIndex = userId
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % palette.length;
    const userColor = palette[colorIndex];

    new QuillBinding(yText, quill, provider.awareness);

    provider.awareness.setLocalStateField("user", {
      name: userId,
      color: userColor,
    });

    // 👂 Escuchar mensajes del WebSocket
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === "final") {
          setIsSubmitted(true);
          localStorage.setItem(`submitted_${roomId}`, 'true');
          provider.awareness.setLocalStateField("submitted", true);
          if (data.sender) {
            setSubmitter(data.sender);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    provider.ws?.addEventListener("message", handleWebSocketMessage);

    // Manejar cambios en el awareness
    const handleAwarenessChange = () => {
      const list: TypingUser[] = [];
      let someoneSubmitted = false;

      provider.awareness.getStates().forEach((state, id) => {
        if (!state.user) return;

        const clientId = String(id);
        const { name, color } = state.user;

        if (!cursors.cursors().some((c: any) => c.id === clientId)) {
          cursors.createCursor(clientId, name, color);
        }

        if (state.selection) {
          cursors.moveCursor(clientId, state.selection);
        }

        list.push({ id: clientId, name, color });

        if (state.submitted === true) {
          someoneSubmitted = true;
          if (state.user.name) {
            setSubmitter(state.user.name);
          }
        }
      });

      setTyping(list);
      if (someoneSubmitted) {
        setIsSubmitted(true);
        localStorage.setItem(`submitted_${roomId}`, 'true');
      }
    };

    provider.awareness.on("change", handleAwarenessChange);

    const onSelectionChange = (sel: any) => {
      provider.awareness.setLocalStateField("selection", sel);
    };

    quill.on("selection-change", onSelectionChange);

    return () => {
      quill.off("selection-change", onSelectionChange);
      provider.ws?.removeEventListener("message", handleWebSocketMessage);
      provider.awareness.off("change", handleAwarenessChange);
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId, userId]);

  // ✅ Emitir mensaje "final" cuando submitted sea true
  useEffect(() => {
    const provider = providerRef.current;
    if (!provider || !submitted) return;

    const msg = JSON.stringify({ 
      type: "final",
      sender: userId,
      timestamp: Date.now()
    });

    const sendFinalMessage = () => {
      if (provider.ws?.readyState === WebSocket.OPEN) {
        provider.ws.send(msg);
      } else {
        const onOpen = () => {
          provider.ws?.send(msg);
          provider.ws?.removeEventListener('open', onOpen);
        };
        provider.ws?.addEventListener('open', onOpen);
      }
    };

    sendFinalMessage();
    provider.awareness.setLocalStateField("submitted", true);
    setIsSubmitted(true);
    localStorage.setItem(`submitted_${roomId}`, 'true');
  }, [submitted, roomId, userId]);

  const modules = {
    cursors: true,
    toolbar: false,
  };

  return (
    <>
      {!isConnected && <ReconnectingModal />}
      <div style={{ width: "100%", height: "90vh" }}>
        <div className="typing-bar">
          {typing.map(u => (
            <div key={u.id} className="typing-pill">
              <span className="dot" style={{ background: u.color }} />
              <span>{u.name} está escribiendo…</span>
            </div>
          ))}
        </div>

        <ReactQuill
          ref={quillRef}
          theme="snow"
          modules={modules}
          readOnly={isSubmitted}
          placeholder={isSubmitted ? "La evaluación ha sido enviada" : "Escribe código colaborativo…"}
          style={{ width: "100%", height: "95%" }}
        />

        {isSubmitted && (
          <div className="text-green-600 font-medium mt-2 text-center p-4 bg-green-100 rounded-lg">
            ✅ Código enviado para evaluación {submitter && `por ${submitter}`}
            <br />
            Ya no se pueden hacer más modificaciones.
          </div>
        )}
      </div>
    </>
  );
}