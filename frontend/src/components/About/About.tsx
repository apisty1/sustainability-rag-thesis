import "./About.scss";

export default function About() {
    return (
        <section id="about" className="about section">
            <div className="container about__container">

                <h2 className="about__title fw-bold text-center mb-4">About Ferrero</h2>

                <p className="about__description text-center mb-5">
                    Present in over 50 countries with 37 factories and more than 47,000 employees,
                    Ferrero integrates sustainability across its entire value chain.
                </p>

                <div className="about__stats row text-center">
                    <div className="about__stat col-md-4">
                        <h3 className="about__stat-value">€18.4bn</h3>
                        <p className="about__stat-label">Turnover</p>
                    </div>

                    <div className="about__stat col-md-4">
                        <h3 className="about__stat-value">+170</h3>
                        <p className="about__stat-label">Countries served</p>
                    </div>

                    <div className="about__stat col-md-4">
                        <h3 className="about__stat-value">1.59m t</h3>
                        <p className="about__stat-label">Total production</p>
                    </div>

                    <div className="about__stat col-md-4">
                        <h3 className="about__stat-value">37</h3>
                        <p className="about__stat-label">Manufacturing plants</p>
                    </div>

                    <div className="about__stat col-md-4">
                        <h3 className="about__stat-value">47.517</h3>
                        <p className="about__stat-label">Total employees</p>
                    </div>

                    <div className="about__stat col-md-4">
                        <h3 className="about__stat-value">50</h3>
                        <p className="about__stat-label">Countries Ferrero Group
                            is present in</p>
                    </div>
                </div>

            </div>
        </section>
    );
}
