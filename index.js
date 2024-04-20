const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to start a conversation with a model based on historical figure info
async function startConversationWithFigure(figure) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const userSetupMessage = `You are ${figure.name}. It is a period ${figure.info}. Respond as if you are ${figure.name} engaging in a dialogue, providing insights and posing questions in your characteristic manner`;
  const modelSetupMessage = `I am ${figure.name}. It is a period ${figure.info}. I will engage in dialogue as if I am ${figure.name}, offering insights and posing questions in my characteristic manner.`;

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: userSetupMessage }] },
      { role: "model", parts: [{ text: modelSetupMessage }] },
    ],
    generationConfig: { maxOutputTokens: 500 },
  });

  const msg = "What do you think a bad marriage makes you a philosopher?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = await response.text();
  console.log(`${figure.name}: ${text}`);
}

async function run() {
  const figures = [
    { name: "Socrates", info: "before the forced suicide" },
    { name: "Leonardo da Vinci", info: "during the High Renaissance" },
  ];

  for (const figure of figures) {
    await startConversationWithFigure(figure);
    console.log();
  }
}

run();
