import React, { useState, useEffect } from 'react';
import { notificationService, type Notification } from '../services/notificationService';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notifs = await notificationService.getNotifications();
      setNotifications(notifs);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    if (!isOpen) {
      await fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const deletedNotif = notifications.find(n => n.id === notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        style={{
          position: 'relative',
          backgroundColor: 'white',
          border: '2px solid #1a1a1a',
          padding: '10px 14px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '3px 3px 0 #1a1a1a',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(1px, 1px)';
          e.currentTarget.style.boxShadow = '2px 2px 0 #1a1a1a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '3px 3px 0 #1a1a1a';
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#1a1a1a',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid white',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '0',
          width: '400px',
          maxHeight: '500px',
          backgroundColor: 'white',
          border: '3px solid #1a1a1a',
          boxShadow: '6px 6px 0 #1a1a1a',
          zIndex: 1000,
          fontFamily: '"Segoe Print", "Comic Sans MS", cursive',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px',
            borderBottom: '2px solid #1a1a1a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1a1a1a',
            }}>
              🔔 Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  backgroundColor: 'white',
                  border: '2px solid #1a1a1a',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0 #1a1a1a',
                  fontFamily: 'inherit',
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}>
            {loading ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#4a4a4a',
              }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#4a4a4a',
              }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                <div>No notifications yet</div>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  style={{
                    padding: '16px',
                    borderBottom: '1px dashed #1a1a1a',
                    backgroundColor: notif.read ? 'white' : '#f5f5f5',
                    cursor: notif.link ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (!notif.read) {
                      handleMarkAsRead(notif.id);
                    }
                    if (notif.link) {
                      window.location.href = notif.link;
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px',
                  }}>
                    <div style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      color: '#1a1a1a',
                      flex: 1,
                    }}>
                      {notif.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '0 4px',
                      }}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#4a4a4a',
                    marginBottom: '8px',
                  }}>
                    {notif.message}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#4a4a4a',
                  }}>
                    {getTimeAgo(notif.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default NotificationBell;
