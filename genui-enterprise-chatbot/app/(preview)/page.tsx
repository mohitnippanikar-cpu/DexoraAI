"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
import { useActions } from "ai/rsc";
import { useScrollToBottom } from "@/pages/Dashboard/use-scroll-to-bottom";
import Sidebar from "@/pages/Sidebar";
import ChatInput from "@/pages/Dashboard/ChatInput";
import ChatMessage, { MessageRole } from "@/pages/Dashboard/ChatMessage";
import { UserProfile } from "@/components/LoginModal";

// Define message type
interface Message {
  id: string;
  role: MessageRole;
  content: string | ReactNode;
  timestamp: Date;
  userPrompt?: string;
}

// Keep these functions for future reference but they won't be used
const serializeMessages = (messages: Message[]): any[] => 
  messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp.toISOString(),
    // If content is not a string (ReactNode), replace with a placeholder
    content: typeof msg.content === 'string' ? msg.content : "AI interactive response"
  }));

const deserializeMessages = (serializedMessages: any[]): Message[] => 
  serializedMessages.map((msg: any) => {
    // If the message content was a placeholder for a ReactNode, make sure it's a string when deserializing
    const content = msg.content === "AI interactive response" 
      ? "This was an interactive response that can't be displayed after page refresh" 
      : msg.content;
      
    return {
      ...msg,
      timestamp: new Date(msg.timestamp),
      content
    };
});

export default function Home() {
  const { sendMessage } = useActions();

  // Use React's useState instead of useLocalStorage to prevent persistence
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  // Authorization states
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // User login state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // References for scrolling to bottom
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  // Remove the initial authorization check on startup
  // Authorization will only be checked when user sends a message

  // Clear all messages
  const clearConversation = () => {
    setMessages([]);
  };

  // Handle sending a new message — temporarily a no-op that appends an assistant message.
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message locally so UI is responsive
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Show loading state while calling the server action
    setIsLoadingResponse(true);

    try {
      const aiResponse = await sendMessage(content);

      const assistantMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponse as any,
        timestamp: new Date(),
        userPrompt: content,
      };

      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error processing request:', error);

      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
        userPrompt: content,
      };

      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar 
        activeNavItem="home" 
        onNewConversation={clearConversation}
        user={currentUser}
        onUserChange={setCurrentUser}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden backdrop-blur-sm bg-slate-950/95">
        {/* Chat Messages Container with constrained width */}
        <div className="flex-1 flex justify-center overflow-hidden">
        <div
          ref={messagesContainerRef}
            className="w-full max-w-4xl overflow-y-auto scrollbar-hide"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="text-center mb-8">
                  {/* Dexora Logo/Brand */}
                  <div className="mb-6">
                    <h1 className="text-7xl font-bold mb-3">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Dexora
                      </span>
                    </h1>
                    <h2 className="text-2xl font-medium text-slate-300 mb-2">
                      Transforming Industries with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-semibold">AI</span>
                    </h2>
                  </div>
                  
                  <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed mb-8">
                    Empower your business with our state-of-the-art AI platform. Experience 
                    enterprise-grade security, custom workflows, and industry-leading performance.
                  </p>
                </div>
                
                <div className="w-full max-w-4xl px-4 mb-8">
                  <ChatInput onSendMessage={handleSendMessage} />
                </div>
                
                {/* Quick Access Tools */}
                <div className="w-full max-w-4xl px-4">
                  <p className="text-center text-sm font-medium text-slate-400 mb-4">Quick Access to Enterprise Tools:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleSendMessage("Show me HR dashboard")}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-900/70 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          👥
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">HR Dashboard</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Employee data & analytics</p>
                    </button>

                    <button 
                      onClick={() => handleSendMessage("Show sales dashboard")}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-900/70 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          💰
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">Sales Dashboard</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Performance & revenue</p>
                    </button>

                    <button 
                      onClick={() => handleSendMessage("Show marketing dashboard")}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-900/70 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          📈
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">Marketing</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Campaign analytics</p>
                    </button>

                    <button 
                      onClick={() => handleSendMessage("Show finance dashboard")}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-900/70 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          💳
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">Finance</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Accounting & budget</p>
                    </button>

                    <button 
                      onClick={() => handleSendMessage("Show engineering dashboard")}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-900/70 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          ⚙️
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">Engineering</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Code & projects</p>
                    </button>

                    <button 
                      onClick={() => handleSendMessage("Upload document for analysis")}
                      className="group p-4 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-primary/50 hover:bg-slate-900/70 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          📊
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white group-hover:text-primary transition-colors">Documents</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Upload & analyze files</p>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    userPrompt={message.role === "assistant" ? message.userPrompt : undefined}
                  />
                ))}
                {isLoadingResponse && (
                  <ChatMessage
                    role="assistant"
                    content=""
                    isLoading={true}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input area with constrained width, only show if we have messages */}
        {messages.length > 0 && (
          <div className="border-t border-slate-700 flex justify-center backdrop-blur-sm bg-slate-900/30">
            <div className="w-full max-w-4xl p-4">
              <ChatInput 
                onSendMessage={handleSendMessage}
                isLoading={isLoadingResponse}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
