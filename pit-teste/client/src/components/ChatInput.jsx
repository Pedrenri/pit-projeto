import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatInput = ({ user, clickedUser, getUsersMessages, getClickedUsersMessages }) => {
  const [textArea, setTextArea] = useState('');
  const userId = user?.id;
  const clickedUserId = clickedUser?.id;
  const textareaRef = useRef(null);

  const addMessage = async () => {
    // Verificar se o texto não é apenas espaços em branco
    if (textArea.trim() === '') {
      return; // Não envie mensagens vazias
    }

    const message = {
      timestamp: new Date().toISOString(),
      from_userId: userId,
      to_userId: clickedUserId,
      message: textArea,
    };

    try {
      await axios.post('http://44.204.7.86/message', { message });
      getUsersMessages();
      getClickedUsersMessages();
      setTextArea('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Ajustar a altura do textarea com base no conteúdo
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [textArea]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div className="chat-input">
      <textarea
        ref={textareaRef}
        value={textArea}
        placeholder='Digite algo...'
        onChange={(e) => setTextArea(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="secondary-button" onClick={addMessage} disabled={!textArea.trim()}>
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;
