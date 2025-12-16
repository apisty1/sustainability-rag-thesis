# 📦 Backend — RAG API for Sustainability Reports

## Overview

This repository contains the **backend API** of a didactic project developed as part of a university thesis.  
The backend implements a **Retrieval-Augmented Generation (RAG)** system to analyze sustainability reports (PDF), extract relevant ESG information, and answer user questions in a structured and explainable way.

The system is designed to:
- Retrieve relevant textual evidence from sustainability reports
- Extract and return structured ESG KPIs
- Provide AI-generated answers **grounded in the original document**, with page-level references

The current implementation focuses on the **Ferrero Group Sustainability Report 2024**, but the architecture is reusable for other companies and reports.

---

## Architecture

**Tech stack**
- **Node.js + Express** — REST API
- **OpenAI API** — embeddings and LLMs
- **Weaviate (vector database)** — semantic retrieval
- **RAG pipeline** — Fast vs Accurate modes

**Core components**
```
backend/
├── server.js              # Express API entry point
├── lambda.js              # AWS Lambda adapter (serverless-http)
├── rag/
│   ├── rag-query.js       # RAG orchestration (retrieval + generation)
│   ├── openai-client.js   # OpenAI client wrapper
│   └── weaviate-client.js # Weaviate client
└── utils/
    └── timing.js          # Simple latency measurement
```

---

## RAG Modes

### ⚡ Fast mode
- Fewer retrieved chunks
- No re-ranking
- Faster response time
- Suitable for exploratory questions

### 🎯 Accurate mode
- More retrieved chunks
- Semantic re-ranking via LLM
- Slower but more precise
- Suitable for detailed analysis and academic use

---

## API Endpoints

### POST /ask-fast
Fast RAG query without re-ranking.

**Request**
```json
{
  "question": "What are Ferrero’s main GHG reduction actions?"
}
```

**Response**
```json
{
  "mode": "FAST",
  "answer": "...",
  "kpis": [],
  "sources": [
    { "page": 45, "chunk_index": 12 }
  ],
  "time": 1.42
}
```

---

### POST /ask-accurate
Accurate RAG query with re-ranking and KPI enrichment.

**Request**
```json
{
  "question": "How have Scope 3 emissions evolved?"
}
```

**Response**
```json
{
  "mode": "ACCURATE",
  "answer": "...",
  "kpis": [
    {
      "metric": "Scope 3 emissions",
      "unit": "tCO2eq",
      "values_json": "{...}"
    }
  ],
  "sources": [
    { "page": 101, "chunk_index": 87 }
  ],
  "time": 3.85
}
```

---

## Data Model (Weaviate)

### FerreroCleanChunk
Narrative text (non-tabular content)

| Field | Type |
|------|------|
| page | INT |
| text | TEXT |
| chunk_index | INT |
| type | TEXT |

### FerreroKPIChunk
Structured KPI tables

| Field | Type |
|------|------|
| page | INT |
| category | TEXT |
| metric | TEXT |
| unit | TEXT |
| values_json | TEXT |

---

## Environment Variables

Create a `.env` file with:

```env
OPENAI_API_KEY=your_openai_key
WEAVIATE_URL=https://your-cluster.weaviate.network
WEAVIATE_API_KEY=your_weaviate_key
```

---

## Run Locally

```bash
npm install
node server.js
```

The API will be available at:
```
http://localhost:3001
```

---

## Execution & Deployment Model

The backend is built around a single Express application that can run in
multiple environments without code duplication.

### Local / Server Deployment
- The API runs as a standard Express server via `server.js`
- Used for local development and traditional hosting

### Serverless Deployment (Production)
- The same Express app is wrapped using `serverless-http`
- Exposed as an AWS Lambda function via `lambda.js`
- Enables scalable, pay-per-request execution

This approach ensures:
- a single source of truth for the API logic
- identical behavior across environments
- simplified maintenance and testing

---

## Academic Disclaimer

This project is developed **exclusively for academic and didactic purposes**.  
It is **not affiliated with or endorsed by Ferrero Group**.

All data originates from publicly available sustainability reports and is used for educational analysis and experimentation with AI-based information retrieval.

---

## Author

**Antonio Pistilli**  
Thesis Project — Consultazione strutturata dei report di sostenibilità mediante tecnologie web: il caso Ferrero
