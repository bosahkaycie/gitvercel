import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function listModels() {
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("API Key missing");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        fs.writeFileSync(path.resolve(__dirname, '../models_list.json'), JSON.stringify(data, null, 2));
        console.log("Models list saved to models_list.json");

        if (data.models) {
            console.log(`Found ${data.models.length} models.`);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
