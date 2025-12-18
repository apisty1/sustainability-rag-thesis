/**
 * RAG QUERY PIPELINE (GraphQL, KPI-FIRST)
 *
 * This module implements a two-stage Retrieval-Augmented Generation (RAG)
 * strategy for sustainability reports:
 *
 * 1. Structured KPI retrieval (FerreroKPI)
 * 2. Narrative text retrieval (FerreroNarrative)
 *
 * The goal is to guarantee numerical accuracy for KPI-related questions
 * while still providing meaningful narrative explanations for general queries.
 */

import { openai } from "./openai-client.js";
import { weaviateClient } from "./weaviate-client.js";
import { startTimer, endTimer } from "../utils/timing.js";


/* ============================================================
   INTENT DETECTION
   ------------------------------------------------------------
   Lightweight heuristic to detect whether the user is likely
   asking for numerical KPI values.
   ============================================================ */

function isKpiQuestion(question) {
    return /(value|values|how much|amount|performance|emissions|energy|water|waste|ratio|percentage|total|scope)/i
        .test(question);
}

async function embedQuestion(question) {
    const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question
    });

    return emb.data[0].embedding;
}

/**
 * Build KPI tables grouped by metric + unit
 * Output is frontend-friendly and suitable for charts.
 */
function buildKpiTables(kpis) {
    const map = new Map();

    for (const kpi of kpis) {
        const key = `${kpi.metric}|${kpi.unit}`;

        if (!map.has(key)) {
            map.set(key, {
                category: kpi.category,
                metric: kpi.metric,
                unit: kpi.unit,
                values: [],
                source: kpi.source
            });
        }

        map.get(key).values.push({
            year: kpi.year,
            value: kpi.value,
            assured: kpi.notes?.includes("(A)") || false
        });
    }

    // Sort values by year (important for tables & charts)
    for (const table of map.values()) {
        table.values.sort((a, b) => a.year.localeCompare(b.year));
    }

    return Array.from(map.values());
}


/* ============================================================
   KPI RETRIEVAL (FerreroKPI)
   ------------------------------------------------------------
   Semantic search over structured KPI objects.
   Each object represents:
   - one metric
   - one year
   - one numerical value
   ============================================================ */

async function retrieveKpis(question, limit = 15) {
    const vector = await embedQuestion(question);
    const res = await weaviateClient.graphql
        .get()
        .withClassName("FerreroKPI")
        .withNearVector({ vector })
        .withFields(`
            category
            metric
            unit
            year
            value
            notes
            source
        `)
        .withLimit(limit)
        .do();

    return res?.data?.Get?.FerreroKPI ?? [];
}

/* ============================================================
   NARRATIVE RETRIEVAL (FerreroNarrative)
   ------------------------------------------------------------
   Used to:
   - explain trends
   - describe methodology
   - answer qualitative questions
   ============================================================ */

async function retrieveNarrative(question, limit = 6) {
    const vector = await embedQuestion(question);
    const res = await weaviateClient.graphql
        .get()
        .withClassName("FerreroNarrative")
        .withNearVector({ vector })
        .withFields(`
            page
            section
            text
        `)
        .withLimit(limit)
        .do();

    return res?.data?.Get?.FerreroNarrative ?? [];
}

/* ============================================================
   PROMPT BUILDER (CRITICAL COMPONENT)
   ------------------------------------------------------------
   The prompt enforces:
   - strict use of provided data
   - explicit reporting of KPI values
   - no hallucinations
   - academic tone
   ============================================================ */

function buildPrompt({ question, kpis, narrative }) {
    return `
You are an academic sustainability and ESG reporting analyst.

Answer the user's question using ONLY the information provided below.

MANDATORY RULES:
- If KPI values are available, you MUST report them explicitly.
- Always specify:
  • KPI name
  • reporting year
  • unit of measurement
- NEVER invent or estimate values.
- If a value is not available, clearly state that it is not reported.
- Use narrative text ONLY to explain context, scope, or trends.
- Maintain a neutral, professional, academic tone.
- Do NOT use external knowledge.

------------------------------------------------------------
USER QUESTION:
${question}

------------------------------------------------------------
STRUCTURED KPI DATA:
${kpis.length ? JSON.stringify(kpis, null, 2) : "No KPI data found."}

------------------------------------------------------------
NARRATIVE CONTEXT:
${narrative.length
        ? narrative.map(n => `Page ${n.page}: ${n.text}`).join("\n\n")
        : "No narrative context found."}

------------------------------------------------------------
ANSWER STRUCTURE:
1. Direct answer to the question.
2. Explicit listing of KPI values (if available).
3. Short explanatory paragraph (only if relevant).
`;
}

/* ============================================================
   MAIN RAG FUNCTION
   ------------------------------------------------------------
   Used by both /ask-fast and /ask-accurate endpoints.
   ============================================================ */

export default async function ragQuery(
    question,
    { accurate = false } = {}
) {
    const start = startTimer();

    const wantsKpis = isKpiQuestion(question);

    let kpis = [];
    let narrative = [];

    // ---------------------------------------------------------
    // KPI-FIRST: retrieve structured data when relevant
    // ---------------------------------------------------------
    if (wantsKpis) {
        kpis = await retrieveKpis(question, accurate ? 20 : 10);
    }

    // ---------------------------------------------------------
    // Narrative fallback / explanation
    // ---------------------------------------------------------
    narrative = await retrieveNarrative(question, accurate ? 8 : 4);

    // ---------------------------------------------------------
    // Build strict prompt
    // ---------------------------------------------------------
    const prompt = buildPrompt({
        question,
        kpis,
        narrative
    });

    // ---------------------------------------------------------
    // LLM completion
    // ---------------------------------------------------------
    const completion = await openai.chat.completions.create({
        model: accurate ? "gpt-4.1" : "gpt-4.1-mini",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: "You are a precise ESG reporting assistant."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });

    const kpiTables = buildKpiTables(kpis);

    // ---------------------------------------------------------
    // Final response payload
    // ---------------------------------------------------------
    return {
        mode: accurate ? "ACCURATE" : "FAST",
        answer: completion.choices[0].message.content,
        kpiTables,
        sources: narrative,
        time: endTimer(start)
    };
}
