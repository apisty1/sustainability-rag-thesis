import NavBar from "./components/NavBar/NavBar";
import Hero from "./components/Hero/Hero";
import About from "./components/About/About";
import KPI from "./components/KPI/KPI";
import Charts from "./components/Charts/Charts";
import SDG from "./components/SDG/SDG";
import Timeline from "./components/Timeline/Timeline";
import Disclaimer from "./components/Disclaimer/Disclaimer.tsx";
import Footer from "./components/Footer/Footer";
import ChatWidget from "./components/ChatWidget/ChatWidget.tsx";

import "./assets/scss/main.scss";

function App() {
    return (
        <>
            <div id="scrollspy-container" data-bs-spy="scroll" data-bs-target="#mainNav" data-bs-offset="80" tabIndex={0}>
                <NavBar />
                <Hero />
                <About />
                <KPI />
                <Charts />
                <SDG />
                <Timeline />
                <Disclaimer />
                <Footer />
                <ChatWidget />
            </div>
        </>
    );
}

export default App;