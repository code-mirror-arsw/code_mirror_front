import { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@heroui/react';
import Cookies from 'js-cookie';
import PaginationBar from '../../offers/offersCreated/PaginationBar';
import { OfferListCardClient } from '../../client/offers/OfferListCardClient';

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

export default function OffersTablesClient() {
  const [offers, setOffers] = useState<OfferJobDto[]>([]);
  const [page, setPage] = useState(1);        // UI 1‑based
  const [totalPages, setTotalPages] = useState(1);

  const userId = Cookies.get('id');           

  useEffect(() => {
    if (!userId) return;                      

    const controller = new AbortController(); 

    (async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/services/be/offer-service/offers/clientId/${userId}?page=${
            page - 1
          }&size=10`,
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
  }, [userId, page]);                         

  return (
    <OfferListCardClient>
      <Table aria-label="Tabla de ofertas laborales">
        <TableHeader className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-bold">
          <TableColumn className="text-center px-4 py-3">Empresa</TableColumn>
          <TableColumn className="text-center px-4 py-3">Título</TableColumn>
          <TableColumn className="text-center px-4 py-3">Estado</TableColumn>
          <TableColumn className="text-center px-4 py-3">Max. Candidatos</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No hay ofertas registradas">
          {offers.map((offer, idx) => (
            <TableRow
              key={idx}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-300 dark:border-gray-600"
            >
              <TableCell className="text-center px-4 py-2">{offer.company}</TableCell>
              <TableCell className="text-center px-4 py-2">{offer.title}</TableCell>
              <TableCell className="text-center px-4 py-2">{offer.status}</TableCell>
              <TableCell className="text-center px-4 py-2">{offer.maxCandidates}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center mt-6">
        <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </OfferListCardClient>
  );
}
