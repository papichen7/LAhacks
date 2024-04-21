import React, { useRef, useEffect } from 'react';
import Message from './Message';
import {
  ChevronDoubleRightIcon
} from "@heroicons/react/24/outline";

function ChatBox({ messages, onSend}) {
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);



    const handleSend = () => {
        sendInputToServer();
    };

    const sendInputToServer = () => {
        fetch('http://localhost:8000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: "" })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            onSend(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
  

    return (
      <div className="mx-16 h-full overflow-y-auto flex flex-col justify-between">
          <div ref={messagesContainerRef} className={`flex-grow overflow-y-auto h-[80%] mt-10 ${messages.length > 5 ? 'flex flex-col justify-start' : 'flex items-center justify-center'}`}>
              <div className="w-full">
                  <p className='text-center bg-slate-100 bg-opacity-35 mx-auto max-w-fit px-3 py-1 rounded-xl text-gray-500'>Start of your conversation</p>
              
                  {messages.map((msg) => (
                    <Message key={msg.message} name={msg.name} image={msg.image} message={msg.message} position={msg.position} />
                  ))}
                  <div ref={messageEndRef} /> {/* This empty div acts as a scroll anchor */}
              </div>
          </div>
          <button className='flex justify-end items-center text-end border-[0.5px] border-opacity-60 border-white bg-cyanish max-w-fit ml-auto px-3 py-2 rounded-2xl bg-opacity-60 hover:bg-opacity-80 hover:border-opacity-80 cursor-pointer transition duration-200 ease-in-out'
                  onClick={handleSend} 
          >
                  <p>Next Message</p>
                  <ChevronDoubleRightIcon className='h-8 w-8'/>
          </button>
      </div>
    );
}

export default ChatBox;
