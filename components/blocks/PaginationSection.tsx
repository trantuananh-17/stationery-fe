import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../ui/pagination';

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: {
    page?: string;
    sort?: string;
    brand?: string;
  };
}

export default function PaginationSection({ currentPage, totalPages, basePath = '/products', searchParams }: Props) {
  const createPageHref = (page: number) => {
    const params = new URLSearchParams();

    if (searchParams?.sort) {
      params.set('sort', searchParams.sort);
    }

    if (searchParams?.brand) {
      params.set('brand', searchParams.brand);
    }

    params.set('page', String(page));

    return `${basePath}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4];
    }

    if (currentPage >= totalPages - 2) {
      return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const pageNumbers = getPageNumbers();
  const showStartEllipsis = pageNumbers[0] > 2;
  const showEndEllipsis = pageNumbers[pageNumbers.length - 1] < totalPages - 1;

  return (
    <section>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? createPageHref(currentPage - 1) : '#'}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {pageNumbers[0] > 1 && (
            <PaginationItem>
              <PaginationLink href={createPageHref(1)} isActive={currentPage === 1}>
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {showStartEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href={createPageHref(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEndEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <PaginationItem>
              <PaginationLink href={createPageHref(totalPages)} isActive={currentPage === totalPages}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href={currentPage < totalPages ? createPageHref(currentPage + 1) : '#'}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
