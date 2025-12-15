import "./SDG.scss";

const sdgs = [
    {
        id: 12,
        title: "Responsible Consumption and Production",
        text: "Embedding responsible sourcing, eco-design and waste reduction across the entire value chain.",
    },
    {
        id: 13,
        title: "Climate Action",
        text: "Reducing greenhouse gas emissions and accelerating the transition to renewable energy.",
    },
    {
        id: 8,
        title: "Decent Work and Economic Growth",
        text: "Promoting safe, inclusive and fair working conditions for people across operations and supply chains.",
    },
    {
        id: 15,
        title: "Life on Land",
        text: "Protecting forests, biodiversity and ecosystems through sustainable agriculture and deforestation-free sourcing.",
    },
    {
        id: 6,
        title: "Clean Water and Sanitation",
        text: "Improving water efficiency and managing water risks in manufacturing sites and sourcing regions.",
    },
];

export default function SDG() {
    return (
        <section id="sdg" className="sdg section bg-light">
            <div className="container">
                <div className="sdg__header text-center mb-5">
                    <h2 className="sdg__title fw-bold">Ferrero & the UN Sustainable Development Goals</h2>
                    <p className="sdg__intro">
                        Ferrero focuses its sustainability efforts on priority SDGs where it can deliver
                        measurable and long-term impact across its value chain.
                    </p>
                </div>

                <div className="row g-4">
                    {sdgs.map((sdg) => (
                        <div key={sdg.id} className="col-12 col-lg-6">
                            <div className="sdg__card sdg__card--horizontal h-100">

                                <div className="sdg__icon-wrap">
                                    <img
                                        src={`/img/icons/E-WEB-Goal-${String(sdg.id).padStart(2, "0")}.png`}
                                        alt={`SDG ${sdg.id}`}
                                        className="sdg__icon"
                                    />
                                </div>

                                <div className="sdg__content">
                                    <h3 className="sdg__card-title">
                                        SDG {sdg.id} – {sdg.title}
                                    </h3>

                                    <p className="sdg__card-text">
                                        {sdg.text}
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
