const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to start a conversation with a model based on historical figure info
async function startConversation(figures) {

    const models = [];

    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const userSetupMessage = `You are ${figure.name}. It is a period ${figure.info}. Respond as if you are ${figure.name} engaging in a dialogue, providing insights and posing questions in your characteristic manner`;
        const modelSetupMessage = `I am ${figure.name}. It is a period ${figure.info}. I will engage in dialogue as if I am ${figure.name}, offering insights and posing questions in my characteristic manner.`;

        models.push({
            name: figure.name,
            model: model,
            chatSession: model.startChat({
                history: [
                    { role: "user", parts: [{ text: userSetupMessage }] },
                    { role: "model", parts: [{ text: modelSetupMessage }] },
                ],
                generationConfig: { maxOutputTokens: 300 }
            })
        });
        console.log(`Created model for ${figure.name} as model${i}`);
    }

    await simulateSharedConversation(models, "What is the relationship between God and human?");
}

async function simulateSharedConversation(models, topic, iterations = 3) {
    let historyTexts = []; 

    historyTexts.push(topic);

    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < models.length; j++) {
            // Construct the prompt for the current model
            const prompt = historyTexts.join(' ');

            // Send the prompt as a message in the current model's chat session
            const result = await models[j].chatSession.sendMessage(prompt);
            const response = await result.response;
            const text = await response.text();

            console.log();
            console.log(`${models[j].name}: ${text}`);

            // Add the new response to the history for the next model's prompt
            historyTexts.push(text);

            // Optional: trim history if it becomes too long
            if (historyTexts.length > 10) {
                historyTexts.shift(); // Remove the oldest entry to keep the history manageable
            }
        }
    }
}

async function run() {
    const figures = [
        { name: "Socrates", info: "before the forced suicide" },
        { name: "Leonardo da Vinci", info: "during the High Renaissance" },
        { name: "Friedrich Nietzsche", info: "before the mental breakdown" },
    ];

    await startConversation(figures);

}

run();