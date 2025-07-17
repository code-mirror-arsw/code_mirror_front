import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import PaginationBar from "../../offers/offersCreated/PaginationBar";
import { ErrorModal } from "../../message/ErrorModal";
import { OfferListCardClient } from "../../client/offers/OfferListCardClient";

interface EvaluationResult {
  id: number;
  score: number;
  feedback: string;
}

interface PageResponse {
  content: EvaluationResult[];
  totalPages: number;
  number: number;
}

export default function EvaluationResultsTable() {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userEmail = Cookies.get("userEmail");
  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (!userEmail || !token) {
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

    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:8280/services/be/code-service/evaluation-results/by-participant?email=${userEmail}&page=${page - 1}`,
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

        if (!res.ok) throw new Error("Error de red o datos incorrectos");

        const data: PageResponse = await res.json();
        setResults(Array.isArray(data.content) ? data.content : []);
        setTotalPages(data.totalPages ?? 1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setErrorMessage("No se pudieron cargar los resultados de evaluación.");
          setErrorOpen(true);
        }
      }
    })();

    return () => controller.abort();
  }, [page, userEmail, token, navigate]);

  return (
    <OfferListCardClient>
      <h2 className="text-xl font-bold mb-4 text-center">Resultados de Evaluación</h2>

      <Table aria-label="Resultados de evaluación">
        <TableHeader className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-bold">
          <TableColumn className="text-center">Score</TableColumn>
          <TableColumn className="text-center w-1/2">Feedback</TableColumn>
          <TableColumn className="text-center">Estado</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No hay resultados disponibles">
          {results.map((result) => (
            <TableRow
              key={result.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-300 dark:border-gray-600"
            >
              <TableCell className="text-center">{result.score}%</TableCell>
              <TableCell className="text-center max-w-[250px] truncate">{result.feedback}</TableCell>
              <TableCell className="text-center">
                {result.score >= 70 ? (
                  <span className="text-green-600 font-semibold">Aprobado</span>
                ) : (
                  <span className="text-red-600 font-semibold">No Aprobado</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      <ErrorModal open={errorOpen} message={errorMessage} onClose={() => setErrorOpen(false)} />
    </OfferListCardClient>
  );
}
