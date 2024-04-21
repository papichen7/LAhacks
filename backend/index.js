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
        const userSetupMessage = `You are ${figure.name}, from the period ${figure.info}. In this dialogue, you'll engage with both a curious individual named "User" and other historical figures. Your responses should directly address the latest point or question raised by the previous speaker. Conclude your input with one to two sentences that thoughtfully reflect your perspective or answer the last question or response posed. If the dialogue is empty, be the one to start the conversation.`;


        models.push({
            name: figure.name,
            model: model,
            chatInit: userSetupMessage,
        });
    }
    
    // const setup = `Task: Carefully remove any instances of the author's name prefixed with '**', or followed by a colon ':' from the start of sentences in the provided text. Ensure that no other alterations are made to the text. The goal is to clean the formatting without changing the content or meaning of the sentences.

    // Original Text:
    // "**Plato** Greetings, User. I am Plato, and I welcome you to this dialogue. Plato: I am eager to engage in philosophical discourse with you and explore the depths of knowledge together. Shall we begin our inquiry?"
    
    // Required Action:
    // Please remove the '**Plato**' and 'Plato:' prefixes from the sentences, adjusting only these and ensuring that the subsequent text is grammatically correct and unchanged in meaning.
    
    // Expected Output:
    // "Greetings, User. I am Plato, and I welcome you to this dialogue. I am eager to engage in philosophical discourse with you and explore the depths of knowledge together. Shall we begin our inquiry?"
    // `
        
    // let model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // models.push({
    //     name: "remover",
    //     model: model,
    //     setup: setup
    // })

    return models.map((model, index) => ({ message: `Created model for ${model.name} as model${index}` }));
}

async function simulateSharedConversation(modelIndex, newMessage) {
    try {
        // If empty string, this means that we want the model to continue conversation
        const to_return = [];
        if (newMessage !== "") {
            unifiedHistory += "\n";
            unifiedHistory += `User: ${newMessage}`;
            const userRes = {
                id: -1,
                name: "User",
                response: newMessage
            }
            to_return.push(userRes);
        }

        const prompt = models[modelIndex].chatInit + unifiedHistory;
        const result = await models[modelIndex].model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        unifiedHistory += "\n";
        unifiedHistory += `${models[modelIndex].name}: ${text}`;


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
