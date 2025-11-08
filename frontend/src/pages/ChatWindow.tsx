import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { useAuth } from "@clerk/clerk-react";
import "./Chat.css";

// this component is for user 
const appointment = {
  CustomerId: "user_33SWQDkGoK0Jll1m1CIxADUTKg7",  // here this is the sender id -> nickname
  EmployeeId: "user_34s5drjxj1d5sl7iKnk7l2vWsQV", // here this is the recipient id
  CustomerName: "Chiran Dhanasekara", // full name
  EmployeeName: "Chanuka Dasun",
  status: "PENDING",
  description: "Basic Service - CAR",
  createdAt: Date.now(),
  updatedAt: Date.now(),
  statusMessage: "Appointment created, waiting for confirmation",
  appointmentDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // One week from now
  serviceTypeId: "basic",
  serviceTypeName: "Basic Service"
}

// interface User {
//   nickname: string;
//   fullname: string;
//   status: "ONLINE" | "OFFLINE";
// }

interface ChatMessage {
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

function ChatWindow() {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const chatAreaRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();
  console.log("Logged in userId:", userId);

  // Scroll chat to bottom when new message arrives
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
      if (userId) {
          connectUser();
          fetchMessages();
      }
      }, [userId]);

  useEffect(() => {
          fetchMessages();
    }, [newMessage]);

  const connectUser = () => {

    const socket = new SockJS("http://localhost:9000/websocket");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setStompClient(client);

      // Subscribe to personal queue
      console.log("Subscribing to /user/" + userId + "/queue/messages");
      client.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);
      const name = appointment.CustomerName;
      // Register user online
      client.send(
        "/app/user.addUser",
        {},
        JSON.stringify({ userId, name, status: "ONLINE" })
      );

      fetchUsers();
    });
  };

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:9000/api/connectedUsers");
    const data = await res.json();
    console.log("Fetched users:", data);
    return data;
  };

  const fetchMessages = async () => {
    console.log("Fetching messages for:", appointment.EmployeeId, "And userId:", userId);
    const res = await fetch(
      `http://localhost:9000/api/messages/${userId}/${appointment.EmployeeId}`
    );
    const data = await res.json();
    console.log("Data here here:", data);
    setMessages(data);
  };

  const onMessageReceived = (payload: any) => {
    const message = JSON.parse(payload.body);
      setMessages((prev) => [
        ...prev,
        {
          senderId: message.senderId,
          recipientId: message.recipientId,
          content: message.content,
          timestamp: new Date().toISOString(),
        },
      ]);
      console.log("Message received for selected user:", message);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stompClient || !newMessage ) return;

    const msg: ChatMessage = {
      senderId: userId? userId : "",
      recipientId: appointment.EmployeeId,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    stompClient.send("/app/chat", {}, JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    fetchMessages();
  };

  // const logout = () => {
  //   if (stompClient) {
  //     const fullname = appointment.CustomerName;
  //     stompClient.send(
  //       "/app/user.disconnectUser",
  //       {},
  //       JSON.stringify({ userId, fullname, status: "OFFLINE" })
  //     );
  //     stompClient.disconnect();
  //   }
  //   setMessages([]);
  // };

  return (
    <div className="chat-container">

      <main className="chat-main">
          <>
            <h3>Chat with {appointment.EmployeeName}</h3>
            <div className="messages" ref={chatAreaRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${
                    msg.senderId === userId ? "sent" : "received"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="message-form">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
      </main>
    </div>
  );
}

export default ChatWindow;
