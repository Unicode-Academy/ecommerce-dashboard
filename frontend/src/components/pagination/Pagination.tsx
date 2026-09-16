import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { SearchParams } from "@/types/category.type";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
type Props = {
  total: number;
  page: number;
};
export default function Pagination({ total, page }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());
  const currentPage = filters.page ?? 1;
  const handleChangePage = (page: number) => {
    setSearchParams({
      ...filters,
      page,
    } as unknown as SearchParams);
  };
  const handleNextPage = () => {
    setSearchParams({
      ...filters,
      page: +currentPage + 1,
    } as unknown as SearchParams);
  };
  const handlePrevPage = () => {
    setSearchParams({
      ...filters,
      page: +currentPage - 1,
    } as unknown as SearchParams);
  };
  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);
  return (
    <ShadcnPagination className="justify-start my-3 bg-white p-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevPage}
            className={
              +currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
        {[...Array(total)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              href="#"
              isActive={page === index + 1}
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                handleChangePage(index + 1);
              }}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={handleNextPage}
            className={
              +currentPage >= total
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
