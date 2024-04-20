import React, { useRef, useEffect } from 'react';
import Message from './Message';

function ChatBox({ messages }) {
    const messageEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="mx-16 h-full overflow-y-auto flex flex-col ">
          <div ref={messagesContainerRef} className={`flex-grow mt-10 ${messages.length > 5 ? 'flex flex-col justify-start' : 'flex items-center justify-center'}`}>
            <div className="w-full">
              <p className='text-center bg-slate-100 bg-opacity-35 mx-auto max-w-fit px-3 py-1 rounded-xl text-gray-500'>Start of your conversation</p>
            
                {messages.map((msg, index) => (
                  <Message key={index} name={msg.name} image={msg.image} message={msg.message} position={msg.position} />
                ))}
                {/* This empty div acts as a scroll anchor */}
                <div ref={messageEndRef} />
            </div>
          </div>
        </div>
    );
}

export default ChatBox;
