"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  TimeInput,
} from "@heroui/react";
import { useState } from "react";
import { CalendarDate, Time } from "@internationalized/date";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../../message/ErrorModal";
import { InterviewDto } from "./InterviewList";

const BASE_URL =
  "http://localhost:8280/services/be/interview-service/interview";

interface Props {
  interview: InterviewDto | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleInterviewModal({
  interview,
  onClose,
  onSuccess,
}: Props) {
  const [date, setDate] = useState<CalendarDate | null>(null);
  const [time, setTime] = useState<Time | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  if (!interview) return null;

  const handleSave = async () => {
    if (!date || !time) return;
    setSaving(true);

    const combined = new Date(
      date.year,
      date.month - 1,
      date.day,
      time.hour,
      time.minute,
      time.second ?? 0
    );

    const iso = combined.toISOString();
    const token = Cookies.get("accessToken");

    try {
      const res = await fetch(
        `${BASE_URL}/${interview.id}/schedule?dateTime=${encodeURIComponent(
          iso
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

      onSuccess();
      onClose();
    } catch {
      setErrorMessage("No se pudo programar la entrevista.");
      setErrorOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={!!interview}
        onOpenChange={onClose}
        backdrop="blur"
        placement="center"
        className="p-0"
      >
        <ModalContent className="max-w-sm w-full bg-lightmode-card dark:bg-card-dark rounded-xl shadow-xl text-lightmode-text dark:text-light">
          {() => (
            <>
              <ModalHeader className="pb-0 text-base font-semibold">
                Programar entrevista
              </ModalHeader>

              <ModalBody className="space-y-4 pt-2">
                <DatePicker
                  label="Fecha"
                  value={date}
                  onChange={setDate}
                  radius="sm"
                  className="w-full"
                />

                <TimeInput
                  label="Hora"
                  value={time}
                  onChange={setTime}
                  granularity="minute"
                  radius="sm"
                  className="w-full"
                />
              </ModalBody>

              <ModalFooter className="pt-0">
                <Button variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  isLoading={saving}
                  disabled={!date || !time}
                  onPress={handleSave}
                >
                  Guardar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </>
  );
}