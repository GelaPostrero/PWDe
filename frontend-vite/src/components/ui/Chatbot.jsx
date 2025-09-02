import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Minus, X, User, Move } from 'lucide-react';

const Chatbot = ({ 
  position = "center", 
  showNotification = false, 
  notificationCount = 0,
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [customPosition, setCustomPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hi! I'm your AI assistant. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const chatbotRef = useRef(null);
  const isDraggable = true; // Always draggable from any position

  const positionClasses = {
    "center": "bottom-6 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
    "right": "top-1/2 right-6 transform -translate-y-1/2",
    "custom": customPosition || "bottom-6 left-1/2 transform -translate-x-1/2"
  };

  const toggleChat = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setIsMinimized(true);
      }
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputValue.trim()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      
      // Simulate AI response (replace with actual AI integration)
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: "I understand you're looking for help. Let me assist you with finding the right opportunities!"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    if (!isDraggable) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = chatbotRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isDraggable) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep chatbot within viewport bounds
    const maxX = window.innerWidth - 56; // 56px is the width of the button
    const maxY = window.innerHeight - 56; // 56px is the height of the button
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setCustomPosition(`top-${boundedY}px left-${boundedX}px`);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e) => {
    if (!isDraggable) return;
    
    const touch = e.touches[0];
    const rect = chatbotRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isDraggable) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;
    
    // Keep chatbot within viewport bounds
    const maxX = window.innerWidth - 56;
    const maxY = window.innerHeight - 56;
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setCustomPosition(`top-${boundedY}px left-${boundedX}px`);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset, isDraggable]);

  // Reset position when position prop changes
  useEffect(() => {
    if (position !== "custom") {
      setCustomPosition(null);
    }
  }, [position]);

  return (
    <div 
      ref={chatbotRef}
      className={`fixed ${positionClasses[position]} z-50 ${className}`}
      style={customPosition ? { 
        top: customPosition.split(' ')[0].replace('top-', '').replace('px', ''),
        left: customPosition.split(' ')[1].replace('left-', '').replace('px', ''),
        transform: 'none'
      } : {}}
    >
      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className={`bg-white rounded-xl shadow-2xl border border-gray-200 w-80 h-96 ${
          position.includes("right") ? "mr-4" : position.includes("left") ? "ml-4" : "mb-4"
        } flex flex-col`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">PWDe AI Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                  Online • Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={minimizeChat}
                className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                aria-label="Minimize chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-2 ${
                  message.type === 'user' ? 'justify-end' : ''
                }`}>
                  {message.type === 'ai' && (
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg px-3 py-2 max-w-xs ${
                    message.type === 'ai' 
                      ? 'bg-white border border-gray-200 text-gray-800' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized Chat Window */}
      {isOpen && isMinimized && (
        <div className={`bg-white rounded-lg shadow-lg border border-gray-200 w-64 ${
          position.includes("right") ? "mr-4" : position.includes("left") ? "ml-4" : "mb-4"
        }`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm">PWDe AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(false)}
                className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                aria-label="Expand chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={toggleChat}
                className="text-blue-100 hover:text-white transition-colors p-1 rounded"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className={`cursor-${isDraggable ? 'move' : 'pointer'} select-none`}
        >
          <button
            onClick={toggleChat}
            className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center relative ${
              isDragging ? 'scale-110' : ''
            }`}
            aria-label="Open AI chat"
          >
            <Bot className="w-6 h-6" />
            
            {/* Move indicator for draggable positions */}
            {isDraggable && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center">
                <Move className="w-2 h-2 text-white" />
              </div>
            )}
            
            {/* Notification Badge */}
            {showNotification && notificationCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium px-1 animate-pulse">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;