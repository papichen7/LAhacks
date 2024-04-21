import React, { useState, useEffect } from 'react';
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Search from './chats/Search';
import Chat from "./chats/Chat";
import Default from "./img/conversation.webp";

function Chats({ setChat }) {
  const [chats, setChats] = useState([]);
  const [selectChars, setSelectChars] = useState({});
  const [chatName, setChatName] = useState("");  // State to manage the name of the new chat
  const [isCardVisible, setCardVisible] = useState(false);
  
  const toggleCard = () => {
    setCardVisible(!isCardVisible);
  };

  useEffect(() => {
    getChats();
    getUsers();
  }, []);

  const imageContext = require.context('./img/', true);


  const getImage = (imageName) => {
    try {
      return imageContext(`./${imageName}`);
    } catch (e) {
      // If image is not found, return the default image
      return Default;
    }
  };

  const getChats = async () => {
    try {
        const response = await fetch('http://localhost:8000/conversation');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setChats(data);
    } catch (error) {
        console.error('Failed to fetch chats:', error);
    }
  };

  const getUsers = async () => {
    try {
        const response = await fetch('http://localhost:8000/user');
        if (!response.ok) throw new Error('Network response was not ok');
        const users = await response.json();
        const usersWithSelection = users.reduce((acc, user) => {
            acc[user._id] = {...user, selected: false};
            return acc;
        }, {});
        setSelectChars(usersWithSelection);
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
  };

  const handleClick = (id) => {
    setChat(id);
  };

  const handleNameClick = (_id) => {
    setSelectChars(prevState => ({
      ...prevState,
      [_id]: {
        ...prevState[_id],
        selected: !prevState[_id].selected
      }
    }));
  };

  const findChat = (searchTerm) => {
    if (searchTerm === undefined || searchTerm === '') {
      getChats();
      return;
    }
    const foundChats = chats.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setChats(foundChats);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from causing a page reload
    const selectedUsers = Object.values(selectChars)
        .filter(user => user.selected)
        .map(user => ({
            name: user.name,
            _id: user._id,
            image: user.image || ""
        }));

    createNewChat(chatName, selectedUsers);
    setChatName(""); // Reset the chat name after submission
  };

  const createNewChat = async (name, users) => {
    try {
        console.log(name, users)
        const response = await fetch('http://localhost:8000/conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                image: Default,
                users: users,
                chatHistory: []
            })
        });
        if (!response.ok) throw new Error('Failed to post new chat');
        getChats();
    } catch (error) {
        console.error('Failed to create new chat:', error);
    }
  };


    return (
        <div className="h-full w-[25%] bg-background border-r-2">
            <div className='mx-4 mt-5'>
                <div>
                    <div className='flex justify-between items-center relative'>
                        <h1 className='font-bold text-3xl'>Chats</h1>
                        <PlusCircleIcon className='h-8 w-8 cursor-pointer' onClick={toggleCard}/>
                        {isCardVisible && (
                            <div className="absolute top-full right-0 w-[250px] mt-2 max-h-screen bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50">
                                <form onSubmit={handleSubmit}>
                                  <div className='contacts  rounded-2xl p-2'>
                                  <div className="text-lg font-extrabold mb-2">Available Contacts</div>
                                  <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                                    <ul className="">
                                    {Object.values(selectChars).map((user) => (
                                        <li
                                        key={user._id}
                                        className={`cursor-pointer py-2 px-3 my-2 rounded-md ${user.selected ? "bg-green-400 bg-opacity-75" : "bg-white hover:bg-gray-100"}`}
                                        onClick={() => handleNameClick(user._id)}
                                        >
                                        {user.name}

                                        <img src={getImage(user.image)} alt={user.name}></img>
                                        
                                        </li>
                                    ))}
                                    </ul>
                                  </div>
                                    
                                  </div>
                                  <div className="mt-4">
                                    <input
                                      type="text"
                                      placeholder="Enter chat name"
                                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm text-center border-[1px]"
                                      value={chatName}
                                      onChange={(e) => setChatName(e.target.value)}
                                      required
                                    />
                                  </div>
                                  <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 w-full rounded"
                                  >
                                    Create Chat
                                  </button>
                                </form>

                                
                            </div>
                        )}
                    </div>
                </div>
                <div className='my-10'>
                    <Search onSend={findChat}/>
                </div>
                {chats.map((chat) => (
                    <Chat key={chat._id} id={chat._id} name={chat.name} handler={handleClick} image={chat.image} users={chat.users} />
                ))}
            </div>
        </div>
    );
}

export default Chats;
