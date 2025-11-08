// src/services/socketService.ts
import type { Message } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class SocketService {
  private client: Client | null = null;
  private connectionPromise: Promise<void> | null = null;

  connect(username: string, onMessage: (msg: any) => void) {
    // Return early if already connected
    if (this.client && this.client.connected) {
      return this.getSubscriptionMethods(onMessage);
    }

    // Create connection promise
    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => 
          new SockJS(`http://localhost:9000/websocket?username=${username}`),
        reconnectDelay: 5000,
        onConnect: () => {
          console.log("WebSocket Connected as:", username);
          resolve();
        },
        onStompError: (err) => {
          console.error("STOMP Error", err);
          reject(err);
        },
      });

      this.client.onWebSocketClose = () => {
        console.log("Disconnected");
        this.connectionPromise = null;
      };

      this.client.activate();
    });

    return this.getSubscriptionMethods(onMessage);
  }

  private getSubscriptionMethods(onMessage: (msg: any) => void) {
    return {
      subscribeToClient: async (clientId: string) => {
        await this.connectionPromise; // Wait for connection
        if (!this.client) throw new Error("Client not initialized");
        
        return this.client.subscribe(`/topic/client/${clientId}`, (message: Message) => {
          onMessage(JSON.parse(message.body));
        });
      },
      subscribeToAppointment: async (appointmentId: string) => {
        await this.connectionPromise; // Wait for connection
        if (!this.client) throw new Error("Client not initialized");
        
        return this.client.subscribe(`/topic/appointment/${appointmentId}`, (message: Message) => {
          onMessage(JSON.parse(message.body));
        });
      }
    };
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connectionPromise = null;
    }
  }
}

export const socketService = new SocketService();