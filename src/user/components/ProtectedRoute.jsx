import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, requiredRole, ...rest }) => {
  // Get authentication status and user data from localStorage
  const jwtToken = localStorage.getItem('jwtToken');
  const storedUserData = localStorage.getItem('userData');

  const isAuthenticated = !!jwtToken && !!storedUserData; // Check if token and user data exist
  let userRole = null; // Default role

  if (isAuthenticated) {
    try {
      const userData = JSON.parse(storedUserData);
      // Assuming your user data stored in localStorage has a 'role' field
      userRole = userData.role; // Get the actual user role
    } catch (error) {
      console.error('Failed to parse user data from localStorage in ProtectedRoute:', error);
      // If data is corrupt, treat as not authenticated
      isAuthenticated = false;
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userData');
    }
  }

  if (!isAuthenticated) {
    // If not authenticated (or data is corrupt), redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, check if a specific role is required and if it matches the user's role
  if (requiredRole) {
    const isAdminRoute = requiredRole === 'admin';
    const hasAdminRole = userRole === 'quản lý cửa hàng';

    if (isAdminRoute && !hasAdminRole) {
      // If required role is admin but user does not have 'quản lý cửa hàng' role
      console.warn(`Unauthorized access attempt: User role is '${userRole}', but required role is '${requiredRole}'`);
      // TODO: Consider creating a dedicated Unauthorized page
      return <Navigate to="/" replace />; // Redirect to home for now
    } else if (!isAdminRoute && userRole !== requiredRole) {
      // For other required roles, check for exact match
      console.warn(`Unauthorized access attempt: User role is '${userRole}', but required role is '${requiredRole}'`);
      // TODO: Consider creating a dedicated Unauthorized page
      return <Navigate to="/" replace />; // Redirect to home for now
    }
  }

  // If authenticated and role matches (or no role required), render the element
  return <Element {...rest} />;
};

export default ProtectedRoute; 