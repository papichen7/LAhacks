import './App.css';
import "./index.css"
import {
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import ChatBox from './ChatBox'; 
import Input from "./Input"
import { useState } from 'react';
import Stock from "./stock.jpg"
import Chats from './Chats';

function App() {

  const [messages, setMessages] = useState([{ name: "Alice", image: Stock, message: "I love coding!", position: false}]);
  const addMessage = (newMessage) => {
      setMessages([...messages, { name: "User", image: Stock, message: newMessage, position: true }]);
  };

  return (
    <div className="App bg-background text-black font-sans">
      <div className="flex h-screen">
        <div className='h-full w-[10%] bg-background border-r-2'>
          <div>
          LA Hacks
          </div>
        </div>

        <Chats />

        {/* <div className='h-full w-[20%] bg-background'>
          <div>
          LA Hacks
          </div>
        </div> */}

        <div className="currbg bg-cyan-400 flex flex-col justify-between h-full w-[70%]">
          <div class="h-full w-full backdrop-blur-[4px] bg-cover bg-center flex flex-col justify-between">
            <div className=' flex bg-white p-3'>
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
