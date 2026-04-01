import { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Send, X, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import axios from 'axios';

import botAnimation from './bot_animation.json';

const quickSuggestions = [
    '🥗 Healthy breakfast ideas',
    '🍝 Quick 15-min dinner',
    '🥤 Organic smoothie recipe',
    '🌿 What veggies are in season?',
];

const TypingIndicator = () => (
    <div className="flex items-end gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="bg-slate-100 rounded-2xl rounded-bl-md px-5 py-4 flex gap-1.5">
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
    </div>
);

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-end gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
        >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${isUser
                ? 'bg-gradient-to-br from-slate-800 to-slate-600'
                : 'bg-gradient-to-br from-primary to-emerald-400'
                }`}>
                {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${isUser
                ? 'bg-slate-900 text-white rounded-2xl rounded-br-md shadow-xl'
                : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md'
                }`}>
                {message.content}
            </div>
        </motion.div>
    );
};

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { user } = useSelector(state => state.auth);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Add welcome message when chat is first opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: `Hey ${user?.name || 'there'}! 👋 I'm Chef AI, your personal culinary assistant.\n\nI can help you find recipes, suggest meal plans, or answer any food-related questions. What can I cook up for you today? 🍳`
            }]);
        }
    }, [isOpen]);

    const sendMessage = async (text) => {
        const content = text || input.trim();
        if (!content || isLoading) return;

        const userMessage = { role: 'user', content };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Send only role + content to the API
            const apiMessages = updatedMessages
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map(m => ({ role: m.role, content: m.content }));

            const { data } = await axios.post('/api/chat', { messages: apiMessages });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.reply
            }]);
        } catch (error) {
            const errReply = error.response?.data?.reply || 'Oops, something went wrong. Please try again! 🍳';
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errReply
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[5000]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.85 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.85 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="absolute bottom-28 right-0 w-[380px] h-[560px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-primary to-emerald-500 px-6 py-5 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-lg tracking-tight">Chef AI</h4>
                                    <p className="text-white/70 text-xs font-medium">Powered by GPT</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                            {/* Decorative wave */}
                            <div className="absolute bottom-0 left-0 right-0 h-3 bg-white rounded-t-3xl" />
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto px-5 py-4 space-y-1 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <ChatMessage key={i} message={msg} />
                            ))}
                            {isLoading && <TypingIndicator />}
                            <div ref={messagesEndRef} />

                            {/* Quick Suggestions - show only if first message from AI */}
                            {messages.length <= 1 && !isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="pt-2"
                                >
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Quick Suggestions</p>
                                    <div className="flex flex-wrap gap-2">
                                        {quickSuggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(s)}
                                                className="px-4 py-2.5 bg-slate-50 hover:bg-primary/10 border border-slate-100 hover:border-primary/30 rounded-xl text-xs font-semibold text-slate-600 hover:text-primary transition-all"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50/50">
                            <div className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 px-4 py-2 shadow-sm focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(22,163,74,0.1)] transition-all">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask Chef AI anything..."
                                    className="flex-grow bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex-shrink-0"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            <p className="text-center text-[9px] text-slate-300 mt-2 font-medium">Chef AI may make mistakes. Verify important info.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-20 h-20 bg-gradient-to-br from-primary to-emerald-500 rounded-full shadow-[0_10px_40px_-10px_rgba(22,163,74,0.5)] flex items-center justify-center overflow-hidden relative group"
                data-cursor="Open AI"
            >
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-50" />
                <div className="w-10 h-10 relative z-10 text-white drop-shadow-lg">
                    <Bot className="w-full h-full" strokeWidth={2.5} />
                </div>
            </motion.button>

            {/* Tooltip when closed */}
            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-6 right-24 bg-white rounded-2xl shadow-xl px-5 py-3 border border-slate-100 whitespace-nowrap"
                >
                    <p className="text-sm font-bold text-slate-800">Need cooking help? 🍳</p>
                    <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-b border-slate-100 rotate-[-45deg]" />
                </motion.div>
            )}
        </div>
    );
};

export default AIAssistant;
