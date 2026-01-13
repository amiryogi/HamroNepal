/**
 * Protected Route Component
 *
 * Restricts access based on authentication and role.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { hasRole } from "@/services/auth.service";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredRoles,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, author } = useAuth();
  const location = useLocation();

  // Combine requiredRoles and allowedRoles for flexibility
  const roles = requiredRoles || allowedRoles;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हुँदैछ...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to="/dashboard/login" state={{ from: location }} replace />
    );
  }

  // Check if user has author profile
  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            पहुँच अस्वीकृत
          </h2>
          <p className="text-gray-600 mb-4">
            तपाईंको लेखक प्रोफाइल भेटिएन। कृपया प्रशासकलाई सम्पर्क गर्नुहोस्।
          </p>
          <Navigate to="/dashboard/login" replace />
        </div>
      </div>
    );
  }

  // Check role-based access
  if (roles && !hasRole(author, roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">अनुमति छैन</h2>
          <p className="text-gray-600 mb-4">
            यो पृष्ठ हेर्न तपाईंसँग पर्याप्त अनुमति छैन।
          </p>
          <a
            href="/dashboard"
            className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            ड्यासबोर्डमा जानुहोस्
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
