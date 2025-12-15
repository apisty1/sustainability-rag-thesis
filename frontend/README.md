# 🖥️ Frontend — Sustainability Analytics Interface

## Overview

This module implements the **frontend application** of the thesis project.  
Its purpose is to provide an **interactive, transparent, and didactic interface** for exploring corporate sustainability reports through AI-assisted analysis.

The frontend is not limited to the AI chat: it also includes a **landing-style dashboard** that introduces the report, highlights key ESG performance indicators, and provides direct access to the original PDF document.

The application is designed to work in conjunction with the **RAG backend API** and reflects the methodological choices made across the ingestion and retrieval layers.

---

## Role in the Overall System

The frontend represents the **user-facing layer** of the system:

```
PDF → Ingestion → Vector DB → RAG Backend → Frontend UI
```

It is the point where:
- structured KPI data,
- narrative explanations,
- and AI-generated answers

are combined into a single, coherent user experience.

---

## Main Sections of the Interface

### 1. Introductory Landing & Context

The application opens with a **Bootstrap-based landing section** that introduces the scope and purpose of the project.

This section:
- frames the analysis as an academic and didactic project
- provides contextual information about the sustainability report
- guides the user before interacting with data or AI features

The landing page is intentionally designed to resemble an **analytical dashboard**, rather than a generic marketing homepage.

---

### 2. PDF Download Access

A dedicated section allows users to **download the original sustainability report** (PDF).

This feature serves multiple purposes:
- encourages verification against primary sources
- reinforces transparency and academic rigor
- allows offline consultation of the document

Providing direct access to the source material is a deliberate design choice aligned with the project’s emphasis on **traceability and critical reading**.

---

### 3. Key ESG Performance Overview

The frontend displays a selection of **key ESG performance indicators** extracted during the ingestion phase.

This section:
- highlights the most relevant environmental and social KPIs
- presents values across multiple reporting years
- provides an immediate, high-level understanding of sustainability performance

The KPIs shown here are chosen for **didactic relevance**, not completeness, and mirror those used by the AI backend during query answering.

---

### 4. KPI Visualization & Charts

Key ESG indicators are visualized using charts and summary components.

The visualizations are designed to:
- show trends over time
- support comparison between years
- complement textual explanations with quantitative evidence

This graphical layer allows users to interpret sustainability performance **before** engaging with the AI assistant, reinforcing a data-first exploration workflow.

---

### 5. AI Chat Interface

The application includes an AI-powered chat widget that enables users to ask natural language questions about the sustainability report.

Key characteristics:
- context-aware answers powered by a RAG pipeline
- explicit distinction between Fast and Accurate query modes
- automatic display of page-level sources
- visible response latency

Rather than replacing traditional analysis, the chat acts as an **augmented exploration tool**.

---

### 6. Fast vs Accurate Modes

Users can switch between two AI query modes:

- **Fast mode**
  - lower latency
  - fewer retrieved chunks
  - suitable for exploratory questions

- **Accurate mode**
  - higher latency
  - richer context and re-ranking
  - suitable for detailed or academic analysis

This UI-level distinction exposes a fundamental trade-off in AI systems:  
**speed versus accuracy**.

---

## Explainability & Transparency

Explainability is a core design principle of the frontend.

For each AI-generated answer, the interface exposes:
- PDF page references
- contextual sections used for retrieval
- response generation time

These elements allow users to:
- trace answers back to the original document
- critically assess AI outputs
- distinguish retrieved facts from generated explanations

---

## Technical Stack

- **React** — UI framework
- **TypeScript** — type safety and maintainability
- **Vite** — development and build tooling
- **Bootstrap** — layout and responsive components
- **Charting libraries** — KPI visualization
- **Fetch API** — backend communication
- **Markdown rendering** — structured AI responses

The frontend is intentionally lightweight and focused on clarity, reproducibility, and didactic value.

---

## Configuration

### Backend Connection

The frontend communicates with the backend via HTTP endpoints:

- `/ask-fast`
- `/ask-accurate`

The API base URL can be configured to point to a local development server or a deployed backend instance.

---

## Running the Application

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Design Considerations (Academic Perspective)

- **Data-first exploration**  
  KPIs and charts are presented before AI interaction.

- **Human-centered AI**  
  The interface is designed to help users understand *how* answers are produced.

- **Hybrid interaction model**  
  Structured visual analysis complements conversational AI.

- **Transparency over automation**  
  The UI favors inspectability over minimalism.

- **Didactic focus**  
  The frontend is intended as a learning and exploration tool, not a commercial product.

---

## Academic Disclaimer

This frontend is developed **exclusively for academic and educational purposes**.  
It is not intended for commercial or production use.

All data is derived from publicly available sustainability reports and processed for research and learning objectives.

---

## Author

**Antonio Pistilli**  
Master’s Thesis — Artificial Intelligence & Sustainability Analytics
