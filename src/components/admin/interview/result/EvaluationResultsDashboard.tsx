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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PaginationBar from "../../../../components/offers/offersCreated/PaginationBar";
import { ErrorModal } from "../../../message/ErrorModal";
import { OfferListCardClient } from "../../../client/offers/OfferListCardClient";

interface EvaluationResult {
  id: number;
  score: number;
  feedback: string;
  participants: string[];
}

interface PageResponse {
  content: EvaluationResult[];
  totalPages: number;
  number: number;
}

export default function EvaluationResultsDashboard() {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewPassed, setViewPassed] = useState(true);
  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
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
    const safePage = Math.max(0, page - 1);
    const url = viewPassed
      ? `http://localhost:8280/services/be/code-service/evaluation-results/by-admin/passed?email=${userEmail}&page=${safePage}`
      : `http://localhost:8280/services/be/code-service/evaluation-results/by-admin/failed?email=${userEmail}&page=${safePage}`;

    (async () => {
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
  }, [page, userEmail, token, navigate, viewPassed]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const passedRes = await fetch(
          `http://localhost:8280/services/be/code-service/evaluation-results/by-admin/passed/count?email=${userEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const failedRes = await fetch(
          `http://localhost:8280/services/be/code-service/evaluation-results/by-admin/failed/count?email=${userEmail}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const passedData = await passedRes.json();
        const failedData = await failedRes.json();

        setPassedCount(passedData.count);
        setFailedCount(failedData.count);
      } catch (error) {
        console.error("Error al obtener conteo:", error);
      }
    };

    fetchCounts();
  }, [userEmail, token]);

  const chartData = [
    { name: "Aprobados", value: passedCount },
    { name: "No Aprobados", value: failedCount },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <OfferListCardClient>
      <h2 className="text-2xl font-bold text-center mb-6">
        Panel de Resultados de Evaluación
      </h2>

      <div className="flex justify-center mb-6">
        <ResponsiveContainer width="60%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded text-white transition ${
            viewPassed ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => {
            setPage(1);
            setViewPassed(true);
          }}
        >
          Ver Aprobados
        </button>
        <button
          className={`px-4 py-2 rounded text-white transition ${
            !viewPassed ? "bg-red-700" : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={() => {
            setPage(1);
            setViewPassed(false);
          }}
        >
          Ver No Aprobados
        </button>
      </div>

      <Table aria-label="Resultados de evaluación">
        <TableHeader className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-bold">
          <TableColumn className="text-center">Score</TableColumn>
          <TableColumn className="text-center w-1/2">Feedback</TableColumn>
          <TableColumn className="text-center">Participantes</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No hay resultados disponibles">
          {results.map((result) => (
            <TableRow
              key={result.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-300 dark:border-gray-600"
            >
              <TableCell className="text-center">{result.score}%</TableCell>
              <TableCell className="text-center max-w-[250px] truncate">
                {result.feedback}
              </TableCell>
              <TableCell className="text-center">
                {result.participants?.length > 0
                  ? result.participants.join(", ")
                  : "Sin participantes"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </OfferListCardClient>
  );
}
