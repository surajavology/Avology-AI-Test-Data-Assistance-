const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("API Key Exists:", !!process.env.GEMINI_API_KEY);
console.log("API Key Prefix:", process.env.GEMINI_API_KEY?.substring(0, 8));

const { GoogleGenerativeAI } = require("@google/generative-ai");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

console.log("Gemini client initialized");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("AI Test Data Backend Running");
});

app.post("/generate", async (req, res) => {

    try {

        const { count, country } = req.body;

        console.log("Generate Request:", req.body);

        const prompt = `
Generate ${count} realistic customer records for ${country}.

Return ONLY valid JSON.

Do not wrap in markdown.
Do not use code blocks.

Format:

[
  {
    "name": "John Smith",
    "email": "john@test.com",
    "phone": "0412345678",
    "address": "12 Main Street Sydney",
    "age": 30
  }
]
`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash"
        });

        const result =
            await model.generateContent(prompt);

        const text =
            result.response.text();

        console.log("Gemini Response:");
        console.log(text);

        const cleaned = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data =
            JSON.parse(cleaned);

        res.json(data);

    }
    catch (error) {

        console.error("Gemini Error:");
        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

console.log("Generate route loaded");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});