import { OffersNewCards } from '../newOffers/OffersNewCards';
import { motion } from 'framer-motion'; // si no usas framer, quita el wrapper

export default function OfferCard({ offer }: { offer: OfferJobDto }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-xl shadow-md p-6 transition-colors duration-300
                 bg-lightmode-card text-lightmode-text
                 dark:bg-card dark:text-light"
    >
      <h3 className="text-lg font-semibold">{offer.title}</h3>
      <p className="text-sm text-muted-foreground mb-2">{offer.company}</p>

      <p className="line-clamp-3 mb-4">{offer.description}</p>

      <div className="flex justify-between text-xs opacity-70">
        <span>{offer.status}</span>
        <span>{new Date(offer.createdAt).toLocaleDateString()}</span>
      </div>
    </motion.article>
  );
}
