import "./KpiTable.scss";

interface KpiValue {
    year: string;
    value: number;
    assured?: boolean;
}

interface KpiTableProps {
    table: {
        category: string;
        metric: string;
        unit: string;
        values: KpiValue[];
        source?: string;
    };
}

export default function KpiTable({ table }: KpiTableProps) {
    return (
        <div className="kpi-table">
            <h4 className="kpi-table__metric">{table.metric}</h4>
            <p className="kpi-table__unit">
                Unit: <strong>{table.unit}</strong>
            </p>

            <table>
                <thead>
                <tr>
                    <th>Year</th>
                    <th>Value</th>
                    <th>Assured</th>
                </tr>
                </thead>
                <tbody>
                {table.values.map(v => (
                    <tr key={v.year}>
                        <td>{v.year}</td>
                        <td>{v.value.toLocaleString()}</td>
                        <td>{v.assured ? "✓" : "–"}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {table.source && (
                <p className="kpi-table__source">
                    Source: {table.source}
                </p>
            )}
        </div>
    );
}
