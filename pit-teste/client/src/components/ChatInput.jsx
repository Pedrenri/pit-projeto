import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const ChatInput = ({user, clickedUser, getUsersMessages, getClickedUsersMessages}) => {

    const [textArea, setTextArea] = useState(null)
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id

    const addMessage = async () => {
        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message:textArea
        }

        try {
            await axios.post('http://localhost:8000/message', {message})
            getUsersMessages()
            getClickedUsersMessages()
            setTextArea("")
        } catch (err) {
            console.log(err)
        }
    }
    

    return (
        <div className="chat-input">
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button className="secondary-button" onClick={addMessage} disabled={textArea?false:true}>
                Enviar
            </button>
        </div>
    )
}

export default ChatInput
