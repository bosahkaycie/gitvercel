import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testGemini() {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    console.log("Testing API Key:", apiKey ? "Present (Starts with " + apiKey.substring(0, 5) + "...)" : "Missing");

    if (!apiKey) {
        console.error("Error: VITE_GEMINI_API_KEY is missing in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = "Hello! Are you working?";
        console.log("Sending prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:", text);
    } catch (error) {
        console.error("API Error:");
        console.error(error);
    }
}

testGemini();
