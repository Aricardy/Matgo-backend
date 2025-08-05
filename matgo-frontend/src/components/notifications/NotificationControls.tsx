import React from 'react';

interface NotificationControlsProps {
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationControls: React.FC<NotificationControlsProps> = ({ onMarkAllAsRead, onClearAll }) => (
  <div className="notification-controls">
    <button onClick={onMarkAllAsRead}>Mark All as Read</button>
    <button onClick={onClearAll}>Clear All</button>
  </div>
);

export default NotificationControls;
