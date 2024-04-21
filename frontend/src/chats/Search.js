import {
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

function Search({ onSend }) {

    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className='flex bg-search rounded-2xl border-[1px]  border-gray-400'>
            <label><MagnifyingGlassIcon className="w-5 h-5 ml-1 mt-[2px]"/></label>
            <input
                className='bg-inherit w-[90%] outline-none mr-5 ml-2'
                placeholder="Search"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
        </div>
    )
}

export default Search