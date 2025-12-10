import React, { useState } from 'react';
import { Search, Filter, User, Mail, Phone, MapPin, X, Calendar, Shield, Building, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ali Ahmed',
      email: 'ali.ahmed@email.com',
      phone: '+92 300 1234567',
      type: 'Farmer',
      location: 'Faisalabad',
      status: 'Active',
      joinDate: '2024-01-15',
      address: '123 Main Street, Faisalabad',
      businessName: 'Ahmed Farms',
      lastLogin: '2024-01-20 10:30 AM',
      totalAnimals: 150,
      verified: true
    },
    {
      id: 2,
      name: 'Dr. Sara Khan',
      email: 'sara.khan@email.com',
      phone: '+92 300 7654321',
      type: 'Veterinarian',
      location: 'Lahore',
      status: 'Active',
      joinDate: '2024-01-10',
      address: '456 Medical Road, Lahore',
      businessName: 'Animal Care Clinic',
      lastLogin: '2024-01-20 09:15 AM',
      experience: '5 years',
      specialization: 'Livestock Health',
      verified: true
    },
    {
      id: 3,
      name: 'Saba',
      email: 'saba@email.com',
      phone: '+92 300 1122334',
      type: 'Farmer',
      location: 'Chiniot',
      status: 'Inactive',
      joinDate: '2024-01-05',
      address: '789 Farm Lane, Chiniot',
      businessName: 'Saba Poultry Farm',
      lastLogin: '2024-01-18 02:45 PM',
      totalAnimals: 80,
      verified: false
    },
    {
      id: 4,
      name: 'Mohammad Ali',
      email: 'mohammad.ali@email.com',
      phone: '+92 300 9988776',
      type: 'Slaughterhouse',
      location: 'Karachi',
      status: 'Active',
      joinDate: '2024-01-12',
      address: '321 Industrial Area, Karachi',
      businessName: 'Al-Madina Halal Meats',
      lastLogin: '2024-01-20 11:00 AM',
      capacity: '500 animals/day',
      certification: 'Halal Certified',
      verified: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Search functionality
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Apply filters
  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setShowFilterModal(false);
  };

  // View user details
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Get status icon and color
  const getStatusInfo = (status, verified) => {
    if (status === 'Active') {
      return {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        label: verified ? 'Verified & Active' : 'Active (Unverified)'
      };
    } else {
      return {
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        label: 'Inactive'
      };
    }
  };

  // Get type icon and color
  const getTypeInfo = (type) => {
    switch(type) {
      case 'Farmer':
        return {
          icon: <User className="h-5 w-5 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'Veterinarian':
        return {
          icon: <Shield className="h-5 w-5 text-blue-600" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'Slaughterhouse':
        return {
          icon: <Building className="h-5 w-5 text-orange-600" />,
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
      default:
        return {
          icon: <User className="h-5 w-5 text-gray-600" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">User Management</h1>
          <p className="text-base text-muted-foreground">View all registered users</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64 text-base"
            />
          </div>
          <button 
            onClick={() => setShowFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-base"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Summary */}
      {(filterType !== 'all' || filterStatus !== 'all') && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {filterType !== 'all' && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg">
              Type: {filterType}
            </span>
          )}
          {filterStatus !== 'all' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg">
              Status: {filterStatus}
            </span>
          )}
          <button 
            onClick={handleClearFilters}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-sm text-foreground">User</th>
                <th className="text-left p-4 font-medium text-sm text-foreground">Type</th>
                <th className="text-left p-4 font-medium text-sm text-foreground">Location</th>
                <th className="text-left p-4 font-medium text-sm text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-sm text-foreground">Join Date</th>
                <th className="text-left p-4 font-medium text-sm text-foreground">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const typeInfo = getTypeInfo(user.type);
                const statusInfo = getStatusInfo(user.status, user.verified);
                
                return (
                  <tr key={user.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                          <User size={20} className="text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-base font-medium text-foreground">{user.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail size={14} />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone size={14} />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                        {typeInfo.icon}
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-base text-foreground">
                        <MapPin size={16} />
                        {user.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        {statusInfo.icon}
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-base text-foreground">{user.joinDate}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          className="px-3 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-sm"
                          onClick={() => handleViewDetails(user)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 w-80 border border-border shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">Filter Users</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">User Type</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Veterinarian">Veterinarian</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleApplyFilters}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-colors text-base"
              >
                Apply Filters
              </button>
              <button 
                onClick={handleClearFilters}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors text-base"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <User size={24} className="text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedUser.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusInfo(selectedUser.status, selectedUser.verified).icon}
                    <span className="text-base text-muted-foreground">
                      {getStatusInfo(selectedUser.status, selectedUser.verified).label}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* User Type Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTypeInfo(selectedUser.type).icon}
                  <span className="text-lg font-semibold text-foreground">{selectedUser.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Joined: {selectedUser.joinDate}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-base font-medium text-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-base font-medium text-foreground">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-base font-medium text-foreground">{selectedUser.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Business Name</p>
                      <p className="text-base font-medium text-foreground">{selectedUser.businessName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Address</h3>
                <div className="p-4 border border-border rounded-lg bg-muted/20">
                  <p className="text-base text-foreground">{selectedUser.address}</p>
                </div>
              </div>

              {/* User Specific Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">User Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedUser.type === 'Farmer' && selectedUser.totalAnimals && (
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Animals</p>
                      <p className="text-2xl font-bold text-foreground">{selectedUser.totalAnimals}</p>
                      <p className="text-xs text-muted-foreground mt-1">Registered animals in farm</p>
                    </div>
                  )}
                  
                  {selectedUser.type === 'Veterinarian' && selectedUser.experience && (
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="text-2xl font-bold text-foreground">{selectedUser.experience}</p>
                      <p className="text-xs text-muted-foreground mt-1">Professional experience</p>
                    </div>
                  )}
                  
                  {selectedUser.type === 'Veterinarian' && selectedUser.specialization && (
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Specialization</p>
                      <p className="text-xl font-semibold text-foreground">{selectedUser.specialization}</p>
                    </div>
                  )}
                  
                  {selectedUser.type === 'Slaughterhouse' && selectedUser.capacity && (
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Daily Capacity</p>
                      <p className="text-2xl font-bold text-foreground">{selectedUser.capacity}</p>
                    </div>
                  )}
                  
                  {selectedUser.type === 'Slaughterhouse' && selectedUser.certification && (
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Certification</p>
                      <p className="text-xl font-semibold text-foreground">{selectedUser.certification}</p>
                    </div>
                  )}
                  
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="text-base font-medium text-foreground">{selectedUser.lastLogin}</p>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Account Verified</p>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedUser.verified ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-base font-medium text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="text-base font-medium text-red-600">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-base"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;