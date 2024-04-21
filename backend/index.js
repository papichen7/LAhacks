const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(express.json());

const models = [];
let unifiedHistory = "";

async function startConversation(figures) {
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const userSetupMessage = `You are ${figure.name}. It is a period ${figure.info}. Respond the following conversation as if you are ${figure.name} engaging in a brief dialogue. Reference your works. One of the participants "User" is an ordinary person trying to learn and engage in dicussion`;

        models.push({
            name: figure.name,
            model: model,
            chatInit: userSetupMessage,
        });
    }

    return models.map((model, index) => ({ message: `Created model for ${model.name} as model${index}` }));
}

async function simulateSharedConversation(modelIndex, newMessage) {
    // If empty string, this means that we want the model to continue conversation
    if (newMessage !== "") {
        unifiedHistory += "\n";
        unifiedHistory += `User: ${newMessage}`;
    }

    const prompt = models[modelIndex].chatInit + unifiedHistory;
    const result = await models[modelIndex].model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    unifiedHistory += "\n";
    unifiedHistory += `${models[modelIndex].name}: ${text}`;

    const res = {
        modelIndex: text
    }
    return res
}


app.post('/gemini', async (req, res) => {
    try {
        const figures = req.body;
        const creationMessages = await startConversation(figures);
        res.json(creationMessages);
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});


app.post('/message', async (req, res) => {
    try {
        const { message, index } = req.body;

        if (index === undefined || index >= models.length || index < 0) {
            return res.status(400).send('Invalid request parameters.');
        }

        const responseObj = await simulateSharedConversation(index, message);
        res.json(responseObj);
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
