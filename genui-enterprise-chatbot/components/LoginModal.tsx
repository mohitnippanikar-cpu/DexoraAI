"use client";

import { useState } from 'react';

export interface UserProfile {
  department: 'Admin' | 'HR' | 'Engineering' | 'Finance';
  name: string;
  email: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

// Demo credentials for each department
const DEMO_CREDENTIALS = {
  Admin: {
    email: 'admin@dexora.ai',
    password: 'admin123',
    name: 'Alex Morgan',
    department: 'Admin' as const,
    icon: '⚙️',
    description: 'Full system access',
  },
  HR: {
    email: 'hr@dexora.ai',
    password: 'hr123',
    name: 'Sarah Johnson',
    department: 'HR' as const,
    icon: '👥',
    description: 'Human Resources',
  },
  Engineering: {
    email: 'eng@dexora.ai',
    password: 'eng123',
    name: 'David Chen',
    department: 'Engineering' as const,
    icon: '🔧',
    description: 'Technical team',
  },
  Finance: {
    email: 'finance@dexora.ai',
    password: 'finance123',
    name: 'Emily Rodriguez',
    department: 'Finance' as const,
    icon: '💰',
    description: 'Financial operations',
  },
};

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const handleQuickLogin = (dept: keyof typeof DEMO_CREDENTIALS) => {
    const credentials = DEMO_CREDENTIALS[dept];
    const userProfile = {
      department: credentials.department,
      name: credentials.name,
      email: credentials.email,
    };
    
    // Call onLogin first to update parent state
    onLogin(userProfile);
    
    // Close modal after a brief delay to ensure state is updated
    setTimeout(() => {
      onClose();
    }, 100);
  };

  if (!isOpen) return null;

  const departments = Object.keys(DEMO_CREDENTIALS) as Array<keyof typeof DEMO_CREDENTIALS>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-slate-700">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Sign In</h2>
            <p className="text-sm text-slate-400 mt-1">Choose your department to continue</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Body - Credential Cards */}
        <div className="p-6">
          <div className="space-y-3">
            {departments.map((dept) => {
              const cred = DEMO_CREDENTIALS[dept];
              
              return (
                <button
                  key={dept}
                  onClick={() => handleQuickLogin(dept)}
                  className="w-full p-4 rounded-xl border-2 border-slate-700 bg-slate-900/50 hover:border-primary hover:bg-slate-900 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {cred.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {cred.name}
                        </div>
                        <div className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                          {dept}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">{cred.description}</div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono">{cred.email}</span>
                        <span>•</span>
                        <span className="font-mono">{cred.password}</span>
                      </div>
                    </div>
                    <div className="text-slate-500 group-hover:text-primary transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-primary mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300 mb-1">Demo Mode</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click any credential card above to instantly sign in with demo access.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
