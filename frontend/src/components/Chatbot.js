import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m here to help you with information about Brilliant Grammar School and PU College. Feel free to ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => 'session_' + Date.now());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/chatbot`, {
        message: userMessage,
        session_id: sessionId
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          data-testid="chatbot-open-btn"
          className="fixed bottom-6 right-6 bg-[#0A192F] text-white p-4 shadow-lg hover:bg-[#1E293B] transition-all duration-300 z-50 btn-primary"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 bg-white border border-gray-200 shadow-2xl z-50 flex flex-col slide-up" style={{ height: '600px' }}>
          {/* Header */}
          <div className="bg-[#0A192F] text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold heading-font">School Assistant</h3>
              <p className="text-xs text-gray-300 body-font">Ask me anything</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              data-testid="chatbot-close-btn"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ maxHeight: 'calc(600px - 140px)' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chatbot-message-${index}`}
              >
                <div
                  className={`max-w-[80%] p-3 body-font text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#0A192F] text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                data-testid="chatbot-input"
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-[#0A192F] focus:border-transparent body-font text-sm"
              />
              <button
                type="submit"
                data-testid="chatbot-send-btn"
                disabled={loading || !input.trim()}
                className="bg-[#0A192F] text-white px-4 py-2 transition-all hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
