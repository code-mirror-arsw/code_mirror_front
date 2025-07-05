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
import PaginationBar from './PaginationBar';
import { OfferListCard } from './OfferListCard'; 

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

export default function OfferTable() {
  const [offers, setOffers] = useState<OfferJobDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userEmail = Cookies.get('userEmail');

  useEffect(() => {
    if (!userEmail) return;

    fetch(
      `http://192.168.1.34:8080/services/be/offer-service/offers/email/${userEmail}?page=${
        page - 1
      }`
    )
      .then((res) => res.json())
      .then((data: PageResponse) => {
        setOffers(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error('Error fetching offers:', err));
  }, [page, userEmail]);

  return (
    <OfferListCard>
      <Table aria-label="Tabla de ofertas laborales">
        <TableHeader className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-bold">
            <TableColumn className="text-center px-4 py-3">Empresa</TableColumn>
            <TableColumn className="text-center px-4 py-3">Título</TableColumn>
            <TableColumn className="text-center px-4 py-3">Estado</TableColumn>
            <TableColumn className="text-center px-4 py-3">Max. Candidatos</TableColumn>
        </TableHeader>

        <TableBody emptyContent="No hay ofertas registradas">
            {offers.map((offer, index) => (
            <TableRow
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-300 dark:border-gray-600"
            >
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">
                {offer.company}
                </TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">
                {offer.title}
                </TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">
                {offer.status}
                </TableCell>
                <TableCell className="text-center px-4 py-2 text-gray-700 dark:text-gray-300">
                {offer.maxCandidates}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>


      <div className="flex justify-center mt-6">
        <PaginationBar page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </OfferListCard>
  );
}
