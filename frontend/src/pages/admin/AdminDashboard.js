import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { LogOut, Mail, Phone, Calendar, Trash2, CheckCircle, Clock, XCircle, Download, Bell, BarChart3, FileText, FileSpreadsheet, ChevronDown, Filter, X } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const lastCheckTime = useRef(new Date().toISOString());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchEnquiries = React.useCallback(async () => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) {
        params.end_date = endDate + 'T23:59:59.999Z';
      }
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const { data } = await axios.get(`${API_URL}/api/enquiries`, {
        withCredentials: true,
        params
      });
      setEnquiries(data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, statusFilter]);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/metrics/analytics`, {
        withCredentials: true
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, []);

  const checkNewEnquiries = React.useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/enquiries/count/new?since=${encodeURIComponent(lastCheckTime.current)}`,
        { withCredentials: true }
      );
      if (data.count > 0) {
        toast.success(`${data.count} new enquiry${data.count > 1 ? 'ies' : ''} received!`, {
          duration: 5000,
        });
        fetchEnquiries();
      }
      lastCheckTime.current = data.checked_at;
    } catch (error) {
      // Silently fail
    }
  }, [fetchEnquiries]);

  useEffect(() => {
    fetchEnquiries();
    fetchAnalytics();
  }, [fetchEnquiries, fetchAnalytics]);

  // Poll for new enquiries every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkNewEnquiries();
    }, 30000);
    return () => clearInterval(interval);
  }, [checkNewEnquiries]);

  const buildDateQueryString = () => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate + 'T23:59:59.999Z');
    if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await axios.get(`${API_URL}/api/enquiries/export/csv${buildDateQueryString()}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `enquiries_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Enquiries exported as CSV!');
    } catch (error) {
      toast.error('Failed to export enquiries');
    } finally {
      setExporting(false);
      setShowExportMenu(false);
    }
  };

  const handleExportXLSX = async () => {
    setExporting(true);
    try {
      const response = await axios.get(`${API_URL}/api/enquiries/export/xlsx${buildDateQueryString()}`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `enquiries_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel report with charts downloaded!');
    } catch (error) {
      toast.error('Failed to export Excel report');
    } finally {
      setExporting(false);
      setShowExportMenu(false);
    }
  };

  const clearDateFilter = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('all');
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold heading-font">Admin Dashboard</h1>
              <p className="text-gray-300 body-font mt-1 flex items-center">
                Welcome, {user?.name}
                <span className="ml-3 inline-flex items-center text-xs text-green-400">
                  <Bell className="w-3 h-3 mr-1 animate-pulse" />
                  Live monitoring active
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                data-testid="analytics-toggle-btn"
                className="flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-4 py-3 font-medium transition-all hover:bg-white/20 body-font"
              >
                <BarChart3 className="w-5 h-5" />
                <span>{showAnalytics ? 'Hide' : 'Show'} Analytics</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={exporting || enquiries.length === 0}
                  data-testid="export-menu-btn"
                  className="flex items-center space-x-2 bg-white text-[#0A192F] px-4 py-3 font-medium transition-all hover:bg-gray-100 body-font disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exporting ? (
                    <div className="spinner w-5 h-5 border-2 border-[#0A192F] border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Export</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                {showExportMenu && !exporting && (
                  <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg border border-gray-200 z-50" data-testid="export-menu-dropdown">
                    <button
                      onClick={handleExportCSV}
                      data-testid="export-csv-btn"
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-[#0A192F] hover:bg-gray-50 transition-colors body-font"
                    >
                      <FileText className="w-5 h-5 text-gray-500" />
                      <div>
                        <div className="font-medium">CSV Format</div>
                        <div className="text-xs text-gray-500">Simple data export</div>
                      </div>
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleExportXLSX}
                      data-testid="export-xlsx-btn"
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-[#0A192F] hover:bg-gray-50 transition-colors body-font"
                    >
                      <FileSpreadsheet className="w-5 h-5 text-[#D4AF37]" />
                      <div>
                        <div className="font-medium">Excel Report</div>
                        <div className="text-xs text-gray-500">With charts & analytics</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                data-testid="logout-btn"
                className="flex items-center space-x-2 bg-[#D4AF37] text-white px-4 py-3 font-medium transition-all hover:bg-[#B4952F] body-font"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              data-testid="toggle-date-filter-btn"
              className={`flex items-center space-x-2 px-4 py-2 font-medium body-font transition-all ${
                (startDate || endDate || statusFilter !== 'all')
                  ? 'bg-[#D4AF37] text-white hover:bg-[#B4952F]' 
                  : 'bg-gray-100 text-[#0A192F] hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>{(startDate || endDate || statusFilter !== 'all') ? 'Filters Active' : 'Filters'}</span>
            </button>
            
            {showDateFilter && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 body-font">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    data-testid="status-filter-select"
                    className="px-3 py-2 border border-gray-300 body-font text-sm focus:ring-2 focus:ring-[#0A192F] focus:border-transparent cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 body-font">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-testid="start-date-input"
                    className="px-3 py-2 border border-gray-300 body-font text-sm focus:ring-2 focus:ring-[#0A192F] focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 body-font">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-testid="end-date-input"
                    min={startDate}
                    className="px-3 py-2 border border-gray-300 body-font text-sm focus:ring-2 focus:ring-[#0A192F] focus:border-transparent"
                  />
                </div>
                {(startDate || endDate || statusFilter !== 'all') && (
                  <button
                    onClick={clearDateFilter}
                    data-testid="clear-date-filter-btn"
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 body-font transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            )}
            
            <div className="ml-auto text-sm text-gray-500 body-font">
              Showing <span className="font-semibold text-[#0A192F]">{enquiries.length}</span> {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
              {(startDate || endDate || statusFilter !== 'all') && (
                <span className="ml-2 text-xs text-[#D4AF37]">
                  (filtered)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && analytics && (
          <div className="bg-white border border-gray-100 shadow-sm p-6 mb-8" data-testid="analytics-panel">
            <h2 className="text-xl font-bold text-[#0A192F] heading-font mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#D4AF37]" />
              Website Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4">
                <h3 className="text-sm text-gray-500 body-font">Total Page Views</h3>
                <p className="text-2xl font-bold text-[#0A192F] heading-font mt-1">
                  {analytics.totals.page_views}
                </p>
              </div>
              <div className="bg-gray-50 p-4">
                <h3 className="text-sm text-gray-500 body-font">Form Submissions</h3>
                <p className="text-2xl font-bold text-[#0A192F] heading-font mt-1">
                  {analytics.totals.form_submits}
                </p>
              </div>
              <div className="bg-gray-50 p-4">
                <h3 className="text-sm text-gray-500 body-font">Unique Sessions</h3>
                <p className="text-2xl font-bold text-[#0A192F] heading-font mt-1">
                  {analytics.totals.unique_sessions}
                </p>
              </div>
            </div>
            {analytics.page_performance && analytics.page_performance.length > 0 && (
              <div>
                <h3 className="font-semibold text-[#0A192F] heading-font mb-3">Top Pages Performance</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left body-font text-gray-600">Page</th>
                        <th className="px-4 py-2 text-left body-font text-gray-600">Views</th>
                        <th className="px-4 py-2 text-left body-font text-gray-600">Avg Load Time</th>
                        <th className="px-4 py-2 text-left body-font text-gray-600">Avg DOM Ready</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.page_performance.map((page) => (
                        <tr key={page.page} className="border-t border-gray-100">
                          <td className="px-4 py-2 body-font">{page.page}</td>
                          <td className="px-4 py-2 body-font">{page.views}</td>
                          <td className="px-4 py-2 body-font">{page.avg_load_time}ms</td>
                          <td className="px-4 py-2 body-font">{page.avg_dom_ready}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

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
