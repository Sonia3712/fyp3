import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Warehouse, 
  MessageSquare, 
  Search, 
  Bell, 
  User, 
  Menu, 
  X,
  LogOut,
  Settings,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info,
  Save,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Globe,
  Shield,
  Palette,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Building,
  Package,
  RefreshCw,
  Smartphone
} from 'lucide-react';

const TopNavbar = ({ activeTab, setActiveTab, user, onSignOut }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  
  // WebSocket connection state
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // Settings state
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: 'english',
    notifications: true,
    sounds: true,
    autoSave: true,
    twoFactorAuth: false
  });

  // Real-time notifications from WebSocket
  const [notifications, setNotifications] = useState([]);
  
  // Auto save interval reference
  const autoSaveIntervalRef = useRef(null);

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Apply theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
    
    // Load other settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(prev => ({
        ...prev,
        ...JSON.parse(savedSettings)
      }));
    }
  }, []);

  // Function to handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
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
    
    // Update settings
    setSettings(prev => ({
      ...prev,
      theme: newTheme
    }));
    
    // Play sound if enabled
    if (settings.sounds) {
      playSound('click');
    }
  };

  // Function to play sounds
  const playSound = (soundType) => {
    if (!settings.sounds) return;
    
    try {
      let soundFile;
      switch(soundType) {
        case 'notification':
          soundFile = '/sounds/notification.mp3';
          break;
        case 'success':
          soundFile = '/sounds/success.mp3';
          break;
        case 'click':
          soundFile = '/sounds/click.mp3';
          break;
        case 'error':
          soundFile = '/sounds/error.mp3';
          break;
        default:
          soundFile = '/sounds/click.mp3';
      }
      
      const audio = new Audio(soundFile);
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Sound play failed:', e));
    } catch (error) {
      console.log('Sound error:', error);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = 'ws://localhost:8000/ws/dashboard';
        const websocket = new WebSocket(wsUrl);
        
        websocket.onopen = () => {
          console.log('✅ WebSocket connected to dashboard');
          setIsConnected(true);
        };

        websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle activity notifications
            if (data.type === 'activity') {
              addRealTimeNotification(data.data);
            }
            
            // Handle initial data
            if (data.type === 'initial_data') {
              console.log('📊 Initial dashboard data received');
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        websocket.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
        };

        websocket.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          setIsConnected(false);
          // Try to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };

        setWs(websocket);
      } catch (error) {
        console.error('❌ Error connecting to WebSocket:', error);
      }
    };

    // Connect to WebSocket
    connectWebSocket();

    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  // Start auto save functionality
  const startAutoSave = () => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }
    
    if (settings.autoSave) {
      autoSaveIntervalRef.current = setInterval(() => {
        console.log('Auto saving data...');
        
        // Save data to localStorage (you can modify this for API calls)
        const dataToSave = {
          timestamp: new Date().toISOString(),
          activeTab: activeTab,
          lastSaved: Date.now()
        };
        
        localStorage.setItem('autoSaveData', JSON.stringify(dataToSave));
        
        // Show auto save notification
        if (settings.notifications) {
          addRealTimeNotification({
            type: 'auto_save',
            details: { savedAt: new Date().toLocaleTimeString() }
          });
        }
      }, 30000); // Save every 30 seconds
    }
  };

  // Initialize auto save
  useEffect(() => {
    startAutoSave();
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [settings.autoSave]);

  // Function to add real-time notification
  const addRealTimeNotification = (activityData) => {
    const activityType = activityData.type;
    const details = activityData.details || {};
    const userName = activityData.user_name || 'System';
    const timestamp = activityData.timestamp ? new Date(activityData.timestamp) : new Date();
    
    let notification = {
      id: Date.now() + Math.random(),
      type: 'info',
      title: '',
      message: '',
      time: formatTimeAgo(timestamp),
      timestamp: timestamp,
      read: false,
      activityType: activityType,
      details: details
    };

    // Set notification content based on activity type
    switch (activityType) {
      case 'user_registered':
        notification.type = 'success';
        notification.title = 'New User Registration';
        notification.message = `${userName} just registered as ${details.role || 'user'}`;
        break;
        
      case 'user_login':
        notification.type = 'info';
        notification.title = 'User Login';
        notification.message = `${userName} logged into the system`;
        break;
        
      case 'hospital_added':
        notification.type = 'success';
        notification.title = 'New Hospital Added';
        notification.message = `Hospital "${details.hospital_name || 'Unknown'}" has been added`;
        break;
        
      case 'slaughterhouse_added':
        notification.type = 'success';
        notification.title = 'New Slaughterhouse Added';
        notification.message = `Slaughterhouse "${details.slaughterhouse_name || 'Unknown'}" has been added`;
        break;
        
      case 'feedback_submitted':
        notification.type = 'info';
        notification.title = 'New Feedback';
        notification.message = `Feedback submitted for ${details.target_name || 'Unknown'}`;
        break;
        
      case 'user_updated':
        notification.type = 'info';
        notification.title = 'Profile Updated';
        notification.message = `${userName}'s profile has been updated`;
        break;
        
      case 'user_deleted':
        notification.type = 'warning';
        notification.title = 'Account Deleted';
        notification.message = `${details.deleted_user || 'User'} account has been deleted`;
        break;
        
      case 'auto_save':
        notification.type = 'info';
        notification.title = 'Auto Save Complete';
        notification.message = `Data automatically saved at ${details.savedAt}`;
        break;
        
      default:
        notification.type = 'info';
        notification.title = 'System Activity';
        notification.message = 'New activity detected on the platform';
    }

    // Add notification sound if enabled
    if (settings.notifications && settings.sounds) {
      playSound('notification');
    }

    // Add notification to the beginning of the list
    setNotifications(prev => [notification, ...prev.slice(0, 19)]); // Keep only last 20
  };

  // Function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  // Mock search results data
  const searchResults = {
    users: [
      { id: 1, name: 'Ali Ahmed', type: 'Farmer', email: 'ali.ahmed@email.com' },
      { id: 2, name: 'Dr. Sara Khan', type: 'Veterinarian', email: 'sara.khan@email.com' }
    ],
    hospitals: [
      { id: 1, name: 'City Veterinary Hospital', location: 'Faisalabad' },
      { id: 2, name: 'Animal Care Center', location: 'Lahore' }
    ],
    slaughterhouses: [
      { id: 1, name: 'Al-Madina Halal Meats', location: 'Faisalabad' },
      { id: 2, name: 'Fresh Quality Meats', location: 'Lahore' }
    ]
  };

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      emoji: '📊',
      line1: 'Dashboard', 
      line2: '',
      activeColor: 'text-primary',
      inactiveColor: 'text-blue-500',
      iconColor: 'text-blue-500'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      emoji: '👥',
      line1: 'User', 
      line2: 'Management',
      activeColor: 'text-primary',
      inactiveColor: 'text-green-500',
      iconColor: 'text-green-500'
    },
    { 
      id: 'hospitals', 
      label: 'Hospital Management', 
      icon: Building2, 
      emoji: '🏥',
      line1: 'Hospital', 
      line2: 'Management',
      activeColor: 'text-primary',
      inactiveColor: 'text-red-500',
      iconColor: 'text-red-500'
    },
    { 
      id: 'slaughterhouses', 
      label: 'Slaughterhouse Management', 
      icon: Warehouse, 
      emoji: '🏭',
      line1: 'Slaughterhouse', 
      line2: 'Management',
      activeColor: 'text-primary',
      inactiveColor: 'text-orange-500',
      iconColor: 'text-orange-500'
    },
    { 
      id: 'feedback', 
      label: 'Feedback Management', 
      icon: MessageSquare, 
      emoji: '💬',
      line1: 'Feedback', 
      line2: 'Management',
      activeColor: 'text-primary',
      inactiveColor: 'text-purple-500',
      iconColor: 'text-purple-500'
    },
  ];

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  const handleSearchResultClick = (type, id) => {
    setSearchQuery('');
    setShowSearchResults(false);
    // Play click sound
    if (settings.sounds) {
      playSound('click');
    }
    // Navigate to the appropriate section based on type
    switch (type) {
      case 'users':
        setActiveTab('users');
        break;
      case 'hospitals':
        setActiveTab('hospitals');
        break;
      case 'slaughterhouses':
        setActiveTab('slaughterhouses');
        break;
      default:
        break;
    }
  };

  // Handle notification actions
  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleClearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  // Handle user profile actions
  const handleSettings = () => {
    setIsProfileDropdownOpen(false);
    setShowSettingsModal(true);
  };

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
    if (window.confirm('Are you sure you want to sign out?')) {
      console.log('Signing out...');
      // Clear auto save interval
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      // Call the onSignOut prop to handle the sign out and redirect to landing page
      if (onSignOut) {
        onSignOut();
      }
    }
  };

  // Handle settings changes
  const handleSettingsChange = (key, value) => {
    // Play sound for toggle changes
    if (key === 'sounds' && value === true) {
      playSound('click');
    }
    
    if (key === 'theme') {
      handleThemeChange(value);
    } else if (key === 'twoFactorAuth' && value === true) {
      // Show 2FA setup modal
      setShow2FAModal(true);
    } else if (key === 'autoSave') {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      // Start or stop auto save
      startAutoSave();
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      // Play success sound
      if (settings.sounds) {
        playSound('success');
      }
      
      // Save to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply theme changes
      if (settings.theme !== theme) {
        handleThemeChange(settings.theme);
      }
      
      // Restart auto save if needed
      startAutoSave();
      
      console.log('Settings saved:', settings);
      setShowSettingsModal(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  // Handle 2FA setup
 
const handle2FASetup = async () => {
  try {
    console.log('Starting 2FA setup...');
    
    // Get verification code from input
    const verificationCodeInput = document.querySelector('input[placeholder="Enter 6-digit code"]');
    const verificationCode = verificationCodeInput ? verificationCodeInput.value : null;
    
    // If verification code is required but not provided
    if (!verificationCode || verificationCode.length !== 6) {
      alert('Please enter a valid 6-digit verification code');
      return;
    }
    
    // CORRECT ENDPOINT with proper credentials
    const response = await fetch('/api/user/two-factor-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // IMPORTANT: Send cookies/session
      body: JSON.stringify({ 
        token: verificationCode // Send verification code
      })
    });
    
    console.log('Response status:', response.status);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned non-JSON response');
    }
    
    // Parse JSON response
    const data = await response.json();
    console.log('2FA setup response:', data);
    
    if (response.ok) {
      // Settings update karo
      handleSettingsChange('twoFactorAuth', true);
      setShow2FAModal(false);
      
      // Success alert
      if (settings.sounds) {
        playSound('success');
      }
      
      alert('Two-Factor Authentication has been enabled successfully!');
      
      // Refresh page or update state as needed
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      throw new Error(data.detail || data.message || data.error || '2FA setup failed');
    }
  } catch (error) {
    console.error('2FA setup error:', error);
    
    // Play error sound if enabled
    if (settings.sounds) {
      playSound('error');
    }
    
    alert(error.message || 'Failed to setup 2FA. Please try again.');
    
    // Reset 2FA toggle on error
    handleSettingsChange('twoFactorAuth', false);
  }
};
  // Get notification icon based on type and activity
  const getNotificationIcon = (notification) => {
    const { type, activityType, details } = notification;
    
    // Special icons for specific activities
    if (activityType === 'user_registered') {
      return <UserPlus className="h-4 w-4 text-green-500" />;
    } else if (activityType === 'hospital_added') {
      return <Building className="h-4 w-4 text-blue-500" />;
    } else if (activityType === 'slaughterhouse_added') {
      return <Package className="h-4 w-4 text-orange-500" />;
    } else if (activityType === 'user_updated') {
      return <Edit className="h-4 w-4 text-purple-500" />;
    } else if (activityType === 'user_deleted') {
      return <Trash2 className="h-4 w-4 text-red-500" />;
    } else if (activityType === 'auto_save') {
      return <Save className="h-4 w-4 text-blue-500" />;
    }
    
    // Default icons by notification type
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get notification badge color
  const getNotificationBadgeColor = (notification) => {
    const { activityType } = notification;
    
    if (activityType === 'user_registered') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (activityType === 'hospital_added') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (activityType === 'slaughterhouse_added') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (activityType === 'user_deleted') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (activityType === 'auto_save') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-6">
          {/* First Row - Logo, Title, Navigation Tabs, and User Profile */}
          <div className="flex items-center justify-between py-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              {/* Floating Logo Card */}
              <div className="relative">
                <div className="w-14 h-14 bg-card rounded-2xl shadow-lg border border-border flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
                  <img 
                    src="/logo1.png" 
                    alt="LivestockSync Logo" 
                    className="w-8 h-8 object-contain relative z-10"
                  />
                </div>
                {/* Soft Shadow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-md opacity-50 -z-10"></div>
              </div>

              {/* Brand Text - Updated with gradient */}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LivestockSync
                </h1>
                <p className="text-sm text-muted-foreground">Digital Farming Revolution</p>
              </div>
            </div>

            {/* Pill-Shaped Navigation Container - Perfectly centered */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <div className="bg-card border border-border rounded-2xl shadow-lg px-6 py-3">
                <div className="flex gap-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-w-[85px] ${
                          isActive
                            ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md scale-105'
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {isActive ? (
                            <Icon className={`h-4 w-4 text-primary-foreground`} />
                          ) : (
                            <>
                              <span className="text-base">{item.emoji}</span>
                              <Icon className={`h-4 w-4 ${item.iconColor}`} />
                            </>
                          )}
                        </div>
                        <span className="text-xs font-semibold leading-tight">{item.line1}</span>
                        {item.line2 && <span className="text-xs font-semibold leading-tight">{item.line2}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* User Profile and Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* WebSocket Connection Status */}
              <div className="hidden md:flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="text-muted-foreground">
                  {isConnected ? 'Live' : 'Offline'}
                </span>
              </div>

              {/* Auto Save Status */}
              {settings.autoSave && (
                <div className="hidden md:flex items-center gap-1 text-xs">
                  <div className={`w-2 h-2 rounded-full ${settings.autoSave ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                  <span className="text-muted-foreground">
                    Auto Save {settings.autoSave ? 'On' : 'Off'}
                  </span>
                </div>
              )}

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                  className="relative p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-destructive text-primary-foreground text-xs rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Real-time Notifications</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs text-muted-foreground">
                            {isConnected ? 'Connected to real-time updates' : 'Offline - updates paused'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {unreadCount > 0 && (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                        <button 
                          onClick={handleClearAllNotifications}
                          className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 border-b border-border hover:bg-accent transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification)}
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-base font-medium text-foreground">
                                    {notification.title}
                                  </p>
                                  {notification.activityType && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${getNotificationBadgeColor(notification)}`}>
                                      {notification.activityType.replace('_', ' ')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                {notification.details && Object.keys(notification.details).length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {Object.entries(notification.details).map(([key, value]) => (
                                      <span key={key} className="text-xs px-2 py-1 bg-muted rounded">
                                        {key}: {value}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-base text-muted-foreground">No notifications yet</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Real-time notifications will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <p className="text-base font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setActiveTab('profile');
                          setIsProfileDropdownOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <User className="h-4 w-4 mr-3" />
                        Profile Settings
                       </button>
                      <button 
                        onClick={handleSettings}
                        className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Search Bar - Centered below tabs */}
          <div className="hidden lg:flex justify-center py-4 relative">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search across platform..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3">
                    {/* Users Results */}
                    {searchResults.users.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Users</h4>
                        {searchResults.users.map(user => (
                          <button
                            key={user.id}
                            onClick={() => handleSearchResultClick('users', user.id)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <User className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.type} • {user.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Hospitals Results */}
                    {searchResults.hospitals.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Hospitals</h4>
                        {searchResults.hospitals.map(hospital => (
                          <button
                            key={hospital.id}
                            onClick={() => handleSearchResultClick('hospitals', hospital.id)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <Building2 className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{hospital.name}</p>
                              <p className="text-xs text-muted-foreground">{hospital.location}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Slaughterhouses Results */}
                    {searchResults.slaughterhouses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Slaughterhouses</h4>
                        {searchResults.slaughterhouses.map(sh => (
                          <button
                            key={sh.id}
                            onClick={() => handleSearchResultClick('slaughterhouses', sh.id)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <Warehouse className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{sh.name}</p>
                              <p className="text-xs text-muted-foreground">{sh.location}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="pb-4 lg:hidden relative">
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search across platform..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
                />
                
                {/* Mobile Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3">
                      {/* Similar search results structure as desktop */}
                      {searchResults.users.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Users</h4>
                          {searchResults.users.map(user => (
                            <button
                              key={user.id}
                              onClick={() => handleSearchResultClick('users', user.id)}
                              className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                            >
                              <User className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.type}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                      if (settings.sounds) {
                        playSound('click');
                      }
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isActive ? (
                        <Icon className={`h-5 w-5 text-primary-foreground`} />
                      ) : (
                        <>
                          <span className="text-lg">{item.emoji}</span>
                          <Icon className={`h-5 w-5 ${item.iconColor}`} />
                        </>
                      )}
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              </div>
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  if (settings.sounds) {
                    playSound('click');
                  }
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Appearance
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Light Theme Option */}
                  <button
                    onClick={() => handleSettingsChange('theme', 'light')}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all relative ${
                      settings.theme === 'light' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center">
                      <Sun className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Light</p>
                      <p className="text-xs text-muted-foreground mt-1">Bright theme</p>
                    </div>
                    {settings.theme === 'light' && (
                      <CheckCircle className="h-5 w-5 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                  
                  {/* Dark Theme Option */}
                  <button
                    onClick={() => handleSettingsChange('theme', 'dark')}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all relative ${
                      settings.theme === 'dark' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-900 border border-border rounded-lg flex items-center justify-center">
                      <Moon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Dark</p>
                      <p className="text-xs text-muted-foreground mt-1">Dark theme</p>
                    </div>
                    {settings.theme === 'dark' && (
                      <CheckCircle className="h-5 w-5 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                  
                  {/* Auto Theme Option */}
                  <button
                    onClick={() => handleSettingsChange('theme', 'auto')}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-3 transition-all relative ${
                      settings.theme === 'auto' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-900 border border-border rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-purple-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Auto</p>
                      <p className="text-xs text-muted-foreground mt-1">System default</p>
                    </div>
                    {settings.theme === 'auto' && (
                      <CheckCircle className="h-5 w-5 text-primary absolute top-3 right-3" />
                    )}
                  </button>
                </div>

                {/* Language Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingsChange('language', e.target.value)}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="english">🇬🇧 English</option>
                    <option value="urdu">🇵🇰 Urdu</option>
                    <option value="spanish">🇪🇸 Spanish</option>
                    <option value="arabic">🇸🇦 Arabic</option>
                    <option value="french">🇫🇷 French</option>
                  </select>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-base font-medium text-foreground">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive real-time notifications</p>
                    </div>
                    <button
                      onClick={() => handleSettingsChange('notifications', !settings.notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-base font-medium text-foreground">Sound Effects</p>
                      <p className="text-sm text-muted-foreground">Play sounds for notifications</p>
                      <div className="flex items-center gap-2 mt-1">
                        {settings.sounds ? (
                          <Volume2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {settings.sounds ? 'Sounds enabled' : 'Sounds muted'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingsChange('sounds', !settings.sounds)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.sounds ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.sounds ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-base font-medium text-foreground">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Smartphone className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground">
                          {settings.twoFactorAuth ? 'Enabled - Use Google Authenticator' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingsChange('twoFactorAuth', !settings.twoFactorAuth)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.twoFactorAuth ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-base font-medium text-foreground">Auto Save</p>
                      <p className="text-sm text-muted-foreground">Automatically save changes every 30 seconds</p>
                      <div className="flex items-center gap-2 mt-1">
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                        <span className="text-xs text-muted-foreground">
                          {settings.autoSave ? 'Saves automatically' : 'Manual save only'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingsChange('autoSave', !settings.autoSave)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.autoSave ? 'bg-primary' : 'bg-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-border bg-muted/20">
              <button
                onClick={() => {
                  // Reset to default settings
                  const defaultSettings = {
                    theme: 'light',
                    language: 'english',
                    notifications: true,
                    sounds: true,
                    autoSave: true,
                    twoFactorAuth: false
                  };
                  setSettings(defaultSettings);
                  handleThemeChange('light');
                  if (settings.sounds) {
                    playSound('click');
                  }
                }}
                className="px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors text-base flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Default
              </button>
              
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  if (settings.sounds) {
                    playSound('click');
                  }
                }}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors text-base"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 text-base"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Setup Two-Factor Authentication</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Scan the QR code with Google Authenticator or Authy app
              </p>
            </div>
            
            <div className="p-6">
              {/* QR Code Placeholder */}
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="h-12 w-12 text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">QR Code Placeholder</p>
                    <p className="text-xs text-muted-foreground mt-1">Scan with Authenticator app</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Secret Key:</p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">JBSWY3DPEHPK3PXP</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter this code manually if you can't scan the QR code
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm font-medium text-foreground">Verification Code:</p>
                  <input
  type="text"
  placeholder="Enter 6-digit code"
  className="w-full mt-2 p-2 border border-border rounded-lg bg-background text-center text-lg font-mono"
  maxLength="6"
  pattern="[0-9]*"
  inputMode="numeric"
  onChange={(e) => {
    // Allow only numbers
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  }}
/>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setShow2FAModal(false);
                  handleSettingsChange('twoFactorAuth', false);
                }}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handle2FASetup}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Verify & Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Backdrop for dropdowns and modals */}
      {(isProfileDropdownOpen || isNotificationDropdownOpen || showSearchResults || showSettingsModal || show2FAModal) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsNotificationDropdownOpen(false);
            setShowSearchResults(false);
            setShowSettingsModal(false);
            setShow2FAModal(false);
          }}
        />
      )}
    </>
  );
}; 

export default TopNavbar;