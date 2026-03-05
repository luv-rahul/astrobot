const ai = require("../utils/gemini");

const handleGptSearchClick = async (userData, query) => {
  const gptQuery = `
    Act as a Astrologer. Give me latest results using google search or your data and answer based on my data and question. Here is a problem:
    My Description: ${userData}
    My Query: ${query}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: gptQuery,
  });

  if (!response.text) {
    alert("Error: Fetching Data. Please Retry!");
  }

  const data = response.text;
  return data;
};

module.exports = { handleGptSearchClick };
