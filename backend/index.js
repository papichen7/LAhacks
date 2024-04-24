const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();
const cors = require('cors');

const User = require("./models/User")  // Assuming 'User' is the model name for your figures


const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'data'});
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

require('./models/User');
require('./models/Conversation');


let models = [];
let unifiedHistory = "";

const corsOptions = {
    origin: ["http://localhost:3000"],
  };
  
app.use(express.json());
app.use(cors(corsOptions));

const conversationRouter = require("./routes/conversation");
const userRouter = require("./routes/user");
app.use('/conversation', conversationRouter);
app.use('/user', userRouter);

let prev = 0;


async function clearModelsAsync() {
    // Simulate an asynchronous operation, e.g., database operation, API call, etc.
    // Here we just use setTimeout as a placeholder for the asynchronous operation.
    return new Promise(resolve => {
        setTimeout(() => {
            models = []; // Assuming models is accessible in this scope.
            unifiedHistory = "";
            resolve();
        }, 100); // Wait for 1 second to simulate async work
    });
}


async function startConversation(figures) {
    if (models.length !== 0) {
        models = [];
        unifiedHistory = "";
    }
    for (let i = 0; i < figures.length; i++) {
        const figure = figures[i];

        // Fetch user details from the database using the ID
        const userDetails = await User.findById(figure);
        if (!userDetails) {
            console.error('User not found with id:', figure);
            continue;  // Skip if user details are not found
        }

        // Check if a model for this figure already exists
        if (models.some(model => model.name === userDetails.name)) {
            console.log(`Model already exists for ${userDetails.name}, skipping.`);
            continue;  // Skip this iteration as model already exists
        }



        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const userSetupMessage = `You are ${userDetails.name}, from the period ${userDetails.info}. In this dialogue, you'll engage with both a curious individual named "User" and other historical figures with the following criteria:
        1. Your responses should directly address the latest point raised by the previous speaker and debate them, but do not state your own name. 
        2. Conclude your input within 2 sentences. 
        3. If the dialogue is empty, be the one to start the conversation.
        4. Be confrontational in your response and address people's name when responding to them.
        5. Don't include your own name`;

        models.push({
            _id: userDetails._id,
            name: userDetails.name,
            image: userDetails.image,
            model: model,
            chatInit: userSetupMessage,
        });
    }



    return models.map((model, index) => ({ message: `Created model for ${model.name} as model${index}` }));
}



async function simulateSharedConversation(newMessage) {
    
    try {

        const safe = [
            {
                "category": "HARM_CATEGORY_DANGEROUS",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_NONE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE",
            },
        ]

        let modelIndex = Math.floor(Math.random() * models.length);
        // If empty string, this means that we want the model to continue conversation
        const to_return = [];
        if (newMessage !== "") {
            unifiedHistory += "\n";
            unifiedHistory += `User: ${newMessage}`;
        }

        const prompt = models[modelIndex].chatInit + unifiedHistory;
        const result = await models[modelIndex].model.generateContent(prompt, safety_settings=safe);
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
            _id: models[modelIndex]._id,
            name: models[modelIndex].name,
            image: models[modelIndex].image,
            response: text
        }


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
        console.log("input", figures);
        const creationMessages = await startConversation(figures);
        res.json(creationMessages);
        console.log("input", creationMessages);

    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});


app.post('/message', async (req, res) => {

    try {
        const { message } = req.body;

        const responseObj = await simulateSharedConversation(message);

        res.json(responseObj);
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
