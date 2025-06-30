import { Pagination } from "@heroui/react";

interface Props {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function PaginationBar({ page, totalPages, setPage }: Props) {
  return (
    <div className="flex justify-center mt-6">
      <Pagination
        page={page} 
        total={totalPages}
        showControls
        onChange={(newPage: number) => setPage(newPage)}
        size="lg"
        variant="bordered"
        color="primary"
      />
    </div>
  );
}
