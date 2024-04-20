import React from 'react';

function Message(props) {
    const { name, image, message } = props;
    console.log(image)
    return (
        <div className="mx-15 flex bg-cyan-200">
            <img src={image} alt="" className='w-8 h-8 rounded-2xl justify-center'></img>
            <div className='w-72 bg-red-400 h-auto'>
                <p className='font font-semibold'>{name}</p>
                <p>{message}</p>
            </div>

        </div>
    );
}

export default Message;
