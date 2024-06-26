"use client"; // This is a client component 👈🏽

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string; id: number }[]>([]);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ messageId: number; text: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input, id: Date.now() };
    setMessages([...messages, userMessage]);

    // Mock bot response for now
    const botMessage = { sender: 'bot', text: `You said: ${input}`, id: Date.now() + 1 };
    setMessages([...messages, userMessage, botMessage]);

    setInput('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleDislike = (messageId: number) => {
    setFeedback({ messageId, text: '' });
  };

  const handleFeedbackChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  };

  const handleFeedbackSubmit = () => {
    if (feedback && feedback.text.trim() !== '') {
      console.log(`Feedback for message ${feedback.messageId}: ${feedback.text}`);
      setFeedback(null);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="p-5 max-w-lg mx-auto h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat Bot Demo</h1>
      <div className="flex-grow border border-gray-300 p-4 overflow-y-scroll mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <p className={`inline-block p-2 rounded-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {msg.text}
              {msg.sender === 'bot' && (
                <button
                  onClick={() => handleDislike(msg.id)}
                  className="ml-2 text-red-500 underline"
                >
                  Dislike
                </button>
              )}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      {feedback && (
        <div className="mb-4">
          <input
            type="text"
            value={feedback.text}
            onChange={handleFeedbackChange}
            placeholder="Provide your feedback here"
            className="w-full border border-gray-300 p-2 rounded-md mb-2 text-black"
          />
          <button onClick={handleFeedbackSubmit} className="bg-blue-500 text-white p-2 rounded-md">
            Submit Feedback
          </button>
        </div>
      )}
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow border border-gray-300 p-2 rounded-md mr-2 text-black"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-md">
          Send
        </button>
      </div>
    </div>
  );
};