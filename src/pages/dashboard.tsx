import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import AI from '../images/AI.png';
import User from '../images/User.jpg';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

interface ApiResponse {
  result?: string;
  error?: string;
}

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = (): void => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const formatApiResponse = (response: string): string => {
    return response
      .replace(/\n/g, '<br>')
      .replace(/#{2,6}\s+([^\n]+)/g, '<h3 class="text-lg font-bold my-2">$1</h3>')
      .replace(/```(\w*)([\s\S]*?)```/g, '<pre class="bg-gray-800 p-4 rounded-lg my-2 overflow-x-auto"><code>$2</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/^\* (.*?)$/gm, '• $1')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
      .replace(/•/g, '<br>•');
  };

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
      const response = await fetch('https://api-cratoss.dharshankumar.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmedInput }),
      });

      const data: ApiResponse = await response.json();
      const formattedResponse = formatApiResponse(data.result || 'No response received');

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
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Chat container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar Image */}
            <div className={`flex-shrink-0 ${
              message.type === 'user' ? 'ml-2' : 'mr-2'
            }`}>
              <img
                src={message.type === 'user' ? User : AI}
                alt={message.type === 'user' ? "User Avatar" : "AI Avatar"}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>

            {/* Message content */}
            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-100'
            }`}>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mr-2">
              <img
                src={AI}
                alt="AI Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
            <div className="bg-gray-800 rounded-2xl px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-gray-800 bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-gray-100 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;