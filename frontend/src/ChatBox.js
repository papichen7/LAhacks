import React, { useRef, useEffect } from 'react';
import Message from './Message';

function ChatBox({ messages }) {
    const messageEndRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="mx-16 bg-orange-500 h-full overflow-y-auto">
            {messages.map((msg, index) => (
                <Message key={index} name={msg.name} image={msg.image} message={msg.message} />
            ))}
            <div ref={messageEndRef} />
        </div>
    );
}

export default ChatBox;
