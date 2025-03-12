import React from "react";

interface Column<T> {
    key: keyof T;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    actions?: (row: T) => React.ReactNode;
}

const Table = <T,>({ columns, data, actions }: TableProps<T>) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key as string} className="px-4 py-2 text-left">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-4 py-2 text-center">Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-300 even:bg-gray-100 hover:bg-gray-200">
                                {columns.map((col) => (
                                    <td key={col.key as string} className="px-4 py-2">
                                        {col.render ? col.render(row) : (row[col.key] as React.ReactNode)}
                                    </td>
                                ))}
                                {actions && <td className="px-4 py-2 text-center">{actions(row)}</td>}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-6 text-center text-gray-500">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
