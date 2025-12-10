// components/HospitalPortal/HospitalPortal.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  FileText, 
  Pill, 
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
  Eye,
  Activity,
  ArrowUp,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Filter
} from 'lucide-react';
import Footer from '../Footer';

const HospitalPortal = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);
  const [showAppointmentDetailModal, setShowAppointmentDetailModal] = useState(false);
  const [showPrescriptionDetailModal, setShowPrescriptionDetailModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);
  const [filteredData, setFilteredData] = useState({
    appointments: [],
    prescriptions: []
  });

  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'New Appointment Booked',
      message: 'Ali Ahmed booked an appointment for his cow',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Prescription Expiring',
      message: 'Antibiotics prescription for Usman Farooq expires tomorrow',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New features have been deployed to the hospital portal',
      time: '1 hour ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Patient Recovery',
      message: 'Sonia Jalal\'s buffalo has recovered successfully',
      time: '2 hours ago',
      read: true
    }
  ]);

  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true
  });

  // State for appointments with full CRUD functionality
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Ali Ahmed',
      patientEmail: 'ali.ahmed@email.com',
      patientPhone: '+92 300 1234567',
      animalType: 'Cow',
      animalBreed: 'Sahiwal',
      animalAge: '4 years',
      symptoms: 'Fever, Loss of appetite',
      date: '2024-01-25',
      time: '10:00 AM',
      duration: '30 minutes',
      status: 'Upcoming',
      notes: 'Requires immediate attention'
    },
    {
      id: 2,
      patientName: 'Usman Farooq',
      patientEmail: 'usman.farooq@email.com',
      patientPhone: '+92 300 7654321',
      animalType: 'Buffalo',
      animalBreed: 'Nili-Ravi',
      animalAge: '5 years',
      symptoms: 'Coughing, Runny nose',
      date: '2024-01-24',
      time: '2:00 PM',
      duration: '20 minutes',
      status: 'Completed',
      notes: 'Prescribed cough syrup'
    },
    {
      id: 3,
      patientName: 'Sonia Jalal',
      patientEmail: 'sonia.jalal@email.com',
      patientPhone: '+92 300 1122334',
      animalType: 'Cow',
      animalBreed: 'Jersey',
      animalAge: '3 years',
      symptoms: 'Leg injury, Limping',
      date: '2024-01-26',
      time: '11:00 AM',
      duration: '45 minutes',
      status: 'Upcoming',
      notes: 'X-ray required'
    },
    {
      id: 4,
      patientName: 'Alina Akram',
      patientEmail: 'alina.akram@email.com',
      patientPhone: '+92 300 9988776',
      animalType: 'Buffalo',
      animalBreed: 'Kundi',
      animalAge: '6 years',
      symptoms: 'Milk production decreased',
      date: '2024-01-27',
      time: '3:00 PM',
      duration: '30 minutes',
      status: 'Upcoming',
      notes: 'Check for mastitis'
    }
  ]);

  // State for prescriptions with full CRUD functionality
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: 'Ali Ahmed',
      patientEmail: 'ali.ahmed@email.com',
      animalType: 'Cow',
      medicine: 'Antibiotics',
      dosage: '2 times daily for 5 days',
      frequency: 'Every 12 hours',
      instructions: 'Give with food, avoid dairy products',
      prescribedDate: '2024-01-24',
      expiryDate: '2024-01-29',
      status: 'Active'
    },
    {
      id: 2,
      patientName: 'Usman Farooq',
      patientEmail: 'usman.farooq@email.com',
      animalType: 'Buffalo',
      medicine: 'Cough syrup',
      dosage: '3 times daily for 3 days',
      frequency: 'Every 8 hours',
      instructions: 'Give directly, keep hydrated',
      prescribedDate: '2024-01-23',
      expiryDate: '2024-01-26',
      status: 'Active'
    },
    {
      id: 3,
      patientName: 'Sonia Jalal',
      patientEmail: 'sonia.jalal@email.com',
      animalType: 'Cow',
      medicine: 'Pain Relief',
      dosage: 'Once daily for 7 days',
      frequency: 'Every 24 hours',
      instructions: 'Administer after evening feed',
      prescribedDate: '2024-01-25',
      expiryDate: '2024-02-01',
      status: 'Active'
    },
    {
      id: 4,
      patientName: 'Alina Akram',
      patientEmail: 'alina.akram@email.com',
      animalType: 'Buffalo',
      medicine: 'Mastitis Treatment',
      dosage: '2 times daily for 10 days',
      frequency: 'Every 12 hours',
      instructions: 'Apply topically on udder',
      prescribedDate: '2024-01-26',
      expiryDate: '2024-02-05',
      status: 'Active'
    }
  ]);

  // Calculate stats based on actual data
  const stats = [
    {
      title: 'Total Appointments',
      value: appointments.length.toString(),
      icon: Calendar,
      change: '+12%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'This month'
    },
    {
      title: "Today's Appointments",
      value: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length.toString(),
      icon: Users,
      change: '+5%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'Scheduled today'
    },
    {
      title: 'Active Prescriptions',
      value: prescriptions.filter(p => p.status === 'Active').length.toString(),
      icon: Pill,
      change: '+15%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'Currently active'
    },
    {
      title: 'Total Prescriptions',
      value: prescriptions.length.toString(),
      icon: FileText,
      change: '+8%',
      trend: 'up',
      color: 'from-primary to-accent',
      description: 'Issued this month'
    }
  ];

  // Generate search results based on current search query
  const generateSearchResults = (query) => {
    if (!query.trim()) {
      return {
        appointments: [],
        prescriptions: []
      };
    }

    const lowerQuery = query.toLowerCase();
    
    const appointmentResults = appointments.filter(apt => 
      apt.patientName.toLowerCase().includes(lowerQuery) ||
      apt.animalType.toLowerCase().includes(lowerQuery) ||
      apt.symptoms.toLowerCase().includes(lowerQuery) ||
      apt.patientPhone.includes(query)
    ).map(apt => ({
      id: apt.id,
      type: 'appointment',
      name: apt.patientName,
      animal: apt.animalType,
      time: apt.time,
      date: apt.date,
      symptoms: apt.symptoms
    }));

    const prescriptionResults = prescriptions.filter(pres => 
      pres.patientName.toLowerCase().includes(lowerQuery) ||
      pres.medicine.toLowerCase().includes(lowerQuery) ||
      pres.animalType.toLowerCase().includes(lowerQuery)
    ).map(pres => ({
      id: pres.id,
      type: 'prescription',
      name: pres.patientName,
      medicine: pres.medicine,
      animal: pres.animalType,
      date: pres.prescribedDate
    }));

    return {
      appointments: appointmentResults.slice(0, 5),
      prescriptions: prescriptionResults.slice(0, 5)
    };
  };

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    animalType: '',
    animalBreed: '',
    animalAge: '',
    symptoms: '',
    date: '',
    time: '',
    duration: '30',
    status: 'Upcoming',
    notes: ''
  });

  // Form state for new prescription
  const [newPrescription, setNewPrescription] = useState({
    patientName: '',
    patientEmail: '',
    animalType: '',
    medicine: '',
    dosage: '',
    frequency: '',
    instructions: '',
    prescribedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'Active'
  });

  const hospitalMenuItems = [
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
      id: 'appointments', 
      label: 'Appointments', 
      icon: Calendar, 
      emoji: '📅',
      line1: 'Appointments', 
      line2: '',
      activeColor: 'text-primary',
      inactiveColor: 'text-green-500',
      iconColor: 'text-green-500'
    },
    { 
      id: 'prescriptions', 
      label: 'Prescriptions', 
      icon: FileText, 
      emoji: '📝',
      line1: 'Prescriptions', 
      line2: '',
      activeColor: 'text-primary',
      inactiveColor: 'text-purple-500',
      iconColor: 'text-purple-500'
    }
  ];

  // Handle search functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const results = generateSearchResults(query);
      setFilteredData(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSelectedSearchResult(null);
      setFilteredData({
        appointments: [],
        prescriptions: []
      });
    }
  };

  const handleSearchResultClick = (type, id) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSelectedSearchResult({ type, id });
    
    // Navigate to the appropriate section
    switch (type) {
      case 'appointment':
        setActiveTab('appointments');
        break;
      case 'prescription':
        setActiveTab('prescriptions');
        break;
      default:
        break;
    }
  };

  // Filter data based on search selection
  const getFilteredAppointments = () => {
    if (selectedSearchResult && selectedSearchResult.type === 'appointment') {
      return appointments.filter(apt => apt.id === selectedSearchResult.id);
    }
    return appointments;
  };

  const getFilteredPrescriptions = () => {
    if (selectedSearchResult && selectedSearchResult.type === 'prescription') {
      return prescriptions.filter(pres => pres.id === selectedSearchResult.id);
    }
    return prescriptions;
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
    alert('Settings saved successfully!');
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onSignOut();
    }
  };

  // Clear search filter
  const clearSearchFilter = () => {
    setSelectedSearchResult(null);
    setSearchQuery('');
    setShowSearchResults(false);
    setFilteredData({
      appointments: [],
      prescriptions: []
    });
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
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Appointment CRUD operations
  const handleAddAppointment = () => {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time) {
      alert('Please fill in all required fields');
      return;
    }

    const appointment = {
      ...newAppointment,
      id: appointments.length + 1,
      animalAge: newAppointment.animalAge || 'Not specified',
      animalBreed: newAppointment.animalBreed || 'Not specified'
    };
    
    setAppointments([...appointments, appointment]);
    setShowAddAppointmentModal(false);
    resetNewAppointmentForm();
    
    // Add notification
    addNotification('success', 'New Appointment Added', 
      `Appointment added for ${appointment.patientName}'s ${appointment.animalType}`);
    
    alert('Appointment added successfully!');
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment({ ...appointment });
    setShowAddAppointmentModal(true);
  };

  const handleSaveAppointmentEdit = () => {
    if (!editingAppointment.patientName || !editingAppointment.date || !editingAppointment.time) {
      alert('Please fill in all required fields');
      return;
    }

    setAppointments(appointments.map(apt =>
      apt.id === editingAppointment.id ? editingAppointment : apt
    ));
    setShowAddAppointmentModal(false);
    setEditingAppointment(null);
    resetNewAppointmentForm();
    
    // Add notification
    addNotification('info', 'Appointment Updated', 
      `Appointment updated for ${editingAppointment.patientName}`);
    
    alert('Appointment updated successfully!');
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const appointmentToDelete = appointments.find(apt => apt.id === appointmentId);
      setAppointments(appointments.filter(apt => apt.id !== appointmentId));
      
      // Add notification
      addNotification('warning', 'Appointment Deleted', 
        `Appointment deleted for ${appointmentToDelete.patientName}'s ${appointmentToDelete.animalType}`);
      
      alert('Appointment deleted successfully!');
    }
  };

  const handleViewAppointmentDetails = (appointment) => {
    setEditingAppointment({ ...appointment });
    setShowAppointmentDetailModal(true);
  };

  // Prescription CRUD operations
  const handleAddPrescription = () => {
    if (!newPrescription.patientName || !newPrescription.medicine || !newPrescription.dosage) {
      alert('Please fill in all required fields');
      return;
    }

    const prescription = {
      ...newPrescription,
      id: prescriptions.length + 1,
      expiryDate: newPrescription.expiryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setPrescriptions([...prescriptions, prescription]);
    setShowAddPrescriptionModal(false);
    resetNewPrescriptionForm();
    
    // Add notification
    addNotification('success', 'New Prescription Added', 
      `${prescription.medicine} prescribed for ${prescription.patientName}'s ${prescription.animalType}`);
    
    alert('Prescription added successfully!');
  };

  const handleEditPrescription = (prescription) => {
    setEditingPrescription({ ...prescription });
    setShowAddPrescriptionModal(true);
  };

  const handleSavePrescriptionEdit = () => {
    if (!editingPrescription.patientName || !editingPrescription.medicine || !editingPrescription.dosage) {
      alert('Please fill in all required fields');
      return;
    }

    setPrescriptions(prescriptions.map(pres =>
      pres.id === editingPrescription.id ? editingPrescription : pres
    ));
    setShowAddPrescriptionModal(false);
    setEditingPrescription(null);
    resetNewPrescriptionForm();
    
    // Add notification
    addNotification('info', 'Prescription Updated', 
      `${editingPrescription.medicine} prescription updated for ${editingPrescription.patientName}`);
    
    alert('Prescription updated successfully!');
  };

  const handleDeletePrescription = (prescriptionId) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      const prescriptionToDelete = prescriptions.find(pres => pres.id === prescriptionId);
      setPrescriptions(prescriptions.filter(pres => pres.id !== prescriptionId));
      
      // Add notification
      addNotification('warning', 'Prescription Deleted', 
        `${prescriptionToDelete.medicine} prescription deleted for ${prescriptionToDelete.patientName}'s ${prescriptionToDelete.animalType}`);
      
      alert('Prescription deleted successfully!');
    }
  };

  const handleViewPrescriptionDetails = (prescription) => {
    setEditingPrescription({ ...prescription });
    setShowPrescriptionDetailModal(true);
  };

  // Reset form functions
  const resetNewAppointmentForm = () => {
    setNewAppointment({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      animalType: '',
      animalBreed: '',
      animalAge: '',
      symptoms: '',
      date: '',
      time: '',
      duration: '30',
      status: 'Upcoming',
      notes: ''
    });
  };

  const resetNewPrescriptionForm = () => {
    setNewPrescription({
      patientName: '',
      patientEmail: '',
      animalType: '',
      medicine: '',
      dosage: '',
      frequency: '',
      instructions: '',
      prescribedDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      status: 'Active'
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Stats Grid with Hover Effects - Now showing real data */}
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
                          <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-lg">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span className="text-xs font-medium">{stat.change}</span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">from last month</span>
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
                          className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 group-hover:animate-pulse-scale"
                          style={{ width: `${Math.min(100, parseInt(stat.value) * 10)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Today's Appointments Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:opacity-90 transition-opacity">
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Today's Appointments
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Upcoming veterinary consultations</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="font-medium">View All</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'Upcoming').slice(0, 3).map((apt, index) => (
                    <div 
                      key={apt.id} 
                      className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary hover:bg-accent/30 transition-all duration-300 group-hover-item cursor-pointer transform hover:scale-[1.02]"
                      onClick={() => handleViewAppointmentDetails(apt)}
                    >
                      <div>
                        <p className="font-medium text-foreground group-hover-item:text-primary transition-colors">
                          {apt.patientName}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{apt.animalType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{apt.time}</p>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Prescriptions Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:opacity-90 transition-opacity">
                      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Recent Prescriptions
                      </span>
                    </h3>
                    <p className="text-sm text-muted-foreground">Recently issued medicines</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('prescriptions')}
                    className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">All Prescriptions</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {prescriptions.slice(0, 3).map((pres, index) => (
                    <div 
                      key={pres.id} 
                      className="p-4 border border-border rounded-xl hover:border-primary hover:bg-accent/30 transition-all duration-300 group-hover-item cursor-pointer transform hover:scale-[1.02]"
                      onClick={() => handleViewPrescriptionDetails(pres)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-foreground group-hover-item:text-primary transition-colors">
                            {pres.patientName}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{pres.animalType}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{pres.prescribedDate}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium text-foreground">💊 {pres.medicine}</p>
                        <p className="text-xs text-muted-foreground mt-1">📋 {pres.dosage}</p>
                      </div>
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
                      Recent Hospital Activity
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Latest appointments and prescriptions</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                  <Activity className="h-4 w-4" />
                  <span className="font-medium">Live Updates</span>
                </div>
              </div>
              <div className="space-y-4">
                {notifications.slice(0, 5).map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-center space-x-4 p-4 hover:bg-accent rounded-xl transition-all duration-300 group-hover-item cursor-pointer transform hover:scale-[1.02] hover:border hover:border-primary/30"
                    onClick={() => handleMarkAsRead(activity.id)}
                  >
                    <div className={`p-3 rounded-xl ${
                      activity.type === 'success' ? 'bg-green-100 text-green-600' :
                      activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'info' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    } group-hover-item:scale-110 transition-transform duration-300`}>
                      {getNotificationIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-medium text-foreground group-hover-item:text-primary transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.message}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        activity.read ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {activity.read ? 'Read' : 'New'}
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

      case 'appointments':
        const displayAppointments = getFilteredAppointments();
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Hospital Appointments
                </h2>
                <p className="text-muted-foreground">Manage veterinary appointments</p>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedSearchResult && (
                  <button 
                    onClick={clearSearchFilter}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Filter className="h-4 w-4" />
                    Clear Filter
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    setEditingAppointment(null);
                    setShowAddAppointmentModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <Plus size={20} />
                  Add Appointment
                </button>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-primary transition-all duration-500">
              <div className="p-4 border-b border-border bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    Showing {displayAppointments.length} appointment{displayAppointments.length !== 1 ? 's' : ''}
                    {selectedSearchResult && ' (Filtered)'}
                  </p>
                </div>
              </div>
              
              {displayAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-base text-muted-foreground">
                    {selectedSearchResult ? 'No appointments match your search' : 'No appointments found'}
                  </p>
                  {selectedSearchResult && (
                    <button 
                      onClick={clearSearchFilter}
                      className="mt-4 text-sm text-primary hover:underline"
                    >
                      Clear filter to view all appointments
                    </button>
                  )}
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="p-4 text-left font-medium text-foreground">Patient</th>
                      <th className="p-4 text-left font-medium text-foreground">Animal</th>
                      <th className="p-4 text-left font-medium text-foreground">Date & Time</th>
                      <th className="p-4 text-left font-medium text-foreground">Symptoms</th>
                      <th className="p-4 text-left font-medium text-foreground">Status</th>
                      <th className="p-4 text-left font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayAppointments.map((apt, index) => (
                      <tr 
                        key={apt.id} 
                        className="border-b border-border hover:bg-accent/50 transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Users className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {apt.patientName}
                              </p>
                              <p className="text-sm text-muted-foreground">{apt.patientPhone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-foreground">
                          <div>
                            <p>{apt.animalType}</p>
                            <p className="text-sm text-muted-foreground">{apt.animalBreed}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-foreground">
                            <Clock size={14} />
                            {apt.date} {apt.time}
                          </div>
                        </td>
                        <td className="p-4 text-foreground max-w-xs truncate">{apt.symptoms}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditAppointment(apt)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors hover:border hover:border-primary/30"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleViewAppointmentDetails(apt)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors hover:border hover:border-green-300"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAppointment(apt.id)}
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
              )}
            </div>
          </div>
        );

      case 'prescriptions':
        const displayPrescriptions = getFilteredPrescriptions();
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Hospital Prescriptions
                </h2>
                <p className="text-muted-foreground">Manage animal prescriptions</p>
              </div>
              
              <div className="flex items-center gap-3">
                {selectedSearchResult && (
                  <button 
                    onClick={clearSearchFilter}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                  >
                    <Filter className="h-4 w-4" />
                    Clear Filter
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    setEditingPrescription(null);
                    setShowAddPrescriptionModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  <Plus size={20} />
                  Add Prescription
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPrescriptions.length === 0 ? (
                <div className="col-span-full p-8 text-center bg-card rounded-2xl border border-border">
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-base text-muted-foreground">
                    {selectedSearchResult ? 'No prescriptions match your search' : 'No prescriptions found'}
                  </p>
                  {selectedSearchResult && (
                    <button 
                      onClick={clearSearchFilter}
                      className="mt-4 text-sm text-primary hover:underline"
                    >
                      Clear filter to view all prescriptions
                    </button>
                  )}
                </div>
              ) : (
                displayPrescriptions.map((pres, index) => (
                  <div 
                    key={pres.id} 
                    className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-2xl hover:border-primary transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {pres.patientName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{pres.animalType}</p>
                      </div>
                      <div className={`p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <Pill className="h-5 w-5 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-sm font-medium text-foreground">💊 {pres.medicine}</p>
                      <p className="text-sm text-muted-foreground mt-2">📋 {pres.dosage}</p>
                      <p className="text-xs text-muted-foreground mt-1">⏰ {pres.frequency}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">Prescribed: {pres.prescribedDate}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditPrescription(pres)}
                          className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/10 transition-colors hover:border-primary/50"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleViewPrescriptionDetails(pres)}
                          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeletePrescription(pres.id)}
                          className="px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-50 transition-colors hover:border-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Welcome to Hospital Portal
            </h2>
            <p className="text-muted-foreground">Select a tab from the navigation to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Hospital Portal Navigation */}
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
                  Hospital Portal
                </h1>
                <p className="text-sm text-muted-foreground">Veterinary Management System</p>
              </div>
            </div>

            {/* Pill-Shaped Navigation Container - Perfectly centered */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <div className="bg-card border border-border rounded-2xl shadow-lg px-6 py-3">
                <div className="flex gap-4">
                  {hospitalMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          clearSearchFilter();
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
                    <p className="text-sm font-medium text-foreground">{user?.name || 'Hospital User'}</p>
                    <p className="text-xs text-muted-foreground">Hospital Admin</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                    isProfileDropdownOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <p className="text-base font-medium text-foreground">{user?.name || 'Hospital User'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email || 'hospital@livestocksync.com'}</p>
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
                placeholder="Search appointments, prescriptions..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
              />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-3">
                    {/* Appointments Results */}
                    {filteredData.appointments.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Appointments</h4>
                        {filteredData.appointments.map(item => (
                          <button
                            key={`appointment-${item.id}`}
                            onClick={() => handleSearchResultClick('appointment', item.id)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <Calendar className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.animal} • {item.time}</p>
                              <p className="text-xs text-muted-foreground">{item.symptoms}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Prescriptions Results */}
                    {filteredData.prescriptions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Prescriptions</h4>
                        {filteredData.prescriptions.map(item => (
                          <button
                            key={`prescription-${item.id}`}
                            onClick={() => handleSearchResultClick('prescription', item.id)}
                            className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                          >
                            <Pill className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.medicine} • {item.animal}</p>
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
                  placeholder="Search appointments, prescriptions..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base"
                />
                
                {/* Mobile Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3">
                      {filteredData.appointments.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2">Appointments</h4>
                          {filteredData.appointments.map(item => (
                            <button
                              key={`mobile-appointment-${item.id}`}
                              onClick={() => handleSearchResultClick('appointment', item.id)}
                              className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors text-left"
                            >
                              <Calendar className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.animal}</p>
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
              {hospitalMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                      clearSearchFilter();
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
            {activeTab === 'dashboard' ? 'Hospital overview and analytics' :
             activeTab === 'appointments' ? 'Manage veterinary appointments' :
             'Manage animal prescriptions'}
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Add/Edit Appointment Modal */}
      {(showAddAppointmentModal || editingAppointment) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowAddAppointmentModal(false);
                  setEditingAppointment(null);
                  resetNewAppointmentForm();
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
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={editingAppointment ? editingAppointment.patientName : newAppointment.patientName}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, patientName: e.target.value})
                      : setNewAppointment({...newAppointment, patientName: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Patient Email
                  </label>
                  <input
                    type="email"
                    value={editingAppointment ? editingAppointment.patientEmail : newAppointment.patientEmail}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, patientEmail: e.target.value})
                      : setNewAppointment({...newAppointment, patientEmail: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Patient Phone *
                  </label>
                  <input
                    type="tel"
                    value={editingAppointment ? editingAppointment.patientPhone : newAppointment.patientPhone}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, patientPhone: e.target.value})
                      : setNewAppointment({...newAppointment, patientPhone: e.target.value})
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
                    value={editingAppointment ? editingAppointment.animalType : newAppointment.animalType}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, animalType: e.target.value})
                      : setNewAppointment({...newAppointment, animalType: e.target.value})
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
                    value={editingAppointment ? editingAppointment.animalBreed : newAppointment.animalBreed}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, animalBreed: e.target.value})
                      : setNewAppointment({...newAppointment, animalBreed: e.target.value})
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
                    value={editingAppointment ? editingAppointment.animalAge : newAppointment.animalAge}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, animalAge: e.target.value})
                      : setNewAppointment({...newAppointment, animalAge: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., 4 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editingAppointment ? editingAppointment.date : newAppointment.date}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, date: e.target.value})
                      : setNewAppointment({...newAppointment, date: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={editingAppointment ? editingAppointment.time : newAppointment.time}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, time: e.target.value})
                      : setNewAppointment({...newAppointment, time: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Symptoms *
                  </label>
                  <textarea
                    value={editingAppointment ? editingAppointment.symptoms : newAppointment.symptoms}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, symptoms: e.target.value})
                      : setNewAppointment({...newAppointment, symptoms: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Describe the symptoms"
                    rows="3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    value={editingAppointment ? editingAppointment.notes : newAppointment.notes}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, notes: e.target.value})
                      : setNewAppointment({...newAppointment, notes: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Additional notes"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={editingAppointment ? editingAppointment.duration : newAppointment.duration}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, duration: e.target.value})
                      : setNewAppointment({...newAppointment, duration: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Status
                  </label>
                  <select
                    value={editingAppointment ? editingAppointment.status : newAppointment.status}
                    onChange={(e) => editingAppointment 
                      ? setEditingAppointment({...editingAppointment, status: e.target.value})
                      : setNewAppointment({...newAppointment, status: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setShowAddAppointmentModal(false);
                  setEditingAppointment(null);
                  resetNewAppointmentForm();
                }}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors hover:border-primary/50"
              >
                Cancel
              </button>
              <button
                onClick={editingAppointment ? handleSaveAppointmentEdit : handleAddAppointment}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {showAppointmentDetailModal && editingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Appointment Details</h2>
              </div>
              <button
                onClick={() => setShowAppointmentDetailModal(false)}
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
                  <h3 className="text-lg font-semibold text-foreground">{editingAppointment.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{editingAppointment.animalType}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{editingAppointment.patientEmail || 'No email'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{editingAppointment.patientPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{editingAppointment.date} at {editingAppointment.time}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Animal Details</p>
                  <p className="text-foreground">{editingAppointment.animalBreed}, {editingAppointment.animalAge}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Symptoms</p>
                  <p className="text-foreground">{editingAppointment.symptoms}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-foreground">{editingAppointment.notes || 'No additional notes'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    editingAppointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    editingAppointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {editingAppointment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowAppointmentDetailModal(false)}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAppointmentDetailModal(false);
                  handleEditAppointment(editingAppointment);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Edit Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Prescription Modal */}
      {(showAddPrescriptionModal || editingPrescription) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Pill className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">
                  {editingPrescription ? 'Edit Prescription' : 'Add New Prescription'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowAddPrescriptionModal(false);
                  setEditingPrescription(null);
                  resetNewPrescriptionForm();
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
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={editingPrescription ? editingPrescription.patientName : newPrescription.patientName}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, patientName: e.target.value})
                      : setNewPrescription({...newPrescription, patientName: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Patient Email
                  </label>
                  <input
                    type="email"
                    value={editingPrescription ? editingPrescription.patientEmail : newPrescription.patientEmail}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, patientEmail: e.target.value})
                      : setNewPrescription({...newPrescription, patientEmail: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Animal Type *
                  </label>
                  <select
                    value={editingPrescription ? editingPrescription.animalType : newPrescription.animalType}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, animalType: e.target.value})
                      : setNewPrescription({...newPrescription, animalType: e.target.value})
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
                    Medicine *
                  </label>
                  <input
                    type="text"
                    value={editingPrescription ? editingPrescription.medicine : newPrescription.medicine}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, medicine: e.target.value})
                      : setNewPrescription({...newPrescription, medicine: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Enter medicine name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    value={editingPrescription ? editingPrescription.dosage : newPrescription.dosage}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, dosage: e.target.value})
                      : setNewPrescription({...newPrescription, dosage: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., 2 times daily for 5 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={editingPrescription ? editingPrescription.frequency : newPrescription.frequency}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, frequency: e.target.value})
                      : setNewPrescription({...newPrescription, frequency: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., Every 12 hours"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={editingPrescription ? editingPrescription.instructions : newPrescription.instructions}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, instructions: e.target.value})
                      : setNewPrescription({...newPrescription, instructions: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Special instructions for administration"
                    rows="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Prescribed Date
                  </label>
                  <input
                    type="date"
                    value={editingPrescription ? editingPrescription.prescribedDate : newPrescription.prescribedDate}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, prescribedDate: e.target.value})
                      : setNewPrescription({...newPrescription, prescribedDate: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={editingPrescription ? editingPrescription.expiryDate : newPrescription.expiryDate}
                    onChange={(e) => editingPrescription 
                      ? setEditingPrescription({...editingPrescription, expiryDate: e.target.value})
                      : setNewPrescription({...newPrescription, expiryDate: e.target.value})
                    }
                    className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => {
                  setShowAddPrescriptionModal(false);
                  setEditingPrescription(null);
                  resetNewPrescriptionForm();
                }}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors hover:border-primary/50"
              >
                Cancel
              </button>
              <button
                onClick={editingPrescription ? handleSavePrescriptionEdit : handleAddPrescription}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                {editingPrescription ? 'Update Prescription' : 'Add Prescription'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {showPrescriptionDetailModal && editingPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <Pill className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Prescription Details</h2>
              </div>
              <button
                onClick={() => setShowPrescriptionDetailModal(false)}
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
                  <h3 className="text-lg font-semibold text-foreground">{editingPrescription.patientName}</h3>
                  <p className="text-sm text-muted-foreground">{editingPrescription.animalType}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Medicine</p>
                  <p className="text-lg font-bold text-green-900">{editingPrescription.medicine}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dosage</p>
                    <p className="text-foreground">{editingPrescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                    <p className="text-foreground">{editingPrescription.frequency}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instructions</p>
                  <p className="text-foreground">{editingPrescription.instructions || 'No special instructions'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prescribed Date</p>
                    <p className="text-foreground">{editingPrescription.prescribedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Expiry Date</p>
                    <p className="text-foreground">{editingPrescription.expiryDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    editingPrescription.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {editingPrescription.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowPrescriptionDetailModal(false)}
                className="flex-1 px-4 py-3 text-foreground border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPrescriptionDetailModal(false);
                  handleEditPrescription(editingPrescription);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
              >
                Edit Prescription
              </button>
              <button
                onClick={() => {
                  setShowPrescriptionDetailModal(false);
                  handleDeletePrescription(editingPrescription.id);
                }}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:opacity-90 transition-colors"
              >
                Delete
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
                <h2 className="text-2xl font-bold text-foreground">Hospital Settings</h2>
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
                <h3 className="text-lg font-semibold text-foreground">Hospital Information</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Hospital Name</p>
                    <p className="text-base mt-1">City Veterinary Hospital</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Address</p>
                    <p className="text-base mt-1">123 Main Street, Faisalabad</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <p className="text-sm font-medium text-foreground">Contact</p>
                    <p className="text-base mt-1">+92 300 1234567</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition-colors">
                    <div>
                      <p className="text-base font-medium text-foreground">Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive appointment reminders</p>
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
        showSettingsModal || showAddAppointmentModal || showAddPrescriptionModal ||
        showAppointmentDetailModal || showPrescriptionDetailModal) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsNotificationDropdownOpen(false);
            setShowSearchResults(false);
            setShowSettingsModal(false);
            setShowAddAppointmentModal(false);
            setShowAddPrescriptionModal(false);
            setShowAppointmentDetailModal(false);
            setShowPrescriptionDetailModal(false);
            if (!showAddAppointmentModal && !showAddPrescriptionModal) {
              setEditingAppointment(null);
              setEditingPrescription(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default HospitalPortal;