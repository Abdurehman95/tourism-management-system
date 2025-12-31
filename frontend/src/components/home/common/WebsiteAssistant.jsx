import React, { useState, useRef, useEffect } from 'react';
import './WebsiteAssistant.css';
import botAvatar from '../../../assets/images/lalibela.jpg';

const WebsiteAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Selam! 👋 I’m your VisitEthiopia assistant. Ask me about cities, culture, food, or trip ideas.", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const suggestedTopics = [
    { icon: "🎉", text: "Festivals & culture" },
    { icon: "🏰", text: "Historical sites" },
    { icon: "🚌", text: "Transport info" }
  ];

  const handleTopicClick = (topic) => {
    setInputValue(topic);
    // Optional: could auto-submit, but pre-filling is safer
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getResponse(userMessage.text);
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const getResponse = (input) => {
    const lowerInput = input.toLowerCase();

    // 1. General Greeting
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('selam')) {
      return "Selam! I'm here to help you plan your Ethiopian adventure. Try asking about 'Gondar', 'Lalibela', or 'local food'.";
    }

    // 2. Food
    if (lowerInput.includes('food') || lowerInput.includes('injera') || lowerInput.includes('eat')) {
      return "Ethiopian cuisine is famous! You must try Injera with Doro Wat (spicy chicken stew). We also have amazing vegetarian dishes like Shiro and Misir Wat.";
    }

    // 3. Culture
    if (lowerInput.includes('culture') || lowerInput.includes('festival') || lowerInput.includes('timket')) {
      return "Ethiopia has a rich cultural heritage. Key festivals include Timket (Epiphany) in Jan and Meskel in Sept. Coffee ceremonies are also a must-experience tradition!";
    }

    // 4. Sites
    if (lowerInput.includes('site') || lowerInput.includes('place') || lowerInput.includes('visit') || lowerInput.includes('lalibela')) {
      return "Top destinations include the rock-hewn churches of Lalibela, the castles of Gondar, and the Simien Mountains. You can book guides for these sites here!";
    }

    // 5. Booking/Login support (Keep existing logic)
    if (lowerInput.includes('login') || lowerInput.includes('sign in')) {
      return "To Log In: Click the 'Sign In' button at the top right. You need an account to book visits.";
    }
    if (lowerInput.includes('book') || lowerInput.includes('reservation')) {
      return "To Book: Login > 'Explore Sites' > Select a site > 'Request Visit'. Simple as that!";
    }

    return "I can help with travel tips, food recommendations, site information, or booking guides. What would you like to know?";
  };

  return (
    <div className="assistant-container" ref={chatContainerRef}>
      {isOpen && (
        <div className="assistant-window">
          {/* Header */}
          <div className="assistant-header">
            <div className="header-left">
              <div className="assistant-avatar-icon">
                <img src={botAvatar} alt="Bot Profile" />
              </div>
              <div className="header-info">
                <h3>Tourism Assistant Bot</h3>
                <div className="header-status">
                  <span className="status-dot"></span>
                  Explore Ethiopia in chat
                </div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Info Bar */}
          <div className="info-bar">
            <span>🇪🇹 Explore Ethiopia</span>
            <span>Travel • Culture • Food</span>
          </div>

          {/* Messages */}
          <div className="assistant-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-wrapper">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="quick-actions-container">
            <div className="quick-actions">
              {suggestedTopics.map((topic, idx) => (
                <button
                  key={idx}
                  className="action-chip"
                  onClick={() => handleTopicClick(topic.text)}
                >
                  <span>{topic.icon}</span> {topic.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <form className="assistant-input-area" onSubmit={handleSend}>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Ask about cities, festivals, food, or routes..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                Send ➤
              </button>
            </div>
          </form>
        </div>
      )}

      <button className="assistant-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default WebsiteAssistant;
