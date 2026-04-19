import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import { cn } from "../lib/cn";
import { Spinner } from "./spinner";

interface DataTableProps<T> {
 emptyMessage?: string;
 loading?: boolean;
 table: TanstackTable<T>;
}

export function DataTable<T>({ emptyMessage = "No data", loading, table }: DataTableProps<T>) {
 if (loading) {
  return (
   <div className="flex justify-center py-8">
    <Spinner />
   </div>
  );
 }

 return (
  <div className="overflow-x-auto">
   <table className="w-full text-sm">
    <thead>
     {table.getHeaderGroups().map((headerGroup) => (
      <tr className="border-b border-slate-700" key={headerGroup.id}>
       {headerGroup.headers.map((header) => (
        <th
         className={cn(
          `px-3 py-2 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase`,
          header.column.getCanSort() && `cursor-pointer select-none hover:text-slate-100`,
         )}
         key={header.id}
         onClick={header.column.getToggleSortingHandler()}>
         <div className="flex items-center gap-1">
          {header.isPlaceholder
           ? null
           : flexRender(header.column.columnDef.header, header.getContext())}
          {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? null}
         </div>
        </th>
       ))}
      </tr>
     ))}
    </thead>
    <tbody>
     {table.getRowModel().rows.length === 0 ? (
      <tr>
       <td className="px-3 py-8 text-center text-slate-400" colSpan={table.getAllColumns().length}>
        {emptyMessage}
       </td>
      </tr>
     ) : (
      table.getRowModel().rows.map((row) => (
       <tr className="border-b border-slate-700/50 transition hover:bg-slate-800/50" key={row.id}>
        {row.getVisibleCells().map((cell) => (
         <td className="px-3 py-2 text-slate-100" key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
         </td>
        ))}
       </tr>
      ))
     )}
    </tbody>
   </table>
  </div>
 );
}
