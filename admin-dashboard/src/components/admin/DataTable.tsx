"use client";

import { cn } from "@/lib/utils";
import { Trash2, Edit3 } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  className?: string;
}

export default function DataTable({ columns, data, onEdit, onDelete, className }: DataTableProps) {
  return (
    <div className={cn("glass rounded-[18px] overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {columns.map(col => (
                <th key={col.key} className="text-right px-4 py-3 font-semibold text-[var(--text-muted)] whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id || i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {onEdit && (
                        <button onClick={() => onEdit(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[rgba(0,229,255,0.1)] transition-all"
                        >
                          <Edit3 size={15} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[rgba(229,9,20,0.1)] transition-all"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
