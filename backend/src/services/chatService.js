const ai = require("../utils/gemini");
const Chat = require("../models/chat");

const handleGptSearchClick = async (userData, query) => {
  const gptQuery = `
You are a professional Astrologer. Using your knowledge and the latest publicly available information (up to today), provide accurate guidance. 
Please consider the user's personal details carefully and respond in a clear, friendly way.

User Details:
- Full Name: ${userData.fullName}
- Date of Birth: ${userData.dob}
- Birth Time: ${userData.birthTime}
- Birth Place: ${userData.birthPlace}

User Question: ${query}

Instructions:
1. Focus on the latest information relevant to the user's question.
2. If the question is time-sensitive, consider events of the current day, week, or month.
3. Give practical advice and actionable suggestions.
4. Keep your answer concise, informative, and in natural language.
5. Give response in bullet-points and formatted structure.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: gptQuery,
  });

  if (!response.text) {
    throw new Error("Error: Fetching Data. Please Retry!");
  }

  const data = response.text;

  const userId = userData._id;
  const title = query.slice(0, 50);
  const message = { request: query, response: data };

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

  return data;
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

module.exports = { handleGptSearchClick,getChatHistory };
