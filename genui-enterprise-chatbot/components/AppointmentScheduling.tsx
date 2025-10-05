"use client";

import { useState } from 'react';

export interface AppointmentData {
  doctorType: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  contactMethod: 'phone' | 'email';
  contactInfo: string;
}

export default function AppointmentScheduling() {
  const [formData, setFormData] = useState<AppointmentData>({
    doctorType: '',
    preferredDate: '',
    preferredTime: '',
    reason: '',
    urgency: 'medium',
    contactMethod: 'email',
    contactInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const doctorTypes = [
    'General Practitioner',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedist',
    'Pediatrician',
    'Psychiatrist',
    'Ophthalmologist',
    'Gynecologist',
    'Dentist',
    'Other'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorType || !formData.preferredDate || !formData.reason || !formData.contactInfo) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically send to your backend API
      console.log('Scheduling appointment:', formData);
      
      // Mock API call for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 5000);
      // Reset form
      setFormData({
        doctorType: '',
        preferredDate: '',
        preferredTime: '',
        reason: '',
        urgency: 'medium',
        contactMethod: 'email',
        contactInfo: ''
      });
    } catch (error) {
      console.error('Error scheduling appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AppointmentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showConfirmation) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-green-600 text-xl">✅</span>
          <h3 className="text-green-800 text-lg font-semibold">Appointment Request Submitted!</h3>
        </div>
        <p className="text-green-700 mb-3">
          Your appointment request has been submitted successfully. We&apos;ll contact you shortly to confirm the details.
        </p>
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <p className="text-green-600 text-sm">
            <strong>Doctor:</strong> {formData.doctorType}<br/>
            <strong>Preferred Date:</strong> {formData.preferredDate}<br/>
            <strong>Contact:</strong> {formData.contactInfo}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-perplexity-background-secondary/40 border border-perplexity-border rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-perplexity-text-primary text-lg font-semibold mb-4">📅 Schedule an Appointment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Doctor Type */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            Type of Doctor/Specialist *
          </label>
          <select
            value={formData.doctorType}
            onChange={(e) => handleInputChange('doctorType', e.target.value)}
            className="w-full p-3 rounded-lg border border-perplexity-border bg-perplexity-background text-perplexity-text-primary focus:outline-none focus:ring-2 focus:ring-perplexity-primary"
            required
          >
            <option value="">Select a doctor type</option>
            {doctorTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            Preferred Date *
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => handleInputChange('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-3 rounded-lg border border-perplexity-border bg-perplexity-background text-perplexity-text-primary focus:outline-none focus:ring-2 focus:ring-perplexity-primary"
            required
          />
        </div>

        {/* Preferred Time */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            Preferred Time (Optional)
          </label>
          <select
            value={formData.preferredTime}
            onChange={(e) => handleInputChange('preferredTime', e.target.value)}
            className="w-full p-3 rounded-lg border border-perplexity-border bg-perplexity-background text-perplexity-text-primary focus:outline-none focus:ring-2 focus:ring-perplexity-primary"
          >
            <option value="">Any time available</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {/* Reason for Visit */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            Reason for Visit *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            placeholder="Please describe your symptoms or reason for the visit..."
            className="w-full p-3 rounded-lg border border-perplexity-border bg-perplexity-background text-perplexity-text-primary focus:outline-none focus:ring-2 focus:ring-perplexity-primary"
            rows={3}
            required
          />
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            Urgency Level
          </label>
          <div className="flex space-x-4">
            {(['low', 'medium', 'high'] as const).map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="radio"
                  name="urgency"
                  value={level}
                  checked={formData.urgency === level}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="mr-2 text-perplexity-primary focus:ring-perplexity-primary"
                />
                <span className={`text-sm capitalize ${
                  level === 'high' ? 'text-red-600' : 
                  level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Contact Method */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            Preferred Contact Method
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={formData.contactMethod === 'email'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                className="mr-2 text-perplexity-primary focus:ring-perplexity-primary"
              />
              <span className="text-sm text-perplexity-text-primary">Email</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={formData.contactMethod === 'phone'}
                onChange={(e) => handleInputChange('contactMethod', e.target.value)}
                className="mr-2 text-perplexity-primary focus:ring-perplexity-primary"
              />
              <span className="text-sm text-perplexity-text-primary">Phone</span>
            </label>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-perplexity-text-primary mb-2">
            {formData.contactMethod === 'email' ? 'Email Address' : 'Phone Number'} *
          </label>
          <input
            type={formData.contactMethod === 'email' ? 'email' : 'tel'}
            value={formData.contactInfo}
            onChange={(e) => handleInputChange('contactInfo', e.target.value)}
            placeholder={formData.contactMethod === 'email' ? 'your@email.com' : '+1 (555) 123-4567'}
            className="w-full p-3 rounded-lg border border-perplexity-border bg-perplexity-background text-perplexity-text-primary focus:outline-none focus:ring-2 focus:ring-perplexity-primary"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-perplexity-primary hover:bg-perplexity-primary/90'
          } text-white focus:outline-none focus:ring-2 focus:ring-perplexity-primary`}
        >
          {isSubmitting ? 'Submitting...' : 'Schedule Appointment'}
        </button>
      </form>

        <div className="mt-4 text-xs text-perplexity-text-secondary">
        <p>* Required fields</p>
        <p>We&apos;ll contact you within 24 hours to confirm your appointment details.</p>
      </div>
    </div>
  );
}
