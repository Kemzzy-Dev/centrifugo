// hooks/useChatData.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const useChatData = () => {
  const { token } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('/api/chats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChats();
  }, [token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post('/api/messages', {
        chatId: currentChat._id,
        message: newMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    chats,
    currentChat,
    setCurrentChat,
    chatMessages,
    newMessage,
    setNewMessage,
    handleSend,
    onlineUsers,
  };
};

export default useChatData;
