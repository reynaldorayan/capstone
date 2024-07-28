"use client";

import { useState } from "react";

interface PaginationResult<T> {
  activePage: number;
  nextPage: () => void;
  previousPage: () => void;
  totalPages: number;
  totalItems: number;
  items: T[];
}

const usePagination = <T>(
  items: T[],
  page: number = 1,
  perPage: number = 10
): PaginationResult<T> => {
  const [activePage, setActivePage] = useState<number>(page);
  const totalPages = Math.ceil(items.length / perPage);
  const offset = perPage * (activePage - 1);
  const paginatedItems = items.slice(offset, perPage * activePage);

  return {
    activePage,
    nextPage: () => setActivePage((p) => (p < totalPages ? p + 1 : p)),
    previousPage: () => setActivePage((p) => (p > 1 ? p - 1 : p)),
    totalPages,
    totalItems: items.length,
    items: paginatedItems,
  };
};

export default usePagination;
