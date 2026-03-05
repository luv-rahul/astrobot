const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_KEY });
module.exports = ai;
