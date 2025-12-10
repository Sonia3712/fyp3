// components/SlaughterhousePortal/SlaughterhousePortal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Package, 
  Settings, 
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Scale,
  BarChart3,
  Eye,
  Activity,
  ArrowUp,
  CheckCircle,
  AlertCircle,
  Info,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import Footer from '../Footer';

const SlaughterhousePortal = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddTimeSlotModal, setShowAddTimeSlotModal] = useState(false);
  const [showBookingDetailModal, setShowBookingDetailModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Initial mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'New Booking Received',
      message: 'Ali Ahmed booked a cow for processing',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Time Slot Filling Up',
      message: 'Only 3 slots available for tomorrow',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New features have been deployed to the slaughterhouse portal',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Payment Received',
      message: 'PKR 25,000 received from Usman Farooq',
      time: '2 hours ago',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    workingHours: '6:00 AM - 10:00 PM'
  });

  // Mock data for stats with color scheme
  const [stats, setStats] = useState([
    {
      title: "Today's Bookings",
      value: '5',
      icon: Calendar,
      change: '+18%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'Animals scheduled'
    },
    {
      title: 'Processing',
      value: '3',
      icon: Package,
      change: '+8%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'In progress'
    },
    {
      title: 'Revenue Today',
      value: 'PKR 85,000',
      icon: DollarSign,
      change: '+22%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'Total earnings'
    },
    {
      title: 'Available Slots',
      value: '12',
      icon: Clock,
      change: '-5%',
      trend: 'down',
      color: 'from-primary to-accent',
      description: 'Open for booking'
    }
  ]);

  // State for bookings with full CRUD functionality
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: 'Ali Ahmed',
      customerEmail: 'ali.ahmed@email.com',
      customerPhone: '+92 300 1234567',
      animalType: 'Cow',
      animalBreed: 'Sahiwal',
      animalAge: '4 years',
      weight: '450 kg',
      bookingDate: '2024-01-25',
      timeSlot: '10:00 AM - 12:00 PM',
      status: 'Confirmed',
      price: 'PKR 25,000',
      notes: 'Special handling required',
      paymentStatus: 'Paid',
      processingType: 'Full Processing'
    },
    {
      id: 2,
      customerName: 'Usman Farooq',
      customerEmail: 'usman.farooq@email.com',
      customerPhone: '+92 300 7654321',
      animalType: 'Buffalo',
      animalBreed: 'Nili-Ravi',
      animalAge: '5 years',
      weight: '650 kg',
      bookingDate: '2024-01-24',
      timeSlot: '2:00 PM - 3:00 PM',
      status: 'Processing',
      price: 'PKR 35,000',
      notes: 'Regular processing',
      paymentStatus: 'Paid',
      processingType: 'Standard'
    },
    {
      id: 3,
      customerName: 'Sonia Jalal',
      customerEmail: 'sonia.jalal@email.com',
      customerPhone: '+92 300 1122334',
      animalType: 'Cow',
      animalBreed: 'Red Sindhi',
      animalAge: '3 years',
      weight: '380 kg',
      bookingDate: '2024-01-26',
      timeSlot: '11:00 AM - 12:00 PM',
      status: 'Pending',
      price: 'PKR 22,000',
      notes: 'Urgent processing needed',
      paymentStatus: 'Pending',
      processingType: 'Quick Processing'
    }
  ]);

  // State for time slots with full CRUD functionality
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, time: '9:00 AM - 10:00 AM', available: true, price: 'PKR 3,000', maxCapacity: 2 },
    { id: 2, time: '10:00 AM - 11:00 AM', available: false, price: 'PKR 3,500', maxCapacity: 2 },
    { id: 3, time: '11:00 AM - 12:00 PM', available: true, price: 'PKR 3,000', maxCapacity: 2 },
    { id: 4, time: '1:00 PM - 2:00 PM', available: true, price: 'PKR 2,500', maxCapacity: 3 },
    { id: 5, time: '2:00 PM - 3:00 PM', available: false, price: 'PKR 3,000', maxCapacity: 2 },
    { id: 6, time: '3:00 PM - 4:00 PM', available: true, price: 'PKR 2,500', maxCapacity: 3 }
  ]);

  // Form state for new booking
  const [newBooking, setNewBooking] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    animalType: '',
    animalBreed: '',
    animalAge: '',
    weight: '',
    bookingDate: '',
    timeSlot: '',
    status: 'Pending',
    price: '',
    notes: '',
    paymentStatus: 'Pending',
    processingType: 'Standard'
  });

  // Form state for new time slot
  const [newTimeSlot, setNewTimeSlot] = useState({
    time: '',
    available: true,
    price: '',
    maxCapacity: '2'
  });

  // Filtered bookings based on search and filter
  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState(timeSlots);

  const slaughterhouseMenuItems = [
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
      id: 'bookings', 
      label: 'Bookings', 
      icon: Calendar, 
      emoji: '📅',
      line1: 'Bookings', 
      line2: '',
      activeColor: 'text-primary',
      inactiveColor: 'text-green-500',
      iconColor: 'text-green-500'
    },
    { 
      id: 'timeslots', 
      label: 'Time Slots', 
      icon: Clock, 
      emoji: '⏰',
      line1: 'Time Slots', 
      line2: '',
      activeColor: 'text-primary',
      inactiveColor: 'text-purple-500',
      iconColor: 'text-purple-500'
    }
  ];

  // Handle search functionality - DIFFERENT FOR DASHBOARD vs OTHER TABS
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (activeTab === 'dashboard') {
      // In dashboard, we want to show search results for both bookings and timeslots
      if (query.length > 0) {
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
      }
    } else if (activeTab === 'bookings') {
      // In bookings tab, filter bookings only
      if (query.length > 0) {
        const filtered = bookings.filter(booking =>
          booking.customerName.toLowerCase().includes(query) ||
          booking.animalType.toLowerCase().includes(query) ||
          booking.status.toLowerCase().includes(query) ||
          booking.bookingDate.includes(query)
        );
        setFilteredBookings(filtered);
        setShowSearchResults(false); // Don't show dropdown in bookings tab
      } else {
        setFilteredBookings(bookings);
        setShowSearchResults(false);
      }
    } else if (activeTab === 'timeslots') {
      // In timeslots tab, filter timeslots only
      if (query.length > 0) {
        const filtered = timeSlots.filter(slot =>
          slot.time.toLowerCase().includes(query)
        );
        setFilteredTimeSlots(filtered);
        setShowSearchResults(false); // Don't show dropdown in timeslots tab
      } else {
        setFilteredTimeSlots(timeSlots);
        setShowSearchResults(false);
      }
    }
  };

  // Handle filter changes for bookings
  useEffect(() => {
    let filtered = bookings;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }
    
    if (searchQuery.length > 0 && activeTab === 'bookings') {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.animalType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBookings(filtered);
  }, [filterStatus, bookings, searchQuery, activeTab]);

  // Search results data for dashboard search - COMBINED RESULTS
  const getSearchResults = () => {
    const query = searchQuery.toLowerCase();
    const results = [];
    
    // Add booking results
    bookings
      .filter(booking => 
        booking.customerName.toLowerCase().includes(query) ||
        booking.animalType.toLowerCase().includes(query) ||
        booking.status.toLowerCase().includes(query) ||
        booking.bookingDate.includes(query)
      )
      .slice(0, 5) // Limit to 5 bookings
      .forEach(booking => {
        results.push({
          id: booking.id,
          type: 'booking',
          name: booking.customerName,
          animalType: booking.animalType,
          time: booking.timeSlot,
          date: booking.bookingDate,
          status: booking.status,
          price: booking.price
        });
      });

    // Add timeslot results
    timeSlots
      .filter(slot => 
        slot.time.toLowerCase().includes(query)
      )
      .slice(0, 5) // Limit to 5 timeslots
      .forEach(slot => {
        results.push({
          id: slot.id,
          type: 'timeslot',
          time: slot.time,
          available: slot.available,
          price: slot.price
        });
      });

    return results;
  };

  // FIXED: Updated handleSearchResultClick to only navigate to tab, not open modals
  const handleSearchResultClick = (result) => {
    setSearchQuery('');
    setShowSearchResults(false);
    
    if (result.type === 'booking') {
      // Just navigate to bookings tab, don't open any modals
      setActiveTab('bookings');
      // Clear any editing states
      setEditingBooking(null);
      setShowBookingDetailModal(false);
      setShowAddBookingModal(false);
    } else if (result.type === 'timeslot') {
      // Just navigate to timeslots tab, don't open any modals
      setActiveTab('timeslots');
      // Clear any editing states
      setEditingTimeSlot(null);
      setShowAddTimeSlotModal(false);
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

  const getNotificationIcon = (type) => {
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

  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Handle settings changes
  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    console.log('Settings saved:', settings);
    setShowSettingsModal(false);
    addNotification('info', 'Settings Updated', 'Your settings have been saved successfully');
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onSignOut();
    }
  };

  // Add notification function
  const addNotification = (type, title, message) => {
    const newNotification = {
      id: notifications.length + 1,
      type,
      title,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  // Booking CRUD operations
  const handleAddBooking = () => {
    if (!newBooking.customerName || !newBooking.animalType || !newBooking.bookingDate) {
      alert('Please fill in all required fields');
      return;
    }

    const booking = {
      ...newBooking,
      id: bookings.length + 1,
      animalBreed: newBooking.animalBreed || 'Not specified',
      animalAge: newBooking.animalAge || 'Not specified',
      weight: newBooking.weight || 'Not specified',
      price: newBooking.price || 'PKR 0'
    };
    
    setBookings([...bookings, booking]);
    setShowAddBookingModal(false);
    resetNewBookingForm();
    
    // Update stats
    updateStats();
    
    // Add notification
    addNotification('success', 'Booking Added', `New booking for ${booking.customerName}'s ${booking.animalType} added successfully`);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking({ ...booking });
    setShowAddBookingModal(true);
  };

  const handleSaveBookingEdit = () => {
    if (!editingBooking.customerName || !editingBooking.animalType || !editingBooking.bookingDate) {
      alert('Please fill in all required fields');
      return;
    }

    setBookings(bookings.map(booking =>
      booking.id === editingBooking.id ? editingBooking : booking
    ));
    setShowAddBookingModal(false);
    setEditingBooking(null);
    resetNewBookingForm();
    
    // Update stats
    updateStats();
    
    // Add notification
    addNotification('success', 'Booking Updated', `Booking for ${editingBooking.customerName}'s ${editingBooking.animalType} updated successfully`);
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const booking = bookings.find(b => b.id === bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      
      // Update stats
      updateStats();
      
      // Add notification
      addNotification('warning', 'Booking Deleted', `Booking for ${booking.customerName}'s ${booking.animalType} has been deleted`);
    }
  };

  const handleViewBookingDetails = (booking) => {
    setEditingBooking({ ...booking });
    setShowBookingDetailModal(true);
  };

  // Time Slot CRUD operations
  const handleAddTimeSlot = () => {
    if (!newTimeSlot.time || !newTimeSlot.price) {
      alert('Please fill in all required fields');
      return;
    }

    const timeSlot = {
      ...newTimeSlot,
      id: timeSlots.length + 1
    };
    
    setTimeSlots([...timeSlots, timeSlot]);
    setShowAddTimeSlotModal(false);
    resetNewTimeSlotForm();
    
    // Update stats
    updateStats();
    
    // Add notification
    addNotification('success', 'Time Slot Added', `New time slot ${timeSlot.time} added successfully`);
  };

  const handleEditTimeSlot = (timeSlot) => {
    setEditingTimeSlot({ ...timeSlot });
    setShowAddTimeSlotModal(true);
  };

  const handleSaveTimeSlotEdit = () => {
    if (!editingTimeSlot.time || !editingTimeSlot.price) {
      alert('Please fill in all required fields');
      return;
    }

    setTimeSlots(timeSlots.map(slot =>
      slot.id === editingTimeSlot.id ? editingTimeSlot : slot
    ));
    setShowAddTimeSlotModal(false);
    setEditingTimeSlot(null);
    resetNewTimeSlotForm();
    
    // Update stats
    updateStats();
    
    // Add notification
    addNotification('success', 'Time Slot Updated', `Time slot ${editingTimeSlot.time} updated successfully`);
  };

  const handleDeleteTimeSlot = (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      const slot = timeSlots.find(s => s.id === slotId);
      setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
      
      // Update stats
      updateStats();
      
      // Add notification
      addNotification('warning', 'Time Slot Deleted', `Time slot ${slot.time} has been deleted`);
    }
  };

  const handleToggleTimeSlotAvailability = (slotId) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === slotId ? { ...slot, available: !slot.available } : slot
    ));
    
    const slot = timeSlots.find(s => s.id === slotId);
    const status = !slot.available ? 'available' : 'booked';
    addNotification('info', 'Slot Availability Updated', `Time slot ${slot.time} is now ${status}`);
  };

  // Update stats based on current data
  const updateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.bookingDate === today);
    const processingBookings = bookings.filter(b => b.status === 'Processing');
    const availableSlots = timeSlots.filter(s => s.available).length;
    
    // Calculate revenue for today
    const todayRevenue = todayBookings.reduce((sum, booking) => {
      const price = parseInt(booking.price.replace(/[^0-9]/g, '') || '0');
      return sum + price;
    }, 0);
    
    setStats([
      {
        ...stats[0],
        value: todayBookings.length.toString()
      },
      {
        ...stats[1],
        value: processingBookings.length.toString()
      },
      {
        ...stats[2],
        value: `PKR ${todayRevenue.toLocaleString()}`
      },
      {
        ...stats[3],
        value: availableSlots.toString()
      }
    ]);
  };

  // Reset form functions
  const resetNewBookingForm = () => {
    setNewBooking({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      animalType: '',
      animalBreed: '',
      animalAge: '',
      weight: '',
      bookingDate: '',
      timeSlot: '',
      status: 'Pending',
      price: '',
      notes: '',
      paymentStatus: 'Pending',
      processingType: 'Standard'
    });
  };

  const resetNewTimeSlotForm = () => {
    setNewTimeSlot({
      time: '',
      available: true,
      price: '',
      maxCapacity: '2'
    });
  };

  // Export bookings to CSV
  const handleExportBookings = () => {
    const csvContent = [
      ['Customer Name', 'Animal Type', 'Date', 'Time Slot', 'Status', 'Price', 'Payment Status'],
      ...bookings.map(booking => [
        booking.customerName,
        booking.animalType,
        booking.bookingDate,
        booking.timeSlot,
        booking.status,
        booking.price,
        booking.paymentStatus
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slaughterhouse-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    addNotification('success', 'Export Complete', 'Bookings exported to CSV successfully');
  };

  // Get recent processing activities
  const getRecentActivities = () => {
    const activities = [];
    
    // Add booking activities
    bookings.slice(0, 3).forEach(booking => {
      activities.push({
        action: `Booking ${booking.status.toLowerCase()}`,
        user: booking.customerName,
        time: 'Today',
        type: 'booking',
        status: booking.status.toLowerCase(),
        animal: booking.animalType,
        price: booking.price
      });
    });
    
    // Add time slot activities
    timeSlots.slice(0, 2).forEach(slot => {
      activities.push({
        action: slot.available ? 'Time slot opened' : 'Time slot booked',
        user: 'System',
        time: 'Today',
        type: 'timeslot',
        status: slot.available ? 'available' : 'booked',
        timeSlot: slot.time
      });
    });
    
    return activities;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats Grid with Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 animate-fade-in-up group cursor-pointer transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-2 group-hover:scale-105 transition-transform">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                        <div className="flex items-center mt-3">
                          <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                            stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {stat.trend === 'up' ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowUp className="h-3 w-3 mr-1 transform rotate-180" />
                            )}
                            <span>{stat.change}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">from yesterday</span>
                        </div>
                      </div>
                      <div className={`p-4 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 group-hover:animate-pulse-scale ${
                            stat.trend === 'up' ? 'bg-gradient-to-r from-primary to-accent' : 'bg-gradient-to-r from-red-500 to-orange-500'
                          }`}
                          style={{ width: `${Math.min(100, parseInt(stat.value.replace(/[^0-9]/g, '')) * 0.8)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Today's Bookings Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:opacity-90 transition-opacity">
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Today's Bookings
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Scheduled animal processing</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">View All</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking, index) => (
                    <div 
                      key={booking.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary hover:bg-accent/30 transition-all duration-300 group-hover-item cursor-pointer transform hover:scale-[1.02]"
                      onClick={() => handleViewBookingDetails(booking)}
                    >
                      <div>
                        <p className="font-medium text-foreground group-hover-item:text-primary transition-colors">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{booking.animalType} • {booking.weight}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{booking.timeSlot}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Time Slots Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:opacity-90 transition-opacity">
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Available Time Slots
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Open slots for booking</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('timeslots')}
                    className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">All Slots</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.filter(slot => slot.available).slice(0, 6).map((slot, index) => (
                    <div 
                      key={slot.id} 
                      className="p-4 border border-green-200 bg-green-50 rounded-xl hover:border-primary hover:bg-accent/30 hover:shadow-lg transition-all duration-300 group-hover-item cursor-pointer transform hover:scale-105"
                      onClick={() => handleToggleTimeSlotAvailability(slot.id)}
                    >
                      <p className="text-sm font-medium text-center text-foreground group-hover-item:text-primary transition-colors">
                        {slot.time}
                      </p>
                      <p className="text-xs text-green-600 text-center mt-2">✅ Available</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground group-hover:opacity-90 transition-opacity">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Recent Processing Activity
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Latest bookings and operations</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">Live Updates</span>
                </div>
              </div>
              <div className="space-y-4">
                {getRecentActivities().map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 p-4 hover:bg-accent rounded-xl transition-all duration-300 group-hover-item cursor-pointer transform hover:scale-[1.02] hover:border hover:border-primary/30"
                  >
                    <div className={`p-3 rounded-xl ${
                      activity.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'timeslot' ? 'bg-purple-100 text-purple-600' :
                      'bg-yellow-100 text-yellow-600'
                    } group-hover-item:scale-110 transition-transform duration-300`}>
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-foreground group-hover-item:text-primary transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.user} • {activity.animal || activity.timeSlot || activity.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        activity.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        activity.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                        activity.status === 'available' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activity.status}
                      </span>
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Slaughterhouse Bookings
                </h2>
                <p className="text-muted-foreground">Manage animal processing bookings</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleExportBookings}
                  className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all hover:shadow-lg"
                >
                  <Download size={20} />
                  Export
                </button>
                <button 
                  onClick={() => {
                    setEditingBooking(null);
                    setShowAddBookingModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <Plus size={20} />
                  Add Booking
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-xl border border-border">
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filter by Status
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      {['all', 'Confirmed', 'Processing', 'Pending', 'Completed'].map(status => (
                        <button
                          key={status}
                          onClick={() => {
                            setFilterStatus(status === 'all' ? 'all' : status);
                            setShowFilterMenu(false);
                          }}
                          className={`flex items-center w-full px-3 py-2 text-sm rounded-lg mb-1 last:mb-0 transition-colors ${
                            (filterStatus === status || (filterStatus === 'all' && status === 'all'))
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-accent'
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            status === 'Confirmed' ? 'bg-green-500' :
                            status === 'Processing' ? 'bg-yellow-500' :
                            status === 'Pending' ? 'bg-blue-500' :
                            status === 'Completed' ? 'bg-purple-500' :
                            'bg-gray-500'
                          }`} />
                          {status === 'all' ? 'All Bookings' : status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg">
                  {filteredBookings.length} bookings
                </span>
                {filterStatus !== 'all' && (
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Clear filter
                  </button>
                )}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-primary transition-all duration-500">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-left font-medium text-foreground">Customer</th>
                    <th className="p-4 text-left font-medium text-foreground">Animal</th>
                    <th className="p-4 text-left font-medium text-foreground">Weight</th>
                    <th className="p-4 text-left font-medium text-foreground">Date & Time</th>
                    <th className="p-4 text-left font-medium text-foreground">Price</th>
                    <th className="p-4 text-left font-medium text-foreground">Status</th>
                    <th className="p-4 text-left font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr 
                      key={booking.id} 
                      className="border-b border-border hover:bg-accent/50 transition-colors group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {booking.customerName}
                            </p>
                            <p className="text-xs text-muted-foreground">{booking.customerPhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">
                        <div>
                          <p>{booking.animalType}</p>
                          <p className="text-sm text-muted-foreground">{booking.animalBreed}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Scale size={14} />
                          {booking.weight}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-foreground">
                          <Clock size={14} />
                          {booking.bookingDate} {booking.timeSlot}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-foreground">{booking.price}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditBooking(booking)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors hover:border hover:border-primary/30"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleViewBookingDetails(booking)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors hover:border hover:border-green-300"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:border hover:border-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'timeslots':
        const displayTimeSlots = searchQuery.length > 0 && activeTab === 'timeslots' ? filteredTimeSlots : timeSlots;
        
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Time Slot Management
                </h2>
                <p className="text-muted-foreground">Manage available time slots for bookings</p>
              </div>
              <button 
                onClick={() => {
                  setEditingTimeSlot(null);
                  setShowAddTimeSlotModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                <Plus size={20} />
                Add Time Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTimeSlots.map((slot, index) => (
                <div 
                  key={slot.id}
                  id={`time-slot-${slot.id}`}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {slot.time}
                    </h3>
                    <div className={`p-2 bg-gradient-to-br ${slot.available ? 'from-primary to-accent' : 'from-red-500 to-orange-500'} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className={`text-sm font-medium ${
                      slot.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {slot.available ? '🟢 Available for booking' : '🔴 Currently booked'}
                    </p>
                    <p className="text-sm text-muted-foreground">💰 Price: {slot.price}</p>
                    <p className="text-sm text-muted-foreground">👥 Max Capacity: {slot.maxCapacity} animals</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleTimeSlotAvailability(slot.id)}
                      className={`flex-1 py-2 text-sm border ${
                        slot.available ? 'border-red-500 text-red-600 hover:bg-red-50' : 'border-green-500 text-green-600 hover:bg-green-50'
                      } rounded-lg transition-colors`}
                    >
                      {slot.available ? 'Mark as Booked' : 'Mark as Available'}
                    </button>
                    <button 
                      onClick={() => handleEditTimeSlot(slot)}
                      className="flex-1 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                    >
                      Edit Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Welcome to Slaughterhouse Portal
            </h2>
            <p className="text-muted-foreground">Select a tab from the navigation to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Slaughterhouse Portal Navigation */}
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
                  Slaughterhouse Portal
                </h1>
                <p className="text-sm text-muted-foreground">Processing Management System</p>
              </div>
            </div>

            {/* Pill-Shaped Navigation Container - Perfectly centered */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <div className="bg-card border border-border rounded-2xl shadow-lg px-6 py-3">
                <div className="flex gap-4">
                  {slaughterhouseMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSearchQuery('');
                          setShowSearchResults(false);
                        }}
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
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                  className="relative p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
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
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
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
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <p className="text-base font-medium text-foreground">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {notification.time}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-base text-muted-foreground">No notifications</p>
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
                    <p className="text-sm font-medium text-foreground">{user?.name || 'Slaughterhouse User'}</p>
                    <p className="text-xs text-muted-foreground">Slaughterhouse Admin</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <p className="text-base font-medium text-foreground">{user?.name || 'Slaughterhouse User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'slaughterhouse@livestocksync.com'}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setShowSettingsModal(true);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-3" />
                        Settings
                      </button>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                placeholder={
                  activeTab === 'dashboard' ? "Search bookings and time slots..." :
                  activeTab === 'bookings' ? "Search bookings by customer, animal, status..." :
                  activeTab === 'timeslots' ? "Search time slots by time..." :
                  "Search..."
                }
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
              />
              
              {/* Search Results Dropdown - Only show in dashboard when search query exists */}
              {showSearchResults && searchQuery.length > 0 && activeTab === 'dashboard' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3">
                    {/* Combined Results */}
                    {getSearchResults().length > 0 ? (
                      getSearchResults().map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSearchResultClick(result)}
                          className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left mb-2 last:mb-0"
                        >
                          {result.type === 'booking' ? (
                            <Calendar className="h-4 w-4 text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-primary" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {result.type === 'booking' ? `${result.name}'s ${result.animalType}` : result.time}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {result.type === 'booking' ? `Booked: ${result.date} • ${result.time}` : `Price: ${result.price}`}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            result.type === 'booking' ? (
                              result.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              result.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            ) : (
                              result.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            )
                          }`}>
                            {result.type === 'booking' ? result.status : (result.available ? 'Available' : 'Booked')}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="py-4 text-center">
                        <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
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
                  placeholder={
                    activeTab === 'dashboard' ? "Search bookings and time slots..." :
                    activeTab === 'bookings' ? "Search bookings..." :
                    activeTab === 'timeslots' ? "Search time slots..." :
                    "Search..."
                  }
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
                />
                
                {/* Mobile Search Results Dropdown - Only show in dashboard */}
                {showSearchResults && searchQuery.length > 0 && activeTab === 'dashboard' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3">
                      {getSearchResults().length > 0 ? (
                        getSearchResults().slice(0, 5).map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleSearchResultClick(result)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            {result.type === 'booking' ? (
                              <Calendar className="h-4 w-4 text-primary" />
                            ) : (
                              <Clock className="h-4 w-4 text-primary" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {result.type === 'booking' ? `${result.name}'s ${result.animalType}` : result.time}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {result.type === 'booking' ? 'Booking' : 'Time Slot'}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-sm text-muted-foreground">No results found</p>
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
              {slaughterhouseMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                      setSearchQuery('');
                      setShowSearchResults(false);
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

      {/* Main Content */}
      <main className="flex-1 max-w-8xl mx-auto w-full py-8 px-6">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            {activeTab === 'dashboard' ? 'Slaughterhouse overview and analytics' :
             activeTab === 'bookings' ? 'Manage processing bookings' :
             activeTab === 'timeslots' ? 'Manage available time slots' :
             'Processing management system'}
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add/Edit Booking Modal */}
      {(showAddBookingModal || editingBooking) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  {editingBooking ? 'Edit Booking' : 'Add New Booking'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowAddBookingModal(false);
                  setEditingBooking(null);
                  resetNewBookingForm();
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={editingBooking ? editingBooking.customerName : newBooking.customerName}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, customerName: e.target.value})
                      : setNewBooking({...newBooking, customerName: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={editingBooking ? editingBooking.customerEmail : newBooking.customerEmail}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, customerEmail: e.target.value})
                      : setNewBooking({...newBooking, customerEmail: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Customer Phone *
                  </label>
                  <input
                    type="tel"
                    value={editingBooking ? editingBooking.customerPhone : newBooking.customerPhone}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, customerPhone: e.target.value})
                      : setNewBooking({...newBooking, customerPhone: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Animal Type *
                  </label>
                  <select
                    value={editingBooking ? editingBooking.animalType : newBooking.animalType}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, animalType: e.target.value})
                      : setNewBooking({...newBooking, animalType: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="">Select animal type</option>
                    <option value="Cow">Cow</option>
                    <option value="Buffalo">Buffalo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Animal Breed
                  </label>
                  <input
                    type="text"
                    value={editingBooking ? editingBooking.animalBreed : newBooking.animalBreed}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, animalBreed: e.target.value})
                      : setNewBooking({...newBooking, animalBreed: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter animal breed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Animal Age
                  </label>
                  <input
                    type="text"
                    value={editingBooking ? editingBooking.animalAge : newBooking.animalAge}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, animalAge: e.target.value})
                      : setNewBooking({...newBooking, animalAge: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., 4 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={editingBooking ? editingBooking.weight : newBooking.weight}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, weight: e.target.value})
                      : setNewBooking({...newBooking, weight: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter weight in kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editingBooking ? editingBooking.bookingDate : newBooking.bookingDate}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, bookingDate: e.target.value})
                      : setNewBooking({...newBooking, bookingDate: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Slot *
                  </label>
                  <select
                    value={editingBooking ? editingBooking.timeSlot : newBooking.timeSlot}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, timeSlot: e.target.value})
                      : setNewBooking({...newBooking, timeSlot: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="">Select time slot</option>
                    {timeSlots.filter(slot => slot.available).map(slot => (
                      <option key={slot.id} value={slot.time}>
                        {slot.time} - {slot.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price (PKR) *
                  </label>
                  <input
                    type="text"
                    value={editingBooking ? editingBooking.price : newBooking.price}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, price: e.target.value})
                      : setNewBooking({...newBooking, price: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={editingBooking ? editingBooking.status : newBooking.status}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, status: e.target.value})
                      : setNewBooking({...newBooking, status: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Status
                  </label>
                  <select
                    value={editingBooking ? editingBooking.paymentStatus : newBooking.paymentStatus}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, paymentStatus: e.target.value})
                      : setNewBooking({...newBooking, paymentStatus: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Processing Type
                  </label>
                  <select
                    value={editingBooking ? editingBooking.processingType : newBooking.processingType}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, processingType: e.target.value})
                      : setNewBooking({...newBooking, processingType: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Quick Processing">Quick Processing</option>
                    <option value="Full Processing">Full Processing</option>
                    <option value="Halal Processing">Halal Processing</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editingBooking ? editingBooking.notes : newBooking.notes}
                    onChange={(e) => editingBooking 
                      ? setEditingBooking({...editingBooking, notes: e.target.value})
                      : setNewBooking({...newBooking, notes: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Additional notes"
                    rows="3"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setShowAddBookingModal(false);
                  setEditingBooking(null);
                  resetNewBookingForm();
                }}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors hover:border-primary/50"
              >
                Cancel
              </button>
              <button
                onClick={editingBooking ? handleSaveBookingEdit : handleAddBooking}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                {editingBooking ? 'Update Booking' : 'Add Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {showBookingDetailModal && editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Booking Details</h2>
              </div>
              <button
                onClick={() => setShowBookingDetailModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{editingBooking.customerName}</h3>
                  <p className="text-sm text-muted-foreground">{editingBooking.animalType}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{editingBooking.customerEmail || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{editingBooking.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{editingBooking.bookingDate} at {editingBooking.timeSlot}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Animal Breed</p>
                    <p className="text-foreground">{editingBooking.animalBreed}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Animal Age</p>
                    <p className="text-foreground">{editingBooking.animalAge}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weight</p>
                  <p className="text-foreground">{editingBooking.weight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing Type</p>
                  <p className="text-foreground">{editingBooking.processingType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-foreground">{editingBooking.notes || 'No additional notes'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      editingBooking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      editingBooking.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      editingBooking.status === 'Completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {editingBooking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Payment</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      editingBooking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      editingBooking.paymentStatus === 'Partially Paid' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {editingBooking.paymentStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-xl font-bold text-foreground">{editingBooking.price}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowBookingDetailModal(false)}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowBookingDetailModal(false);
                  handleEditBooking(editingBooking);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Edit Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Time Slot Modal */}
      {(showAddTimeSlotModal || editingTimeSlot) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  {editingTimeSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowAddTimeSlotModal(false);
                  setEditingTimeSlot(null);
                  resetNewTimeSlotForm();
                }}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time Slot *
                  </label>
                  <input
                    type="text"
                    value={editingTimeSlot ? editingTimeSlot.time : newTimeSlot.time}
                    onChange={(e) => editingTimeSlot 
                      ? setEditingTimeSlot({...editingTimeSlot, time: e.target.value})
                      : setNewTimeSlot({...newTimeSlot, time: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., 9:00 AM - 10:00 AM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price (PKR) *
                  </label>
                  <input
                    type="text"
                    value={editingTimeSlot ? editingTimeSlot.price : newTimeSlot.price}
                    onChange={(e) => editingTimeSlot 
                      ? setEditingTimeSlot({...editingTimeSlot, price: e.target.value})
                      : setNewTimeSlot({...newTimeSlot, price: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max Capacity
                  </label>
                  <select
                    value={editingTimeSlot ? editingTimeSlot.maxCapacity : newTimeSlot.maxCapacity}
                    onChange={(e) => editingTimeSlot 
                      ? setEditingTimeSlot({...editingTimeSlot, maxCapacity: e.target.value})
                      : setNewTimeSlot({...newTimeSlot, maxCapacity: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="1">1 animal</option>
                    <option value="2">2 animals</option>
                    <option value="3">3 animals</option>
                    <option value="4">4 animals</option>
                    <option value="5">5 animals</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="text-base font-medium text-foreground">Available for Booking</p>
                    <p className="text-sm text-muted-foreground">Slot availability status</p>
                  </div>
                  <button
                    onClick={() => editingTimeSlot 
                      ? setEditingTimeSlot({...editingTimeSlot, available: !editingTimeSlot.available})
                      : setNewTimeSlot({...newTimeSlot, available: !newTimeSlot.available})
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      (editingTimeSlot ? editingTimeSlot.available : newTimeSlot.available) ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        (editingTimeSlot ? editingTimeSlot.available : newTimeSlot.available) ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setShowAddTimeSlotModal(false);
                  setEditingTimeSlot(null);
                  resetNewTimeSlotForm();
                }}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors hover:border-primary/50"
              >
                Cancel
              </button>
              <button
                onClick={editingTimeSlot ? handleSaveTimeSlotEdit : handleAddTimeSlot}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                {editingTimeSlot ? 'Update Time Slot' : 'Add Time Slot'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Slaughterhouse Settings</h2>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Slaughterhouse Information</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Business Name</p>
                    <p className="text-base mt-1">Al-Madina Halal Meats</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Address</p>
                    <p className="text-base mt-1">123 Industrial Area, Faisalabad</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Contact</p>
                    <p className="text-base mt-1">+92 300 1234567</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Operating Hours</p>
                    <p className="text-base mt-1">{settings.workingHours}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <div>
                      <p className="text-base font-medium text-foreground">Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive booking notifications</p>
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
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <div>
                      <p className="text-base font-medium text-foreground">Auto Save</p>
                      <p className="text-sm text-muted-foreground">Automatically save changes</p>
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

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors hover:border-primary/50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Save Changes
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
      {(isProfileDropdownOpen || isNotificationDropdownOpen || showSearchResults || 
        showSettingsModal || showAddBookingModal || showAddTimeSlotModal ||
        showBookingDetailModal || showFilterMenu) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsNotificationDropdownOpen(false);
            setShowSearchResults(false);
            setShowSettingsModal(false);
            setShowAddBookingModal(false);
            setShowAddTimeSlotModal(false);
            setShowBookingDetailModal(false);
            setShowFilterMenu(false);
            if (!showAddBookingModal && !showAddTimeSlotModal) {
              setEditingBooking(null);
              setEditingTimeSlot(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default SlaughterhousePortal;