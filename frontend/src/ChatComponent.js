import React, { useEffect, useState } from 'react';
import Input from "./Input";
import ChatBox from './ChatBox'; 
import Default from "./img/stock.webp";
import {
    ChevronLeftIcon,
} from "@heroicons/react/24/outline";

function ChatComponent({currChat}) {

    const [conversationUsers, setConversationUsers] = useState([]);

    const [conversationName, setConversationName] = useState("Default");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getConversation(currChat);
    }, [currChat]);


    const imageContext = require.context('./img/', true);


    const getImage = (imageName) => {
      try {
        return imageContext(`./${imageName}`);
      } catch (e) {
        // If image is not found, return the default image
        return Default;
      }
    };

    
    const getConversation = async (chatId) => {
        if (!chatId) return;
        try {
            const response = await fetch(`http://localhost:8000/conversation/${chatId}`);
            if (!response.ok) throw new Error('Failed to fetch conversation');
            const conversation = await response.json();
            setConversationName(conversation.name);
            setConversationUsers(conversation.users); // Assuming this includes user details you need
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const addMessage = (objects) => {
        // console.log(objects)
        setMessages(currentMessages => [
            ...currentMessages,
            ...objects.map(object => ({
                name: object.name,
                image: getImage(object.image), 
                message: object.response,
                position: object.name === "User"
            }))
        ]);
    };


    
    useEffect(() => {
        if (conversationUsers.length > 0) {
            startGemini(conversationUsers);
            console.log("Gemini", conversationUsers);
        }
    }, [conversationUsers]);

    const startGemini = async (users) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(users) // Passing the conversation users to the gemini endpoint
        };

        try {
            console.log("In Gemini", requestOptions);
            const response = await fetch('http://localhost:8000/gemini', requestOptions);
            const data = await response.json();
            console.log()
            console.log('Activation successful:', data);
        } catch (error) {
            console.error('Error activating Gemini:', error);
        }
    };

    return (
        <div className="currbg bg-cyan-400 flex flex-col justify-between h-full w-[75%]">
            <div className="h-full w-full backdrop-blur-[4px] bg-cover bg-center flex flex-col justify-between">
                <div className='flex bg-white p-3'>
                    <ChevronLeftIcon className='h-[24px] w-[28px] mt-2 border-cyan-200 border'/>
                    <div className='text-[24px] ml-2'>{conversationName}</div>
                </div>
                    <ChatBox messages={messages} onSend={addMessage} />
                    <Input onSend={addMessage} />
            </div>
        </div>
    )
}

export default ChatComponent;
