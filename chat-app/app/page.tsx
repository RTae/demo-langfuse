"use client";

import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/modal';

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string; id: number }[]>([]);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ messageId?: number; text: string } | null>(null);
  const [username] = useState('User' + Math.floor(Math.random() * 1000));
  const [sessionId] = useState(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage = { sender: username, text: input, id: Date.now() };
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
    setFeedback({ ...feedback, text: event.target.value });
  };

  const handleFeedbackSubmit = () => {
    if (feedback && feedback.text.trim() !== '') {
      console.log(`Feedback for message ${feedback.messageId} from ${username} (session ${sessionId}): ${feedback.text}`);
      setFeedback(null);
    }
  };

  const closeModal = () => {
    setFeedback(null);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="p-5 max-w-lg mx-auto h-screen flex flex-col bg-black text-white">
      <h1 className="text-2xl font-bold mb-2">Master Chief Bot</h1>
      <p className="mb-4"><strong>Username:</strong> {username}</p>
      <p className="mb-4"><strong>Session ID:</strong> {sessionId}</p>
      <div className="flex-grow border border-gray-300 p-4 overflow-y-scroll mb-4 bg-white text-black rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === username ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-md ${msg.sender === username ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              <p className="text-xs text-black"><strong>ID:</strong> {msg.id}</p>
              <p>{msg.text}</p>
            </div>
            {msg.sender === 'bot' && (
              <div className="flex justify-start mt-1">
                <button
                  onClick={() => handleDislike(msg.id)}
                  className="text-red-500"
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
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

      <Modal isOpen={!!feedback} onClose={closeModal}>
        {feedback && (
          <>
            <h2 className="text-xl font-bold mb-2">Provide Feedback</h2>
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
          </>
        )}
      </Modal>
    </div>
  );
};
