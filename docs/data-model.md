# 📊 Data Model & Information Representation

## Overview

This document describes the **data model** adopted in the Sustainability RAG system.  
The modeling choices reflect the need to balance **semantic flexibility**, **numerical precision**, and **traceability** in the analysis of sustainability reports.

---

## Types of Data Managed

The system handles three main categories of data:

1. **Narrative text**
2. **Structured ESG KPIs**
3. **Vector embeddings**

Each category plays a distinct role in the Hybrid RAG architecture.

---

## Narrative Text Chunks

Narrative content is extracted from the PDF and split into token-aware chunks.

Each chunk represents:
- a coherent semantic unit
- tied to a specific PDF page

**Core attributes**
- `text`
- `page`
- `chunk_index`

These chunks are optimized for semantic similarity search.

---

## Structured KPI Data

ESG KPIs are treated as **first-class structured entities**, not as plain text.

Characteristics:
- explicit metric names
- year-based values
- preserved units
- page-level provenance

KPI data is normalized into JSON structures to:
- avoid ambiguity
- prevent hallucinations
- support precise retrieval

---

## JSON as an Intermediate Representation

JSON is used as an intermediate representation because it is:
- human-readable
- language-agnostic
- structurally explicit

This allows KPI data to be:
- validated manually
- reused across backend and frontend
- queried independently of semantic similarity

---

## Vector Embeddings

Narrative chunks are transformed into dense vector embeddings using OpenAI models.

Embeddings enable:
- semantic similarity search
- context retrieval for RAG prompts
- ranking of relevant passages

Embeddings are stored separately from structured KPI values.

---

## Hybrid RAG Data Interaction

The Hybrid RAG model combines:

- **Vector-based retrieval**
  - for qualitative explanations

- **Structured data access**
  - for quantitative accuracy

During query answering:
- relevant text chunks provide context
- KPI records provide precise values

This dual strategy improves both reliability and explainability.

---

## Traceability & Explainability

All data entities preserve:
- PDF page references
- stable identifiers

This ensures that:
- every answer can be traced back to the source document
- users can verify claims manually
- AI outputs remain auditable

---

## Design Rationale

Key modeling principles include:

- **Separation of concerns**
  Narrative and numerical data are modeled differently.

- **Explicitness**
  Structured data is preferred over inferred values.

- **Didactic clarity**
  The model supports inspection and learning.

---

## Academic Perspective

The data model demonstrates how:
- traditional document analysis
- modern vector-based retrieval
- and structured data modeling

can coexist within a single AI system.

These choices are central to the project’s methodological contribution.

---

## Author

**Antonio Pistilli**  
Thesis Project — Consultazione strutturata dei report di sostenibilità mediante tecnologie web: il caso Ferrero
