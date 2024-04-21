import React from 'react';
import { UserCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';


function Sidebar({ name }) {
    return (
        <div className='h-full w-[10%] bg-background justify-center items-center border-r-2'>
            <div className="flex flex-col gap-100">
                <Link to="/quiz">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full mt-16 flex items-center"> */}
                    {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"> */}

                        {/* <LightBulbIcon className="w-14 h-20 mr-2 items-center" /> */}
                        Search
                    </button>
                </Link>
                <Link to="/debate">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Debate
                    </button>
                </Link>
                <Link to="/">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                        Home
                    </button>
                </Link>
                </div>


                <div className="fixed bottom-0 left-0 right-0 flex">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    <UserCircleIcon className='h-[20px] w-[24px]'></UserCircleIcon>
                    Profile
                </button>
            </div>

            
        </div>
    );
}

export default Sidebar;