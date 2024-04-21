const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(express.json());

const models = [];
let unifiedHistory = "";

const corsOptions = {
    origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions));


async function startConversation(figures) {
    if (models.length !== 0) {
        return models.map((model, index) => ({ message: `Created model for ${model.name} as model${index}` }));
    }

    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const userSetupMessage = `You are ${figure.name}, from the period ${figure.info}. In this dialogue, you'll engage with both a curious individual named "User" and other historical figures with the following criteria:
                                    1. Your responses should directly address the latest point raised by the previous speaker and debate them, but do not state your own name. 
                                    2. Conclude your input within 2 sentences. 
                                    3. If the dialogue is empty, be the one to start the conversation.
                                    4. Be confrontational in your response and address people's name when responding to them.
                                    5. Don't include your own name`;


        models.push({
            name: figure.name,
            model: model,
            chatInit: userSetupMessage,
        });
    }


    return models.map((model, index) => ({ message: `Created model for ${model.name} as model${index}` }));
}

async function simulateSharedConversation(modelIndex, newMessage) {
    try {
        // If empty string, this means that we want the model to continue conversation
        const to_return = [];
        if (newMessage !== "") {
            unifiedHistory += "\n";
            unifiedHistory += `User: ${newMessage}`;
        }

        const prompt = models[modelIndex].chatInit + unifiedHistory;
        const result = await models[modelIndex].model.generateContent(prompt);
        const response = await result.response;
        let text = await response.text();

        let newText = text.replace(models[modelIndex].name + ":", "");
        const nameParts = (models[modelIndex].name).split(" ");
        nameParts.forEach((part) => {
            newText = newText.replace(part + ":", "");
        });

        unifiedHistory += "\n";
        unifiedHistory += `${models[modelIndex].name}: ${newText}`;


        const res = {
            id: modelIndex,
            name: models[modelIndex].name,
            response: text
        };

        to_return.push(res);
        return to_return;
    } catch (error) {
        console.error('Error during simulation:', error);
        throw new Error(`Error generating content: ${error.message}`);
    }
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

        // console.log(response)

        res.json(responseObj);
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
