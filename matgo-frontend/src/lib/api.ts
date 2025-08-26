const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to refresh the access token
async function refreshAccessToken() {
  if (isRefreshing) {
    // If a token refresh is already in progress, wait for it to complete
    return new Promise((resolve, reject) => {
      refreshSubscribers.push((newToken: string) => {
        if (newToken) {
          resolve(newToken);
        } else {
          reject(new Error('Token refresh failed'));
        }
      });
    });
  }

  isRefreshing = true;
  
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    const { token, user } = data;

    // Update the stored token and user
    localStorage.setItem('matgoToken', token);
    if (user) {
      localStorage.setItem('matgoUser', JSON.stringify(user));
    }

    // Notify all waiting requests that the token has been refreshed
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
    isRefreshing = false;

    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear auth data and redirect to login
    localStorage.removeItem('matgoToken');
    localStorage.removeItem('matgoUser');
    window.location.href = '/login';
    refreshSubscribers = [];
    isRefreshing = false;
    throw error;
  }
}

// Refresh the token and retry the original request
async function refreshAndRetry(endpoint: string, options: RequestInit): Promise<any> {
  try {
    const refreshToken = localStorage.getItem('matgoRefreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    // Request a new access token
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken } = await response.json();
    localStorage.setItem('matgoToken', accessToken);

    // Retry the original request with the new token
    return apiFetch(endpoint, options);
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('matgoToken');
    localStorage.removeItem('matgoUser');
    localStorage.removeItem('matgoRefreshToken');
    window.location.href = '/login';
    throw error;
  }
}

// Update apiFetch to handle token refresh
export async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  // Skip token for login/register endpoints only, not all auth endpoints
  const isPublicAuthEndpoint = endpoint === '/auth/login' || endpoint === '/auth/register' || endpoint === '/refresh-token';
  
  // Get the current token
  let token = localStorage.getItem('matgoToken');
  
  // Prepare headers
  const headers = new Headers(options.headers || {});
  if (token && !isPublicAuthEndpoint) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Only set Content-Type to application/json if it's not a FormData object and not explicitly set
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    // Make the initial request
    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    // If unauthorized and not already refreshing, try to refresh the token
    if (response.status === 401 && !isPublicAuthEndpoint && token) {
      return refreshAndRetry(endpoint, options);
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: (endpoint: string, options: RequestInit = {}) => 
    apiFetch(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint: string, body?: any, options: RequestInit = {}) => {
    const isFormData = body instanceof FormData;
    return apiFetch(endpoint, { 
      ...options,
      method: 'POST',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
  },
    
  put: (endpoint: string, body?: any, options: RequestInit = {}) => {
    const isFormData = body instanceof FormData;
    return apiFetch(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });
  },
    
  delete: (endpoint: string, options: RequestInit = {}) =>
    apiFetch(endpoint, { ...options, method: 'DELETE' }),
};
