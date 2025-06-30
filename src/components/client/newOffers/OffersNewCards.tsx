
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PaginationBar from '../../offers/offersCreated/PaginationBar';
import logo from "../../login/logo.png";           

interface OfferJobDto {
  company: string;
  title: string;
  description: string;
  status: string;
  maxCandidates: number;
  adminEmail: string;
}

interface PageResponse {
  content: OfferJobDto[];
  totalPages: number;
  number: number;
}

export default function OffersNewCards() {
  const [offers, setOffers] = useState<OfferJobDto[]>([]);
  const [page, setPage] = useState(1);          
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/services/be/offer-service/offers?page=${
            page - 1
          }&size=6`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: PageResponse = await res.json();
        setOffers(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error fetching offers:', err);
        }
      }
    })();

    return () => controller.abort();
  }, [page]);


  return (
    <section className="max-w-6xl mx-auto px-4">
      <header className="flex items-center gap-3 mb-8">
        <img src={logo} alt="Logo" className="w-10 h-10" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Nuevas ofertas de trabajo
        </h2>
      </header>

      {offers.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No hay ofertas registradas.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, idx) => (
            <article
              key={idx}
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 flex flex-col justify-between h-full transition hover:shadow-lg dark:hover:shadow-gray-700/40"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {offer.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                  {offer.description || 'Sin descripción.'}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                  {offer.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {offer.company}
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
  );
}
