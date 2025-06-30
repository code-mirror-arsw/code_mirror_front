


import { OfferCard } from '../../../components/offers/OfferCard';
import CreateOfferForm from '../../../components/offers/CreateOfferForm';

export default function CreateOfferPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lightmode-background dark:bg-background 
    text-lightmode-text dark:text-light transition-colors duration-300 px-4">
      <OfferCard>
        <CreateOfferForm />
      </OfferCard>
    </div>
  );
}

