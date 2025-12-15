# 📄 PDF Ingestion & Data Preparation Pipeline

## Overview

This module implements the **data ingestion and preparation pipeline** of the thesis project.  
Its goal is to transform raw sustainability reports (PDF) into **clean, structured, and embedding-ready data** suitable for semantic retrieval and AI-based analysis.

The pipeline focuses on:
- Extracting narrative text from sustainability reports
- Cleaning and chunking content for optimal embeddings
- Creating vector representations using OpenAI embeddings
- Storing enriched data into a vector database (Weaviate)
- Preserving page-level traceability for academic transparency

The current implementation targets the **Ferrero Group Sustainability Report 2024** as a case study.

---

## Role in the Overall System

This module represents the **data foundation** of the entire system:

```
PDF → Clean text → Token-aware chunks → Embeddings → Vector DB → RAG backend → Frontend
```

All downstream components rely on the **quality, structure, and consistency** of the data generated here.

---

## Pipeline Stages

### 1. PDF Loading
- The report is loaded using `pypdf`
- Each page is processed sequentially
- The pipeline is deterministic and fully reproducible

---

### 2. Text Cleaning

Raw PDF text often contains artifacts that negatively impact embeddings.  
The pipeline applies a cleaning step to:

- Remove line breaks and duplicated spaces
- Merge hyphenated words split across lines
- Normalize spacing while preserving semantics

This step improves **semantic coherence** and **embedding quality**.

---

### 3. Token-Aware Chunking

Instead of fixed-size character chunks, the pipeline uses **token-based chunking**:

- Sentences are grouped dynamically
- Each chunk is kept within ~450 tokens
- Token count is computed using `tiktoken`

This ensures:
- Compatibility with OpenAI embedding limits
- Semantic completeness of chunks
- Balanced granularity for retrieval

Each chunk stores:
- page number
- cleaned text
- progressive chunk index

---

### 4. Embedding Generation

Embeddings are generated using:
- **OpenAI `text-embedding-3-large`**

Before embedding:
- Empty or invalid chunks are filtered
- Input is validated to comply with API constraints

Embeddings are generated in small batches to:
- Improve reliability
- Respect rate limits
- Enable progress monitoring

---

### 5. Vector Database Ingestion

Each chunk is inserted into **Weaviate** with:
- its embedding vector
- page number
- chunk index

The collection is configured with:
- manual vectors (`Vectorizer.none`)
- HNSW index for efficient similarity search

This setup ensures **full control over embeddings** and **predictable retrieval behavior**.

---

## Why a JSON Representation Is Used

During development and evaluation, KPI data and extracted information are often exported to **intermediate JSON files**.

This design choice is intentional.

JSON is used because it is:
- **Human-readable** → easy to inspect and validate manually
- **Language-agnostic** → reusable across Python, Node.js, and frontend code
- **Structurally explicit** → preserves hierarchy, years, and values clearly
- **Didactically effective** → ideal for explaining data transformations in an academic context

In particular, JSON allows:
- Manual verification of extracted KPIs
- Rapid iteration on normalization logic
- Clear separation between *extraction* and *consumption*

For a research-oriented project, transparency and inspectability are prioritized over binary or opaque formats.

---

## Configuration

### Environment Variables

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_key
WEAVIATE_URL=https://your-weaviate-cluster
WEAVIATE_API_KEY=your_weaviate_key
```

---

## Running the Pipeline

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the ingestion script:

```bash
python ingest.py
```

The script will:
- load and clean the PDF
- generate token-aware chunks
- compute embeddings
- populate the vector database
- log progress at each stage

---

## Design Considerations (Academic Perspective)

- **Explainability**  
  Page numbers and chunk indices are preserved for traceability.

- **Embedding-aware preprocessing**  
  Chunking is driven by token count, not arbitrary length.

- **Reproducibility**  
  The pipeline can be re-executed end-to-end from the original PDF.

- **Separation of concerns**  
  Data preparation is fully decoupled from querying and UI logic.

---

## Academic Disclaimer

This module is developed **exclusively for academic and research purposes**.  
It is not intended for production-scale document processing.

All data is sourced from publicly available sustainability reports and used solely for educational experimentation.

---

## Author

**Antonio Pistilli**  
Master’s Thesis — Artificial Intelligence & Sustainability Analytics
