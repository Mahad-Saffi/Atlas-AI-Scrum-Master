import React, { useState, useEffect } from "react";
import {
  notificationService,
  type Notification,
} from "../services/notificationService";
import {
  BellIcon,
  CheckIcon,
  XMarkIcon,
  InboxIcon,
} from "@heroicons/react/24/solid";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notifs = await notificationService.getNotifications(showUnreadOnly);
      setNotifications(notifs);
    } catch (error) {
      console.error("Error fetching notifications:", error);
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

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [showUnreadOnly]);

  const handleToggle = async () => {
    if (!isOpen) {
      await fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const deletedNotif = notifications.find((n) => n.id === notificationId);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      if (deletedNotif && !deletedNotif.read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        style={{
          position: "relative",
          padding: "10px 14px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          color: "#f1f5f9",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <BellIcon style={{ width: "20px", height: "20px" }} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              backgroundColor: "#dc2626",
              color: "white",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: "bold",
              border: "2px solid #0a0a0f",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "0",
            width: "400px",
            maxHeight: "500px",
            background: "rgba(17, 17, 24, 0.98)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            zIndex: 1000,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(10, 10, 15, 0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <BellIcon style={{ width: "20px", height: "20px" }} />
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <CheckIcon style={{ width: "14px", height: "14px" }} />
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setShowUnreadOnly(false)}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  flex: 1,
                  background: !showUnreadOnly
                    ? "linear-gradient(135deg, #dc2626, #991b1b)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: !showUnreadOnly
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                All
              </button>
              <button
                onClick={() => setShowUnreadOnly(true)}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  flex: 1,
                  background: showUnreadOnly
                    ? "linear-gradient(135deg, #dc2626, #991b1b)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: showUnreadOnly
                    ? "none"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "#94a3b8",
                }}
              >
                <div
                  className="spinner"
                  style={{ width: "32px", height: "32px", margin: "0 auto" }}
                />
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <InboxIcon
                  style={{
                    width: "64px",
                    height: "64px",
                    margin: "0 auto 16px",
                    color: "#475569",
                  }}
                />
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#f1f5f9",
                    marginBottom: "8px",
                  }}
                >
                  No notifications yet
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#94a3b8",
                  }}
                >
                  You're all caught up!
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    backgroundColor: notif.read
                      ? "transparent"
                      : "rgba(220, 38, 38, 0.1)",
                    cursor: notif.link ? "pointer" : "default",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = notif.read
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(220, 38, 38, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notif.read
                      ? "transparent"
                      : "rgba(220, 38, 38, 0.1)";
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#f1f5f9",
                        flex: 1,
                      }}
                    >
                      {notif.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0 4px",
                        color: "#94a3b8",
                      }}
                      title="Delete"
                    >
                      <XMarkIcon style={{ width: "16px", height: "16px" }} />
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#94a3b8",
                      marginBottom: "8px",
                    }}
                  >
                    {notif.message}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                    }}
                  >
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
            position: "fixed",
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
