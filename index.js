const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Function to start a conversation with a model based on historical figure info
async function startConversation(figures) {

    const models = [];

    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const userSetupMessage = `You are ${figure.name}. It is a period ${figure.info}. Respond the following conversation as if you are ${figure.name} engaging in a brief dialogue of 5 sentences(There may have already be opinions of other people as below, if that is the case refer to their name when responding to their opinions; if not, proceed with your own response), providing insights in your characteristic manner.`;

        models.push({
            name: figure.name,
            model: model,
            chatInit: userSetupMessage,
        });
        console.log(`Created model for ${figure.name} as model${i}`);
    }

    await simulateSharedConversation(models, "What is the relationship between God and human?");
}

async function simulateSharedConversation(models, topic, iterations = 3) {
    let conversationHistory = topic;

    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < models.length; j++) {
            // Construct the prompt for the current model
            const prompt = models[j].chatInit + conversationHistory;

            // Send the prompt as a message in the current model's chat session
            const result = await models[j].model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            console.log();
            if(topic !== conversationHistory) {
                console.log(`${models[j].name}: ${text}`);
            }

            // Add the new response to the history for the next model's prompt
            conversationHistory += "\n";
            conversationHistory += `${models[j].name}: ${text}`;
        }
    }
}

async function run() {
    const figures = [
        { name: "Plato", info: "before he taught Aristoteles" },
        { name: "Leonardo da Vinci", info: "during the High Renaissance" },
        { name: "Friedrich Nietzsche", info: "before the mental breakdown" },
    ];

    await startConversation(figures);

}

run();