import React from 'react';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
  link?: string;
}

interface AdminNotificationListProps {
  notifications: Notification[];
}

const categories = [
  'New SACCO Application',
  'New System Admin Application',
  'Major Incident Report',
  'System Health Alert',
];

const AdminNotificationList: React.FC<AdminNotificationListProps> = ({ notifications }) => (
  <div className="admin-notification-list">
    {categories.map(cat => (
      <div key={cat} className="notification-category">
        <h3>{cat}</h3>
        {notifications.filter(n => n.category === cat).map(n => (
          <div key={n.id} className={`notification-card${n.read ? '' : ' unread'}`}>
            <span className={`notification-icon ${n.type}`}></span>
            <div className="notification-message">
              {n.link ? <a href={n.link}>{n.message}</a> : n.message}
            </div>
            <div className="notification-timestamp">{n.timestamp}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default AdminNotificationList;
