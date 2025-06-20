
import Editor from '@monaco-editor/react';
import { useState } from 'react';

type MonacoEditorProps = { initialCode?: string };

export function MonacoEditor({ initialCode = '// start coding...' }: MonacoEditorProps) {
  const [code, setCode] = useState(initialCode);

  return (
    <Editor
      height="60vh"
      defaultLanguage="java"
      value={code}
      theme="vs-dark"
      onChange={(value) => setCode(value || '')}
    />
  );
}
