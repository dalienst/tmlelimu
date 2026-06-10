"use client"

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { sendChatMessage, ChatMessage } from "@/services/chatbot";
import ReactMarkdown from "react-markdown";

export default function AssistantPage() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                role: "model",
                parts: [{ text: "Hello! I'm your AI Assistant. How can I help you find or summarize SOPs today?" }]
            }]);
        }
    }, [messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !session?.user?.token) return;

        const userText = input.trim();
        setInput("");
        
        const newHistory: ChatMessage[] = [...messages, { role: "user", parts: [{ text: userText }] }];
        setMessages(newHistory);
        setIsLoading(true);

        try {
            const apiHistory = newHistory.filter(m => m.parts[0].text !== "Hello! I'm your AI Assistant. How can I help you find or summarize SOPs today?");
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
        <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Bot size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
                    <p className="text-gray-500">Your intelligent knowledge base for SOPs</p>
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md"}`}>
                                {msg.role === "user" ? <UserIcon size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={`max-w-[80%] px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm overflow-hidden"}`}>
                                {msg.role === "model" ? (
                                    <div className="prose prose-blue max-w-none prose-p:leading-relaxed prose-li:my-1">
                                        <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                                    </div>
                                ) : (
                                    msg.parts[0].text
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                                <Bot size={20} />
                            </div>
                            <div className="bg-gray-50 border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <form onSubmit={handleSend} className="relative flex items-center max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything about your SOPs..."
                            className="w-full bg-white border border-gray-200 rounded-full pl-6 pr-14 py-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-300 text-white p-2.5 rounded-full transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-0.5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
