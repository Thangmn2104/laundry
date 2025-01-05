"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  isBorderInner?: boolean;
  className?: string
  defaultViewPath?: string;
  tableRef?: (table: any) => void;
}

function CustomTable<TData, TValue>({
  columns,
  data,
  loading,
  isBorderInner,
  className,
  defaultViewPath,
  tableRef
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (tableRef) {
      tableRef(table);
    }
  }, [table, tableRef]);

  const navigate = useNavigate()
  return (

    <div className={cn("rounded-md border-[1px] border-slate-200 overflow-hidden", className)}>
      {
        loading ? (
          <div className="flex justify-center items-center w-full h-[326px]">
            <span className="flex items-center justify-center">
              <Loader2 className="ml-2 h-6 w-6 animate-spin" />
            </span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          isBorderInner && 'border',
                          header.column.columnDef.size && `w-[${header.column.columnDef.size}px]`
                        )}
                        style={{
                          width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : undefined,
                          minWidth: header.column.columnDef.minSize ? `${header.column.columnDef.minSize}px` : undefined,
                          maxWidth: header.column.columnDef.maxSize ? `${header.column.columnDef.maxSize}px` : undefined,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn(defaultViewPath && 'cursor-pointer')}
                    onClick={() => navigate(defaultViewPath || '')}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(isBorderInner && 'border')}
                        style={{
                          width: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : undefined,
                          minWidth: cell.column.columnDef.minSize ? `${cell.column.columnDef.minSize}px` : undefined,
                          maxWidth: cell.column.columnDef.maxSize ? `${cell.column.columnDef.maxSize}px` : undefined,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))

              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-60 text-center"
                  >
                    <div className="flex flex-col gap-4 items-center justify-center h-full text-slate-500">
                      <Inbox size={50} />
                      <p>Không có kết quả</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
    </div>
  );
}

export default CustomTable;
