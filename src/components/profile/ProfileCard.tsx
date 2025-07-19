import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
  Badge,
} from "@heroui/react";
import { FileCheck2, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CVUploadButton from "@/components/profile/CVUploadButton";
import { ErrorModal } from "../message/ErrorModal";

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  uriCvFile: string | null;
  role: "ADMIN" | "CLIENT";
}

export default function ProfileCard() {
  const [user, setUser] = useState<User | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const cookieId = Cookies.get("id");
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!cookieId) return;

    const controller = new AbortController();

    fetch(`https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/user-service/users/${cookieId}`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          setErrorMessage("Debes tener iniciada sesión.");
          setErrorOpen(true);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("userRole");
          Cookies.remove("userEmail");
          Cookies.remove("id");
          setTimeout(() => navigate("/"), 2000);
          return Promise.reject("unauthorized");
        }
        return r.ok ? r.json() : Promise.reject(r.status);
      })
      .then(setUser)
      

    return () => controller.abort();
  }, [cookieId, token, navigate]);

  const handleDownloadCV = async () => {
    if (!user) return;
    try {
      const res = await fetch(`https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/user-service/cv/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Error al descargar el CV");
      setErrorOpen(true);
    }
  };

  if (!user)
    return <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />;

  const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(`${user.name} ${user.lastName}`)}`;
  const isClient = user.role === "CLIENT";
  const cvReady = !!(user.uriCvFile && user.uriCvFile.trim());

  return (
    <>
      <div className="flex justify-center items-center py-10">
        <Card radius="lg" shadow="lg" className="w-96 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="relative">
            <Image alt="avatar" height={200} width={384} src={avatar} className="w-full h-52 object-cover" />
            <CardHeader className="absolute top-4 right-4">
              <Badge size="sm" className="bg-blue-600/90 text-white px-2 py-0.5 rounded">
                {isClient ? "Cliente" : "Admin"}
              </Badge>
            </CardHeader>
          </div>

          <CardBody className="flex flex-col items-center gap-1 px-6 pt-6 pb-4 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {user.name} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
          </CardBody>

          {isClient && (
            <CardBody className="px-6 pt-4 pb-6 border-t border-gray-100 dark:border-zinc-700">
              {cvReady ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <FileCheck2 size={20} />
                    <span className="font-medium text-sm">CV listo para postulación</span>
                  </div>

                  <div className="flex w-full gap-3">
                    <Button size="sm" radius="lg" className="w-fit mx-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-lg font-semibold leading-none hover:bg-blue-700" onPress={handleDownloadCV}>
                      Ver CV
                    </Button>

                    <CVUploadButton userId={user.id} uriCvFile={user.uriCvFile} onUploaded={(uri) => setUser((u) => (u ? { ...u, uriCvFile: uri } : u))}>
                      {(openPicker, uploading) => (
                        <Button size="sm" radius="lg" startContent={<RefreshCcw size={18} />} className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-800/40 dark:text-blue-200 disabled:opacity-50" isDisabled={uploading} onPress={openPicker}>
                          Actualizar
                        </Button>
                      )}
                    </CVUploadButton>
                  </div>
                </div>
              ) : (
                <CVUploadButton userId={user.id} uriCvFile={user.uriCvFile} onUploaded={(uri) => setUser((u) => (u ? { ...u, uriCvFile: uri } : u))} />
              )}
            </CardBody>
          )}

          <CardFooter className="px-6 py-4 border-t border-gray-100 dark:border-zinc-700">
            <Button size="sm" radius="lg" className="w-full bg-blue-800 text-white hover:bg-blue-900">
              Editar perfil
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}
