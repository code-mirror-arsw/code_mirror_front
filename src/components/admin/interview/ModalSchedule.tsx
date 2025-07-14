import { useState, useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Calendar,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { InterviewDto } from "./InterviewList";
import { ErrorModal } from "../../message/ErrorModal";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  interview: InterviewDto | null;
  onScheduled: () => void;
}

export default function ModalSchedule({
  isOpen,
  onOpenChange,
  interview,
  onScheduled,
}: Props) {
  const [date, setDate] = useState<any>(today(getLocalTimeZone()));
  const [time, setTime] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const formattedDate = useMemo(() => {
    if (!date) return "";
    const js = new Date(date.year, date.month - 1, date.day);
    return js.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [date]);

  const save = async () => {
    if (!interview) return;

    const token = Cookies.get("accessToken");
    const d = `${date.year}-${String(date.month).padStart(2, "0")}-${String(
      date.day
    ).padStart(2, "0")}`;
    const dateTime = `${d}T${time}:00`;

    try {
      const res = await fetch(
        `https://codemirrorback-f9hub9hxd4aecwfz.canadacentral-01.azurewebsites.net/services/be/interview-service/interview/${interview.id}/schedule?dateTime=${encodeURIComponent(
          dateTime
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      onOpenChange(false);
      onScheduled();
    } catch {
      setErrorMessage("No se pudo programar la entrevista.");
      setErrorOpen(true);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        scrollBehavior="outside"
      >
        <ModalContent className="mx-auto mt-24 w-full max-w-md max-h-[570px] overflow-auto bg-lightmode-card dark:bg-card-dark rounded-xl shadow-xl text-lightmode-text dark:text-light">
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-medium">
                Programa tu entrevista
              </ModalHeader>

              <ModalBody className="space-y-5 px-4 py-2">
                {interview && (
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold">Oferta:</span> {interview.offerId}
                    </div>
                    <div>
                      <span className="font-semibold">Descripción:</span> {interview.description}
                    </div>
                  </div>
                )}

                <Calendar
                  value={date}
                  onChange={setDate}
                  aria-label="Fecha"
                  minValue={today(getLocalTimeZone())}
                  className="w-full"
                />

                <div className="text-center text-base font-semibold">
                  {formattedDate}
                </div>

                <div className="flex items-center gap-4">
                  <label className="shrink-0 w-16 text-sm font-medium">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="flex-1 rounded-md border px-3 py-2 dark:bg-neutral-700 dark:border-neutral-600"
                  />
                </div>
              </ModalBody>

              <ModalFooter className="px-4 py-2">
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={save} isDisabled={!time || !date}>
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}