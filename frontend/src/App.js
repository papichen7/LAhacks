import './App.css';
import "./index.css"
import {
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

import ChatBox from './ChatBox'; 
import Input from "./Input"
import { useState } from 'react';
import Stock from "./stock.jpg"
import Sidebar from './Sidebar';
import Chats from './Chats';
import ChatComponent from './ChatComponent'

function App() {

  // const [messages, setMessages] = useState([{ name: "Alice", image: Stock, message: "I love coding!", position: false}]);
  // const addMessage = (newMessage) => {
  //     setMessages([...messages, { name: "User", image: Stock, message: newMessage, position: true }]);
  // };

  const [currChat, setChat] = useState("662569f9394a0f6875f5ad1b");

  
  return (
    <div className="App bg-background text-black font-sans">
      <div className="flex h-screen">

        <Chats setChat={setChat}/>

        <ChatComponent currChat={currChat}/>

      </div>
    </div>
  );
}

export default App;
