import React from 'react';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  userRole: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => (
  <div className="notification-list">
    {notifications.map(n => (
      <div key={n.id} className={`notification-card${n.read ? '' : ' unread'}`}>
        <span className={`notification-icon ${n.type}`}></span>
        <div className="notification-message">{n.message}</div>
        <div className="notification-timestamp">{n.timestamp}</div>
        {/* Mark as Read/Delete actions can be added here */}
      </div>
    ))}
  </div>
);

export default NotificationList;
