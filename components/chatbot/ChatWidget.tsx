"use client"

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, X, Send, Bot, User as UserIcon, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { sendChatMessage, ChatMessage } from "@/services/chatbot";
import ReactMarkdown from "react-markdown";
import { Session } from "next-auth";

interface CustomSession extends Session {
  user?: {
    token?: string;
    [key: string]: any;
  } & Session["user"];
}

export const ChatWidget = () => {
    const { data: session } = useSession() as { data: CustomSession | null };
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: "model",
                parts: [{ text: "Hello! I'm Elimu AI. How can I help you find or summarize SOPs today?" }]
            }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const suggestedPrompts = [
        "What is the procedure for taking leave?",
        "Find the IT security policy",
        "Summarize my department's SOPs"
    ];

    const handleSend = async (e?: React.FormEvent, promptText?: string) => {
        e?.preventDefault();
        const userText = promptText || input.trim();
        if (!userText || !session?.user?.token) return;

        if (e) setInput("");
        
        const newHistory: ChatMessage[] = [...messages, { role: "user", parts: [{ text: userText }] }];
        setMessages(newHistory);
        setIsLoading(true);

        try {
            const apiHistory = newHistory.filter(m => m.parts[0].text !== "Hello! I'm Elimu AI. How can I help you find or summarize SOPs today?");
            const res = await sendChatMessage(userText, apiHistory, {
                headers: { Authorization: `Token ${session.user.token}` }
            });
            
            setMessages(prev => [...prev, {
                role: "model",
                parts: [{ text: res.reply || "Sorry, I couldn't understand that." }]
            }]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: "model",
                parts: [{ text: "Error: " + (error.response?.data?.error || error.message) }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300 ease-in-out ${isExpanded ? "w-[90vw] h-[85vh] sm:w-[600px] sm:h-[700px]" : "w-[380px] h-[550px]"}`}>
                    {/* Header */}
                    <div className="bg-[#004d40] p-4 flex justify-between items-center text-white shadow-md">
                        <div className="flex items-center gap-2">
                            <Bot size={24} className="text-white" />
                            <div>
                                <h3 className="font-bold text-sm tracking-wide">Elimu AI</h3>
                                <p className="text-xs text-emerald-100 opacity-90">SOP Knowledge Base</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors text-white" aria-label="Expand Chat">
                                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors text-white" aria-label="Close Chat">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-emerald-50 text-[#004d40]" : "bg-[#00332b] text-white shadow-sm"}`}>
                                    {msg.role === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-[#004d40] text-white rounded-tr-sm shadow-sm" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm overflow-hidden"}`}>
                                    {msg.role === "model" ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-snug prose-li:my-0.5">
                                            <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.parts[0].text
                                    )}
                                </div>
                            </div>
                        ))}
                        {messages.length === 1 && !isLoading && (
                            <div className="flex flex-wrap gap-2 px-12 mt-2">
                                {suggestedPrompts.map((prompt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(undefined, prompt)}
                                        className="text-xs text-left bg-emerald-50 text-[#004d40] border border-emerald-100 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#00332b] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-[#004d40] rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-[#004d40] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                    <span className="w-1.5 h-1.5 bg-[#004d40] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about an SOP..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#004d40]/50 focus:border-[#004d40] transition-all shadow-sm"
                                disabled={isLoading}
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1.5 bg-[#004d40] hover:bg-[#00332b] disabled:bg-gray-300 disabled:hover:bg-gray-300 text-white p-2 rounded-full transition-all flex items-center justify-center shadow-sm"
                            >
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-[#004d40] hover:bg-[#00332b] rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                    <MessageSquare size={24} />
                </button>
            )}
        </div>
    );
};
