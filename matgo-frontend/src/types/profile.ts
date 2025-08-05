// Shared types for profile and notification API responses

export type PassengerProfile = {
  id: string;
  avatarUrl: string;
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  favorites: any[];
  tripHistory: any[];
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
};

export type CrewProfile = {
  id: string;
  avatarUrl: string;
  fullName: string;
  crewRole: string;
  saccoName: string;
  phone: string;
  email: string;
  vehicle: {
    saccoName: string;
    busName: string;
    registrationNumber: string;
  };
  rating: number;
};

export type AdminProfile = {
  id: string;
  avatarUrl: string;
  fullName: string;
  adminRole: string;
  email: string;
};

export type Notification = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
  category?: string;
  link?: string;
};
