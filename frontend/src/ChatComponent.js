// import Chats from './Chats';
import Input from "./Input";
import { useEffect, useState } from 'react';
import Stock from "./stock.jpg"
import ChatBox from './ChatBox'; 
import Data from "./data/philosophers.json"

import {
    ChevronLeftIcon,
  } from "@heroicons/react/24/outline";

function ChatComponent({currChat}) {

    // currChat has the userID which we will use to load in messages. We can simply just map this into the useState

    useEffect(() => {
        if (currChat) {
            setMessages([{ name: "Alice", image: Stock, message: currChat, position: false }]);
        }
    }, [currChat]);

  
      useEffect(() => {
        startGemini();  // Call startGemini when the component mounts
    }, []);

    const startGemini = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Data)  // Use Data directly since it's imported from philosophers.json
        };

        try {
            const response = await fetch('http://localhost:8000/gemini', requestOptions);
            const data = await response.json();
            console.log('Activation successful:', data);
        } catch (error) {
            console.error('Error activating Gemini:', error);
        }
    };


    const [messages, setMessages] = useState([{ name: "Alice", image: Stock, message: currChat, position: false }]);
    const [messageIndex, setMessageIndex] = useState(0); // State to track message index


    const addMessage = (objects) => {
        setMessages(currentMessages => [
            ...currentMessages,
            ...objects.map(object => ({
                name: object.name,
                image: Stock, // Ensure `Stock` is defined somewhere in your scope
                message: object.response,
                position: object.name === "User"
            }))
        ]);
    };
    

    return(
        <div className="currbg bg-cyan-400 flex flex-col justify-between h-full w-[70%]">
          <div className="h-full w-full backdrop-blur-[4px] bg-cover bg-center flex flex-col justify-between">
            <div className=' flex bg-white p-3'>
              <ChevronLeftIcon className='h-[24px] w-[28px] mt-2 border-cyan-200 border'/>
              <div className='text-[24px] ml-2'>Conversation with friends</div>
          </div>
          
                <ChatBox messages={messages} messageIndex={messageIndex} setMessageIndex={setMessageIndex} onSend={addMessage} total={Data.length} />
                <Input onSend={addMessage} messageIndex={messageIndex} setMessageIndex={setMessageIndex} total={Data.length} />
            
          </div>
        </div>
    )
}

export default ChatComponent;