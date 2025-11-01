import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';

let stompClient: Client | null = null;

export const connectWebSocket = (onMessageReceived: (msg: any) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('🔄 Attempting to connect to WebSocket...');
    
    const socket = new SockJS('http://127.0.0.1:9000/websocket');

    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },

      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        
        stompClient?.subscribe('/topic/messages', (message: IMessage) => {
          try {
            const msg = JSON.parse(message.body);
            onMessageReceived(msg);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });
        
        resolve();
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message']);
        console.error('Error details:', frame.body);
        reject(new Error(frame.headers['message']));
      },

      onWebSocketClose: (event) => {
        console.log('🔌 WebSocket closed:', event);
      },

      onWebSocketError: (event) => {
        console.error('❌ WebSocket error:', event);
        reject(event);
      }
    });

    stompClient.activate();
  });
};

export const sendMessage = (nickname: string, content: string): boolean => {
  if (stompClient && stompClient.connected) {
    const chatMessage = { 
      nickname: nickname, 
      content: content, 
      date: new Date().toISOString()
    };
    
    try {
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(chatMessage),
      });
      console.log('📤 Message sent:', chatMessage);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  } else {
    console.warn('⚠️ Cannot send message: STOMP client not connected');
    return false;
  }
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('❌ Disconnected');
  }
};

export const isConnected = (): boolean => {
  return stompClient?.connected ?? false;
};