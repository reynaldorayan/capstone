"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Table as NextUiTable,
  Pagination,
  Selection,
  SortDescriptor,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { TbCategoryPlus, TbChevronDown } from "react-icons/tb"; // Import the component here
import React, { useCallback, useMemo, useState } from "react";
import { TableProps } from "./types";
import { capitalize } from "@/utils";
import { BookingStatus } from "@prisma/client";

export default function Table<T extends { id: string; status: BookingStatus }>({
  searchColumn,
  searchPlaceholder,
  data,
  columns,
  initialVisibleColumns,
  renderCell,
  renderCreateButton,
  onSelectionRow,
}: TableProps<T>) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(initialVisibleColumns) || new Set(["all"])
  );

  const [statusFilter, setStatusFilter] = useState<Selection>("all");

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (Array.from(visibleColumns).includes("all")) return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.field)
    );
  }, [visibleColumns, columns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...data];

    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) => {
        const searchByCol = (item as any)[(searchColumn as keyof T) || "name"];
        const isObj = typeof searchByCol === "object";

        return String(isObj ? JSON.stringify(searchByCol) : searchByCol)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      });
    }

    if (statusFilter !== "all") {
      filteredData = filteredData.filter((item) =>
        statusFilter.has(item.status as BookingStatus)
      );
    }

    return filteredData;
  }, [filterValue, data, hasSearchFilter, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items: T[] = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof T];
      const second = b[sortDescriptor.column as keyof T];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={searchPlaceholder || "Search by name..."}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            startContent={<span className="text-default-400">🔍</span>}
          />
          <div className="flex gap-3">
            {columns.some((column) => column.field === "status") ? (
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" endContent={<TbChevronDown />}>
                    Status
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Status"
                  closeOnSelect={false}
                  selectedKeys={statusFilter}
                  selectionMode="multiple"
                  onSelectionChange={(keys) => { 
                    setStatusFilter(
                      new Set(Array.from(keys).map((key) => key as BookingStatus))
                    );
                  }}
                >
                  {Object.values(BookingStatus).map((status) => (
                    <DropdownItem key={status}>{status}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            ) : null}

            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" endContent={<TbCategoryPlus />}>
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={(keys) =>
                  setVisibleColumns(
                    new Set(Array.from(keys).map((key) => key.toString()))
                  )
                }
              >
                {columns.map((column) => (
                  <DropdownItem key={column.field} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {renderCreateButton ? renderCreateButton() : null}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} items
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    data.length,
    onSearchChange,
    onClear,
    columns,
    statusFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    // selectedKeys,
    filteredItems.length,
    page,
    pages,
  ]);

  return (
    <NextUiTable
      classNames={{
        th: "bg-gray-100 border-none",
        td: "border-b border-gray-100 first:border-t-none",
        base: "overflow-x-auto overflow-y-hidden",
      }}
      removeWrapper
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      selectedKeys={selectedKeys}
      selectionMode={onSelectionRow ? "single" : "none"}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={(keys) => {
        setSelectedKeys(keys);
        if (onSelectionRow && keys !== "all") {
          const selected = items.find(
            (item) => item.id === keys.values().next().value
          );
          onSelectionRow(selected as T);
        }
      }}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => {
          return (
            <TableColumn
              data-key={column.field}
              key={column.field}
              align={column.field === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          );
        }}
      </TableHeader>
      <TableBody emptyContent={"No records found"} items={sortedItems}>
        {(item: T) => {
          return (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as keyof T)}</TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </NextUiTable>
  );
}
