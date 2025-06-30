import Table from "../../components/client/offers/OffersTablesClient"

export default function OffersPage() {
    return (
         <div className="min-h-screen flex items-center justify-center bg-lightmode-background dark:bg-background 
    text-lightmode-text dark:text-light transition-colors duration-300 px-4">
            <Table/>
        </div>
    );
}
