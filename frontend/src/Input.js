import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { ReactComponent as Logo } from './logo.svg';
import { useState } from "react";



export default function Input({ onSend }) {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSend = () => {
        if (input.trim()) {
            sendInputToServer(input);
            const res = {
                "_id": '6624e96388cf85ea8ddbe3d8',
                "response": input
            }
            onSend(res);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const sendInputToServer = (data) => {
        fetch('http://localhost:8000/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: data })
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
        <div className='flex bg-background rounded-2xl m-3'>
            <label><Logo className="w-8 h-8 ml-1 mt-2"/></label>
            <input
                className='bg-inherit w-[100%] outline-none mx-3 py-3'
                placeholder="Write a Message..."
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            <button onClick={handleSend}><PaperAirplaneIcon className='mx-2 w-8 h-8' /></button>
            <div className="w-px bg-gray-300 h-8 inline-block align-middle mt-2"></div>
            <button><MicrophoneIcon className='mx-2 w-8 h-8'/></button>
        </div>
    );
}
