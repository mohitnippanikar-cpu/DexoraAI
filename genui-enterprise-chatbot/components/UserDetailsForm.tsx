"use client";

import { useState, FormEvent } from 'react';

export interface UserDetails {
  name: string;
  email: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bloodType: string;
  occupation: string;
  allergies: string[];
  medicalConditions: string[];
  medications: string[];
  familyHistory: string[];
  lifestyle: {
    smoking: string;
    alcohol: string;
    exercise: string;
    diet: string;
  };
  interests: string[];
}

interface UserDetailsFormProps {
  onSubmit: (details: UserDetails) => void;
  initialData?: Partial<UserDetails>;
  isLoading?: boolean;
}

export default function UserDetailsForm({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false 
}: UserDetailsFormProps) {
  const [formData, setFormData] = useState<Partial<UserDetails>>({
    name: initialData.name || '',
    email: initialData.email || '',
    age: initialData.age || 0,
    gender: initialData.gender || '',
    height: initialData.height || 0,
    weight: initialData.weight || 0,
    bloodType: initialData.bloodType || '',
    occupation: initialData.occupation || '',
    allergies: initialData.allergies || [],
    medicalConditions: initialData.medicalConditions || [],
    medications: initialData.medications || [],
    familyHistory: initialData.familyHistory || [],
    lifestyle: initialData.lifestyle || {
      smoking: 'non_smoker',
      alcohol: 'none',
      exercise: 'moderate',
      diet: 'balanced'
    },
    interests: initialData.interests || [],
  });
  
  // Inputs for array fields
  const [interestInput, setInterestInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [conditionInput, setConditionInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');
  const [familyHistoryInput, setFamilyHistoryInput] = useState('');
  
  const [errors, setErrors] = useState<Partial<Record<keyof UserDetails | string, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested lifestyle properties
    if (name.startsWith('lifestyle.')) {
      const lifestyleProperty = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        lifestyle: {
          ...prev.lifestyle!,
          [lifestyleProperty]: value
        }
      }));
    } else {
      // Handle numeric fields
      if (name === 'age' || name === 'height' || name === 'weight') {
        setFormData(prev => ({
          ...prev,
          [name]: parseInt(value) || 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Generic function to add an item to an array field
  const addItemToArray = (field: keyof Pick<UserDetails, 'interests' | 'allergies' | 'medicalConditions' | 'medications' | 'familyHistory'>, value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
      setter('');
    }
  };

  // Generic function to remove an item from an array field
  const removeItemFromArray = (field: keyof Pick<UserDetails, 'interests' | 'allergies' | 'medicalConditions' | 'medications' | 'familyHistory'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    
    // Basic validation
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.occupation) newErrors.occupation = 'Occupation is required';
    if (formData.age !== undefined && formData.age <= 0) {
      newErrors.age = 'Please enter a valid age';
    }
    if (formData.height !== undefined && formData.height <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    if (formData.weight !== undefined && formData.weight <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData as UserDetails);
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

  return (
    <div className="bg-perplexity-background rounded-lg p-6 border border-perplexity-border w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-perplexity-text-primary mb-6">Comprehensive Health Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-perplexity-text-primary border-b border-perplexity-border pb-2">
              Personal Information
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-perplexity-text-secondary text-sm">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-perplexity-background-secondary border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary ${
                  errors.name ? 'border-red-500' : 'border-perplexity-border'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-perplexity-text-secondary text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-perplexity-background-secondary border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary ${
                  errors.email ? 'border-red-500' : 'border-perplexity-border'
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="age" className="block text-perplexity-text-secondary text-sm">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-perplexity-background-secondary border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary ${
                    errors.age ? 'border-red-500' : 'border-perplexity-border'
                  }`}
                  placeholder="Years"
                  disabled={isLoading}
                  min="1"
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-perplexity-text-secondary text-sm">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                  disabled={isLoading}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="occupation" className="block text-perplexity-text-secondary text-sm">
                Occupation
              </label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-perplexity-background-secondary border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary ${
                  errors.occupation ? 'border-red-500' : 'border-perplexity-border'
                }`}
                placeholder="Enter your occupation"
                disabled={isLoading}
              />
              {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation}</p>}
            </div>
          </div>
          
          {/* Physical Characteristics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-perplexity-text-primary border-b border-perplexity-border pb-2">
              Physical Characteristics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="height" className="block text-perplexity-text-secondary text-sm">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-perplexity-background-secondary border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary ${
                    errors.height ? 'border-red-500' : 'border-perplexity-border'
                  }`}
                  placeholder="Height in cm"
                  disabled={isLoading}
                  min="1"
                />
                {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="weight" className="block text-perplexity-text-secondary text-sm">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-perplexity-background-secondary border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary ${
                    errors.weight ? 'border-red-500' : 'border-perplexity-border'
                  }`}
                  placeholder="Weight in kg"
                  disabled={isLoading}
                  min="1"
                />
                {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bloodType" className="block text-perplexity-text-secondary text-sm">
                Blood Type
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={formData.bloodType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                disabled={isLoading}
              >
                <option value="">Select Blood Type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Lifestyle Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium text-perplexity-text-primary border-b border-perplexity-border pb-2">
            Lifestyle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="lifestyle.smoking" className="block text-perplexity-text-secondary text-sm">
                Smoking Habits
              </label>
              <select
                id="lifestyle.smoking"
                name="lifestyle.smoking"
                value={formData.lifestyle?.smoking}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                disabled={isLoading}
              >
                <option value="non_smoker">Non-smoker</option>
                <option value="former_smoker">Former smoker</option>
                <option value="light_smoker">Light smoker</option>
                <option value="regular_smoker">Regular smoker</option>
                <option value="heavy_smoker">Heavy smoker</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lifestyle.alcohol" className="block text-perplexity-text-secondary text-sm">
                Alcohol Consumption
              </label>
              <select
                id="lifestyle.alcohol"
                name="lifestyle.alcohol"
                value={formData.lifestyle?.alcohol}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                disabled={isLoading}
              >
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="moderate">Moderate</option>
                <option value="regular">Regular</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lifestyle.exercise" className="block text-perplexity-text-secondary text-sm">
                Exercise Frequency
              </label>
              <select
                id="lifestyle.exercise"
                name="lifestyle.exercise"
                value={formData.lifestyle?.exercise}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                disabled={isLoading}
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-4 days/week)</option>
                <option value="active">Active (5+ days/week)</option>
                <option value="very_active">Very active (daily intense)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="lifestyle.diet" className="block text-perplexity-text-secondary text-sm">
                Diet Type
              </label>
              <select
                id="lifestyle.diet"
                name="lifestyle.diet"
                value={formData.lifestyle?.diet}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                disabled={isLoading}
              >
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="keto">Ketogenic</option>
                <option value="paleo">Paleo</option>
                <option value="low_carb">Low-carb</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Medical History Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium text-perplexity-text-primary border-b border-perplexity-border pb-2">
            Medical History
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergies */}
            <div className="space-y-2">
              <label className="block text-perplexity-text-secondary text-sm">
                Allergies
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={(e) => setAllergyInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                  placeholder="Add an allergy"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => addItemToArray('allergies', allergyInput, setAllergyInput)}
                  disabled={isLoading || !allergyInput.trim()}
                  className="px-3 py-2 bg-perplexity-primary text-white rounded-md hover:bg-perplexity-primary/80 transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              
              {formData.allergies && formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergies.map((allergy, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-perplexity-background-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm text-perplexity-text-primary">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => removeItemFromArray('allergies', index)}
                        disabled={isLoading}
                        className="text-perplexity-text-secondary hover:text-perplexity-text-primary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Medical Conditions */}
            <div className="space-y-2">
              <label className="block text-perplexity-text-secondary text-sm">
                Medical Conditions
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conditionInput}
                  onChange={(e) => setConditionInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                  placeholder="Add a medical condition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => addItemToArray('medicalConditions', conditionInput, setConditionInput)}
                  disabled={isLoading || !conditionInput.trim()}
                  className="px-3 py-2 bg-perplexity-primary text-white rounded-md hover:bg-perplexity-primary/80 transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              
              {formData.medicalConditions && formData.medicalConditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medicalConditions.map((condition, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-perplexity-background-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm text-perplexity-text-primary">{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeItemFromArray('medicalConditions', index)}
                        disabled={isLoading}
                        className="text-perplexity-text-secondary hover:text-perplexity-text-primary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Current Medications */}
            <div className="space-y-2">
              <label className="block text-perplexity-text-secondary text-sm">
                Current Medications
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                  placeholder="Add a medication"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => addItemToArray('medications', medicationInput, setMedicationInput)}
                  disabled={isLoading || !medicationInput.trim()}
                  className="px-3 py-2 bg-perplexity-primary text-white rounded-md hover:bg-perplexity-primary/80 transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              
              {formData.medications && formData.medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medications.map((medication, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-perplexity-background-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm text-perplexity-text-primary">{medication}</span>
                      <button
                        type="button"
                        onClick={() => removeItemFromArray('medications', index)}
                        disabled={isLoading}
                        className="text-perplexity-text-secondary hover:text-perplexity-text-primary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Family History */}
            <div className="space-y-2">
              <label className="block text-perplexity-text-secondary text-sm">
                Family Medical History
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={familyHistoryInput}
                  onChange={(e) => setFamilyHistoryInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                  placeholder="Add family condition (e.g., Diabetes - Mother)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => addItemToArray('familyHistory', familyHistoryInput, setFamilyHistoryInput)}
                  disabled={isLoading || !familyHistoryInput.trim()}
                  className="px-3 py-2 bg-perplexity-primary text-white rounded-md hover:bg-perplexity-primary/80 transition disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              
              {formData.familyHistory && formData.familyHistory.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.familyHistory.map((history, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-1 bg-perplexity-background-secondary px-2 py-1 rounded-md"
                    >
                      <span className="text-sm text-perplexity-text-primary">{history}</span>
                      <button
                        type="button"
                        onClick={() => removeItemFromArray('familyHistory', index)}
                        disabled={isLoading}
                        className="text-perplexity-text-secondary hover:text-perplexity-text-primary"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Health Interests Section */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium text-perplexity-text-primary border-b border-perplexity-border pb-2">
            Health Interests & Concerns
          </h3>
          
          <div className="space-y-2">
            <label className="block text-perplexity-text-secondary text-sm">
              Health Topics of Interest
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-perplexity-background-secondary border border-perplexity-border rounded-md focus:outline-none focus:ring-1 focus:ring-perplexity-primary"
                placeholder="Add a health interest or concern"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => addItemToArray('interests', interestInput, setInterestInput)}
                disabled={isLoading || !interestInput.trim()}
                className="px-3 py-2 bg-perplexity-primary text-white rounded-md hover:bg-perplexity-primary/80 transition disabled:opacity-50"
              >
                Add
              </button>
            </div>
            
            {formData.interests && formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.interests.map((interest, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-1 bg-perplexity-background-secondary px-2 py-1 rounded-md"
                  >
                    <span className="text-sm text-perplexity-text-primary">{interest}</span>
                    <button
                      type="button"
                      onClick={() => removeItemFromArray('interests', index)}
                      disabled={isLoading}
                      className="text-perplexity-text-secondary hover:text-perplexity-text-primary"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-perplexity-primary text-white py-3 px-4 rounded-md hover:bg-perplexity-primary/80 transition disabled:opacity-50 flex justify-center items-center gap-2 text-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving Your Profile...</span>
              </>
            ) : (
              'Save Health Profile'
            )}
          </button>
          <p className="text-center text-perplexity-text-secondary text-xs mt-2">
            Your information is secure and will only be used to provide personalized health recommendations.
          </p>
        </div>
      </form>
    </div>
  );
} 