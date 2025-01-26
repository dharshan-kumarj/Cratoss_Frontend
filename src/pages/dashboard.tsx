import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import '../styles/dashbord.css';

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<{ type: 'user' | 'ai'; content: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const appendMessage = (type: 'user' | 'ai', content: string) => {
    setMessages((prevMessages) => [...prevMessages, { type, content }]);
  };

  const sendMessage = async () => {
    const input = (document.getElementById('userinput') as HTMLInputElement)?.value.trim();
    if (!input) return;

    appendMessage('user', input);
    (document.getElementById('userinput') as HTMLInputElement).value = '';

    appendMessage('ai', '<div class="typing-indicator"><span></span><span></span><span></span></div>');

    try {
      const response = await fetch('https://api-cratoss.dharshankumar.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      const data = await response.json();

      // Remove typing indicator
      setMessages((prevMessages) =>
        prevMessages.filter((_, index) => index !== prevMessages.length - 1)
      );

      appendMessage('ai', formatOutput(data.output));
    } catch (error) {
      // Remove typing indicator
      setMessages((prevMessages) =>
        prevMessages.filter((_, index) => index !== prevMessages.length - 1)
      );

      appendMessage('ai', 'Sorry, I encountered an error. Please try again.');
      console.error('Error:', error);
    }
  };

  const formatOutput = (text: string) => {
    const sections = parseOutput(text);
    let formattedHtml = '';

    for (const [title, content] of Object.entries(sections)) {
      formattedHtml += `
        <div class="output-section">
          <h3>${title}</h3>
          ${title.toLowerCase().includes('code') ? `<pre><code>${content}</code></pre>` : `<div>${content}</div>`}
        </div>
      `;
    }

    return wrapCodeBlocks(formattedHtml);
  };

  const parseOutput = (text: string) => {
    // Implement the same logic as before to parse the output
    return {};
  };

  const wrapCodeBlocks = (html: string) => {
    // Implement the same logic as before to wrap code blocks
    return html;
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <Wrapper>
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <Message key={index} className={`${message.type} ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Avatar src={`../images/${message.type === 'user' ? 'User' : 'AI'}.png`} />
            <MessageContent dangerouslySetInnerHTML={{ __html: message.content }} />
          </Message>
        ))}
      </ChatContainer>

      <InputContainer>
        <Input id="userinput" name="userinput" type="text" placeholder="Ask me..." />
        <SendButton id="Execute" onClick={sendMessage}>
          Send
        </SendButton>
      </InputContainer>
    </Wrapper>
  );
};

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