import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkNotificationsAsRead,
} from '@shared/api/notifications';
import type { Notification } from '@shared/api/notifications';
import { usePostDetail } from '@app/providers/usePostDetail';
import styles from './NotificationsSidebar.module.css';

interface NotificationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Time ago formatter
function timeAgo(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) return 'just now';
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
  if (seconds < 2592000) {
    const weeks = Math.floor(seconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
  }

  return 'a while ago';
}

// Notification type text
function getNotificationText(notification: Notification): string {
  switch (notification.type) {
    case 'like':
      return 'liked your photo.';
    case 'comment':
      return 'commented on your photo.';
    case 'follow':
      return 'started following you.';
    default:
      return '';
  }
}

export default function NotificationsSidebar({
  isOpen,
  onClose,
}: NotificationsSidebarProps) {
  const navigate = useNavigate();
  const { openPostDetail } = usePostDetail();
  const { data: allNotifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkNotificationsAsRead();

  // Filter notifications from the last month
  const notifications = useMemo(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return allNotifications.filter((notif) => {
      const notifDate = new Date(notif.createdAt);
      return notifDate >= oneMonthAgo;
    });
  }, [allNotifications]);

  // Group notifications: new (unread) and earlier (read)
  const newNotifications = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  const earlierNotifications = useMemo(
    () => notifications.filter((n) => n.read),
    [notifications]
  );

  const handleMarkAllAsRead = () => {
    if (newNotifications.length > 0) {
      markAllAsRead.mutate();
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Notification clicked:', notification._id, 'read status:', notification.read);
    
    // Mark as read if not already read
    if (!notification.read) {
      console.log('Marking notification as read...');
      markAsRead.mutate(notification._id, {
        onSuccess: () => {
          console.log('Notification marked as read successfully');
        },
        onError: (error) => {
          console.error('Error marking notification as read:', error);
        },
      });
    }

    if (notification.type === 'follow') {
      // Navigate to user profile
      navigate(`/profile/${notification.sender._id}`);
      onClose();
    } else if (notification.post?._id) {
      // Open post detail modal for likes and comments
      openPostDetail(notification.post._id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Notifications</h2>
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className={styles.noNotifications}>
              No notifications from the last month
            </div>
          ) : (
            <>
              {/* New notifications */}
              {newNotifications.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>New</h3>
                    <button
                      className={styles.markAllButton}
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className={styles.notificationsList}>
                    {newNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`${styles.notificationItem} ${
                          !notification.read ? styles.unread : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={styles.notificationAvatar}>
                          {notification.sender.profileImage ? (
                            <img
                              src={notification.sender.profileImage}
                              alt={notification.sender.name}
                            />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              {notification.sender.name[0]?.toUpperCase() ||
                                'U'}
                            </div>
                          )}
                        </div>

                        <div className={styles.notificationContent}>
                          <div className={styles.notificationText}>
                            <span className={styles.username}>
                              {notification.sender.name}
                            </span>{' '}
                            {getNotificationText(notification)}
                          </div>
                          <div className={styles.time}>
                            {timeAgo(notification.createdAt)}
                          </div>
                        </div>

                        {/* Post thumbnail for likes and comments */}
                        {(notification.type === 'like' ||
                          notification.type === 'comment') &&
                          notification.post && (
                            <div className={styles.postThumbnail}>
                              {notification.post.imageUrl ? (
                                <img
                                  src={notification.post.imageUrl}
                                  alt="Post"
                                />
                              ) : (
                                <div className={styles.thumbnailPlaceholder} />
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read notifications */}
              {earlierNotifications.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Read</h3>
                  <div className={styles.notificationsList}>
                    {earlierNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={styles.notificationItem}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={styles.notificationAvatar}>
                          {notification.sender.profileImage ? (
                            <img
                              src={notification.sender.profileImage}
                              alt={notification.sender.name}
                            />
                          ) : (
                            <div className={styles.avatarPlaceholder}>
                              {notification.sender.name[0]?.toUpperCase() ||
                                'U'}
                            </div>
                          )}
                        </div>

                        <div className={styles.notificationContent}>
                          <div className={styles.notificationText}>
                            <span className={styles.username}>
                              {notification.sender.name}
                            </span>{' '}
                            {getNotificationText(notification)}
                          </div>
                          <div className={styles.time}>
                            {timeAgo(notification.createdAt)}
                          </div>
                        </div>

                        {/* Post thumbnail for likes and comments */}
                        {(notification.type === 'like' ||
                          notification.type === 'comment') &&
                          notification.post && (
                            <div className={styles.postThumbnail}>
                              {notification.post.imageUrl ? (
                                <img
                                  src={notification.post.imageUrl}
                                  alt="Post"
                                />
                              ) : (
                                <div className={styles.thumbnailPlaceholder} />
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
