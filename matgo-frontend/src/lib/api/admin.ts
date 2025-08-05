import axios from 'axios';

export const fetchAdminProfile = async (id: string, token: string) => {
  const { data } = await axios.get(`/api/users/admin/${id}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateAdminProfile = async (id: string, profile: any, token: string) => {
  const { data } = await axios.put(`/api/users/admin/${id}/profile`, profile, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const fetchAdminNotifications = async (id: string, token: string) => {
  const { data } = await axios.get(`/api/users/admin/${id}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
