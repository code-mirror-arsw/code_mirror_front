import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Spinner,
} from "@heroui/react";

import ModalSchedule from "./ModalSchedule";
import { OfferListCard } from "../../offers/offersCreated/OfferListCard";

export interface InterviewDto {
  id: string;
  offerId: string;
  adminEmail: string;
  scheduledAt: string | null;
  description: string;
  link: string | null;
  participants: string[];
  status: "NOT_SCHEDULED" | "SCHEDULED" | "STARTED" | "FINISHED";
}

const BASE_URL =
  "http://192.168.1.34:8083/services/be/interview-service/interview";

interface Props {
  adminEmail: string;
}

export default function InterviewList({ adminEmail }: Props) {
  const [interviews, setInterviews] = useState<InterviewDto[]>([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<InterviewDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/adminEmail/${adminEmail}?page=${page}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInterviews(data.content);
      setPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [adminEmail, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openModal = (interview: InterviewDto) => {
    setSelected(interview);
    setModalOpen(true);
  };

  const handleScheduled = () => {
    setModalOpen(false);
    setSelected(null);
    fetchData();
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300 px-4">
      <OfferListCard>
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner label="Cargando entrevistas…" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table
                aria-label="Entrevistas sin programar"
                isStriped
                removeWrapper
                className="min-w-[850px] table-fixed"
              >
                <TableHeader>
                  <TableColumn className="w-2/5 text-center">
                    DESCRIPCIÓN
                  </TableColumn>
                  <TableColumn className="w-2/5 text-center">
                    PARTICIPANTES
                  </TableColumn>
                  <TableColumn className="w-1/5 text-center">
                    ADMIN&nbsp;E‑MAIL
                  </TableColumn>
                  <TableColumn className="w-[140px] text-center">
                    ACCIÓN
                  </TableColumn>
                </TableHeader>

                <TableBody emptyContent="No hay entrevistas pendientes">
                  {interviews.map((i) => (
                    <TableRow key={i.id} className="text-center">
                      <TableCell className="whitespace-normal break-words">
                        {i.description}
                      </TableCell>
                      <TableCell className="whitespace-normal break-words">
                        {i.participants.join(", ")}
                      </TableCell>
                      <TableCell className="break-words">
                        {i.adminEmail}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          color="primary"
                          radius="sm"
                          onPress={() => openModal(i)}
                        >
                          Programar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {pages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  total={pages}
                  page={page + 1}
                  onChange={(p) => setPage(p - 1)}
                  size="sm"
                />
              </div>
            )}
          </>
        )}
      </OfferListCard>

      <ModalSchedule
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        interview={selected}
        onScheduled={handleScheduled}
      />
    </div>
  );
}
