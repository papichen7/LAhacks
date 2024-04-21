import { useState } from 'react';
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Search from './chats/Search';
import Chat from "./chats/Chat";

import Stock from "./stock.jpg"

function Chats({setChat}) {
    const [chats, setChats] = useState([
        {
            id: 1,
            name: "First Chat",
            image: Stock,
            users: [{ name: "Alice", image: "" }]
        },
        {
            id: 2,
            name: "Second Chat",
            image: Stock,
            users: [{ name: "Alice", image: "" }]
        },
        {
            id: 3,
            name: "Third Chat",
            image: Stock,
            users: [{ name: "Alice", image: "" }]
        }
        // Add more chats if needed for demonstration
    ]);

    const handleClick = (id) => {
        setChat(id);
      };

    const findChat = (searchTerm) => {
        const foundChats = chats.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));
        console.log(foundChats); // This could potentially update state or UI with the found chats
    };

    const createNewChat = () => {
        const newChat = {
            id: chats.length + 1,
            name: "New Chat",
            image: "",
            users: [{ name: "New User", image: "" }]
        };
        setChats(prevChats => [...prevChats, newChat]);
    };

    return (
        <div className="h-full w-[20%] bg-background border-r-2">
            <div className='mx-4 mt-5'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-bold text-3xl'>Chats</h1>
                    <PlusCircleIcon className='h-8 w-8 cursor-pointer' onClick={createNewChat}/>
                </div>

                <div className='my-10'>
                    <Search onSend={findChat}/>
                </div>

                {chats.map((chat) => (
                    <Chat key={chat.id} id={chat.id} name={chat.name} handler={handleClick} image={chat.image} users={chat.users} />
                ))}

            </div>
        </div>
    );
}

export default Chats;
