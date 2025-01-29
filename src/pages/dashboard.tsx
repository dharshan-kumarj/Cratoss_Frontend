import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styled from 'styled-components';
import '../styles/dashbord.css';
import AI from '../images/AI.png';
import User from '../images/User.jpg';

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const extractResponseContent = (data: any) => {
    if (data && data.result) {
      const match = data.result.match(/"([\s\S]*)"$/);
      return match ? match[1] : data.result;
    }
    return 'No response received';
  };

  const formatApiResponse = (response: string) => {
    return response
      .replace(/\n/g, '<br>')
      .replace(/#{2,6}\s+([^\n]+)/g, '<h3>$1</h3>')
      .replace(/```(\w*)([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.*?)$/gm, '• $1')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>')
      .replace(/•/g, '<br>•');
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    // Add user message
    setMessages(prev => [...prev, {
      type: 'user',
      content: trimmedInput
    }]);
    setInputValue('');

    // Add typing indicator
    setMessages(prev => [...prev, {
      type: 'ai',
      content: '<div class="typing-indicator"><span></span><span></span><span></span></div>'
    }]);

    try {
      const response = await fetch('https://api-cratoss.dharshankumar.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: trimmedInput
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      // Extract and format the response content
      const extractedContent = extractResponseContent(data);
      const formattedResponse = formatApiResponse(extractedContent);

      // Remove typing indicator and add formatted response
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter((_, index) => index !== prev.length - 1);
        return [...messagesWithoutTyping, {
          type: 'ai',
          content: formattedResponse
        }];
      });

    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => {
        const messagesWithoutTyping = prev.filter((_, index) => index !== prev.length - 1);
        return [...messagesWithoutTyping, {
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.'
        }];
      });
    }
  };

  return (
    <Wrapper>
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <Message key={index} className={`${message.type} ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.type === 'ai' && <Avatar src={AI} alt="AI" />}
            <MessageContent dangerouslySetInnerHTML={{ __html: message.content }} />
            {message.type === 'user' && <Avatar src={User} alt="User" />}
          </Message>
        ))}
      </ChatContainer>

      <InputContainer>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask me..."
        />
        <SendButton onClick={handleSendMessage}>
          Send
        </SendButton>
      </InputContainer>
    </Wrapper>
  );
};

// Styled components remain exactly the same
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: #ffffff;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
  box-sizing: border-box;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;

  &.user {
    justify-content: flex-end;
  }

  &.ai {
    justify-content: flex-start;
  }
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 10px;
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.4;
  position: relative;

  .user & {
    background-color: #0084ff;
    color: #ffffff;
    text-align: right;
  }

  .ai & {
    background-color: #1e1e1e;
    color: #ffffff;
    text-align: left;
  }

  h3 {
    margin: 15px 0 10px 0;
    font-size: 1.2em;
    font-weight: bold;
  }

  pre {
    background-color: #2d2d2d;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    margin: 10px 0;
  }

  code {
    font-family: monospace;
    white-space: pre-wrap;
    color: #e6e6e6;
  }

  a {
    color: #00b0ff;
    text-decoration: underline;
  }

  br {
    display: block;
    margin: 5px 0;
    content: "";
  }

  strong {
    font-weight: bold;
    color: #ffffff;
  }

  em {
    font-style: italic;
  }
`;

const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  display: flex;
  align-items: center;
  background: transparent;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 12px 18px;
  border: none;
  border-radius: 25px;
  background-color: #f0f0f0;
  color: #333333;
  font-size: 15px;
  margin-right: 10px;

  &::placeholder {
    color: #999999;
  }
`;

const SendButton = styled.button`
  width: 70px;
  height: 44px;
  background-color: #0084ff;
  color: #ffffff;
  border: none;
  border-radius: 22px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
`;

export default Dashboard;