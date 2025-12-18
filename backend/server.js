// server.js
import express from "express";
import cors from "cors";
import ragQuery from "./rag/rag-query.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    // Lascia passare il preflight
    if (req.method === "OPTIONS") {
        return next();
    }

    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return res.status(401).json({
            error: "Unauthorized"
        });
    }

    next();
});

// -------------------------------------
// FAST RAG (veloce, no reranking)
// -------------------------------------
app.post("/ask-fast", async (req, res) => {
    console.log("ASK-FAST BODY:", req.body);

    try {
        const questionRaw = req.body?.question ?? "";
        const question = String(questionRaw).trim();

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        const result = await ragQuery(question, { accurate: false });

        res.json(result);

    } catch (err) {
        console.error("ASK-FAST ERROR:", err);
        res.status(500).json({
            error: "Internal server error",
            details: err.message
        });
    }
});


// -------------------------------------
// ACCURATE RAG (slow but smart)
// -------------------------------------
app.post("/ask-accurate", async (req, res) => {
    try {
        const question = String(req.body?.question || "").trim();
        const result = await ragQuery(question, { accurate: true });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// -----------------------------
// EXPORT DEFAULT (FONDAMENTALE)
// -----------------------------
export default app;

// SOLO per sviluppo locale
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    app.listen(3001, () =>
        console.log("Local backend on http://localhost:3001")
    );
}
