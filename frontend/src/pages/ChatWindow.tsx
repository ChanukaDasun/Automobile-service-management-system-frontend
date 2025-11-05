import { useEffect, useState } from 'react';
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from '../api/webSocketService';

interface ChatMessage {
  nickname: string;
  content: string;
  date?: string | Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nickname, setNickname] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  useEffect(() => {
    if (nickname && connectionStatus === 'disconnected') {
      setConnectionStatus('connecting');
      
      connectWebSocket((msg: ChatMessage) => {
        setMessages((prev) => [...prev, msg]);
      })
        .then(() => {
          setConnectionStatus('connected');
          console.log('Connection established successfully');
        })
        .catch((error) => {
          console.error('Failed to connect:', error);
          setConnectionStatus('disconnected');
        });
    }

    return () => {
      if (connectionStatus === 'connected') {
        disconnectWebSocket();
      }
    };
  }, [nickname]);

  const handleSend = (): void => {
    if (content.trim() && nickname.trim() && connectionStatus === 'connected') {
      const success = sendMessage(nickname, content);
      if (success) {
        setContent('');
      }
    }
  };

  if (!nickname) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl mb-4">Enter your nickname</h2>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Your name..."
          className="border rounded px-3 py-2 w-64"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold text-center flex-1">Live Chat</h2>
        <span className={`px-2 py-1 rounded text-xs ${
          connectionStatus === 'connected' ? 'bg-green-200 text-green-800' :
          connectionStatus === 'connecting' ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
          {connectionStatus === 'connected' ? '● Connected' :
           connectionStatus === 'connecting' ? '○ Connecting...' :
           '○ Disconnected'}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto border rounded p-3 mb-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 ${
              msg.nickname === nickname ? 'text-right' : 'text-left'
            }`}
          >
            <div className="inline-block bg-blue-100 px-3 py-2 rounded-lg">
              <strong>{msg.nickname}</strong>: {msg.content}
              {msg.date && (
                <div className="text-xs text-gray-500">
                  {new Date(msg.date).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
          disabled={connectionStatus !== 'connected'}
        />
        <button
          onClick={handleSend}
          disabled={connectionStatus !== 'connected'}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}