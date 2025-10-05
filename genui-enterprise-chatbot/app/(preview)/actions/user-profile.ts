'use server';

// Define the UserDetails interface here to avoid circular dependencies
export interface UserDetails {
  name: string;
  email: string;
  age: number;
  occupation: string;
  interests: string[];
}

// Store user profile in memory (in a real app, this would be in a database)
let userProfile: UserDetails | null = null;

/**
 * Server action to update the user profile
 */
export async function updateUserProfile(details: UserDetails): Promise<void> {
  // In a real app, you would store this in a database
  userProfile = details;
  console.log('User profile updated:', details);
}

/**
 * Server action to get the current user profile
 */
export async function getUserProfile(): Promise<UserDetails | null> {
  return userProfile;
} 