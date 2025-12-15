import "./Hero.scss";
import heroImg from "../../assets/img/ferrero-hero.jpg";

/**
 * HERO SECTION
 * ----------------------------------------------
 * - Full-width hero banner with dark gradient overlay
 * - Accessible CTA with real file download
 * - Optimized for SEO, screen readers and AI crawlers
 */

export default function Hero() {
    return (
        <section
            id="hero"
            className="hero"
            aria-labelledby="hero-title"
            style={{ backgroundImage: `url(${heroImg})` }}
        >
            <div className="container hero__content">

                <h1
                    id="hero-title"
                    className="hero__title display-3 fw-bold"
                >
                    Sustainability at Ferrero
                </h1>

                <p className="hero__subtitle lead">
                    Advancing responsibility, transparency and long-term value
                </p>

                {/* DOWNLOAD CTA */}
                <a
                    href="/ferrero-sustainability-report-2024.pdf"
                    download
                    className="hero__cta btn btn-light btn-lg mt-4 d-inline-flex align-items-center gap-2"
                    aria-label="Download Ferrero Sustainability Report 2024 (PDF)"
                    title="Download Ferrero Sustainability Report 2024"
                >
                    <i className="bi bi-download" aria-hidden="true"></i>
                    <span>Download Sustainability Report 2024</span>
                </a>

                {/* Invisible helper text for screen readers */}
                <span className="visually-hidden">
                    PDF document, Ferrero Group Sustainability Report 2024
                </span>

            </div>
        </section>
    );
}
