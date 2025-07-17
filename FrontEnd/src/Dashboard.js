import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { diseaseFirstAid } from './diseaseFirstAid';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setMedicalHistory(response.data.medical_history || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const handleNearbyHospitalsClick = () => {
    navigate('/nearby-hospitals');
  };

  const handleCloseModal = () => setShowModal(false);
  const handleViewChatHistory = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        'http://localhost:5000/chat/getchathistory',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const formattedHistory = response.data.chat_history.map(chatDoc => {
        return {
          messages: chatDoc.messages.map(msg => ({
            type: msg.type === 'bot' ? 'Bot' : 'User',
            content: msg.content
          }))
        };
      });
      
      setChatHistory(formattedHistory);
      setShowChatHistory(true);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseChatHistory = () => setShowChatHistory(false);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage = { type: 'user', content: messageInput };
    const botResponse = getBotResponse(messageInput);

    const newMessages = [
      ...chatMessages,
      userMessage,
      { type: 'bot', content: botResponse.message }
    ];

    setChatMessages(newMessages);

    if (botResponse.diagnosis) {
      setMedicalHistory(prevHistory =>
        !prevHistory.includes(botResponse.diagnosis)
          ? [...prevHistory, botResponse.diagnosis]
          : prevHistory
      );
    }

    setMessageInput('');

    // Save chat to backend
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/chat/savechat',
        { messages: newMessages },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const getBotResponse = (userMessage) => {
    const messageLower = userMessage.toLowerCase();

    for (const disease in diseaseFirstAid) {
      if (messageLower.includes(disease.toLowerCase())) {
        return {
          message: `You should follow these first aid instructions for ${disease}: ${diseaseFirstAid[disease].join(', ')}`,
          diagnosis: disease,
        };
      }
    }

    return {
      message: 'I am here to help! Please provide me more details about what you are facing.',
      diagnosis: null,
    };
  };

  const saveChatToHistory = async () => {
    if (chatMessages.length > 0) {
      const token = localStorage.getItem('token');
      try {
        await axios.post(
          'http://localhost:5000/chat/savechat',
          { messages: chatMessages },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setChatMessages([]);
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-purple-900 text-white flex items-center justify-between p-4">
        <div className="flex items-center">
          <img src="bot.jpg" alt="User DP" className="h-10 w-10 rounded-full mr-3" />
          <span className="font-semibold text-lg">Hi, {user?.name}</span>
        </div>
        <div className="flex items-center">
          <button onClick={() => navigate('/profile')} className="text-white hover:underline">
            User Profile
          </button>
          <button onClick={() => navigate('/about-us')} className="ml-4 text-white hover:underline">
            About Us
          </button>
          <button onClick={handleLogout} className="ml-4 text-white hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-grow">
        <div className="w-1/4 bg-purple-50 p-4 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-lg mb-4">Patient Record</h2>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <p>Medical History:</p>
              <ul>
                {medicalHistory.length > 0 ? (
                  medicalHistory.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))
                ) : (
                  <li>No medical history available</li>
                )}
              </ul>
            </div>
          </div>
          <button
            onClick={handleViewChatHistory}
            className="w-full bg-purple-900 text-white px-4 py-2 rounded-lg mt-4"
          >
            View Chat History
          </button>
        </div>

        <div className="w-3/4 p-4 flex flex-col justify-center relative">
          <h2 className="font-bold text-lg mb-4">Chat with AI Healthcare Bot</h2>
          <div className="bg-white rounded-lg p-4 shadow-md flex flex-col h-80">
            <div className="flex flex-col h-64 overflow-y-auto p-2 border-b border-gray-200" id="chat-messages">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg max-w-xs ${
                    message.type === 'bot' 
                      ? 'bg-blue-100 text-blue-900 self-start' 
                      : 'bg-purple-100 text-purple-900 self-end'
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-900 text-white px-4 py-2 rounded-lg"
              >
                Send
              </button>
              <button
                onClick={saveChatToHistory}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Save to History
              </button>
            </div>
          </div>
          <button
            onClick={handleNearbyHospitalsClick}
            className="w-full bg-purple-900 text-white px-4 py-2 rounded-lg mt-4"
          >
            Show Nearby Hospitals
          </button>
        </div>
      </div>

      {showChatHistory && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-purple-900 mb-4">Chat History</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : chatHistory.length > 0 ? (
              chatHistory.map((conversation, index) => (
                <div key={index} className="mb-6">
                  <h3 className="font-semibold mb-2">Conversation {index + 1}</h3>
                  <div className="space-y-2">
                    {conversation.messages.map((message, msgIndex) => (
                      <div
                        key={msgIndex}
                        className={`p-3 rounded-lg ${
                          message.type === 'Bot'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        <strong>{message.type}:</strong> {message.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p>No chat history available.</p>
            )}
            <button
              onClick={handleCloseChatHistory}
              className="mt-4 bg-purple-900 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;