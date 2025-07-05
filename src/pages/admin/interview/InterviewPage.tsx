import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { decryptAESBase64Url, parseInterviewData } from "../../../util/crypto";
import InterviewLayout from "../../../components/interview/InterviewLayout";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function InterviewPage() {
  const query = useQuery();
  const data  = query.get("data");

  const [valid,  setValid]  = useState(false);
  const [email,  setEmail]  = useState("");
  const [interviewId,  setInterviewId]  = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error,  setError]  = useState("");

  useEffect(() => {
    if (!data) {
      setError("Missing data param");
      return;
    }

    (async () => {
      try {
        const decrypted = await decryptAESBase64Url(data);
        const parsed    = parseInterviewData(decrypted);
        console.log("[🔍 Desencriptado]:", parsed);

        const fechaISO = new Date(parsed.fecha);
        if (isNaN(fechaISO.getTime())) throw new Error("Invalid date format");
        if (fechaISO > new Date())     throw new Error("Link has expired");

        const url = `http://localhost:8081/services/be/user-service/users/role/email/${parsed.email}`;
        const res = await fetch(url);

        if (!res.ok) throw new Error(`Role request failed (${res.status})`);

        let raw = await res.text();              // ejemplo:  "ADMIN"\r\n
        console.log("↩️ raw text:", JSON.stringify(raw));

        raw = raw.replace(/"/g, "").trim().toUpperCase(); // ADMIN

        setIsAdmin(raw === "ADMIN");

        setEmail(parsed.email);
        setInterviewId(parsed.interviewId);
        setParticipants(parsed.participants || []);
        setValid(true);
      } catch (err: any) {
        setError(err.message || "Error parsing link");
      }
    })();
  }, [data]);

  if (!valid) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center text-red-600">
          {error || "Invalid or expired link"}
        </div>
      </div>
    );
  }

  return (
    <InterviewLayout
      email={email}
      participants={participants}
      interviewId={interviewId}
      isAdmin={isAdmin}
    />
  );
}
