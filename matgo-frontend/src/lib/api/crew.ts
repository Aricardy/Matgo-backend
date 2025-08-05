import axios from 'axios';

export const fetchCrewProfile = async (id: string, token: string) => {
  const { data } = await axios.get(`/api/users/crew/${id}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const fetchCrewNotifications = async (id: string, token: string) => {
  const { data } = await axios.get(`/api/users/crew/${id}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
