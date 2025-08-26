// Helper function to get the current user's token
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  return localStorage.getItem('matgoToken');
}

// Helper function to get the current user
export function getCurrentUser() {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  const userStr = localStorage.getItem('matgoUser');
  return userStr ? JSON.parse(userStr) : null;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!token && !!user;
}

// Check if user has admin role
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'system_admin';
}

// Verify token with backend
async function verifyToken(): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) return false;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Clear invalid auth data
      localStorage.removeItem('matgoToken');
      localStorage.removeItem('matgoUser');
      return false;
    }

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

// Redirect to login if not authenticated or not admin for admin routes
let lastVerification: number | null = null;
const VERIFICATION_INTERVAL = 30000; // 30 seconds

export async function requireAuth(redirectTo = '/login', requireAdmin = false): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  
  // Check basic auth first
  const isAuth = isAuthenticated();
  if (!isAuth) {
    console.log('Authentication check failed - no valid auth data');
    window.location.href = redirectTo;
    return false;
  }

  // Check admin role if required
  if (requireAdmin && !isAdmin()) {
    console.log('Admin role check failed - user is not admin');
    window.location.href = redirectTo;
    return false;
  }

  // Only verify token with backend if enough time has passed since last verification
  const now = Date.now();
  if (!lastVerification || (now - lastVerification > VERIFICATION_INTERVAL)) {
    try {
      // Get current token
      const token = getAuthToken();
      if (!token) {
        window.location.href = redirectTo;
        return false;
      }

      // Verify token
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 401) {
        // Token is invalid, try to refresh it
        try {
          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });

          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh token');
          }

          const data = await refreshResponse.json();
          
          // Update stored auth data
          localStorage.setItem('matgoToken', data.token);
          if (data.user) {
            localStorage.setItem('matgoUser', JSON.stringify(data.user));
          }

          lastVerification = now;
          return true;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('matgoToken');
          localStorage.removeItem('matgoUser');
          window.location.href = redirectTo;
          return false;
        }
      }

      lastVerification = now;
      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Auth verification failed:', error);
      localStorage.removeItem('matgoToken');
      localStorage.removeItem('matgoUser');
      window.location.href = redirectTo;
      return false;
    }
  }
  
  return true;
}
