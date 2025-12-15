# 📄 PDF Ingestion & Data Preparation Pipeline

## Overview

This module implements the **data ingestion and preparation pipeline** of the thesis project.  
Its goal is to transform raw sustainability reports (PDF) into **clean, structured, and embedding-ready data** suitable for semantic retrieval and AI-based analysis.

The pipeline focuses on:
- Extracting narrative text from sustainability reports
- Cleaning and chunking content for optimal embeddings
- Creating vector representations using OpenAI embeddings
- Preparing structured data to support hybrid retrieval strategies
- Preserving page-level traceability for academic transparency

The current implementation targets the **Ferrero Group Sustainability Report 2024** as a case study.

---

## Role in the Overall System

This module represents the **data foundation** of the entire system:

```
PDF → Clean text / Structured data → Embeddings → Vector DB → RAG backend → Frontend
```

All downstream components rely on the **quality, structure, and modeling choices** made at this stage.

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

## From Simple RAG to Hybrid RAG: Why JSON Matters

During early experimentation, the system relied on a **single retrieval strategy**:
- splitting the report into narrative chunks
- extracting tabular content
- embedding everything uniformly

While effective for qualitative questions, this approach revealed clear limitations when handling **numerical KPIs** and **structured sustainability data**.

In particular:
- KPI tables were poorly represented when flattened into text
- Numerical values risked being hallucinated or misattributed
- Semantic similarity alone was insufficient for precise KPI retrieval

These observations led to the adoption of a **Hybrid RAG approach**, combining:
- semantic retrieval over narrative text
- structured access to normalized KPI data

### Why JSON as an Intermediate Representation

To support this hybrid strategy, KPI data is extracted and normalized into **explicit JSON structures** before ingestion.

This design choice is intentional and methodologically motivated.

JSON is used because it is:
- **Explicit** — numerical values, years, and metrics are clearly separated
- **Inspectable** — data can be manually reviewed and validated
- **Flexible** — usable across Python ingestion, Node.js backend, and frontend
- **Model-friendly** — avoids ambiguity inherent in free-text tables

By introducing a structured JSON layer, the pipeline:
- decouples *extraction* from *retrieval*
- enables precise KPI querying alongside semantic search
- improves answer accuracy and reduces hallucinations

This evolution from a simple chunk-based RAG to a **Hybrid RAG architecture** represents a key methodological contribution of the project.

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
- prepare structured data for hybrid retrieval
- populate the vector database
- log progress at each stage

---

## Design Considerations (Academic Perspective)

- **Methodological evolution**  
  The pipeline reflects an iterative research process, evolving from simple RAG to Hybrid RAG.

- **Explainability**  
  Page numbers and chunk indices are preserved for traceability.

- **Embedding-aware preprocessing**  
  Chunking is driven by token count, not arbitrary length.

- **Reproducibility**  
  The pipeline can be re-executed end-to-end from the original PDF.

---

## Academic Disclaimer

This module is developed **exclusively for academic and research purposes**.  
It is not intended for production-scale document processing.

All data is sourced from publicly available sustainability reports and used solely for educational experimentation.

---

## Author

**Antonio Pistilli**  
Thesis Project — Artificial Intelligence & Sustainability Analytics
