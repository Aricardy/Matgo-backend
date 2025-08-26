// authUtils.ts
interface AuthToken {
  token: string;
  user: any;
}

interface ApiError {
  response?: {
    status: number;
    data?: any;
  };
  message?: string;
}

let refreshPromise: Promise<string | null> | null = null;

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    // If there's already a refresh in progress, wait for it
    if (refreshPromise) {
      return await refreshPromise;
    }

    // Start a new refresh
    refreshPromise = (async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data: AuthToken = await response.json();
      
      // Update stored auth data
      localStorage.setItem('matgoToken', data.token);
      if (data.user) {
        localStorage.setItem('matgoUser', JSON.stringify(data.user));
      }

      return data.token;
    })();

    // Wait for the refresh to complete
    const newToken = await refreshPromise;
    
    // Clear the promise
    refreshPromise = null;
    
    return newToken;
  } catch (error) {
    // Clear the promise on error
    refreshPromise = null;
    
    // Clear stored auth data
    localStorage.removeItem('matgoToken');
    localStorage.removeItem('matgoUser');
    
    throw error;
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('matgoToken');
    if (!token) return false;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.status === 401) {
      // Token is invalid, try to refresh it
      const newToken = await refreshAuthToken();
      return !!newToken;
    }

    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

export const handleApiError = async (error: ApiError): Promise<boolean> => {
  if (error.response?.status === 401) {
    try {
      // Try to refresh the token
      const newToken = await refreshAuthToken();
      return !!newToken;
    } catch (refreshError) {
      // If refresh fails, clear auth data
      localStorage.removeItem('matgoToken');
      localStorage.removeItem('matgoUser');
      return false;
    }
  }
  return true;
};
