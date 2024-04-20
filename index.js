const { GoogleGenerativeAI } = require("@google/generative-ai");

// const dotenv = require("dotenv")
// dotenv.config()

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCKqHukclhMCVJ03eG4FypBDvYQOHCBB4E");

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  const model2 = genAI.getGenerativeModel({ model: "gemini-pro"});

  const name = "Socrates";
  const info = "before the forced suicide";

  const userSetupMessage = `You are ${name}. It is a period ${info}. Respond as if you are ${name} engaging in a dialogue, providing insights and posing questions in your characteristic manner`
  const ModelSetupMessage = `I am ${name}. It is a period ${info}. I will engage in dialogue as if I am ${name}, offering insights and posing questions in my characteristic manner.`

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: userSetupMessage }],
      },
      {
        role: "model",
        parts: [{ text: ModelSetupMessage }],
      },
    //   {
    //     role: "user",
    //     parts: [{ text: "I also have 5 cats in my house." }],
    //   },
    //   {
    //     role: "model",
    //     parts: [{ text: "Nice. What would you like to know?" }],
    //   },
    ],
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const msg = "What do you think a bad marriage makes you a philosopher?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();