import React, { useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  Building2, 
  Warehouse, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Globe, 
  Smartphone,
  Calendar,
  Bell,
  Heart,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Search,
  Menu,
  X,
  Send,
  ShieldCheck,
  BadgeCheck,
  UserCircle,
  Lock
} from 'lucide-react';
import Footer from './Footer';

const LandingPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  
  // UPDATED Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const features = [
    {
      icon: '🏥',
      title: 'Veterinary Hospital Finder',
      description: 'Locate and book appointments with nearby veterinary hospitals using GPS-based services',
      color: 'from-primary to-accent',
      borderColor: 'hover:border-primary',
      shadowColor: 'hover:shadow-primary/20',
      role: 'all'
    },
    {
      icon: '🔪',
      title: 'Slaughterhouse Locator',
      description: 'Find registered slaughterhouses with operational timings and contact details',
      color: 'from-primary to-accent',
      borderColor: 'hover:border-primary',
      shadowColor: 'hover:shadow-primary/20',
      role: 'all'
    },
    {
      icon: '🐄',
      title: 'Livestock Health Log',
      description: 'Maintain individual animal profiles with vaccination history and health records',
      color: 'from-primary to-accent',
      borderColor: 'hover:border-primary',
      shadowColor: 'hover:shadow-primary/20',
      role: 'all'
    },
    {
      icon: '🐄💉',
      title: 'Vaccination Reminders',
      description: 'Automated alerts for upcoming vaccinations and medical appointments',
      color: 'from-primary to-accent',
      borderColor: 'hover:border-primary',
      shadowColor: 'hover:shadow-primary/20',
      role: 'all'
    },
    {
      icon: '🤖',
      title: 'AI Chatbot Assistance',
      description: '24/7 AI-powered support in Urdu and English for livestock care',
      color: 'from-primary to-accent',
      borderColor: 'hover:border-primary',
      shadowColor: 'hover:shadow-primary/20',
      role: 'all'
    },
    {
      icon: '💊',
      title: 'Medicine Suggestions',
      description: 'Doctor-approved medicine recommendations for common health issues',
      color: 'from-primary to-accent',
      borderColor: 'hover:border-primary',
      shadowColor: 'hover:shadow-primary/20',
      role: 'all'
    }
  ];

  const stats = [
    { number: '1,234+', label: 'Registered Farmers' },
    { number: '89+', label: 'Veterinary Hospitals' },
    { number: '45+', label: 'Slaughterhouses' },
    { number: '567+', label: 'Happy Customers' }
  ];

  const benefits = [
    {
      text: 'Bilingual support (Urdu & English)',
      hoverColor: 'group hover:text-primary'
    },
    {
      text: 'Weather-based health suggestions',
      hoverColor: 'group hover:text-primary'
    },
    {
      text: 'Real-time appointment booking',
      hoverColor: 'group hover:text-primary'
    },
    {
      text: 'AI-powered assistance',
      hoverColor: 'group hover:text-primary'
    }
  ];

  const whyChooseItems = [
    {
      icon: Globe,
      title: 'Digital Transformation',
      description: 'Bringing modern technology to traditional farming practices',
      color: 'text-primary'
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Designed for farmers with Android smartphones in rural areas',
      color: 'text-primary'
    },
    {
      icon: BarChart3,
      title: 'Data Driven',
      description: 'Smart analytics and insights for better decision making',
      color: 'text-primary'
    }
  ];

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const full_name = formData.get("name") || "User";
    const email = (formData.get("email") || "").trim().toLowerCase();
    const password = formData.get("password") || "";
    const confirmPassword = formData.get("confirmPassword") || "";
    const role = selectedRole;

    console.log("Auth Mode:", authMode);
    console.log("Selected Role:", selectedRole);
    console.log("Email:", email);

    // For signup — confirm password
    if (authMode === "signup" && password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      if (authMode === "signup") {
        const payload = { 
          email, 
          password, 
          full_name, 
          phone: "", 
          role 
        };

        console.log("Signup Payload:", payload);

        const resp = await axios.post(
          "http://localhost:8000/api/auth/signup",
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Signup Response:", resp.data);

        alert(`✅ Successfully signed up as ${selectedRole}! Now you can login.`);
        
        // Auto-fill login form with same credentials
        setShowSignup(false);
        setShowLogin(true);

      } else {
        // LOGIN
        const payload = { email, password };

        console.log("Login Payload:", payload);

        const resp = await axios.post(
          "http://localhost:8000/api/auth/login",
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Login Response:", resp.data);
        
        // Get user role from backend response
        const userRole = resp.data.user?.role;
        console.log("User role from backend:", userRole);
        
        // Store token + user
        localStorage.setItem("livestocksync_token", resp.data.access_token);
        localStorage.setItem(
          "livestocksync_user",
          JSON.stringify(resp.data.user)
        );

        // IMPORTANT: Use the role from backend response
        onLogin(resp.data.user, userRole);
        setShowLogin(false);
      }
    } catch (err) {
      console.error("Authentication Error:", err);
      
      let errorMessage = "Authentication failed";
      
      if (err.response) {
        // Show backend error message
        if (err.response.data?.detail) {
          if (typeof err.response.data.detail === 'string') {
            errorMessage = err.response.data.detail;
          } else if (Array.isArray(err.response.data.detail)) {
            // Handle validation errors
            const errors = err.response.data.detail.map(e => e.msg).join(', ');
            errorMessage = errors;
          } else {
            errorMessage = JSON.stringify(err.response.data.detail);
          }
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.status === 422) {
          errorMessage = "Validation error. Please check your input.";
        } else {
          errorMessage = `Error ${err.response.status}: ${err.response.statusText}`;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check if backend is running.";
      }
      
      alert(errorMessage);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'signup' : 'login');
    // Don't reset role when switching modes - keep it as is
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFieldFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleFieldBlur = () => {
    setFocusedField('');
  };

  const validateContactForm = () => {
    const errors = {};
    
    if (!contactForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!contactForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    }
    
    return errors;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const errors = validateContactForm();
    
    if (Object.keys(errors).length === 0) {
      // Form is valid, show thank you message
      setShowThankYou(true);
      setFormErrors({});
      // Reset form
      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
      setFormSubmitted(false);
      // Hide thank you message after 5 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
    } else {
      setFormErrors(errors);
    }
  };

  const handleContactSales = () => {
    // Scroll to contact section
    document.getElementById('contact').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const closeAuthModal = () => {
    setShowLogin(false);
    setShowSignup(false);
    // Don't reset role when closing modal
  };

  const getFieldBorderColor = (fieldName) => {
    if (formErrors[fieldName]) {
      return 'border-red-500 ring-2 ring-red-500/20';
    }
    if (formSubmitted && !contactForm[fieldName]) {
      return 'border-yellow-500 ring-2 ring-yellow-500/20';
    }
    if (focusedField === fieldName) {
      return 'border-primary ring-2 ring-primary/20';
    }
    return 'border-gray-300';
  };

  const getLabelColor = (fieldName) => {
    if (focusedField === fieldName) {
      return 'text-primary font-semibold';
    }
    return 'text-foreground';
  };

  const getInputHoverClass = (fieldName) => {
    if (!formErrors[fieldName] && !(formSubmitted && !contactForm[fieldName])) {
      return 'hover:border-primary/50';
    }
    return '';
  };

  // Role selection component
  const RoleSelector = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-foreground mb-1">
          Select Your Role
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole('admin')}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'admin'
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <ShieldCheck className={`h-8 w-8 mb-2 ${
              selectedRole === 'admin' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className="font-medium">Administrator</span>
            <span className="text-xs text-muted-foreground mt-1">System Management</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('hospital')}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'hospital'
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Building2 className={`h-8 w-8 mb-2 ${
              selectedRole === 'hospital' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className="font-medium">Hospital</span>
            <span className="text-xs text-muted-foreground mt-1">Veterinary Services</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('slaughterhouse')}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'slaughterhouse'
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Warehouse className={`h-8 w-8 mb-2 ${
              selectedRole === 'slaughterhouse' ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <span className="font-medium">Slaughterhouse</span>
            <span className="text-xs text-muted-foreground mt-1">Processing Services</span>
          </button>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        {selectedRole === 'admin' && (
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">System Administrator</p>
              <p className="text-xs text-muted-foreground">
                Manage users, hospitals, slaughterhouses, and platform settings. Full system access.
              </p>
            </div>
          </div>
        )}
        {selectedRole === 'Hospital' && (
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Veterinary Hospital</p>
              <p className="text-xs text-muted-foreground">
                Manage appointments, animal records, prescriptions, and hospital operations.
              </p>
            </div>
          </div>
        )}
        {selectedRole === 'slaughterhouse' && (
          <div className="flex items-start gap-3">
            <Warehouse className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Slaughterhouse</p>
              <p className="text-xs text-muted-foreground">
                Manage bookings, time slots, operations, and customer interactions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground" style={{
      '--background': 'oklch(0.98 0 0)',
      '--foreground': 'oklch(0.12 0 0)',
      '--primary': 'oklch(0.40 0.15 285)',
      '--primary-foreground': 'oklch(0.98 0 0)',
      '--secondary': 'oklch(0.45 0.15 200)',
      '--secondary-foreground': 'oklch(0.98 0 0)',
      '--accent': 'oklch(0.56 0.18 190)',
      '--accent-foreground': 'oklch(0.98 0 0)',
      '--muted': 'oklch(0.93 0 0)',
      '--muted-foreground': 'oklch(0.50 0 0)',
      '--border': 'oklch(0.92 0 0)',
      '--card': 'oklch(1 0 0)',
    }}>
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-card rounded-2xl shadow-lg border border-border flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>
                  <img 
                    src="/logo1.png" 
                    alt="LivestockSync Logo" 
                    className="w-7 h-7 object-contain relative z-10"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-md opacity-50 -z-10"></div>
              </div>

              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LivestockSync
                </h1>
                <p className="text-xs text-muted-foreground">Digital Farming Revolution</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <div className="bg-card border border-border rounded-2xl shadow-lg px-4 py-2">
                <div className="flex gap-3">
                  <a 
                    href="#features" 
                    className="flex flex-col items-center justify-center px-3 py-1 rounded-xl text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm transition-all duration-200 min-w-[70px] group"
                  >
                    <Building2 className="h-3 w-3 mb-1 group-hover:text-accent-foreground transition-colors duration-200" />
                    <span className="text-xs font-semibold leading-tight group-hover:text-accent-foreground transition-colors duration-200">Features</span>
                  </a>
                  <a 
                    href="#about" 
                    className="flex flex-col items-center justify-center px-3 py-1 rounded-xl text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm transition-all duration-200 min-w-[70px] group"
                  >
                    <Users className="h-3 w-3 mb-1 group-hover:text-accent-foreground transition-colors duration-200" />
                    <span className="text-xs font-semibold leading-tight group-hover:text-accent-foreground transition-colors duration-200">About</span>
                  </a>
                  <a 
                    href="#contact" 
                    className="flex flex-col items-center justify-center px-3 py-1 rounded-xl text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm transition-all duration-200 min-w-[70px] group"
                  >
                    <Phone className="h-3 w-3 mb-1 group-hover:text-accent-foreground transition-colors duration-200" />
                    <span className="text-xs font-semibold leading-tight group-hover:text-accent-foreground transition-colors duration-200">Contact</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Auth Buttons and Mobile Menu */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => {
                  setShowLogin(true);
                  setAuthMode('login');
                  // Don't reset role - keep current selection
                }}
                className="px-4 py-2 text-primary hover:text-primary/80 font-medium transition-all duration-300 rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/20"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setShowSignup(true);
                  setAuthMode('signup');
                  // Don't reset role - keep current selection
                }}
                className="px-6 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-all duration-300 font-medium hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden group"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-foreground hover:bg-accent transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-card border-t border-border">
              <div className="px-3 pt-1 pb-3 space-y-1">
                <a 
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground group"
                >
                  <Building2 className="h-4 w-4 mr-2 group-hover:text-accent-foreground transition-colors duration-200" />
                  Features
                </a>
                <a 
                  href="#about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground group"
                >
                  <Users className="h-4 w-4 mr-2 group-hover:text-accent-foreground transition-colors duration-200" />
                  About
                </a>
                <a 
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground group"
                >
                  <Phone className="h-4 w-4 mr-2 group-hover:text-accent-foreground transition-colors duration-200" />
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8" style={{
        background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center">
            <div className="text-center max-w-4xl">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    <Award className="w-3 h-3 mr-1" />
                    Transforming Livestock Management
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Smart Animal
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Management</span>
                    Platform
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    LivestockSync provides a comprehensive digital solution for farmers to manage 
                    livestock health, connect with veterinary services, and streamline operations 
                    through intelligent technology.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => {
                      setShowSignup(true);
                      setAuthMode('signup');
                      // Keep current role selection
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl hover:opacity-90 transition-all duration-300 font-semibold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-primary/20 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="w-4 h-4 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                  <button 
                    onClick={handleContactSales}
                    className="px-6 py-3 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold text-base flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <Play className="w-4 h-4" />
                    Watch Demo
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 max-w-2xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white/80 rounded-xl border border-border backdrop-blur-sm hover:transform hover:-translate-y-1 transition-all duration-300">
                      <div className="text-xl font-bold text-foreground">{stat.number}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Everything You Need for 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Modern Livestock Farming</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform brings digital transformation to traditional farming practices, 
              making livestock management efficient, accessible, and profitable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 group hover:border-primary hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-2xl text-primary-foreground"
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Revolutionizing 
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Pakistan's Livestock Sector</span>
              </h2>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                LivestockSync addresses critical challenges faced by farmers in Pakistan, including 
                limited access to veterinary services, poor record-keeping, and communication gaps 
                between stakeholders in the livestock value chain.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 cursor-pointer group ${benefit.hoverColor}`}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 group-hover:text-primary transition-colors duration-200" />
                    <span className="text-foreground text-sm transition-colors duration-200 group-hover:text-primary">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose LivestockSync with Hover Effects */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 transition-all duration-300 hover:border-primary hover:shadow-primary/20">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Why Choose LivestockSync?
                </h3>
                
                <div className="space-y-3">
                  {whyChooseItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                          <p className="text-muted-foreground text-xs mt-1">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" style={{
        background: 'linear-gradient(135deg, var(--primary), var(--accent))'
      }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Livestock Management?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-6">
            Join thousands of farmers who are already using LivestockSync to improve their productivity and animal welfare.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => {
                setShowSignup(true);
                setAuthMode('signup');
                // Keep current role selection
              }}
              className="px-6 py-3 bg-background text-foreground rounded-xl hover:bg-background/90 transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-primary/20"
            >
              Start Free Trial
            </button>
            <button 
              onClick={handleContactSales}
              className="px-6 py-3 border-2 border-background text-background rounded-xl hover:bg-background hover:text-foreground transition-all duration-300 font-semibold text-base hover:shadow-lg hover:shadow-primary/20"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Our Location</h3>
                  <p className="text-muted-foreground text-xs">FAST University, Chiniot-Faisalabad Campus</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Phone Number</h3>
                  <p className="text-muted-foreground text-xs">+92 300 123 4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-card rounded-xl border border-border">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Email Address</h3>
                  <p className="text-muted-foreground text-xs">info@livestocksync.com</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                {showThankYou ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                    <p className="text-muted-foreground">
                      Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${getLabelColor('firstName')}`}>
                          First Name
                        </label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={contactForm.firstName}
                          onChange={handleContactChange}
                          onFocus={() => handleFieldFocus('firstName')}
                          onBlur={handleFieldBlur}
                          className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none transition-all duration-200 text-sm ${getFieldBorderColor('firstName')} ${getInputHoverClass('firstName')}`}
                          placeholder="Enter your first name"
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${getLabelColor('lastName')}`}>
                          Last Name
                        </label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={contactForm.lastName}
                          onChange={handleContactChange}
                          onFocus={() => handleFieldFocus('lastName')}
                          onBlur={handleFieldBlur}
                          className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none transition-all duration-200 text-sm ${getFieldBorderColor('lastName')} ${getInputHoverClass('lastName')}`}
                          placeholder="Enter your last name"
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${getLabelColor('email')}`}>
                        Email
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        onFocus={() => handleFieldFocus('email')}
                        onBlur={handleFieldBlur}
                        className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none transition-all duration-200 text-sm ${getFieldBorderColor('email')} ${getInputHoverClass('email')}`}
                        placeholder="Enter your email"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 transition-colors duration-200 ${getLabelColor('message')}`}>
                        Message
                      </label>
                      <textarea 
                        rows="4"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        onFocus={() => handleFieldFocus('message')}
                        onBlur={handleFieldBlur}
                        className={`w-full px-3 py-2 bg-background border rounded-lg focus:outline-none transition-all duration-200 text-sm ${getFieldBorderColor('message')} ${getInputHoverClass('message')}`}
                        placeholder="Enter your message"
                      ></textarea>
                      {formErrors.message && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                      )}
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-colors font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 relative overflow-hidden group"
                    >
                      <Send className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Send Message</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />

      {/* Auth Modal - FIXED FOR VISIBILITY */}
      {(showLogin || showSignup) && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeAuthModal}
        >
          <div 
            className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      {authMode === 'login' 
                        ? 'Sign in to your LivestockSync account' 
                        : `Join as ${selectedRole === 'admin' ? 'Administrator' : selectedRole === 'hospital' ? 'Hospital' : 'Slaughterhouse'}`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeAuthModal}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm hover:border-primary/50 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm hover:border-primary/50 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm hover:border-primary/50 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>

                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Confirm Password
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm hover:border-primary/50 transition-all duration-200"
                      placeholder="Confirm your password"
                    />
                  </div>
                )}

                {/* Role Selector */}
                <RoleSelector />

                {authMode === 'login' && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary w-3 h-3" />
                      <span className="ml-2 text-xs text-muted-foreground">Remember me</span>
                    </label>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowLogin(false);
                        setShowForgotPassword(true);
                        setResetEmail(""); // Reset email field
                      }}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-colors font-semibold text-sm mt-6"
                >
                  <span>
                    {authMode === 'login' ? 'Sign In' : `Sign Up as ${selectedRole === 'admin' ? 'Administrator' : selectedRole === 'hospital' ? 'Hospital' : 'Slaughterhouse'}`}
                  </span>
                </button>
              </form>

              <div className="mt-4 text-center pt-4 border-t border-border">
                <p className="text-muted-foreground text-sm">
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={toggleAuthMode}
                    className="text-primary hover:text-primary/80 font-semibold"
                  >
                    {authMode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPDATED FORGOT PASSWORD MODAL */}
      {showForgotPassword && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowForgotPassword(false)}
        >
          <div 
            className="bg-card rounded-2xl w-full max-w-md p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Forgot Password</h2>
              <button 
                onClick={() => setShowForgotPassword(false)}
                className="p-1 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Enter your email address to receive a verification OTP
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={isSendingOTP}
                />
              </div>

              <button
                onClick={async () => {
                  if (!resetEmail) {
                    alert("Please enter your email");
                    return;
                  }

                  setIsSendingOTP(true);
                  try {
                    const response = await axios.post("http://localhost:8000/api/auth/forgot-password", {
                      email: resetEmail
                    });

                    if (response.data.success) {
                      alert(`✅ OTP has been sent to ${resetEmail}`);
                      console.log("OTP sent:", response.data.otp); // Debug ke liye
                      
                      // Forgot password band karo, reset password modal show karo
                      setShowForgotPassword(false);
                      setShowResetPassword(true);
                    }
                  } catch (error) {
                    console.error("Error sending OTP:", error);
                    alert(error.response?.data?.detail || "Error sending OTP. Please try again.");
                  } finally {
                    setIsSendingOTP(false);
                  }
                }}
                disabled={isSendingOTP}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-colors font-semibold disabled:opacity-50"
              >
                {isSendingOTP ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* UPDATED RESET PASSWORD MODAL */}
      {showResetPassword && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResetPassword(false)}
        >
          <div 
            className="bg-card rounded-2xl w-full max-w-md p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
              <button 
                onClick={() => setShowResetPassword(false)}
                className="p-1 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Enter the OTP sent to your email and set a new password
            </p>

            <div className="space-y-4">
              {/* OTP Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Verification OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Check your email for the OTP
                </p>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={async () => {
                  // Validation
                  if (!otp || !newPassword || !confirmNewPassword) {
                    alert("Please fill all fields");
                    return;
                  }

                  if (newPassword.length < 6) {
                    alert("Password must be at least 6 characters");
                    return;
                  }

                  if (newPassword !== confirmNewPassword) {
                    alert("Passwords do not match");
                    return;
                  }

                  setIsResettingPassword(true);
                  try {
                    const response = await axios.post("http://localhost:8000/api/auth/reset-password", {
                      email: resetEmail,
                      otp: otp,
                      new_password: newPassword
                    });

                    if (response.data.success) {
                      alert("✅ Password reset successful! Please login with your new password.");
                      
                      // Reset all states
                      setShowResetPassword(false);
                      setResetEmail("");
                      setOtp("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                      
                      // Show login modal
                      setShowLogin(true);
                      setAuthMode('login');
                    }
                  } catch (error) {
                    console.error("Error resetting password:", error);
                    alert(error.response?.data?.detail || "Error resetting password. Please try again.");
                  } finally {
                    setIsResettingPassword(false);
                  }
                }}
                disabled={isResettingPassword}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-2.5 rounded-lg hover:opacity-90 transition-colors font-semibold disabled:opacity-50"
              >
                {isResettingPassword ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting Password...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* Resend OTP option */}
              <div className="text-center">
                <button
                  onClick={async () => {
                    if (!resetEmail) {
                      alert("Please enter your email");
                      return;
                    }

                    setIsSendingOTP(true);
                    try {
                      const response = await axios.post("http://localhost:8000/api/auth/forgot-password", {
                        email: resetEmail
                      });

                      if (response.data.success) {
                        alert(`✅ New OTP sent to ${resetEmail}`);
                        console.log("New OTP:", response.data.otp); // Debug
                      }
                    } catch (error) {
                      console.error("Error resending OTP:", error);
                      alert(error.response?.data?.detail || "Error resending OTP.");
                    } finally {
                      setIsSendingOTP(false);
                    }
                  }}
                  className="text-sm text-primary hover:text-primary/80"
                  disabled={isSendingOTP}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LandingPage;