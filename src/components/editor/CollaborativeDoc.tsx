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
}

interface TypingUser {
  id: string;
  name: string;
  color: string;
}

export default function CollaborativeDoc({ roomId, userId }: Props) {
  const quillRef = useRef<ReactQuill>(null);
  const [typing, setTyping] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const wsUrl = `wss://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/stream-service/yjs`;

  useEffect(() => {
    const storedResult = localStorage.getItem(`submission_${roomId}`);
    if (storedResult) setIsSubmitted(true);
  }, [roomId]);

  const connect = () => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(wsUrl, roomId, ydoc);

    ydocRef.current = ydoc;
    providerRef.current = provider;

    provider.on("status", e => {
      if (e.status === "connected") {
        setIsConnected(true);
        flushLocalChanges();
      } else if (e.status === "disconnected") {
        setIsConnected(false);
      }
    });

    const yText = ydoc.getText("quill");
    const quill = quillRef.current!.getEditor();
    const cursors = quill.getModule("cursors") as QuillCursors;

    const palette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
    const color =
      palette[userId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % palette.length];

    new QuillBinding(yText, quill, provider.awareness);
    provider.awareness.setLocalStateField("user", { name: userId, color });

    const updateUI = () => {
      const list: TypingUser[] = [];
      provider.awareness.getStates().forEach((state, id) => {
        if (!state.user || !state.selection) return;
        if (!cursors.cursors().some((c: any) => c.id === String(id))) {
          cursors.createCursor(String(id), state.user.name, state.user.color);
        }
        cursors.moveCursor(String(id), state.selection);
        list.push({ id: String(id), ...state.user });
      });
      setTyping(list);
    };

    provider.awareness.on("change", updateUI);

    quill.on("text-change", delta => {
      if (!provider.wsconnected) {
        saveToLocal(delta);
      }
    });

    quill.on("selection-change", sel =>
      provider.awareness.setLocalStateField("selection", sel)
    );
  };

  const saveToLocal = (delta: any) => {
    const changes = JSON.parse(localStorage.getItem("offlineChanges") || "[]");
    changes.push(delta);
    localStorage.setItem("offlineChanges", JSON.stringify(changes));
  };

  const flushLocalChanges = () => {
    const quill = quillRef.current?.getEditor();
    const changes = JSON.parse(localStorage.getItem("offlineChanges") || "[]");
    changes.forEach((delta: any) => {
      quill?.updateContents(delta);
    });
    localStorage.removeItem("offlineChanges");
  };

  useEffect(() => {
    if (!quillRef.current) return;
    connect();
    return () => {
      providerRef.current?.destroy();
      ydocRef.current?.destroy();
    };
  }, []);

  const modules = { cursors: true, toolbar: false };

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
          placeholder="Escribe código colaborativo…"
          style={{ width: "100%", height: "95%" }}
        />

        {isSubmitted && (
          <div className="text-green-600 font-medium mt-2 text-center">
            ✅ Código enviado
          </div>
        )}
      </div>
    </>
  );
}
