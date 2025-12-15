# 🧭 System Architecture

## Overview

This document describes the **architecture of the Sustainability RAG system**, developed as part of a thesis project.  
The system is designed as an **end-to-end AI pipeline** that transforms corporate sustainability reports into an interactive, explainable, and queryable web application.

The architecture is intentionally modular and reflects both:
- a **research-oriented design**, and
- a **real production deployment** on AWS.

---

## High-Level Architecture

At a conceptual level, the system follows this flow:

```
Sustainability Report (PDF)
        ↓
Data Ingestion & Structuring
        ↓
Vector Database (Embeddings + Structured Data)
        ↓
RAG Backend API
        ↓
Web Frontend (Dashboard + AI Chat)
```

Each layer is independent but tightly integrated through well-defined interfaces.

---

## Component Responsibilities

### 1. Data Ingestion Layer

**Purpose**
- Transform unstructured PDF content into structured, retrievable data

**Responsibilities**
- Extract narrative text
- Normalize ESG KPIs into structured formats
- Generate embeddings
- Preserve page-level traceability

This layer is implemented in Python and is executed offline or on-demand.

---

### 2. RAG Backend Layer

**Purpose**
- Answer user questions using retrieved evidence from the report

**Responsibilities**
- Semantic retrieval using embeddings
- Hybrid retrieval (narrative text + structured KPIs)
- Prompt construction and answer generation
- Exposure of a clean HTTP API

The backend supports two execution modes:
- **Fast** (low latency)
- **Accurate** (re-ranking, richer context)

---

### 3. Frontend Layer

**Purpose**
- Enable human interaction with the system

**Responsibilities**
- Present key ESG KPIs and charts
- Provide access to the original PDF
- Enable chat-based exploration
- Expose AI behavior transparently (sources, latency, modes)

The frontend is designed as an **analytical interface**, not a black-box chatbot.

---

## Hybrid RAG Strategy

Early experimentation revealed that a purely chunk-based RAG approach was insufficient for handling structured ESG data.

The system therefore adopts a **Hybrid RAG architecture**:
- Semantic retrieval over narrative text
- Structured access to normalized KPI data

This separation improves:
- numerical accuracy
- explainability
- robustness against hallucinations

---

## Production Deployment Architecture (AWS)

In addition to the conceptual architecture, the system has been **fully deployed in a production-like environment on AWS**.

### 🌍 Frontend (Production)

- **Amazon S3**  
  - Private bucket hosting the built SPA

- **Amazon CloudFront**
  - CDN distribution
  - Origin Access Control (OAC)
  - HTTPS termination

- **Amazon Route 53**
  - Custom domain
  - DNS management

**Characteristics**
- Fully static SPA
- Secure private origin
- ChatWidget integrated
- PDF download available
- KPI charts rendered client-side

---

### ⚙️ Backend (Production)

- **AWS Lambda (Node.js 20)**
  - Stateless execution
  - Express app adapted using `serverless-http`

- **Amazon API Gateway (HTTP API)**
  - Public HTTPS endpoints
  - Preflight and CORS correctly configured

- **External Services**
  - OpenAI API
  - Weaviate Cloud vector database

**Custom Domain**
```
https://api.sustai.pistilli.io
```

---

### 🔗 Frontend ↔ Backend Integration

The deployed system supports:

- `/ask-fast` and `/ask-accurate` endpoints
- Clean CORS handling (including preflight)
- Stable runtime behavior
- Visible response latency
- Correct rendering of KPI tables

No runtime or CORS errors are observed in production.

---

## Execution Model

The project follows a **single-codebase, multi-runtime model**:

- Express app shared between:
  - local development
  - server deployment
  - AWS Lambda execution

This approach ensures:
- consistency across environments
- reduced maintenance overhead
- architectural clarity

---

## Design Rationale

Key architectural decisions include:

- **Monorepo structure**  
  To preserve conceptual unity and reproducibility.

- **Serverless backend**  
  For scalability and cost-efficiency.

- **Static frontend hosting**  
  For security and performance.

- **Hybrid RAG**  
  To balance semantic understanding and numerical precision.

---

## Academic Perspective

This architecture demonstrates how:
- modern AI techniques (RAG, embeddings)
- cloud-native infrastructure
- and explainable UX design

can be combined into a coherent, research-oriented system.

The production deployment serves as a **proof of feasibility**, while the focus remains on methodological soundness rather than industrial optimization.

---

## Author

**Antonio Pistilli**  
Thesis Project — Artificial Intelligence & Sustainability Analytics
