# 🌱 Consultazione strutturata dei report di sostenibilità mediante tecnologie web: il caso Ferrero

## Overview

This repository contains the complete implementation of a **Retrieval-Augmented Generation (RAG)** system developed as part of a **Thesis Project**.  
The project explores how Artificial Intelligence can be used to **analyze, structure, and interpret corporate sustainability reports**, with a specific focus on ESG KPIs.

The system enables users to:
- Ingest sustainability reports in PDF format
- Extract and normalize key ESG indicators
- Query the reports through an AI-powered backend
- Explore results via an interactive web interface with transparent source attribution

The current case study is based on the **Ferrero Group Sustainability Report 2024**, used exclusively for academic and didactic purposes.

---

## Project Structure

The repository is organized as a **monorepo**, grouping all components of the system in a single, coherent codebase.

```
sustainability-rag-thesis/
│
├── backend/                 # RAG API (Node.js, OpenAI, Weaviate)
│   ├── README.md
│   ├── server.js
│   ├── lambda.js
│   └── rag/
│
├── ingest-pdf/              # PDF ingestion & KPI extraction (Python)
│   ├── README.md
│   ├── ingest.py
│   └── requirements.txt
│
├── frontend/                # Web interface (React)
│   ├── README.md
│   ├── src/
│   └── public/
│
└── docs/                    # Supporting documentation, Screenshots and screencast
    ├── Screenshots/
    ├── architecture.md
    └── data-model.md
```

This structure reflects the **end-to-end pipeline** of the system, from raw documents to AI-assisted analysis and visualization.

---

## System Architecture

The project follows a modular architecture composed of three main layers:

1. **Data Ingestion**
   - Parses sustainability reports (PDF)
   - Extracts narrative text and tabular KPI data
   - Normalizes and stores content in a vector database

2. **RAG Backend**
   - Performs semantic retrieval using embeddings
   - Combines retrieved context with large language models
   - Supports multiple query modes (Fast vs Accurate)
   - Exposes a REST API for downstream consumers

3. **Frontend Application**
   - Visualizes extracted KPIs
   - Enables chat-based exploration of reports
   - Displays page-level sources for transparency and traceability

---

## Running the Project (High-Level)

The system is composed of three main components that must be executed
in the following order:

1. **Data ingestion**
   - Parse the sustainability report
   - Generate embeddings
   - Populate the vector database  
   (see `ingest-pdf/README.md`)

2. **Backend API**
   - Start the RAG API (local or serverless)
   - Expose `/ask-fast` and `/ask-accurate` endpoints  
   (see `backend/README.md`)

3. **Frontend application**
   - Start the web interface
   - Connect to the backend API  
   (see `frontend/README.md`)

Each component can be run independently, but the ingestion step
must be completed before querying the system.

---

## Design Principles

The project is guided by the following principles:

- **Explainability**  
  AI-generated answers are always grounded in retrieved document content.

- **Modularity**  
  Each component can be developed, tested, and extended independently.

- **Reproducibility**  
  The full pipeline can be re-executed starting from the original PDF sources.

- **Didactic focus**  
  The system prioritizes clarity and methodological soundness over production-scale optimization.

---

## Academic Disclaimer

This project is developed **exclusively for academic and educational purposes**.  
It is **not affiliated with or endorsed by Ferrero Group**.

All data originates from publicly available sustainability reports and is used solely for research, experimentation, and learning objectives.

---

## Author

**Antonio Pistilli**  
Thesis Project — Consultazione strutturata dei report di sostenibilità mediante tecnologie web: il caso Ferrero

