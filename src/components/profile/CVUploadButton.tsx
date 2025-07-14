import { useRef, useState, ReactNode } from "react";
import { Progress } from "@heroui/react";
import { UploadCloud, FileText } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../message/ErrorModal";
import "./CVUploadButton.css";

export interface CVUploadButtonProps {
  userId: string;
  onUploaded?: (uri: string) => void;
  uriCvFile?: string | null;
  children?: (openPicker: () => void, uploading: boolean) => ReactNode;
}

export default function CVUploadButton({ userId, onUploaded, uriCvFile, children }: CVUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const openPicker = () => inputRef.current?.click();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = Cookies.get("accessToken");
    setFileName(file.name);
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`https://codemirrorback-f9hub9hxd4aecwfz.canadacentral-01.azurewebsites.net/services/be/user-service/cv/upload/${userId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.status === 401) {
        setErrorMessage("Debes tener iniciada sesión.");
        setErrorOpen(true);
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("userRole");
        Cookies.remove("userEmail");
        Cookies.remove("id");
        setTimeout(() => navigate("/"), 2000);
        return;
      }

      if (!res.ok) throw new Error();

      const uri = await res.text();
      onUploaded?.(uri);
    } catch {
      setErrorMessage("Error al subir CV. Inténtalo de nuevo.");
      setErrorOpen(true);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!children && uriCvFile) return null;

  return (
    <>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} />

      {children ? (
        children(openPicker, uploading)
      ) : uploading ? (
        <Progress isIndeterminate className="w-full h-2 bg-blue-100 dark:bg-blue-800" />
      ) : (
        <div onClick={openPicker} role="button" className="w-full rounded-lg border-2 border-dashed border-blue-600/80 p-5 hover:bg-blue-50/60 dark:hover:bg-zinc-800/60 cursor-pointer select-none transition-colors">
          <div className="flex flex-col items-center gap-3">
            <UploadCloud className="w-9 h-9 text-blue-600" strokeWidth={1.5} />
            <p className="text-base font-semibold text-blue-600">Subir Hoja de vida</p>
          </div>

          <div className="flex items-center justify-center mt-4 bg-blue-600/10 dark:bg-blue-600/20 rounded-md px-4 py-3">
            <FileText className="w-5 h-5 text-blue-600 shrink-0 mr-2" />
            <p className="text-sm text-gray-700 dark:text-gray-200 truncate">{fileName ?? "No file selected"}</p>
          </div>
        </div>
      )}

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}
