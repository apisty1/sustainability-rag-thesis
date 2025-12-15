import { useEffect, useState } from "react";
import "./KPI.scss";

// TypeScript interface for our JSON
interface WaterWithdrawal {
    from_water_main: number[];
    from_well: number[];
    from_river: number[];
    from_other_sources: number[];
}

interface KPIData {
    ghg: {
        years: string[];
        scope1: number[];
        scope2: number[];
        scope3: number[];
    };
    energy: {
        years: string[];
        energy_intensity_ratio: number[];
        renewable_certified: number[];
    };
    water: {
        years: string[];
        withdrawal_ratio: number[];
    };
    packaging_2023_24: {
        labels: string[];
        values: number[];
    };
    water_withdrawal?: WaterWithdrawal;
}


export default function KPI() {
    const [kpi, setKpi] = useState<KPIData | null>(null);

    useEffect(() => {
        fetch("/data/kpi_ferrero.json")
            .then((res) => res.json())
            .then((data: KPIData) => setKpi(data))
            .catch((err) => console.error("KPI JSON Load Error:", err));
    }, []);

    if (!kpi) return <p className="text-center">Loading KPI…</p>;

    //
    // 🔹 1. MAIN ESG KPI (ultimo anno disponibile)
    //
    // WATER WITHDRAWAL TOTAL (sum of all sources, last year)
    const lastNumber = (arr?: unknown[]): number => {
        const v = arr?.[arr.length - 1];
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };
    if (!kpi.water_withdrawal) return null;
    const lastWaterWithdrawal =
        lastNumber(kpi.water_withdrawal.from_water_main) +
        lastNumber(kpi.water_withdrawal.from_well) +
        lastNumber(kpi.water_withdrawal.from_river) +
        lastNumber(kpi.water_withdrawal.from_other_sources);

// Prepare KPI list
    const kpiList = [
        {
            label: "GHG Scope 1 (2023/24)",
            value: kpi.ghg.scope1.at(-1)?.toLocaleString(),
        },
        {
            label: "GHG Scope 2 (2023/24)",
            value: kpi.ghg.scope2.at(-1)?.toLocaleString(),
        },
        {
            label: "GHG Scope 3 (2023/24)",
            value: kpi.ghg.scope3.at(-1)?.toLocaleString(),
        },
        {
            label: "Energy Intensity (GJ/t)",
            value: kpi.energy.energy_intensity_ratio.at(-1),
        },
        {
            label: "Certified Renewable Electricity (%)",
            value: kpi.energy.renewable_certified.at(-1) + "%",
        },
        {
            label: "Water Withdrawal Total (m³/t)",
            value: lastWaterWithdrawal.toFixed(2),
        }
    ];


    //
    // 🔹 2. PACKAGING KPI (2023/24)
    //
    const packagingKPIs = kpi.packaging_2023_24.labels.map((label, index) => ({
        label,
        value: kpi.packaging_2023_24.values[index] + "%"
    }));

    //
    // 🔹 3. Uniamo tutto in un unico array
    //
    const allKPIs = [...kpiList, ...packagingKPIs];

    return (
        <section id="kpi" className="kpi section bg-light">
            <div className="container kpi__container">
                <h2 className="kpi__title fw-bold text-center mb-5">
                    Key ESG Performance
                </h2>

                <div className="kpi__grid row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">

                    {allKPIs.map((item, i) => (
                        <div className="col" key={i}>
                            <div className="kpi-card">
                                <div className="kpi-value">{item.value}</div>
                                <p className="kpi-label">{item.label}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
