import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { LogOut, Mail, Phone, Calendar, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchEnquiries = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/enquiries`, {
        withCredentials: true
      });
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const fetchEnquiries = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/enquiries`, {
        withCredentials: true
      });
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/enquiries/${id}`, {
        withCredentials: true
      });
      setEnquiries(enquiries.filter(e => e.id !== id));
      toast.success('Enquiry deleted successfully');
    } catch (error) {
      toast.error('Failed to delete enquiry');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API_URL}/api/enquiries/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status } : e));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      contacted: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Mail },
      enrolled: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };

    const badge = badges[status] || badges.new;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0A192F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold heading-font">Admin Dashboard</h1>
              <p className="text-gray-300 body-font mt-1">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              data-testid="logout-btn"
              className="flex items-center space-x-2 bg-[#D4AF37] text-white px-6 py-3 font-medium transition-all hover:bg-[#B4952F] body-font"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 body-font">Total Enquiries</h3>
            <p className="text-3xl font-bold text-[#0A192F] heading-font mt-2">{enquiries.length}</p>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 body-font">New</h3>
            <p className="text-3xl font-bold text-blue-600 heading-font mt-2">
              {enquiries.filter(e => e.status === 'new').length}
            </p>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 body-font">Contacted</h3>
            <p className="text-3xl font-bold text-yellow-600 heading-font mt-2">
              {enquiries.filter(e => e.status === 'contacted').length}
            </p>
          </div>
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 body-font">Enrolled</h3>
            <p className="text-3xl font-bold text-green-600 heading-font mt-2">
              {enquiries.filter(e => e.status === 'enrolled').length}
            </p>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#0A192F] heading-font">Enquiries</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner w-12 h-12 border-4 border-[#0A192F] border-t-transparent rounded-full"></div>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 body-font">No enquiries yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Parent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider body-font">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50" data-testid={`enquiry-row-${enquiry.id}`}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 body-font">{enquiry.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 body-font">{enquiry.parent_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 body-font">
                          <div className="flex items-center mb-1">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {enquiry.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {enquiry.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 body-font">{enquiry.class_interested}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={enquiry.status}
                          onChange={(e) => handleUpdateStatus(enquiry.id, e.target.value)}
                          data-testid={`status-select-${enquiry.id}`}
                          className="text-sm border-0 focus:ring-0 bg-transparent body-font cursor-pointer"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="enrolled">Enrolled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500 body-font">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(enquiry.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(enquiry.id)}
                          data-testid={`delete-btn-${enquiry.id}`}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
