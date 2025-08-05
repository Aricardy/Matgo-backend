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
  return !!getAuthToken();
}

// Redirect to login if not authenticated
export function requireAuth(redirectTo = '/login') {
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
