// rag/weaviate-client.js
import weaviate from "weaviate-ts-client";
import dotenv from "dotenv";

dotenv.config();

export const weaviateClient = weaviate.client({
    scheme: "https",
    host: process.env.WEAVIATE_URL.replace("https://", ""),
    apiKey: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
});
