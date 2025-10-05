"use client";

import { UserDetails } from './UserDetailsForm';

interface ViewUserProfileProps {
  userProfile: UserDetails | null;
}

export default function ViewUserProfile({ userProfile }: ViewUserProfileProps) {
  if (!userProfile) {
    return (
      <div className="bg-perplexity-background rounded-lg p-6 border border-perplexity-border max-w-md w-full mx-auto">
        <p className="text-center text-perplexity-text-secondary">
          No health profile information is available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-perplexity-background-secondary/40 border border-perplexity-border rounded-lg p-6">
      <h2 className="text-perplexity-text-primary text-lg font-semibold mb-4">Your Health Profile</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-perplexity-text-secondary text-sm">Name</h3>
          <p className="text-perplexity-text-primary">{userProfile.name}</p>
        </div>
        
        <div>
          <h3 className="text-perplexity-text-secondary text-sm">Email</h3>
          <p className="text-perplexity-text-primary">{userProfile.email}</p>
        </div>
        
        <div>
          <h3 className="text-perplexity-text-secondary text-sm">Age</h3>
          <p className="text-perplexity-text-primary">{userProfile.age}</p>
        </div>
        
        <div>
          <h3 className="text-perplexity-text-secondary text-sm">Occupation</h3>
          <p className="text-perplexity-text-primary">{userProfile.occupation}</p>
        </div>
        
        {userProfile.interests && userProfile.interests.length > 0 && (
          <div>
            <h3 className="text-perplexity-text-secondary text-sm">Health Concerns</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {userProfile.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="bg-perplexity-primary/10 text-perplexity-primary px-2 py-1 rounded-md text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 