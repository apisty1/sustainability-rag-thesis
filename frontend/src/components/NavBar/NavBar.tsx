import "./NavBar.scss";

/**
 * Navigation bar component
 * Accessibility improvements only (ARIA + semantics)
 */
export default function NavBar() {
    return (
        <nav
            id="mainNav"
            className="nav-site navbar navbar-expand-lg fixed-top"
            aria-label="Main navigation"
        >
            <div className="container nav-site__container">

                <a
                    className="nav-site__brand navbar-brand fw-bold"
                    href="#hero"
                    aria-label="Go to homepage section"
                >
                    Ferrero Sustainability 2024
                </a>

                <button
                    className="navbar-toggler nav-site__toggle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navmenu"
                    aria-controls="navmenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation menu"
                >
                    <span className="navbar-toggler-icon" aria-hidden="true"></span>
                </button>

                <div
                    id="navmenu"
                    className="nav-site__menu collapse navbar-collapse justify-content-end"
                >
                    <ul className="nav-site__list navbar-nav">

                        <li className="nav-site__item nav-item">
                            <a
                                href="#about"
                                className="nav-site__link nav-link"
                                aria-label="Go to About section"
                            >
                                About
                            </a>
                        </li>

                        <li className="nav-site__item nav-item">
                            <a
                                href="#kpi"
                                className="nav-site__link nav-link"
                                aria-label="Go to KPI section"
                            >
                                KPI
                            </a>
                        </li>

                        <li className="nav-site__item nav-item">
                            <a
                                href="#charts"
                                className="nav-site__link nav-link"
                                aria-label="Go to Charts section"
                            >
                                Charts
                            </a>
                        </li>

                        <li className="nav-site__item nav-item">
                            <a
                                href="#sdg"
                                className="nav-site__link nav-link"
                                aria-label="Go to Sustainable Development Goals section"
                            >
                                SDGs
                            </a>
                        </li>

                        <li className="nav-site__item nav-item">
                            <a
                                href="#timeline"
                                className="nav-site__link nav-link"
                                aria-label="Go to Achievements section"
                            >
                                Achievements
                            </a>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}
