import React, { useState, useEffect } from 'react';
import './Messages.css';

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const data: Message[] = [
        { id: 1, user: '0x1234...abcd', text: 'Hello there!', timestamp: '10:30 AM' },
        { id: 2, user: '0x1234...abcd', text: 'Hi 0x1234...abcd, how are you?', timestamp: '10:31 AM' },
      ];
      setMessages(data);
    };

    fetchMessages();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: messages.length + 1,
      user: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  return (
    <div className="messages">
      <div className="messages-header">
        <h1>Messages</h1>
      </div>
      <div className="messages-main">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <p><strong>{message.user}:</strong> {message.text}</p>
            <span className="timestamp">{message.timestamp}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
