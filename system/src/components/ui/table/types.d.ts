"use client";

export interface Column<T> {
  field: keyof T;
  name: string;
  sortable?: boolean;
}


export type TableProps<T> = {
  columns: Column[];
  initialVisibleColumns: string[];
  data: T[]; // Use the generic type T for the data array
  renderCell: (item: T, columnKey: keyof T) => ReactNode; // Update renderCell to use T
  renderCreateButton?: () => ReactNode;
  searchPlaceholder?: string
  searchColumn?: keyof T
  onSelectionRow?: (item: T) => void;

  isHasFilterStatus?: boolean;
  
};
