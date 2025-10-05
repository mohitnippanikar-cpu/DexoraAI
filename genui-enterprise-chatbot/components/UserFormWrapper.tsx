"use client";

import { useState } from 'react';
import UserDetailsForm, { UserDetails } from './UserDetailsForm';

// Define a server action type that the parent can provide
export type UpdateUserProfileAction = (details: UserDetails) => Promise<void>;

interface UserFormWrapperProps {
  initialData?: Partial<UserDetails>;
  updateUserProfile: UpdateUserProfileAction;
}

export default function UserFormWrapper({ 
  initialData, 
  updateUserProfile 
}: UserFormWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Client-side handler
  const handleSubmit = async (details: UserDetails) => {
    try {
      setIsLoading(true);
      // Call the server action to update the user profile
      await updateUserProfile(details);
    } catch (error) {
      console.error('Error updating user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <UserDetailsForm
      onSubmit={handleSubmit}
      initialData={initialData}
      isLoading={isLoading}
    />
  );
} 