import React, { useState } from "react";
import { InputOtp, Button, Spinner } from "@heroui/react";
import { CheckCircle } from "lucide-react";
import VerificationCard from "../../components/codeVerification/VerificationCard";

const VerifyOtpPage: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCodeChange = (val: string): void => {
    const onlyDigits = val.replace(/\D/g, "").slice(0, 6);
    setCode(onlyDigits);
  };

  const isComplete = code.length === 6;

  const handleSubmit = async (): Promise<void> => {
    if (!isComplete || loading) return;
    try {
      setLoading(true);
      const res = await fetch(
        `http://192.168.1.34:8280/auth/verify?code=${code}`,
        { method: "GET" }
      );
      const text = await res.text();
      setMessage(text);
    } catch {
      setMessage(
        "Ocurrió un error al verificar tu código. Intenta nuevamente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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

          {message && (
            <p className="text-center text-sm text-default-500 dark:text-default-400 max-w-sm">
              {message}
            </p>
          )}
        </div>
      </VerificationCard>
    </div>
  );
};

export default VerifyOtpPage;
