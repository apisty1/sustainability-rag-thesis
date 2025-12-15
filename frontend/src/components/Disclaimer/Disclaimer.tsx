import "./Disclaimer.scss";

export default function Disclaimer() {
    return (
        <section className="academic-disclaimer">
            <div className="container">
                <p className="academic-disclaimer__title">
                    Academic Disclaimer
                </p>

                <p>
                    This website is part of an academic thesis project developed for
                    educational and research purposes only.
                </p>

                <p>
                    The content presented here is based on publicly available sustainability
                    reports published by Ferrero Group.
                </p>

                <p>
                    This project is <strong>not affiliated with, endorsed by, or officially
                    published by Ferrero Group</strong>. All analyses, visualizations, and
                    AI-generated responses are <strong>interpretations for didactic
                    purposes</strong> and should not be considered official or authoritative
                    corporate disclosures.
                </p>

                <p className="academic-disclaimer__note">
                    AI-generated content may contain inaccuracies and should be interpreted
                    critically.
                </p>
            </div>
        </section>
    );
}
