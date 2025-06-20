import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import Editor, { OnMount } from '@monaco-editor/react';

export default function CollaborativeEditor({ roomId }: { roomId: string }) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', roomId, ydoc);
    const yText = ydoc.getText('monaco');
    const binding = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    return () => {
      provider.destroy();
      ydoc.destroy();
      binding.destroy();
    };
  }, [roomId]);

  const handleMount: OnMount = editor => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="60vh"
      defaultLanguage="java"
      theme="vs-dark"
      onMount={handleMount}
    />
  );
}
