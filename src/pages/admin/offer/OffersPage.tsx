import OffersTable from '../../../components/offers/offersCreated/OffersTable';

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-lightmode-background dark:bg-background text-lightmode-text dark:text-light transition-colors duration-300">
      <OffersTable />
    </div>
  );
}
