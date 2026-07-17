import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import multer from "multer";

dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

console.log(process.env.GEMINI_API_KEY ? "✅ API Key Loaded" : "❌ API Key Missing");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("MealBridge AI Server Running 🚀");
});

app.get("/test-ai", async (req, res) => {
    try {
        const response = await ai.models.generateContent({
           model: "gemini-3.5-flash",
            contents: "Say hello in one short sentence.",
        });

        res.send(response.text);
    } catch (error) {
        console.error(error);
        res.status(500).send("Gemini Error");
    }
});

app.post("/analyze-food", upload.single("foodImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image received."
            });
        }


        console.log("Image received:", req.file.originalname);
console.log("Image received:", req.file.originalname);

const imageBase64 = req.file.buffer.toString("base64");

const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [
        {
            inlineData: {
                mimeType: req.file.mimetype,
                data: imageBase64,
            },
        },
        {
            text: `
You are a food donation assistant.

Analyze this image and reply ONLY in this format:

Food:
Estimated Meals:
Freshness:
Pickup Before:
`
        }
    ]
});

res.json({
    success: true,
    analysis: response.text
});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});