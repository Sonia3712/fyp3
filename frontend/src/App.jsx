// App.jsx - Updated with Theme Management
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TopNavbar from './components/TopNavbar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import HospitalManagement from './components/HospitalManagement';
import SlaughterhouseManagement from './components/SlaughterhouseManagement';
import FeedbackManagement from './components/FeedbackManagement';
import Footer from './components/Footer';
import ProfileSettings from './components/ProfileSettings';

// Import Hospital and Slaughterhouse Portal components
import HospitalPortal from './components/HospitalPortal/HospitalPortal';
import SlaughterhousePortal from './components/SlaughterhousePortal/SlaughterhousePortal';

function App() {
   
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme state for global theme management
  const [theme, setTheme] = useState(() => {
    // Load theme from localStorage or default to 'light'
    return localStorage.getItem('livestocksync_theme') || 'light';
  });

  // Apply theme on component mount and when theme changes
  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('livestocksync_theme') || 'light';
    setTheme(savedTheme);
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Listen for system theme changes if auto mode is selected
    if (savedTheme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Check for existing session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('livestocksync_user');
    const savedRole = localStorage.getItem('livestocksync_role');
    
    if (savedUser && savedRole) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        setActiveTab(savedRole === 'admin' ? 'dashboard' : 'portal');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Clear invalid data
        localStorage.removeItem('livestocksync_user');
        localStorage.removeItem('livestocksync_role');
      }
    }
    setIsLoading(false);
  }, []);

  // Function to change theme globally
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('livestocksync_theme', newTheme);
    
    // Apply theme immediately
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (newTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleLogin = (userData, role) => {
    setUser(userData);
    setIsLoggedIn(true);
    setActiveTab(role === 'admin' ? 'dashboard' : 'portal');
    
    // Save user data
    localStorage.setItem('livestocksync_user', JSON.stringify(userData));
    localStorage.setItem('livestocksync_role', role);
  };

  const handleSignOut = () => {
    localStorage.removeItem('livestocksync_user');
    localStorage.removeItem('livestocksync_role');
    setUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  // Render content based on role
  const renderAdminContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard theme={theme} />;
      case 'users':
        return <UserManagement theme={theme} />;
      case 'hospitals':
        return <HospitalManagement theme={theme} />;
      case 'slaughterhouses':
        return <SlaughterhouseManagement theme={theme} />;
      case 'feedback':
        return <FeedbackManagement theme={theme} />;
      case 'profile':
        return <ProfileSettings theme={theme} />;
      default:
        return <Dashboard theme={theme} />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-foreground dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Determine which portal to show based on user role
  const userRole = user?.role || 'admin';
  
  if (userRole === 'hospital') {
    return <HospitalPortal user={user} onSignOut={handleSignOut} theme={theme} onThemeChange={handleThemeChange} />;
  }
  
  if (userRole === 'slaughterhouse') {
    return <SlaughterhousePortal user={user} onSignOut={handleSignOut} theme={theme} onThemeChange={handleThemeChange} />;
  }

  // Show admin dashboard if logged in as admin
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground dark:text-gray-300 flex flex-col transition-colors duration-300">
      <TopNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onSignOut={handleSignOut}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      
      {/* Main Content */}
      <main className="flex-1 max-w-8xl mx-auto w-full py-8 px-6 transition-colors duration-300">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mt-3 text-lg">
            Manage your livestock platform efficiently and effectively
          </p>
        </div>

        {/* Page Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {renderAdminContent()}
        </div>
      </main>

      {/* Footer */}
      <Footer theme={theme} />
    </div>
  );
}

export default App;