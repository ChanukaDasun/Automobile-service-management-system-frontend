import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface UseNotificationsProps {
  username?: string;
  token?: string;
  onMessage?: (body: any) => void;
}

export default function useNotifications({ username, token, onMessage }: UseNotificationsProps) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!username && !token) {
      console.warn('Provide username (dev) or token (prod).');
      return;
    }

    const url = `/websocket${username ? `?username=${encodeURIComponent(username)}` : ''}`;
    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: () => {
        console.log('WebSocket connected successfully');
        // Subscribe to user queue
        client.subscribe('/user/queue/notifications', (msg) => {
          let body = msg.body;
          try { body = JSON.parse(body); } catch(e) {}
          if (onMessage) onMessage(body);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      }
    });
    clientRef.current = client;
    client.activate();

    return () => {
      try { client.deactivate(); } catch(e) {}
    };
  }, [username, token, onMessage]);

  const sendNotification = useCallback((to: string, message: string) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      console.warn('STOMP not connected');
      return;
    }
    client.publish({
      destination: '/app/sendMessage',
      body: JSON.stringify({ to, message }),
      headers: { 'content-type': 'application/json' }
    });
  }, []);

  return { sendNotification };
}