'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
  TimeInput,
} from '@heroui/react';
import { useState } from 'react';
import {
  CalendarDate, 
  Time,         
} from '@internationalized/date';

import { InterviewDto } from './InterviewList';

const BASE_URL =
  'http://localhost:8083/services/be/interview-service/interview';

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
      time.second ?? 0,
    );

    const iso = combined.toISOString(); 

    try {
      const res = await fetch(
        `${BASE_URL}/${interview.id}/schedule?dateTime=${encodeURIComponent(
          iso,
        )}`,
        { method: 'PUT' },
      );
      if (!res.ok) throw new Error('Schedule failed');
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!interview}
      onOpenChange={onClose}
      backdrop="blur"
      placement="center"
      className="p-0"
    >
      <ModalContent className="max-w-sm w-full">
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
  );
}
