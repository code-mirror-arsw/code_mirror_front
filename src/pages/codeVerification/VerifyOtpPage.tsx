import { useState } from "react";
import { InputOtp, Button, Spinner } from "@heroui/react";
import { CheckCircle } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import VerificationCard from "../../components/codeVerification/VerificationCard";
import { ErrorModal } from "../../components/message/ErrorModal";
import { SuccessModal } from "../../components/message/SuccessModal";

const VerifyOtpPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();

  const handleCodeChange = (val: string) => {
    const onlyDigits = val.replace(/\D/g, "").slice(0, 6);
    setCode(onlyDigits);
  };

  const isComplete = code.length === 6;

  const handleSubmit = async () => {
    if (!isComplete || loading) return;

    setLoading(true);
    const token = Cookies.get("accessToken");

    try {
      const res = await fetch(`https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/auth/verify?code=${code}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
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

      setSuccessOpen(true);
      setCode("");
    } catch {
      setErrorMessage("Ocurrió un error al verificar tu código. Intenta nuevamente más tarde.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SuccessModal open={successOpen} message="Código verificado correctamente" onClose={() => setSuccessOpen(false)} />
      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <VerificationCard>
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex justify-center w-full">
              <InputOtp
                length={6}
                value={code}
                onValueChange={handleCodeChange}
                variant="bordered"
                color="primary"
                size="lg"
                radius="md"
                classNames={{
                  base: "flex gap-2",
                  segment:
                    "w-12 h-12 text-lg font-bold bg-white dark:bg-gray-800 rounded-lg " +
                    "border-2 border-blue-600 shadow-inner " +
                    "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-offset-2 data-[focus-visible=true]:ring-blue-500 " +
                    "data-[has-value=true]:bg-blue-50 dark:data-[has-value=true]:bg-blue-900/20",
                }}
              />
            </div>

            <Button
              color="primary"
              variant="shadow"
              size="lg"
              radius="lg"
              fullWidth
              onClick={handleSubmit}
              disabled={!isComplete || loading}
              startContent={!loading && <CheckCircle size={18} />}
              className="font-semibold tracking-wide"
            >
              {loading ? <Spinner size="sm" /> : "Verificar"}
            </Button>
          </div>
        </VerificationCard>
      </div>
    </>
  );
};

export default VerifyOtpPage;
