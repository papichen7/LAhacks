import React from 'react';

function Message({ name, image, message, position }) {
    // Define a base class string for the message bubble
    const messageBubbleClass = `max-w-[500px] ${position ? "bg-message" : "bg-red-400" } rounded-xl p-1 overflow-hidden`;

    return (
        <div className={`mx-15 flex my-3 text-white ${position ? 'justify-end' : 'justify-start'}`}>
            {/* Conditionally render image on the left or right based on position */}
            {!position && (
                <img src={image} alt="user" className="w-16 h-16 rounded-full justify-center mt-5 mx-2" />
            )}
            <div className={messageBubbleClass}>
                <div className='mx-3'>
                    <p className='font-semibold'>{name}</p>
                    <p>{message}</p>
                </div>
            </div>
            {position && (
                <img src={image} alt="user" className="w-16 h-16 rounded-full justify-center mt-5 mx-2" />
            )}
        </div>
    );
}

export default Message;

