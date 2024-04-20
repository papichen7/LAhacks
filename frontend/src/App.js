import './App.css';

import {
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import ChatBox from './ChatBox'; 
import Input from "./Input"
import { useState } from 'react';
import Stock from "./stock.jpg"

function App() {

  const [messages, setMessages] = useState([{ name: "Alice", image: Stock, message: "I love coding!" }]);
  const addMessage = (newMessage) => {
      setMessages([...messages, { name: "User", image: Stock, message: newMessage }]);
  };

  return (
    <div className="App bg-gray-900 text-white font-sans">
      <div className="flex h-screen">
        <div className='h-full w-[20%] bg-gray-800'>
          <div>
          LA Hacks
          </div>
        </div>
        <div className="bg-[url('./background.jpeg')] bg-cover bg-center flex flex-col justify-between h-full w-[80%]">
          <div class="h-full w-full backdrop-blur-[4px] bg-cover bg-center flex flex-col justify-between">
            <div className=' flex bg-gray-800 p-3'>
              <ChevronLeftIcon className='h-[24px] w-[28px] mt-2 border-cyan-200 border'/>
              <div className='text-[24px] ml-2'>Conversation with friends</div>
            </div>

            <ChatBox messages={messages} />

            <Input onSend={addMessage} />

        </div>

        </div>

      </div>
    </div>
  );
}

export default App;
