import { useEffect } from "react";
import "./Timeline.scss";

export default function Timeline() {

    // Simple intersection observer for fade-up
    useEffect(() => {
        const items = document.querySelectorAll(".timeline__item");

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) {
                        e.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        items.forEach(el => observer.observe(el));
        return () => observer.disconnect();

    }, []);

    const events = [
        { date: "Settembre 2023", title: "Nutella Biscuits milestone" },
        { date: "Ottobre 2023", title: "Lancio Kinderini" },
        { date: "Ottobre 2023", title: "100 anni Butterfinger" },
        { date: "Gennaio 2024", title: "Child’s Rights Benchmark" },
        { date: "Febbraio 2024", title: "50 anni Kinder Surprise" },
    ];

    return (
        <section id="timeline" className="timeline section">
            <div className="container">
                <h2 className="timeline__title fw-bold text-center mb-5">
                    Ferrero Achievements 2023–2024
                </h2>

                <div className="timeline__list">

                    {events.map((ev, i) => (
                        <div key={i} className="timeline__item">
                            <div className="timeline__date">{ev.date}</div>
                            <div className="timeline__content">{ev.title}</div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
