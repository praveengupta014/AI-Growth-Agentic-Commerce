import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I am your AI Agent. I can help you find products, answer questions, or process orders. How can I assist you today?',
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { id: messages.length + 1, role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    // Prepare messages for the API (removing the 'id' field)
    const apiMessages = newMessages.map(({ role, content }) => ({ role, content }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          userId: null // Set to null instead of 'guest' to avoid ObjectId cast error in DB
        }),
      });

      if (!response.ok) throw new Error('API returned an error');

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'assistant',
          content: data.reply,
        }
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: 'assistant',
          content: 'Sorry, I am having trouble connecting to the LLM backend.',
        }
      ]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Chat Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/20 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Bot size={20} />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-neutral-900 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
          </div>
          <div>
            <h2 className="text-white font-semibold flex items-center gap-2">
              Agentic Assistant <Sparkles size={14} className="text-amber-400" />
            </h2>
            <p className="text-xs text-indigo-300 font-medium">Online • AI Powered</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 z-10 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[95%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                msg.role === 'user' 
                  ? 'bg-neutral-800 border border-white/10 text-gray-400' 
                  : 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-neutral-800 border border-white/5 text-gray-200 rounded-tr-sm'
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-50 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black/20 border-t border-white/10 z-10">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI agent anything..."
            className="w-full bg-neutral-800/50 border border-white/10 rounded-xl py-4 pl-5 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-neutral-700 disabled:text-neutral-500 text-white rounded-lg transition-colors flex items-center justify-center shadow-lg"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
