"use client";
import React from "react";
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
};

const AppPagination: React.FC<AppPaginationProps> = ({
  pageNum,
  totalPages,
  onPageChange
}) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => pageNum > 1 && onPageChange(pageNum - 1)}
            aria-disabled={pageNum === 1}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              isActive={p === pageNum}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => pageNum < totalPages && onPageChange(pageNum + 1)}
            aria-disabled={pageNum === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
