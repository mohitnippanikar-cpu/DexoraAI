// Configuration constants for the application
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

// You can add other utility constants and functions here as needed
export const API_ENDPOINTS = {
  MAKE_CALL: "/make-call",
  USER_PROFILE: "/user-profile",
  // Add more endpoints as needed
};

// Utility function to construct full API URLs
export const getApiUrl = (endpoint: string) => `${SERVER_URL}${endpoint}`;

// Utility function for API error handling
export const handleApiError = (error: any) => {
  console.error("API Error:", error);
  return {
    success: false,
    error: error.message || "An unexpected error occurred",
  };
};
