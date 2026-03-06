const ai = require("../utils/gemini");
const Chat = require("../models/chat");

const handleGptSearchClick = async (userData, query) => {
  const gptQuery = `
You are Jyotish Acharya, an expert Vedic and Western astrologer with 30+ years of experience. 
You provide deeply personalized, accurate astrological readings based on birth charts.

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
- Identify the ruling planets and active dashas/transits relevant to the question
- Be SPECIFIC to the question — only include fields directly relevant to: "${query}"
- Do NOT include unrelated fields (e.g. if asked about career, skip love/health)
- Always include "summary" and "advice"
- "important_dates" should only appear if specific dates are astrologically significant
- Dates must be in YYYY-MM-DD format
- Advice must be actionable, specific, and grounded in planetary positions
- Avoid vague generic statements — reference actual planetary influences

## Response Format
Return ONLY a raw JSON object. No markdown, no backticks, no explanation.

{
  "summary": "Concise 2-3 sentence personalized prediction referencing actual planetary positions",
  "career": "Only if career-relevant — specific prediction with planetary reasoning",
  "finance": "Only if finance-relevant — specific prediction with planetary reasoning",
  "love": "Only if love-relevant — specific prediction with planetary reasoning",
  "health": "Only if health-relevant — specific prediction with planetary reasoning",
  "advice": [
    "Specific actionable advice grounded in planetary position 1",
    "Specific actionable advice grounded in planetary position 2",
    "Specific actionable advice grounded in planetary position 3"
  ],
  "important_dates": [
    "YYYY-MM-DD"
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
