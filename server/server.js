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

    if (error.status === 503) {
        return res.status(503).json({
            success: false,
            message: "🤖 AI service is currently busy. Please try again in a few minutes."
        });
    }

    return res.status(500).json({
        success: false,
        message: "Unable to analyze the image right now."
    });
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

Analyze the uploaded food image.

Reply ONLY with valid JSON.

Do not add explanations.
Do not use markdown.
Do not use \`\`\`json.

Use exactly this format:

{
  "food": "",
  "estimatedMeals": "",
  "freshness": "",
  "pickupBefore": ""
}
`
        }
    ]
});

let cleanedText = response.text.trim();

cleanedText = cleanedText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

const analysis = JSON.parse(cleanedText);

res.json({
    success: true,
    analysis
});

    } catch (error) {
    console.error(error);

    if (error.status === 503) {
        return res.status(503).json({
            success: false,
            message: "🤖 AI service is currently busy. Please try again in a few minutes."
        });
    }

    return res.status(500).json({
        success: false,
        message: "Unable to analyze the image right now."
    });
}
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});