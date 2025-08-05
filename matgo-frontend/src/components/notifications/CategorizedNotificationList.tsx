import React from 'react';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
}

interface CategorizedNotificationListProps {
  notifications: Notification[];
}

const categories = ['SACCO Comm', 'System Alert', 'Info'];

const CategorizedNotificationList: React.FC<CategorizedNotificationListProps> = ({ notifications }) => (
  <div className="categorized-notification-list">
    {categories.map(cat => (
      <div key={cat} className="notification-category">
        <h3>{cat}</h3>
        {notifications.filter(n => n.category === cat).map(n => (
          <div key={n.id} className={`notification-card${n.read ? '' : ' unread'}`}>
            <span className={`notification-icon ${n.type}`}></span>
            <div className="notification-message">{n.message}</div>
            <div className="notification-timestamp">{n.timestamp}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default CategorizedNotificationList;
