import { useEffect, useState } from "react";
import "./Charts.scss";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    Tooltip,
    Legend
);

// Updated interface — matches your new JSON structure
interface KPIData {
    ghg: {
        years: string[];
        scope1: number[];
        scope2: number[];
        scope3: number[];
    };
    scope3_breakdown_2023_24: {
        categories: string[];
        values: number[];
    };
    energy: {
        years: string[];
        energy_intensity_ratio: number[];
        renewable_certified: number[];
    };
    water_withdrawal: {
        years: string[];
        from_water_main: number[];
        from_well: number[];
        from_river: number[];
        from_other_sources: number[];
    };
    packaging_2023_24: {
        labels: string[];
        values: number[];
    };
}

export default function Charts() {
    const [kpi, setKpi] = useState<KPIData | null>(null);

    useEffect(() => {
        fetch("/data/kpi_ferrero.json")
            .then((res) => res.json())
            .then((data: KPIData) => setKpi(data));
    }, []);

    if (!kpi) return <p className="text-center">Loading charts...</p>;

    // -----------------------------
    // 1) GHG EMISSIONS – 3 YEARS – STACKED BAR
    // -----------------------------
    const ghgData = {
        labels: kpi.ghg.years,
        datasets: [
            {
                label: "Scope 1",
                data: kpi.ghg.scope1,
                backgroundColor: "rgba(255, 99, 132, 0.7)",
            },
            {
                label: "Scope 2",
                data: kpi.ghg.scope2,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            },
            {
                label: "Scope 3",
                data: kpi.ghg.scope3,
                backgroundColor: "rgba(75, 192, 192, 0.7)",
            }
        ],
    };

    const ghgOptions = {
        responsive: true,
        plugins: { legend: { position: "top" as const } },
        scales: {
            x: { stacked: true },
            y: { stacked: true }
        }
    };

    // -----------------------------
    // 2) PACKAGING 2023/24 — DOUGHNUT
    // -----------------------------
    const packagingData = {
        labels: kpi.packaging_2023_24.labels,
        datasets: [
            {
                data: kpi.packaging_2023_24.values,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.7)",
                    "rgba(255, 159, 64, 0.7)",
                    "rgba(153, 102, 255, 0.7)",
                    "rgba(54, 162, 235, 0.7)",
                    "rgba(255, 99, 132, 0.7)"
                ],
                borderColor: "#fff",
                borderWidth: 1
            }
        ]
    };

    // -----------------------------
    // 3) ENERGY INTENSITY — MULTI-YEAR LINE
    // -----------------------------
    // -----------------------------
// ENERGY INTENSITY — BAR CHART
// -----------------------------
    const energyIntensityBar = {
        labels: kpi.energy.years,
        datasets: [
            {
                label: "Energy Intensity (GJ/t)",
                data: kpi.energy.energy_intensity_ratio,
                backgroundColor: "rgba(255, 159, 64, 0.7)",
                borderColor: "rgba(255, 159, 64, 1)",
                borderWidth: 1
            }
        ]
    };

    const energyIntensityOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    // -----------------------------
    // 4) RENEWABLE ELECTRICITY — MULTI-YEAR BAR
    // -----------------------------
    const renewableData = {
        labels: kpi.energy.years,
        datasets: [
            {
                label: "Certified Renewable Electricity (%)",
                data: kpi.energy.renewable_certified,
                backgroundColor: "rgba(54, 162, 235, 0.7)",
            }
        ]
    };

    // -----------------------------
    // 5) WATER WITHDRAWAL — STACKED BAR (MULTI-YEAR)
    // -----------------------------
    const waterStackedData = {
        labels: kpi.water_withdrawal.years,
        datasets: [
            {
                label: "From water main",
                data: kpi.water_withdrawal.from_water_main,
                backgroundColor: "rgba(54,162,235,0.8)",
            },
            {
                label: "From well",
                data: kpi.water_withdrawal.from_well,
                backgroundColor: "rgba(255,206,86,0.8)",
            },
            {
                label: "From river",
                data: kpi.water_withdrawal.from_river,
                backgroundColor: "rgba(75,192,192,0.8)",
            },
            {
                label: "From other sources",
                data: kpi.water_withdrawal.from_other_sources,
                backgroundColor: "rgba(153,102,255,0.8)",
            }
        ]
    };

    const waterStackedOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" as const }
        },
        scales: {
            x: { stacked: true },
            y: {
                stacked: true,
                title: {
                    display: true,
                    text: "m³/t"
                }
            }
        }
    };


    return (
        <section id="charts" className="charts section">
            <div className="container">
                <h2 className="fw-bold text-center mb-5">Environmental Performance</h2>

                <div className="row g-0 g-lg-5">

                    {/* GHG STACKED */}
                    <div className="col-md-6">
                        <h5 className="text-center">GHG Emissions – Scope 1, 2, 3 (3 years)</h5>
                        <Bar data={ghgData} options={ghgOptions}/>

                        <p className="chart-description mt-3 text-muted small">
                            Scope 1 and 2 emissions decreased mainly due to efficiency improvements
                            and increased renewable electricity procurement, while Scope 3 emissions
                            remain the largest contributor, driven primarily by raw materials.
                        </p>
                    </div>

                    {/* PACKAGING */}
                    <div className="col-md-6">
                        <h5 className="text-center">Packaging KPI – FY 2023/24</h5>
                        <Doughnut data={packagingData}/>

                        <p className="chart-description mt-3 text-muted small">
                            In 2023/24, 92.1% of packaging was recyclable and 86.1% was recyclable,
                            reusable or compostable. Progress continues toward the 2025 packaging commitments.
                        </p>

                    </div>

                </div>

                <div className="row g-0 g-lg-5 mt-5">

                    {/* ENERGY INTENSITY */}
                    <div className="col-md-6">
                        <h5 className="text-center">Energy Intensity (GJ/t)</h5>
                        <Bar data={energyIntensityBar} options={energyIntensityOptions}/>

                        <p className="chart-description mt-3 text-muted small">
                            Ferrero has progressively reduced its energy consumption per tonne of product,
                            reaching 7.07 GJ/t in 2023/24. This reduction reflects continued investments in
                            energy-efficient technologies and optimization across production facilities.
                        </p>
                    </div>


                    {/* RENEWABLE ELECTRICITY */}
                    <div className="col-md-6">
                        <h5 className="text-center">Certified Renewable Electricity (%)</h5>
                        <Bar data={renewableData}/>

                        <p className="chart-description mt-3 text-muted small">
                            Over 90% of electricity purchased in 2023/24 was certified renewable,
                            supporting Ferrero’s decarbonization roadmap toward 2030.
                        </p>
                    </div>

                </div>

                <div className="row g-0 g-lg-5 mt-5">

                    {/* WATER WITHDRAWAL */}
                    <div className="col-md-12 mt-5">
                        <h5 className="text-center">Water Withdrawal Ratio (m³/t)</h5>
                        <Bar data={waterStackedData} options={waterStackedOptions}/>

                        <p className="chart-description mt-3 text-muted small">
                            Water withdrawal intensity continues to decrease, with reductions across
                            all sources due to optimization of cleaning processes and improved water
                            management technologies within production facilities.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}