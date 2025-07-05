import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { QuillBinding } from "y-quill";
import ReactQuill, { Quill } from "react-quill";
import QuillCursors from "quill-cursors";



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

  useEffect(() => {
    if (!quillRef.current) return;

    const ydoc     = new Y.Doc();
    const provider = new WebsocketProvider("ws://localhost:8084/yjs", roomId, ydoc);
    const yText    = ydoc.getText("quill");

    const quill   = quillRef.current.getEditor();
    const cursors = quill.getModule("cursors") as QuillCursors;

    const palette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
    const color   = palette[
      userId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % palette.length
    ];

    new QuillBinding(yText, quill, provider.awareness);

    provider.awareness.setLocalStateField("user", { name: userId, color });

    const updateUI = () => {
      const list: TypingUser[] = [];

      provider.awareness.getStates().forEach((state, id) => {
        if (!state.user) return;
        if (!state.selection) return;

        if (!cursors.cursors().some((c: any) => c.id === String(id))) {
          cursors.createCursor(String(id), state.user.name, state.user.color);
        }
        cursors.moveCursor(String(id), state.selection);

        list.push({ id: String(id), ...state.user });
      });

      setTyping(list);
    };
    provider.awareness.on("change", updateUI);

    quill.on("selection-change", sel =>
      provider.awareness.setLocalStateField("selection", sel)
    );

    return () => {
      quill.off("selection-change");
      provider.awareness.off("change", updateUI);
      provider.destroy();
      ydoc.destroy();
    };
  }, [roomId, userId]);

  const modules = { cursors: true, toolbar: false };

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <div className="typing-bar">
        {typing.map(u => (
          <div key={u.id} className="typing-pill">
            <span className="dot" style={{ background: u.color }} />
            <span>{u.name} está escribiendo…</span>
          </div>
        ))}
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        placeholder="Escribe código colaborativo…"
        style={{ width: "100%", height: "95%" }}
      />
    </div>
  );
}
