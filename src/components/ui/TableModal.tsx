import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import Modal from '@/components/ui/Modal'

type TableModalProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[]
  title?: string
  modalContent?: (item: T) => React.ReactNode
}

export function TableModal<T>({
  data,
  columns,
  title = 'Data Table',
  modalContent,
}: TableModalProps<T>) {
  const [selectedRow, setSelectedRow] = React.useState<T | null>(null)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4">
        <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
      </div>
      <div className="w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b transition-colors hover:bg-muted/50"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-12 px-4 text-left font-medium text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
                {modalContent && <th className="h-12 px-4 text-left" />}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                  {modalContent && (
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRow(row.original)}
                      >
                        View
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (modalContent ? 1 : 0)}
                  className="h-24 text-center"
                >
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalContent && selectedRow && (
        <Modal
          open={!!selectedRow}
          onClose={() => setSelectedRow(null)}
          title="Details"
        >
          {modalContent(selectedRow)}
        </Modal>
      )}
    </div>
  )
}
