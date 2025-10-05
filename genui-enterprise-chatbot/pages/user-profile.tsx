import { useState } from 'react';
import UserDetailsForm, { UserDetails } from '../components/UserDetailsForm';
import { toast } from 'sonner';

export default function UserProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedUserDetails, setSavedUserDetails] = useState<UserDetails | null>(null);

  const handleSubmit = async (details: UserDetails) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real application, you would send the data to your API here
      console.log('User details submitted:', details);
      
      // Save the details to state to display them
      setSavedUserDetails(details);
      
      // Show success message
      toast.success('User details saved successfully!');
    } catch (error) {
      console.error('Error saving user details:', error);
      toast.error('Failed to save user details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-perplexity-background flex flex-col">
      <header className="bg-perplexity-background-secondary border-b border-perplexity-border py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-perplexity-text-primary text-xl font-bold">GenUI User Profile</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-perplexity-text-primary text-lg font-semibold mb-4">Update Your Profile</h2>
            <p className="text-perplexity-text-secondary mb-6">
              Please provide your details to help us personalize your experience with GenUI.
            </p>
            
            <UserDetailsForm 
              onSubmit={handleSubmit} 
              initialData={savedUserDetails || undefined}
              isLoading={isLoading} 
            />
          </div>
          
          {savedUserDetails && (
            <div className="bg-perplexity-background-secondary/40 border border-perplexity-border rounded-lg p-6">
              <h2 className="text-perplexity-text-primary text-lg font-semibold mb-4">Your Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-perplexity-text-secondary text-sm">Name</h3>
                  <p className="text-perplexity-text-primary">{savedUserDetails.name}</p>
                </div>
                
                <div>
                  <h3 className="text-perplexity-text-secondary text-sm">Email</h3>
                  <p className="text-perplexity-text-primary">{savedUserDetails.email}</p>
                </div>
                
                <div>
                  <h3 className="text-perplexity-text-secondary text-sm">Age</h3>
                  <p className="text-perplexity-text-primary">{savedUserDetails.age}</p>
                </div>
                
                <div>
                  <h3 className="text-perplexity-text-secondary text-sm">Occupation</h3>
                  <p className="text-perplexity-text-primary">{savedUserDetails.occupation}</p>
                </div>
                
                {savedUserDetails.interests && savedUserDetails.interests.length > 0 && (
                  <div>
                    <h3 className="text-perplexity-text-secondary text-sm">Interests</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {savedUserDetails.interests.map((interest, index) => (
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
          )}
        </div>
      </main>
    </div>
  );
} 