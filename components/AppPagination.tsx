"use client";
import React, { MouseEvent, MouseEventHandler } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "./ui/pagination";

type AppPaginationProps = {
  pageNum: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  buildHref?: (page: number) => string;
  className?: string;
};

const AppPagination: React.FC<AppPaginationProps> = ({
  pageNum,
  totalPages,
  onPageChange,
  buildHref,
  className = ""
}) => {
  const handleNavigatePrevious: MouseEventHandler = (event) => {
    event.preventDefault();
    if (pageNum > 1) {
      onPageChange(pageNum - 1);
    }
  };

  const handleNavigateNext: MouseEventHandler = (event) => {
    event.preventDefault();
    if (pageNum < totalPages) {
      onPageChange(pageNum + 1);
    }
  };

  const handleNavigatePage = (event: MouseEvent, page: number) => {
    event.preventDefault();
    onPageChange(page);
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handleNavigatePrevious}
            aria-disabled={pageNum === 1}
            href={pageNum !== 1 ? buildHref?.(pageNum - 1) : undefined}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === pageNum}
              onClick={(e) => handleNavigatePage(e, p)}
              href={buildHref?.(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={handleNavigateNext}
            aria-disabled={pageNum === totalPages}
            href={pageNum < totalPages ? buildHref?.(pageNum + 1) : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
