import React, { useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    type PaginationState
} from '@tanstack/react-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown, faAngleDoubleRight, faAngleRight, faAngleDoubleLeft, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import Filter from './Filter';

interface ReactTableProps<T> {
    data: T[];
    columns;
    initialSort: string;
}

// ReactTable component
const TanstackTable = <T,>({ data, columns, initialSort }: ReactTableProps<T>) => {

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    })

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: initialSort ?? '', // Must match the column's accessorKey
            desc: false,
        }]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel()
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div className="cursor-pointer select-none"
                                            onClick={header.column.getToggleSortingHandler()}
                                            title={
                                                header.column.getCanSort()
                                                    ? header.column.getNextSortingOrder() === "asc"
                                                        ? "Sort ascending"
                                                        : header.column.getNextSortingOrder() === "desc"
                                                            ? "Sort descending"
                                                            : "Clear sort"
                                                    : undefined
                                            }
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: (
                                                    <FontAwesomeIcon icon={faSortUp} className="ml-1" />
                                                ),
                                                desc: (
                                                    <FontAwesomeIcon icon={faSortDown} className="ml-1" />
                                                ),
                                            }[header.column.getIsSorted() as string] ?? null}
                                            {header.column.getCanFilter() ? (
                                                <div>
                                                    <Filter column={header.column} table={table} />
                                                </div>
                                            ) : null}                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="border border-gray-300 px-4 py-2"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="row m-1">
                <div className="col-md-1"></div>
                <div className="col-md-10">
                    <button
                        className="btn btn-light border p-1"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleLeft} />
                    </button>
                    <button
                        className="btn btn-light border p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <button
                        className="btn btn-light border p-1"
                        onClick={() => {
                            console.log('running table.nextPage');
                            console.log('Before: ' + table.getState().pagination.pageIndex + 1);
                            console.log('Page Count: ' + table.getPageCount());
                            table.nextPage();
                            console.log('After: ' + table.getState().pagination.pageIndex + 1);
                            console.log('tabld.nextPage should have run');
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                    <button
                        className="btn btn-light border p-1"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <FontAwesomeIcon icon={faAngleDoubleRight} />
                    </button>
                </div>
                <div className="col-md-1"></div>
            </div>
            <div className="row m-1">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-auto">
                            Page&nbsp;
                            <strong>
                                {table.getState().pagination.pageIndex + 1} of{' '}
                                {table.getPageCount().toLocaleString()}
                            </strong>
                        </div>
                        <div className="col-md-auto">
                            Go to page:
                        </div>
                        <div className="col-md-auto">
                            <input
                                type="number"
                                min="1"
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={e => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    table.setPageIndex(page)
                                }}
                                className="border rounded w-16 form-control"
                            />
                        </div>
                        <div className="col-md-auto">
                            <select className="form-select"
                                value={table.getState().pagination.pageSize}
                                onChange={e => {
                                    table.setPageSize(Number(e.target.value))
                                }}
                            >
                                {[3, 5, 10, 20, 30, 40, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Show {pageSize} Rows
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md">
                            <div className="d-flex justify-content-end">
                                Displaying {table.getRowModel().rows.length.toLocaleString()} of{' '}
                                {table.getRowCount().toLocaleString()} Rows
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TanstackTable;