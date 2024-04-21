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
            users: [{ name: "Alice", uid: 0, image: "" }]
        },
        {
            id: 2,
            name: "Second Chat",
            image: Stock,
            users: [{ name: "Bob", uid: 1, image: "" }]
        },
        {
            id: 3,
            name: "Third Chat",
            image: Stock,
            users: [{ name: "Jeff", uid: 2, image: "" }]
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

    // replaced with popup functionality
    const createNewChat = (name, uid,) => {
        const newChat = {
            id: chats.length + 1,
            name: "New Chat",
            image: "",
            users: [{ name: "New User", image: "" }]
        };
        setChats(prevChats => [...prevChats, newChat]);
    };

    const [isCardVisible, setCardVisible] = useState(false);
  
    const toggleCard = () => {
      setCardVisible(!isCardVisible);
    };

    // for list items
    const [selectChars, setSelectChars] = useState({
      0: { name: 'Alice', selected: false },
      1: { name: 'Bob', selected: false },
      2: { name: 'Jeff', selected: false }
    });
  
    const handleNameClick = (uid) => {
      setSelectChars(prevState => ({
        ...prevState,
        [uid]: {
          ...prevState[uid],
          selected: !prevState[uid].selected // Toggle the selected property
        }
      }));
    };
  
    const handleSubmit = () => {
      // if (selectedName) {
      //   // Handle submission, for example, send selectedName to server
      //   console.log("Selected name:", selectedName);
      //   setSubmitted(true);
      // } else {
      //   alert("Please select a name before submitting.");
      // }
      setSelectChars(prevState => {
        const newState = {};
        Object.keys(prevState).forEach(uid => {
          newState[uid] = { name: prevState[uid].name, selected: false };
        });
        return newState;
      });
      toggleCard();
      for (let key in selectChars) {
        if (selectChars[key].selected) {
          console.log(selectChars[key].name);
        }
      }

      createNewChat()

    };
    
    return (
        <div className="h-full w-[20%] bg-background border-r-2">
            <div className='mx-4 mt-5'>
                <div>
                    <div className='flex justify-between items-center relative'>
                        <h1 className='font-bold text-3xl'>Chats</h1>
                        <PlusCircleIcon className='h-8 w-8 cursor-pointer' onClick={toggleCard}/>
                        {isCardVisible && (
                        <div className="absolute top-full right-0 w-[250px] mt-2 max-h-screen bg-white border border-gray-300 shadow-md p-4 rounded-lg z-50">
                            <div className="text-lg font-bold mb-2">Available Contacts</div>
                            <div className="overflow-y-auto">
                              <ul className="divide-y divide-gray-200 h-full overflow-y-auto">
                              {Object.keys(selectChars).map(uid => (
                                <li
                                  key={uid}
                                  className={`cursor-pointer py-2 ${selectChars[uid].selected ? "bg-green-300 bg-opacity-25" : ""}`}
                                  onClick={() => handleNameClick(uid)}
                                >
                                  {selectChars[uid].name}
                                </li>
                              ))}
                              </ul>

                              <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mt-4 w-full rounded"
                              onClick={handleSubmit}
                              >
                              Submit
                              </button>

                            </div>
                        </div>
                        )}
                    </div>
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
