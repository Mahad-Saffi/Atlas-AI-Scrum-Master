import React, { useState, useEffect } from "react";
import {
  notificationService,
  type Notification,
} from "../services/notificationService";
import { BellIcon, InboxIcon, XMarkIcon } from "@heroicons/react/24/solid";
import theme from "../styles/theme";

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
        className="btn-secondary"
        style={{
          position: "relative",
          padding: theme.spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BellIcon
          style={{
            width: "20px",
            height: "20px",
            color: theme.colors.text.primary,
          }}
        />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              backgroundColor: theme.colors.status.error,
              color: theme.colors.text.white,
              borderRadius: theme.borderRadius.full,
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.bold,
              border: `2px solid ${theme.colors.background.primary}`,
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
            background: theme.colors.background.card,
            backdropFilter: theme.effects.backdropBlur.lg,
            border: `1px solid ${theme.colors.border.light}`,
            borderRadius: theme.borderRadius.lg,
            zIndex: theme.zIndex.dropdown,
            overflow: "hidden",
            boxShadow: theme.shadows.lg,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: theme.spacing.lg,
              borderBottom: `1px solid ${theme.colors.border.default}`,
              background: theme.colors.background.hover,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.spacing.md,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.text.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.sm,
                }}
              >
                <BellIcon style={{ width: "20px", height: "20px" }} />
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="btn-secondary"
                  style={{
                    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                    fontSize: theme.typography.fontSize.xs,
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: theme.spacing.sm }}>
              <button
                onClick={() => setShowUnreadOnly(false)}
                className={!showUnreadOnly ? "btn-primary" : "btn-secondary"}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  fontSize: theme.typography.fontSize.xs,
                  flex: 1,
                }}
              >
                All
              </button>
              <button
                onClick={() => setShowUnreadOnly(true)}
                className={showUnreadOnly ? "btn-primary" : "btn-secondary"}
                style={{
                  padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                  fontSize: theme.typography.fontSize.xs,
                  flex: 1,
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
                  padding: theme.spacing["4xl"],
                  textAlign: "center",
                  color: theme.colors.text.secondary,
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
                  padding: theme.spacing["4xl"],
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    background: theme.colors.background.hover,
                    borderRadius: theme.borderRadius.full,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: `0 auto ${theme.spacing.lg}`,
                  }}
                >
                  <InboxIcon
                    style={{
                      width: "32px",
                      height: "32px",
                      color: theme.colors.text.secondary,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: theme.typography.fontSize.md,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  No notifications yet
                </div>
                <div
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
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
                    padding: theme.spacing.lg,
                    borderBottom: `1px solid ${theme.colors.border.default}`,
                    backgroundColor: notif.read
                      ? "transparent"
                      : theme.colors.background.hover,
                    cursor: notif.link ? "pointer" : "default",
                    transition: theme.effects.transition.normal,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      theme.colors.background.hoverStrong;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = notif.read
                      ? "transparent"
                      : theme.colors.background.hover;
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
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: theme.typography.fontWeight.bold,
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary,
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
                        padding: theme.spacing.xs,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Delete"
                    >
                      <XMarkIcon
                        style={{
                          width: "16px",
                          height: "16px",
                          color: theme.colors.text.secondary,
                        }}
                      />
                    </button>
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: theme.colors.text.secondary,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {notif.message}
                  </div>
                  <div
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
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
