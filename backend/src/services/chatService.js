const ai = require("../utils/gemini");
const Chat = require("../models/chat");

const today = new Date();
const currentDate = today.toISOString().split("T")[0];
const currentYear = today.getFullYear();

const handleGptSearchClick = async (userData, query) => {
  const gptQuery = `
You are Jyotish Acharya, an expert Vedic and Western astrologer with 30+ years of experience. 
You provide deeply personalized, accurate astrological readings based on birth charts.

## Today's Date
- Current Date: ${currentDate}
- Current Year: ${currentYear}
- All predictions MUST be from ${currentDate} onwards — never reference past dates or expired transits.

## Client Profile
- Name: ${userData.fullName}
- Date of Birth: ${userData.dob}
- Birth Time: ${userData.birthTime}  
- Birth Place: ${userData.birthPlace}

## Task
Analyze the client's natal chart based on their birth details and answer this specific question:
"${query}"

## Instructions
- Calculate the ascendant, moon sign, and sun sign from the birth data
- Identify CURRENTLY ACTIVE dashas and transits as of ${currentDate}
- Only predict future events — nothing before ${currentDate} is relevant
- Be SPECIFIC to the question — only include fields directly relevant to: "${query}"
- Do NOT include unrelated fields (e.g. if asked about career, skip love/health)
- Always include "summary" and "advice"
- "important_dates" must only contain dates AFTER ${currentDate}
- Dates must be in YYYY-MM-DD format
- Advice must be actionable, specific, and grounded in current/upcoming planetary positions

## Response Format
Return ONLY a raw JSON object. No markdown, no backticks, no explanation.

{
  "summary": "Concise prediction based on CURRENTLY active planetary positions as of ${currentDate}",
  "career": "Only if relevant — future prediction with active planetary reasoning",
  "finance": "Only if relevant — future prediction with active planetary reasoning",
  "love": "Only if relevant — future prediction with active planetary reasoning",
  "health": "Only if relevant — future prediction with active planetary reasoning",
  "advice": [
    "Actionable advice based on current/upcoming planetary positions",
    "Actionable advice based on current/upcoming planetary positions",
    "Actionable advice based on current/upcoming planetary positions"
  ],
  "important_dates": [
    "YYYY-MM-DD (must be after ${currentDate})"
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: gptQuery,
  });

  if (!response.text) {
    throw new Error("Error: Fetching Data. Please Retry!");
  }

  let text = response.text;
  // remove ```json ``` if Gemini adds it
  text = text.replace(/```json|```/g, "").trim();

  let parsedData;

  try {
    parsedData = JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON from AI:", text);
    throw new Error("AI response formatting error");
  }

  const userId = userData._id;
  const title = query.slice(0, 50);

  const message = {
    request: query,
    response: parsedData,
  };

  let chatDoc = await Chat.findOne({ userId });

  if (!chatDoc) {
    chatDoc = new Chat({
      userId,
      conversations: [
        {
          title,
          messages: [message],
        },
      ],
    });
  } else {
    chatDoc.conversations.push({
      title,
      messages: [message],
    });
  }

  await chatDoc.save();

  return parsedData;
};

const getChatHistory = async (userId) => {
  try {
    const chatDoc = await Chat.findOne({ userId });

    if (!chatDoc) {
      return { message: "No chat history found." };
    }

    return chatDoc.conversations.map((conversation) => ({
      title: conversation.title,
      messages: conversation.messages,
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw new Error("Unable to fetch chat history. Please try again.");
  }
};

module.exports = { handleGptSearchClick, getChatHistory };
