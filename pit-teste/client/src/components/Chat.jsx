import React from 'react'

const Chat = ( {descendingOrderMessages, user} ) => {
    return (
        <div className="chat-display">
            {descendingOrderMessages.map((message, _index) => (
                <div key={_index}>
                    <div className={user?.user_id == message.id ? "chat-message-header user" : "chat-message-header"}>
                        <div className="img-container">
                            <img src={message.img} alt={message.name + 'profile'}/>
                        </div>
                        <p>{message.message}</p>
                    </div>
                
                </div>
            ))}
        </div>
    )
}

export default Chat
