import React, { useEffect, useState } from 'react';
import Input from "./Input";
import ChatBox from './ChatBox'; 
import Stock from "./stock.jpg";
import {
    ChevronLeftIcon,
} from "@heroicons/react/24/outline";

function ChatComponent({currChat}) {
    const [messages, setMessages] = useState([]);

    const [conversationUsers, setConversationUsers] = useState([]);

    useEffect(() => {
        getConversation(currChat);
    }, [currChat]);

    const getConversation = async (chatId) => {
        if (!chatId) return;
        try {
            const response = await fetch(`http://localhost:8000/conversation/${chatId}`);
            if (!response.ok) throw new Error('Failed to fetch conversation');
            const conversation = await response.json();
            setMessages(formatMessages(conversation.chatHistory));
            setConversationUsers(conversation.users); // Assuming this includes user details you need
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    const formatMessages = (chatHistory) => {
        return chatHistory.map(item => ({
            name: item.name,
            image: item.image || Stock,
            message: item.message,
            position: item.position
        }));
    };

    const sendMessage = async (newMessage) => {
        try {
            const response = await fetch(`http://localhost:8000/conversation/${currChat}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chatHistory: newMessage })
            });
            if (!response.ok) throw new Error('Failed to send message');
            const updatedConversation = await response.json();
            setMessages(formatMessages(updatedConversation.chatHistory));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSend = (obj) => {
        // Prepare message object to fit the backend schema
        console.log(obj)
        const newMessage = {
            message: obj.response,
            name: "User", // Use a real user's name here, "You" is just a placeholder
            image: Stock,
            position: true // This should reflect whether the message is from the user or someone else
        };
        sendMessage(newMessage);
    };

    useEffect(() => {
        if (conversationUsers.length > 0) {
            startGemini(conversationUsers);
        }
    }, [conversationUsers]);

    const startGemini = async (users) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(users) // Passing the conversation users to the gemini endpoint
        };

        try {
            const response = await fetch('http://localhost:8000/gemini', requestOptions);
            const data = await response.json();
            console.log('Activation successful:', data);
        } catch (error) {
            console.error('Error activating Gemini:', error);
        }
    };

    return (
        <div className="currbg bg-cyan-400 flex flex-col justify-between h-full w-[70%]">
            <div className="h-full w-full backdrop-blur-[4px] bg-cover bg-center flex flex-col justify-between">
                <div className='flex bg-white p-3'>
                    <ChevronLeftIcon className='h-[24px] w-[28px] mt-2 border-cyan-200 border'/>
                    <div className='text-[24px] ml-2'>Conversation with friends</div>
                </div>
                <ChatBox messages={messages} onSend={handleSend} />
                <Input onSend={handleSend} />
            </div>
        </div>
    )
}

export default ChatComponent;
