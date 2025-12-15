import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import KpiTable from "../KpiTable/KpiTable.tsx";
import "./ChatWidget.scss";

interface ChatMessage {
    sender: "user" | "bot";
    text: string;
    section?: string;
    latency?: number;
    kpiTables?: {
        category: string;
        metric: string;
        unit: string;
        values: {
            year: string;
            value: number;
            assured?: boolean;
        }[];
        source?: string;
    }[];
}

interface Suggestion {
    key: string;
    label: string;
    question: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ChatWidget() {

    // -----------------------------
    // UI STATE
    // -----------------------------
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [message, setMessage] = useState("");
    const [useAccurate, setUseAccurate] = useState(false);
    const [botTyping, setBotTyping] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // -----------------------------
    // WELCOME MESSAGE
    // -----------------------------
    const welcomeMessage: ChatMessage = {
        sender: "bot",
        text: `Hi! I'm your Sustainability Assistant 👋  
I can help you explore Ferrero’s ESG performance, sustainability strategy, and key KPIs.

You can ask your own question, or start with one of the examples below.`
    };

    // -----------------------------
    // KPI-BASED SUGGESTIONS
    // -----------------------------
    const KPI_SUGGESTIONS: Suggestion[] = [
        {
            key: "ghg",
            label: "GHG footprint",
            question: "What is the total GHG footprint of Ferrero in 2023/24?"
        },
        {
            key: "energy",
            label: "Renewable energy",
            question: "How much of Ferrero’s energy consumption comes from renewable sources?"
        },
        {
            key: "water",
            label: "Water strategy",
            question: "What is the water withdrawal ratio per tonne of product?"
        },
        {
            key: "framework",
            label: "Sustainability framework",
            question: "Summarize Ferrero’s sustainability framework."
        }
    ];

    // -----------------------------
    // LOAD FROM LOCAL STORAGE
    // -----------------------------
    const loadMemory = (): ChatMessage[] => {
        try {
            const saved = localStorage.getItem("chat_memory");
            if (saved) return JSON.parse(saved);
        } catch (_) {}
        return [welcomeMessage];
    };

    const [messages, setMessages] = useState<ChatMessage[]>(loadMemory);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
    };

    // Persist chat memory
    useEffect(() => {
        localStorage.setItem("chat_memory", JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);



    // -----------------------------
    // DETECT AVAILABLE KPIs (heuristic)
    // -----------------------------
    const availableKpis = new Set<string>();

    for (const { text = "" } of messages) {
        const t = text.toLowerCase();
        if (!t) continue;

        if (/(ghg|scope)/.test(t)) availableKpis.add("ghg");
        if (/(energy|renewable)/.test(t)) availableKpis.add("energy");
        if (/water/.test(t)) availableKpis.add("water");
    }


    const suggestions = messages.length === 1
        ? KPI_SUGGESTIONS
        : KPI_SUGGESTIONS.filter(s =>
            s.key === "framework" || availableKpis.has(s.key)
        );

    // -----------------------------
    // SEND MESSAGE
    // -----------------------------
    const sendMessage = async (override?: string) => {
        const q = override || message;
        if (!q.trim()) return;

        setMessages(prev => [...prev, { sender: "user", text: q }]);
        setMessage("");
        setBotTyping(true);

        const endpoint = useAccurate ? "/ask-accurate" : "/ask-fast";

        const start = performance.now();
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": import.meta.env.VITE_API_KEY
            },
            body: JSON.stringify({ question: q })
        });

        if (!response.ok) {
            throw new Error(`API error ${response.status}`);
        }
        const data = await response.json();
        const latency = (performance.now() - start) / 1000;

        setBotTyping(false);

        setMessages(prev => [
            ...prev,
            {
                sender: "bot",
                text: data.answer,
                kpiTables: data.kpiTables || [],
                section: data.sources?.map((s: any) => `p.${s.page}`).join(", "),
                latency
            }
        ]);
    };

    const sendSuggested = (q: string) => {
        sendMessage(q);
    };

    // -----------------------------
    // RESET CHAT
    // -----------------------------
    const resetChat = () => {
        setMessages([welcomeMessage]);
        localStorage.setItem("chat_memory", JSON.stringify([welcomeMessage]));
    };

    // -----------------------------
    // COPY MESSAGE
    // -----------------------------
    const copyMessage = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 1200);
    };

    return (
        <div className="chat-widget">

            {/* ------------------ MINIMIZED PILL ------------------ */}
            {!isOpen && (
                <div
                    className="chat-widget__pill fs-5"
                    onClick={() => setIsOpen(true)}
                >
                    <i className="bi bi-chat-dots me-2"></i>
                    Chat with AI
                </div>
            )}

            {/* ------------------ CHAT WINDOW ------------------ */}
            {isOpen && (
                <div
                    className={`
                        chat-widget__window
                        ${isExpanded ? "expanded" : ""}
                    `}
                >

                    {/* ------------------ HEADER ------------------ */}
                    <div className="chat-widget__header">
                        <span className="chat-widget__title">SustAi</span>

                        <div className="mode-toggle">
                            <span className={`mode-label ${!useAccurate ? "active" : ""}`}>
                                ⚡ Fast
                            </span>

                            <label className="mode-switch">
                                <input
                                    type="checkbox"
                                    checked={useAccurate}
                                    onChange={() => setUseAccurate(!useAccurate)}
                                />
                                <span className="slider"></span>
                            </label>

                            <span className={`mode-label ${useAccurate ? "active" : ""}`}>
                                🎯 Accurate
                            </span>
                        </div>

                        <div className="chat-widget__header-buttons">
                            <button
                                className="icon-btn"
                                title="Clear chat"
                                onClick={resetChat}
                            >
                                <i className="bi bi-trash3"></i>
                            </button>

                            <button
                                className="icon-btn hide-on-mobile"
                                title={isExpanded ? "Reduce" : "Expand"}
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? (
                                    <i className="bi bi-arrows-angle-contract"></i>
                                ) : (
                                    <i className="bi bi-arrows-angle-expand"></i>
                                )}
                            </button>

                            <button
                                className="icon-btn"
                                title="Close"
                                onClick={() => setIsOpen(false)}
                            >
                                <i className="bi bi-dash"></i>
                            </button>
                        </div>
                    </div>

                    {/* ------------------ MESSAGES ------------------ */}
                    <div className="chat-widget__messages">
                        {messages.map((msg, i) => {
                            const isFirstBot = i === 0 && msg.sender === "bot";

                            return (
                                <div
                                    key={i}
                                    className={`chat-widget__message chat-widget__message--${msg.sender}`}
                                >
                                    <div className="chat-widget__avatar">
                                        {msg.sender === "bot" ? "🤖" : "🧑"}
                                    </div>

                                    <div className="chat-widget__bubble">

                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.text}
                                        </ReactMarkdown>

                                        {/* ⬇️ KPI TABLES (SOLO PER IL BOT) */}
                                        {msg.sender === "bot" && msg.kpiTables && msg.kpiTables.length > 0 && (
                                            <div className="chat__kpi-tables">
                                                {msg.kpiTables.map((table, idx) => (
                                                    <KpiTable key={idx} table={table} />
                                                ))}
                                            </div>
                                        )}

                                        {/* CHIP-STYLE SUGGESTIONS */}
                                        {isFirstBot && (
                                            <div className="chat-widget__suggestions">
                                                {suggestions.map((s, idx) => (
                                                    <button
                                                        key={idx}
                                                        className="suggest-chip"
                                                        onClick={() => sendSuggested(s.question)}
                                                    >
                                                        {s.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {msg.section && (
                                            <div className="chat-widget__section-tag">
                                                {msg.section}
                                            </div>
                                        )}

                                        {msg.latency && (
                                            <div className="latency-tag">
                                                <i className="bi bi-stopwatch"></i> {msg.latency.toFixed(2)}s
                                            </div>
                                        )}

                                        {!isFirstBot && msg.sender === "bot" && (
                                            <div
                                                className="chat-widget__copy"
                                                onClick={() => copyMessage(msg.text, i)}
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === i ? (
                                                    <span className="copy-confirm">✔ Copied</span>
                                                ) : (
                                                    <i className="bi bi-copy"></i>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {botTyping && (
                            <div className="chat-widget__typing">
                                🤖 <span className="typing-dots">...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* ------------------ INPUT ------------------ */}
                    <div className="chat-widget__input">
                        <input
                            type="text"
                            placeholder="Ask something..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            className="chat-widget__send"
                            onClick={() => sendMessage()}
                        >
                            <i className="bi bi-send"></i>
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}
