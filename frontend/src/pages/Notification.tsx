import { useNotificationContext } from '@/contexts/NotificationContext';

export default function Notification() {
  const { notifications, clearNotification, markAsRead, refreshNotifications } = useNotificationContext();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <button
            onClick={refreshNotifications}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        
        {/* Debug Info - Shows username for backend integration */}
       

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              All Notifications ({notifications.length})
            </h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-gray-600 text-lg">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-2">Notifications will appear here when you receive them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      notification.read 
                        ? 'bg-gray-50 border-gray-200 opacity-75' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4">
                          <p className="text-xs text-gray-500">
                            {notification.timestamp}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => clearNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                        title="Delete notification"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
