import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PaginationBar from "./PaginationBar";
import { OfferListCard } from "./OfferListCard";
import { ErrorModal } from "../../message/ErrorModal";

interface OfferJobDto {
  id: string;
  company: string;
  title: string;
  description: string;
  status: string;
  maxCandidates: number;
  adminEmail: string;
  language: string;
}

interface PageResponse {
  content: OfferJobDto[];
  totalPages: number;
  number: number;
}

export default function OfferTable() {
  const [offers, setOffers] = useState<OfferJobDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userEmail = Cookies.get("userEmail");

  useEffect(() => {
    if (!userEmail) return;

    const controller = new AbortController();
    const token = Cookies.get("accessToken");

    (async () => {
      try {
        const res = await fetch(
          `https://apigateway-b8exa0bnakh6bvhx.canadacentral-01.azurewebsites.net/services/be/offer-service/offers/email/${userEmail}?page=${page - 1}`,
          {
            signal: controller.signal,
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

        const data: PageResponse = await res.json();
        setOffers(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages ?? 1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setErrorMessage("Ocurrió un error al cargar las ofertas.");
          setErrorOpen(true);
        }
      }
    })();

    return () => controller.abort();
  }, [page, userEmail, navigate]);

  return (
    <>
      <OfferListCard>
        <Table aria-label="Tabla de ofertas laborales">
          <TableHeader className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-bold">
            <TableColumn className="text-center px-4 py-3">Empresa</TableColumn>
            <TableColumn className="text-center px-4 py-3">Título</TableColumn>
            <TableColumn className="text-center px-4 py-3">Estado</TableColumn>
            <TableColumn className="text-center px-4 py-3">Lenguaje</TableColumn>
            <TableColumn className="text-center px-4 py-3">Max. Candidatos</TableColumn>
          </TableHeader>

          <TableBody emptyContent="No hay ofertas registradas">
            {offers.map((offer) => (
              <TableRow
                key={offer.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-300 dark:border-gray-600"
              >
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">{offer.company}</TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">{offer.title}</TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">{offer.status}</TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">{offer.language}</TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">{offer.maxCandidates}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-center mt-6">
          <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </OfferListCard>

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </>
  );
}
