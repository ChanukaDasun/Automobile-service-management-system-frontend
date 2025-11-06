import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import useNotifications from '@/hooks/useNotification';
import NotificationPopup from '@/components/NotificationPopup';
import { useUser } from '@clerk/clerk-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read?: boolean;
}

interface BackendNotification {
  id: string;
  to: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPopup, setCurrentPopup] = useState<Notification | null>(null);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/notifications/${user.id}`);
      if (response.ok) {
        const data: BackendNotification[] = await response.json();
        
        // Transform backend format to frontend format
        const transformedNotifications: Notification[] = data.map(notif => ({
          id: notif.id,
          title: 'New Notification',
          message: notif.message,
          type: 'info' as const,
          timestamp: new Date(notif.createdAt).toLocaleString(),
          read: notif.read
        }));

        setNotifications(transformedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user?.id]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((body: any) => {
    console.log('Received WebSocket notification:', body);
    
    const newNotification: Notification = {
      id: body.id || Date.now().toString(),
      title: body.title || 'New Notification',
      message: body.message || JSON.stringify(body),
      type: body.type || 'info',
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setCurrentPopup(newNotification);

    // Play notification sound (optional)
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {
        // Ignore audio play errors (autoplay policy)
      });
    } catch (error) {
      console.log('Could not play notification sound');
    }
  }, []);

  // Initialize WebSocket connection for notifications
  useNotifications({
    username: user?.id,
    token: undefined, 
    onMessage: handleWebSocketMessage
  });

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    setCurrentPopup(newNotification);
  }, []);

  const clearNotification = useCallback(async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    // Optionally delete from backend
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );

    // Update backend
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const closePopup = useCallback(() => {
    setCurrentPopup(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      clearNotification, 
      markAsRead,
      refreshNotifications: fetchNotifications
    }}>
      {children}
      <NotificationPopup notification={currentPopup} onClose={closePopup} />
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
