import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import LoginModal, { UserProfile } from '@/components/LoginModal';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  active?: boolean;
}

function NavItem({ href, icon, children, active }: NavItemProps) {
  return (
    <Link href={href} className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${active ? 'bg-primary/10 text-primary shadow-sm font-medium' : 'text-slate-400 hover:bg-slate-900 hover:text-white hover:shadow-sm'}`}>
      <span className="text-lg flex items-center justify-center w-6">{icon}</span>
      <span className="text-sm">{children}</span>
      {active && (
        <div className="ml-auto w-1 h-6 rounded-full bg-primary"></div>
      )}
    </Link>
  );
}

interface SidebarProps {
  activeNavItem?: string;
  onNewConversation?: () => void;
  user?: UserProfile | null;
  onUserChange?: (user: UserProfile | null) => void;
}

export default function Sidebar({ 
  activeNavItem = 'home',
  onNewConversation = () => {},
  user = null,
  onUserChange = () => {}
}: SidebarProps) {
  const [isProMode, setIsProMode] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogin = (userProfile: UserProfile) => {
    console.log('Login handler called with:', userProfile); // Debug log
    onUserChange(userProfile);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    console.log('Logout handler called'); // Debug log
    onUserChange(null);
  };

  // Debug log to see current user state
  useEffect(() => {
    console.log('Current user in Sidebar:', user);
  }, [user]);

  return (
    <div className="h-screen w-64 bg-slate-800 flex flex-col flex-shrink-0 border-r border-slate-700 shadow-lg">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-700">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14.5C8 16.9853 10.0147 19 12.5 19C14.9853 19 17 16.9853 17 14.5C17 12.0147 14.9853 10 12.5 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12.5 19C14.9853 19 17 16.9853 17 14.5C17 12.0147 14.9853 10 12.5 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12.5 10C12.5 7.51472 10.4853 5.5 8 5.5C5.51472 5.5 3.5 7.51472 3.5 10C3.5 12.4853 5.51472 14.5 8 14.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20.5 4.5V7.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 6H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-white">Dexora</span>
            <div className="text-xs text-slate-400">AI Enterprise Platform</div>
          </div>
        </Link>
      </div>

      {/* New Conversation Button */}
      <div className="px-4 mt-6 mb-6">
        <button 
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
          onClick={onNewConversation}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>New Conversation</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-4 mb-2">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3 pl-2">
          Menu
        </div>
      </div>
      <nav className="px-3 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
        <NavItem 
          href="/" 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>} 
          active={activeNavItem === 'home'}
        >
          AI Assistant
        </NavItem>
        <NavItem 
          href="/discover" 
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>} 
          active={activeNavItem === 'discover'}
        >
          Discover
        </NavItem>
      </nav>

      {/* Enterprise Upgrade Banner */}
      <div className="mt-auto px-4 pb-6 pt-3">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border border-primary/20 backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="font-medium text-white">Enterprise</div>
              <div className="text-xs text-slate-400">Unlock full potential</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            Access advanced AI models, custom workflows, and enterprise security.
          </p>
          <button className="text-xs w-full bg-gradient-to-r from-primary to-secondary text-white py-2 px-3 rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 font-medium">
            Upgrade Now
          </button>
        </div>
      </div>

     

      {/* User Profile / Login */}
      <div className="p-4 border-t border-slate-700">
        {user ? (
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">{user.department}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Login
          </button>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
} 