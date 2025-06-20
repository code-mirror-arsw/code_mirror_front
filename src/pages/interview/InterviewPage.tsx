import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decryptAESBase64Url, parseInterviewData } from "../../util/crypto";
import { MonacoEditor } from "../../components/editor/MonacoEditor";

export default function InterviewPage() {
  const { data } = useParams<{ data: string }>();
  const [valid, setValid] = useState(false);
  const [interviewId, setInterviewId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!data) {
      setError("Missing data param");
      return;
    }

    (async () => {
      try {
        const decrypted = await decryptAESBase64Url(data);
        const { interviewId, email, fecha } = parseInterviewData(decrypted);

        const fechaISO = new Date(fecha);
        if (isNaN(fechaISO.getTime())) {
          throw new Error("Invalid date format");
        }

        const now = new Date();
        if (fechaISO < now) {
          throw new Error("Link has expired");
        }

        setInterviewId(interviewId);
        setEmail(email);
        setValid(true);
      } catch (err: any) {
        setError(err.message || "Error parsing link");
      }
    })();
  }, [data]);

  if (!valid) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-red-600">{error || "Invalid or expired link"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Interview Room</h1>
        <p className="text-sm">Interview ID: {interviewId} • User: {email}</p>
      </header>

      <div className="flex flex-col gap-4">
        <MonacoEditor />
        <button className="self-end px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Run Code
        </button>
      </div>
    </div>
  );
}
