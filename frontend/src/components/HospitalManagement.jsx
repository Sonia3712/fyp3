import React, { useState, useEffect } from 'react';
import { Search, Plus, MapPin, Phone, Star, Edit, Trash2, Building2, X, RefreshCw } from 'lucide-react';

const HospitalManagement = ({ onAddActivity }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newHospital, setNewHospital] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    services: '',
    doctors: 0,
    status: 'Active'
  });

  const API_URL = 'http://localhost:8000';

  // Fetch hospitals from API
  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/hospitals`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHospitals(data.hospitals || []);
      }
    } catch (err) {
      console.error('Error fetching hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  // Search functionality
  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add new hospital to backend
  const handleAddHospital = async () => {
    if (!newHospital.name || !newHospital.email || !newHospital.phone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const hospitalData = {
        name: newHospital.name,
        address: newHospital.address,
        phone: newHospital.phone,
        email: newHospital.email,
        services: newHospital.services.split(',').map(s => s.trim()),
        doctors: parseInt(newHospital.doctors) || 0,
        status: newHospital.status
      };

      const response = await fetch(`${API_URL}/api/admin/hospitals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(hospitalData)
      });

      if (response.ok) {
        alert('Hospital added successfully!');
        setShowAddModal(false);
        
        // Reset form
        setNewHospital({
          name: '',
          email: '',
          phone: '',
          address: '',
          services: '',
          doctors: 0,
          status: 'Active'
        });
        
        // Refresh hospitals list
        fetchHospitals();
        
        // Add to recent activities
        if (onAddActivity) {
          onAddActivity({
            action: 'New hospital added',
            user: newHospital.name,
            time: 'Just now',
            type: 'business',
            status: 'completed'
          });
        }
      } else {
        alert('Failed to add hospital');
      }
    } catch (err) {
      console.error('Error adding hospital:', err);
      alert('Error adding hospital. Please try again.');
    }
  };

  // Edit hospital
  const handleEditHospital = (hospital) => {
    setEditingHospital({ 
      ...hospital,
      services: Array.isArray(hospital.services) ? hospital.services.join(', ') : hospital.services,
      doctors: hospital.doctors || 0
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingHospital) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/hospitals/${editingHospital.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: editingHospital.name,
          email: editingHospital.email,
          phone: editingHospital.phone || editingHospital.contact,
          address: editingHospital.address,
          services: editingHospital.services.split(',').map(s => s.trim()),
          doctors: parseInt(editingHospital.doctors) || 0,
          status: editingHospital.status
        })
      });

      if (response.ok) {
        alert('Hospital updated successfully!');
        setShowEditModal(false);
        setEditingHospital(null);
        
        // Refresh hospitals list
        fetchHospitals();
        
        // Add to recent activities
        if (onAddActivity) {
          onAddActivity({
            action: 'Hospital updated',
            user: editingHospital.name,
            time: 'Just now',
            type: 'business',
            status: 'completed'
          });
        }
      } else {
        alert('Failed to update hospital');
      }
    } catch (err) {
      console.error('Error updating hospital:', err);
      alert('Error updating hospital. Please try again.');
    }
  };

  // Delete hospital from backend
  const handleDeleteHospital = async (hospitalId) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) {
      return;
    }

    const hospital = hospitals.find(h => h.id === hospitalId);
    
    try {
      const response = await fetch(`${API_URL}/api/admin/hospitals/${hospitalId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert('Hospital deleted successfully!');
        
        // Update local state
        setHospitals(hospitals.filter(h => h.id !== hospitalId));
        
        // Add to recent activities
        if (hospital && onAddActivity) {
          onAddActivity({
            action: 'Hospital deleted',
            user: hospital.name,
            time: 'Just now',
            type: 'business',
            status: 'completed'
          });
        }
      } else {
        alert('Failed to delete hospital');
      }
    } catch (err) {
      console.error('Error deleting hospital:', err);
      alert('Error deleting hospital. Please try again.');
    }
  };

  if (loading && hospitals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hospital Management
            </h1>
            <p className="text-base text-muted-foreground">Manage veterinary hospitals and clinics</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading hospitals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Hospital Management
          </h1>
          <p className="text-base text-muted-foreground">
            Manage veterinary hospitals and clinics ({hospitals.length} total)
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-64 text-base"
            />
          </div>
          <button
            onClick={fetchHospitals}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors text-base"
          >
            <Plus size={20} />
            Add Hospital
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <div key={hospital.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Building2 size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{hospital.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm text-foreground">4.5</span>
                    <span className="text-sm text-muted-foreground">({hospital.doctors || '5'} doctors)</span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                hospital.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : hospital.status === 'Verified'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {hospital.status || 'Active'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                {hospital.phone || hospital.contact || 'N/A'}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin size={16} className="mt-0.5" />
                {hospital.address || 'Address not provided'}
              </div>
              {hospital.services && Array.isArray(hospital.services) && hospital.services.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-foreground mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {service}
                      </span>
                    ))}
                    {hospital.services.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                        +{hospital.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {hospital.email || 'No email'}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditHospital(hospital)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteHospital(hospital.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No hospitals found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 'Try adjusting your search query' : 'Add your first hospital to get started'}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg hover:opacity-90 transition-colors mx-auto"
          >
            <Plus size={20} />
            Add Hospital
          </button>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">Add New Hospital</h3>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hospital Name *</label>
                <input
                  type="text"
                  value={newHospital.name}
                  onChange={(e) => setNewHospital({...newHospital, name: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter hospital name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                <input
                  type="email"
                  value={newHospital.email}
                  onChange={(e) => setNewHospital({...newHospital, email: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                <input
                  type="text"
                  value={newHospital.phone}
                  onChange={(e) => setNewHospital({...newHospital, phone: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <textarea
                  value={newHospital.address}
                  onChange={(e) => setNewHospital({...newHospital, address: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter full address"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Doctors</label>
                <input
                  type="number"
                  min="0"
                  value={newHospital.doctors}
                  onChange={(e) => setNewHospital({...newHospital, doctors: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter number of doctors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Services (comma separated)</label>
                <textarea
                  value={newHospital.services}
                  onChange={(e) => setNewHospital({...newHospital, services: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Emergency care, Surgery, Vaccination"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select 
                  value={newHospital.status}
                  onChange={(e) => setNewHospital({...newHospital, status: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleAddHospital}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-colors text-base"
              >
                Add Hospital
              </button>
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hospital Modal */}
      {showEditModal && editingHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-foreground">Edit Hospital</h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Hospital Name</label>
                <input
                  type="text"
                  value={editingHospital.name}
                  onChange={(e) => setEditingHospital({...editingHospital, name: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={editingHospital.email}
                  onChange={(e) => setEditingHospital({...editingHospital, email: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="text"
                  value={editingHospital.phone || editingHospital.contact}
                  onChange={(e) => setEditingHospital({...editingHospital, phone: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Number of Doctors</label>
                <input
                  type="number"
                  min="0"
                  value={editingHospital.doctors}
                  onChange={(e) => setEditingHospital({...editingHospital, doctors: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Services (comma separated)</label>
                <textarea
                  value={editingHospital.services}
                  onChange={(e) => setEditingHospital({...editingHospital, services: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select 
                  value={editingHospital.status || 'Active'}
                  onChange={(e) => setEditingHospital({...editingHospital, status: e.target.value})}
                  className="w-full p-2 border border-border rounded-lg bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-colors text-base"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-muted text-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalManagement;