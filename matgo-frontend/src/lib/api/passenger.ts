// Trip Booking API
export const fetchRoutes = async () => {
  const { data } = await axios.get('/api/routes');
  return data;
};

export const bookTrip = async (booking: {
  user_id: string;
  route: string;
  trip_type: 'one-way' | 'two-way';
  departure_date: string;
  return_date?: string | null;
}) => {
  const { data } = await axios.post('/api/bookings', booking);
  return data;
};

export const payForTrip = async (payment: {
  booking_id: string;
  amount: number;
  payment_method: 'MPESA' | 'CARD' | 'CASH';
}) => {
  const { data } = await axios.post('/api/payments', payment);
  return data;
};
// Emergency Contacts API
export const fetchEmergencyContacts = async (userId: string) => {
  const { data } = await axios.get(`/api/emergency-contacts/${userId}`);
  return data;
};

export const addEmergencyContact = async (contact: { user_id: string; name: string; phone_number: string }) => {
  const { data } = await axios.post('/api/emergency-contacts', contact);
  return data;
};

export const deleteEmergencyContact = async (contactId: string) => {
  const { data } = await axios.delete(`/api/emergency-contacts/${contactId}`);
  return data;
};
import axios from 'axios';

export const fetchPassengerProfile = async (id: string, token: string) => {
  const { data } = await axios.get(`/api/users/passenger/${id}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updatePassengerProfile = async (id: string, profile: any, token: string) => {
  const { data } = await axios.put(`/api/users/passenger/${id}/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const submitTripFeedback = async (tripId: string, feedback: any, token: string) => {
  const { data } = await axios.post(`/api/trips/${tripId}/feedback`, feedback, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const fetchPassengerNotifications = async (id: string, token: string) => {
  const { data } = await axios.get(`/api/users/passenger/${id}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const markAllAsRead = async (id: string, token: string) => {
  await axios.post(`/api/notifications/mark-read`, { userId: id }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearAllNotifications = async (id: string, token: string) => {
  await axios.delete(`/api/users/passenger/${id}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
