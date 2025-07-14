import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PaginationBar from "../../offers/offersCreated/PaginationBar";
import OfferModal from "./OfferModal";
import logo from "../../auth/login/logo.png";
import { ErrorModal } from "..//../message/ErrorModal";

export interface OfferJobDto {
  company: string;
  title: string;
  description: string;
  status: string;
  maxCandidates: number;
  adminEmail: string;
  createdAt: string;
  id: string;
}

interface PageResponse {
  content?: OfferJobDto[] | null;
  totalPages: number;
  number: number;
}

export default function OffersNewCards() {
  const [offers, setOffers] = useState<OfferJobDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    const token = Cookies.get("accessToken");

    (async () => {
      try {
        const res = await fetch(
          `http://20.63.88.120/8280/services/be/offer-service/offers/newOffers?page=${page - 1}`,
          {
            signal: ctrl.signal,
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
        setTP(data.totalPages ?? 1);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setErrorMessage("Ocurrió un error al cargar las ofertas.");
          setErrorOpen(true);
          setOffers([]);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [page, navigate]);

  return (
    <div className="min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300">
      <section className="max-w-6xl mx-auto px-4 pt-6 sm:pt-10">
        <header className="flex flex-col items-center text-center gap-3 mb-8">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <h2 className="text-2xl font-bold">Nuevas ofertas de trabajo</h2>
        </header>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-300">Cargando ofertas…</p>
        ) : offers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-300">No hay ofertas.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
            {offers.map((o) => (
              <article
                key={o.id}
                onClick={() => {
                  setSelectedOfferId(o.id);
                  setModalOpen(true);
                }}
                className="cursor-pointer w-full bg-white dark:bg-card-dark shadow-md rounded-xl p-6 flex flex-col justify-between h-full transition hover:shadow-lg dark:hover:shadow-blue-900/40"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-light mb-2">
                    {o.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-blue-200 line-clamp-4">
                    {o.description || "Sin descripción."}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full">
                    {o.status}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-blue-300">
                    {o.company}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </section>

      {selectedOfferId && (
        <OfferModal
          visible={modalOpen}
          onClose={() => setModalOpen(false)}
          offerId={selectedOfferId}
        />
      )}

      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}
