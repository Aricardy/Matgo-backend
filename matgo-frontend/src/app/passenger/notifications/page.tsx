"use client";
// Passenger Notifications Page
import React, { useEffect, useState } from 'react';
// Update the import path if the alias is not configured or incorrect
import { useSession } from '../../../contexts/SessionContext';
import { fetchPassengerNotifications, markAllAsRead, clearAllNotifications } from '../../../lib/api/passenger';
import { NotificationList, NotificationControls } from '../../../components/notifications';
import { useRouter } from 'next/navigation';

const PassengerNotificationsPage = () => {
  const { user, role, token } = useSession();
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (role !== 'passenger') {
      router.replace(`/${role}/dashboard`);
      return;
    }
    if (user && token) {
      fetchPassengerNotifications(user.id, token).then(setNotifications);
    }
  }, [user, role, token, router]);

  return (
    <div className="notifications-container">
      <NotificationControls
        onMarkAllAsRead={() => user && token && markAllAsRead(user.id, token).then(() => fetchPassengerNotifications(user.id, token).then(setNotifications))}
        onClearAll={() => user && token && clearAllNotifications(user.id, token).then(() => setNotifications([]))}
      />
      <NotificationList notifications={notifications} userRole={role || ''} />
    </div>
  );
};

export default PassengerNotificationsPage;
