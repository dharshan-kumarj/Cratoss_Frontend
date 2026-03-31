import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Loader2, Copy, Check, Terminal, User as UserIcon, Bot, Trash2 } from 'lucide-react';
import AI from '../images/AI.png';
import User from '../images/User.jpg';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

interface ApiResponse {
  answer?: string;
  error?: string;
}

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatApiResponse = (response: string): string => {
    return response
      .replace(/\n/g, '<br>')
      .replace(/#{1,6}\s+([^\n]+)/g, (_, title) => `<h3 class="text-xl font-bold my-4 text-blue-400">${title}</h3>`)
      .replace(/```(\w*)([\s\S]*?)```/g, (_, lang, code) => {
        const uniqueId = `code-${Math.random().toString(36).substr(2, 9)}`;
        return `
          <div class="relative group my-4 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl">
            <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
              <span class="text-xs font-mono text-gray-400">${lang || 'code'}</span>
              <button 
                onclick="window.copyCode('${code.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')"
                class="copy-btn p-1 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
              >
                Copy
              </button>
            </div>
            <pre class="p-4 overflow-x-auto text-sm font-mono text-blue-100"><code>${code}</code></pre>
          </div>`;
      })
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
      .replace(/^\* (.*?)$/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-400 hover:text-blue-300 underline font-medium">$1</a>')
      .replace(/\[(Source\s+\d+:.*?)\]/g, '<span class="text-xs font-semibold bg-blue-900/40 text-blue-200 px-2 py-0.5 rounded border border-blue-700/50 my-1 inline-block hover:bg-blue-900/60 transition-colors pointer-cursor">$1</span>')
      .replace(/•/g, '<br>•');
  };

  useEffect(() => {
    // Expose copy function to window for the button in dangerouslySetInnerHTML
    (window as any).copyCode = (code: string) => {
      navigator.clipboard.writeText(code);
      // Optional: Visual feedback
      const btn = document.activeElement as HTMLButtonElement;
      if (btn && btn.classList.contains('copy-btn')) {
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Copied!';
        setTimeout(() => { btn.innerHTML = originalText; }, 2000);
      }
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    setMessages(prev => [...prev, {
      type: 'user',
      content: trimmedInput
    }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: trimmedInput }),
      });

      const data: ApiResponse = await response.json();
      const formattedResponse = formatApiResponse(data.answer || 'No response received');

      setMessages(prev => [...prev, {
        type: 'ai',
        content: formattedResponse
      }]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0c] text-gray-100 selection:bg-blue-500/30">
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/60 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl shadow-lg shadow-blue-900/20 border border-white/10">
            <img src={AI} alt="Cratoss Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Cratoss AI
            </h1>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Intelligent IoT Assistant</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])} 
          className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-red-400"
          title="Clear Conversation"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      {/* Chat container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
              <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center animate-pulse border border-blue-500/20 overflow-hidden p-4">
                <img src={AI} alt="Cratoss Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">How can I help you today?</h2>
                <p className="text-gray-400 max-w-sm">Ask me anything about Arduino, IoT devices, security protocols, or hardware architecture.</p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                message.type === 'user' ? 'items-end' : 'items-start'
              } group`}
            >
              <div className={`flex items-start gap-3 max-w-[75%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                {/* Avatar */}
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border ${
                    message.type === 'user' 
                      ? 'bg-blue-600 border-blue-400/30 overflow-hidden' 
                      : 'bg-gray-800 border-gray-700 overflow-hidden'
                  }`}>
                    <img
                      src={message.type === 'user' ? User : AI}
                      alt={message.type === 'user' ? "User" : "AI"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1.5 scale-in overflow-hidden">
                  <div className={`relative px-4 py-2.5 shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-600/90 to-blue-700/90 text-white rounded-2xl rounded-tr-none border border-blue-500/20'
                      : 'bg-[#1a1a20] text-gray-200 rounded-2xl rounded-tl-none border border-white/5'
                  }`}>
                    <div 
                      className="prose prose-invert max-w-none leading-relaxed text-[15px]"
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                  
                  {/* Message Actions */}
                  <div className={`flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <button 
                      onClick={() => copyToClipboard(message.content.replace(/<[^>]*>/g, ''), index)}
                      className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium transition-colors uppercase tracking-wider rounded ${
                        copiedId === index ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-blue-400 bg-white/5'
                      }`}
                    >
                      {copiedId === index ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-gray-600 uppercase tracking-tighter">
                      {message.type === 'user' ? 'You' : 'Cratoss Bot'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden p-1 shadow-lg">
                <img src={AI} alt="Thinking..." className="w-full h-full object-contain animate-pulse" />
              </div>
              <div className="bg-[#1a1a20] rounded-2xl px-6 py-4 border border-white/5 flex items-center gap-3 shadow-xl">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="p-6 bg-[#0a0a0c] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center gap-2 bg-[#14141a] rounded-2xl p-2 border border-white/10 shadow-2xl focus-within:border-blue-500/50 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Message Cratoss AI..."
                className="flex-1 bg-transparent text-gray-100 px-4 py-3 focus:outline-none placeholder-gray-500 font-medium"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                  isLoading || !inputValue.trim() 
                    ? 'bg-gray-800 text-gray-600' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-gray-500 font-medium uppercase tracking-widest">
            Cratoss can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;