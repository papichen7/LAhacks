
function Chat({ name, image, handler, id, users }) {
    
    return (
            <div className="flex bg-search p-2 my-2 rounded-lg hover:bg-lblue cursor-pointer transition duration-200 ease-in-out" onClick={() => handler(id)}>
                <img src={image} alt="" className="h-14 w-14 rounded-[32px]"></img>
                <div className="mx-2 mt-1">
                    <p className="font-semibold">{name}</p>
                    <p className="text-xs">Latest Message</p>
                </div>
            </div>
    )
}


export default Chat