"use client";

import { useState, useMemo } from "react";

export type Column<T> = {
  id: string;
  label: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
};

type DataSheetProps<T> = {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => React.ReactNode;
};

export default function DataSheet<T extends { id: string }>({
  data,
  columns,
  title,
  searchable = true,
  filterable = false,
  exportable = true,
  onRowClick,
  actions,
}: DataSheetProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Search
    if (searchTerm) {
      result = result.filter((row) => {
        return columns.some((col) => {
          const value = col.accessor(row);
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Sort
    if (sortColumn) {
      const column = columns.find((col) => col.id === sortColumn);
      if (column && column.sortable) {
        result.sort((a, b) => {
          const aValue = column.accessor(a);
          const bValue = column.accessor(b);
          const comparison =
            String(aValue).localeCompare(String(bValue), "de", {
              numeric: true,
            });
          return sortDirection === "asc" ? comparison : -comparison;
        });
      }
    }

    return result;
  }, [data, columns, searchTerm, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const exportToCSV = () => {
    const headers = columns.map((col) => col.label).join(",");
    const rows = filteredAndSortedData.map((row) =>
      columns
        .map((col) => {
          const value = col.accessor(row);
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title || "data"}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="font-db-screenhead text-lg font-bold text-slate-900">
                {title}
              </h2>
            )}
            <p className="mt-1 text-xs text-slate-500">
              {filteredAndSortedData.length} Einträge
            </p>
          </div>
          <div className="flex items-center gap-2">
            {exportable && (
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      {searchable && (
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 pl-10 text-sm focus:border-[#e2001a] focus:outline-none focus:ring-2 focus:ring-[#e2001a]/20"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 ${
                    column.width ? "" : "whitespace-nowrap"
                  }`}
                  style={{ width: column.width }}
                >
                  <button
                    onClick={() => column.sortable && handleSort(column.id)}
                    className={`flex items-center gap-2 ${
                      column.sortable
                        ? "cursor-pointer hover:text-slate-900"
                        : "cursor-default"
                    }`}
                    disabled={!column.sortable}
                  >
                    {column.label}
                    {column.sortable && sortColumn === column.id && (
                      <svg
                        className={`h-4 w-4 ${
                          sortDirection === "asc" ? "" : "rotate-180"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                  </button>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Aktionen
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  Keine Daten gefunden
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className={`transition ${
                    onRowClick
                      ? "cursor-pointer hover:bg-slate-50"
                      : "hover:bg-slate-50"
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className="px-6 py-4 text-sm text-slate-900"
                    >
                      {column.accessor(row)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">{actions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Seite {currentPage} von {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300 hover:bg-slate-50"
              >
                Zurück
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300 hover:bg-slate-50"
              >
                Weiter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

