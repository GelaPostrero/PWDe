import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobseekerHeader from '../../components/ui/JobseekerHeader';
import Footer from '../../components/ui/Footer';
import Chatbot from '../../components/ui/Chatbot';
import ProfileModal from '../../components/ui/ProfileModal';
import Swal from 'sweetalert2';
import api from '../../utils/api';

const Support = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [showEditTicket, setShowEditTicket] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    description: '',
    attachments: []
  });

  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch support tickets on component mount
  useEffect(() => {
    fetchSupportTickets();
  }, []);

  // Fetch support tickets from API
  const fetchSupportTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/support/tickets');
      if (response.data.success) {
        setSupportTickets(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      
      // If API is not available, show mock data for demo purposes
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('API not available, using mock data for demo');
        const mockTickets = [
          {
            id: 'TICKET-0001',
            subject: 'Unable to upload resume',
            category: 'Technical',
            status: 'Open',
            priority: 'High',
            description: 'I am having trouble uploading my resume. The file upload button is not responding.',
            created: 'Jan 15, 2024',
            lastUpdated: 'Jan 15, 2024',
            assignedTo: 'Support Team',
            isResolved: false,
            attachments: [
              { name: 'resume.pdf', size: 1024000, type: 'application/pdf' },
              { name: 'screenshot.png', size: 512000, type: 'image/png' }
            ]
          },
          {
            id: 'TICKET-0002',
            subject: 'Account verification issue',
            category: 'Account',
            status: 'In Progress',
            priority: 'Medium',
            description: 'My account verification is taking longer than expected. I submitted all required documents 3 days ago.',
            created: 'Jan 12, 2024',
            lastUpdated: 'Jan 14, 2024',
            assignedTo: 'Sarah Johnson',
            isResolved: false,
            attachments: [
              { name: 'id_document.pdf', size: 256000, type: 'application/pdf' },
              { name: 'proof_of_address.pdf', size: 128000, type: 'application/pdf' }
            ]
          }
        ];
        setSupportTickets(mockTickets);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch support tickets',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter and search functionality
  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesCategory = filterCategory === 'all' || ticket.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  // Handle create new ticket
  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all required fields',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('subject', newTicket.subject);
      formData.append('category', newTicket.category);
      formData.append('description', newTicket.description);
      
      // Add attachments if any
      newTicket.attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await api.post('/api/support/tickets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Refresh tickets list
        await fetchSupportTickets();

        setNewTicket({
          subject: '',
          category: '',
          description: '',
          attachments: []
        });
        setShowCreateTicket(false);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Support ticket created successfully!',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      
      // If API is not available, add to local state for demo
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('API not available, adding to local state for demo');
        const newTicketData = {
          id: `TICKET-${String(supportTickets.length + 1001).padStart(4, '0')}`,
          subject: newTicket.subject,
          category: newTicket.category,
          status: 'Open',
          priority: 'Medium',
          description: newTicket.description,
          created: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
          }),
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
          }),
          assignedTo: 'Support Team',
          isResolved: false,
          attachments: newTicket.attachments
        };

        setSupportTickets(prev => [newTicketData, ...prev]);
        setNewTicket({
          subject: '',
          category: '',
          description: '',
          attachments: []
        });
        setShowCreateTicket(false);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Support ticket created successfully! (Demo mode)',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to create support ticket. Please try again.',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle view ticket details
  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  // Handle edit ticket
  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setNewTicket({
      subject: ticket.subject,
      category: ticket.category,
      description: ticket.description || '',
      attachments: ticket.attachments || []
    });
    setShowEditTicket(true);
  };

  // Handle update ticket
  const handleUpdateTicket = async () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please fill in all required fields',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      return;
    }

    setIsSaving(true);

    try {
      const ticketId = editingTicket.id.replace('TICKET-', '');
      const formData = new FormData();
      formData.append('subject', newTicket.subject);
      formData.append('category', newTicket.category);
      formData.append('description', newTicket.description);
      
      // Add attachments if any
      newTicket.attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await api.put(`/api/support/tickets/${ticketId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Refresh tickets list
        await fetchSupportTickets();

        setNewTicket({
          subject: '',
          category: '',
          description: '',
          attachments: []
        });
        setShowEditTicket(false);
        setEditingTicket(null);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Support ticket updated successfully!',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } catch (error) {
      console.error('Error updating support ticket:', error);
      
      // If API is not available, update local state for demo
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('API not available, updating local state for demo');
        const updatedTicket = {
          ...editingTicket,
          subject: newTicket.subject,
          category: newTicket.category,
          description: newTicket.description,
          attachments: newTicket.attachments,
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: '2-digit' 
          })
        };

        setSupportTickets(prev => 
          prev.map(ticket => 
            ticket.id === editingTicket.id ? updatedTicket : ticket
          )
        );

        setNewTicket({
          subject: '',
          category: '',
          description: '',
          attachments: []
        });
        setShowEditTicket(false);
        setEditingTicket(null);

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Support ticket updated successfully! (Demo mode)',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to update support ticket. Please try again.',
          timer: 3000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Handle FAQ click
  const handleFAQClick = () => {
    setActiveTab('faq');
  };


  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Files',
        text: 'Some files were not uploaded. Please ensure files are JPG, PNG, PDF, DOC, or DOCX and under 10MB each.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }

    setNewTicket(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setNewTicket(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  // Handle file download
  const handleFileDownload = (file) => {
    try {
      // Extract filename from path if it's a full path
      const filename = file.path ? file.path.split('/').pop() : file.name;
      
      // Create download URL
      const downloadUrl = `/api/support/download/${filename}`;
      
      // Create a temporary link element and trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      Swal.fire({
        icon: 'success',
        title: 'Download Started',
        text: `Downloading ${file.name}...`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download file. Please try again.',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  const getStatusBadge = (status, isResolved) => {
    if (status === 'Resolved' || isResolved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Resolved
        </span>
      );
    } else if (status === 'Rejected') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Open
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobseekerHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Quick Help */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
              
              <div className="space-y-3">
                 {/* Support Tickets */}
                 <div 
                   onClick={() => setActiveTab('tickets')}
                   className={`rounded-lg p-4 border cursor-pointer transition-colors ${
                     activeTab === 'tickets' 
                       ? 'bg-blue-50 border-blue-200' 
                       : 'bg-white border-gray-200 hover:bg-gray-50'
                   }`}
                 >
                   <div className="flex items-center">
                     <div className="flex-shrink-0">
                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </div>
                     </div>
                     <div className="ml-3">
                       <h4 className={`text-sm font-medium ${
                         activeTab === 'tickets' ? 'text-blue-900' : 'text-gray-900'
                       }`}>Support Tickets</h4>
                       <p className={`text-xs ${
                         activeTab === 'tickets' ? 'text-blue-700' : 'text-gray-600'
                       }`}>See status of submitted ticket</p>
                     </div>
                   </div>
                 </div>

                 {/* FAQ */}
                 <div 
                   onClick={handleFAQClick}
                   className={`rounded-lg p-4 border cursor-pointer transition-colors ${
                     activeTab === 'faq' 
                       ? 'bg-blue-50 border-blue-200' 
                       : 'bg-white border-gray-200 hover:bg-gray-50'
                   }`}
                 >
                   <div className="flex items-center">
                     <div className="flex-shrink-0">
                       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </div>
                     </div>
                     <div className="ml-3">
                       <h4 className={`text-sm font-medium ${
                         activeTab === 'faq' ? 'text-blue-900' : 'text-gray-900'
                       }`}>Frequently Asked Questions</h4>
                       <p className={`text-xs ${
                         activeTab === 'faq' ? 'text-blue-700' : 'text-gray-600'
                       }`}>Find answers to common questions</p>
                     </div>
                   </div>
                 </div>

              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {activeTab === 'faq' ? 'Frequently Asked Questions' : 
                       'Get Help & Support'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {activeTab === 'faq' ? 'Find answers to common questions' :
                       'Get assistance with any questions or issues'}
                    </p>
                  </div>
                   {activeTab === 'tickets' && (
                     <button 
                       onClick={() => setShowCreateTicket(true)}
                       className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                     >
                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                       </svg>
                       Create New Ticket
                     </button>
                   )}
                </div>
              </div>

              {/* Content based on active tab */}
              {activeTab === 'tickets' && (
                <>
                  {/* Search and Filters */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Search */}
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Search tickets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* Status Filter */}
                      <div>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Status</option>
                          <option value="open">Open</option>
                          <option value="resolved">Resolved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      
                      {/* Category Filter */}
                      <div>
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Categories</option>
                          <option value="technical">Technical</option>
                          <option value="financial">Financial</option>
                          <option value="verification">Verification</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'faq' && (
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">How do I apply for a job?</h3>
                      <p className="text-blue-800">Click on any job posting, review the details, and click "Apply Now" to submit your application. Make sure your profile is complete before applying.</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I update my profile?</h3>
                      <p className="text-gray-700">Go to your profile page and click "Edit Profile" to update your information. You can also access this through Account Settings.</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I reset my password?</h3>
                      <p className="text-gray-700">Click "Forgot Password" on the login page and follow the instructions sent to your email. Check your spam folder if you don't receive the email.</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I contact support?</h3>
                      <p className="text-gray-700">Use the "Create New Ticket" button above or contact us through live chat. You can also check our FAQ section for quick answers.</p>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">What file types are supported for uploads?</h3>
                      <p className="text-gray-700">We support JPG, PNG, PDF, DOC, and DOCX files. Maximum file size is 10MB per file.</p>
                    </div>
                  </div>
                </div>
              )}


               {/* Support Tickets Table - Only show for tickets tab */}
               {activeTab === 'tickets' && (
                 <>
                   {loading ? (
                     <div className="flex justify-center items-center py-12">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                       <span className="ml-2 text-gray-600">Loading tickets...</span>
                     </div>
                   ) : (
                     <div className="overflow-x-auto">
                       <table className="min-w-full divide-y divide-gray-200">
                         <thead className="bg-gray-50">
                           <tr>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Ticket ID
                             </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Subject
                             </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Category
                             </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Status
                             </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Created
                             </th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                               Actions
                             </th>
                           </tr>
                         </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                           {currentTickets.length === 0 ? (
                             <tr>
                               <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                 <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                 </svg>
                                 <p>No support tickets found</p>
                                 <p className="text-sm">Create your first support ticket to get started</p>
                               </td>
                             </tr>
                           ) : (
                             currentTickets.map((ticket) => (
                               <tr key={ticket.id} className="hover:bg-gray-50">
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                   {ticket.id}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                   {ticket.subject}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                   {ticket.category}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                   {getStatusBadge(ticket.status, ticket.isResolved)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                   {ticket.created}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                   <div className="flex space-x-2">
                                     <button 
                                       onClick={() => handleViewTicket(ticket)}
                                       className="text-blue-600 hover:text-blue-900"
                                     >
                                       View
                                     </button>
                                     {ticket.status === 'Open' && (
                                       <button 
                                         onClick={() => handleEditTicket(ticket)}
                                         className="text-green-600 hover:text-green-900"
                                       >
                                         Edit
                                       </button>
                                     )}
                                   </div>
                                 </td>
                               </tr>
                             ))
                           )}
                         </tbody>
                       </table>
                     </div>
                   )}

                   {/* Pagination */}
                   <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                     <div className="flex items-center justify-between">
                       <div className="flex-1 flex justify-between sm:hidden">
                         <button 
                           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                           disabled={currentPage === 1}
                           className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Previous
                         </button>
                         <button 
                           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                           disabled={currentPage === totalPages}
                           className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                           Next
                         </button>
                       </div>
                       <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                         <div>
                           <p className="text-sm text-gray-700">
                             Showing <span className="font-medium">{indexOfFirstTicket + 1}</span> to <span className="font-medium">{Math.min(indexOfLastTicket, filteredTickets.length)}</span> of{' '}
                             <span className="font-medium">{filteredTickets.length}</span> results
                           </p>
                         </div>
                         <div>
                           <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                             <button 
                               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                               disabled={currentPage === 1}
                               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                               Previous
                             </button>
                             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                               const page = i + 1;
                               return (
                                 <button
                                   key={page}
                                   onClick={() => setCurrentPage(page)}
                                   className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                     currentPage === page
                                       ? 'border-blue-500 bg-blue-50 text-blue-600'
                                       : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                   }`}
                                 >
                                   {page}
                                 </button>
                               );
                             })}
                             {totalPages > 5 && (
                               <>
                                 <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                   ...
                                 </span>
                                 <button 
                                   onClick={() => setCurrentPage(totalPages)}
                                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                 >
                                   {totalPages}
                                 </button>
                               </>
                             )}
                             <button 
                               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                               disabled={currentPage === totalPages}
                               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                               Next
                             </button>
                           </nav>
                         </div>
                       </div>
                     </div>
                   </div>
                 </>
               )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />

      {/* Create New Ticket Modal */}
      <ProfileModal
        isOpen={showCreateTicket}
        onClose={() => setShowCreateTicket(false)}
        title="Create Support Ticket"
        description="Submit a new support ticket for assistance"
        onSave={handleCreateTicket}
        isSaving={isSaving}
        saveText="Submit Ticket"
      >
        <div className="space-y-6">
          {/* Issue Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</label>
            <select
              value={newTicket.category}
              onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="Technical">Technical</option>
              <option value="Financial">Financial</option>
              <option value="Verification">Verification</option>
              <option value="Account">Account</option>
              <option value="Job Application">Job Application</option>
              <option value="Profile">Profile</option>
            </select>
          </div>
          
          {/* Subject Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
            <input
              type="text"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of your issue"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please describe your issue in detail. Include any error messages, steps you took, and what you expected to happen."
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {newTicket.description.length} / 1000 characters
            </div>
          </div>
          
          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload').click()}
            >
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Choose Files
              </button>
              <p className="text-sm text-gray-500 mt-2">Supported: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)</p>
            </div>
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Show uploaded files */}
            {newTicket.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {newTicket.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ProfileModal>

      {/* Edit Ticket Modal */}
      <ProfileModal
        isOpen={showEditTicket}
        onClose={() => {
          setShowEditTicket(false);
          setEditingTicket(null);
          setNewTicket({
            subject: '',
            category: '',
            description: '',
            attachments: []
          });
        }}
        title="Edit Support Ticket"
        description="Update your support ticket information"
        onSave={handleUpdateTicket}
        isSaving={isSaving}
        saveText="Update Ticket"
      >
        <div className="space-y-6">
          {/* Issue Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</label>
            <select
              value={newTicket.category}
              onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="Technical">Technical</option>
              <option value="Financial">Financial</option>
              <option value="Verification">Verification</option>
              <option value="Account">Account</option>
              <option value="Job Application">Job Application</option>
              <option value="Profile">Profile</option>
            </select>
          </div>
          
          {/* Subject Line */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line *</label>
            <input
              type="text"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of your issue"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please describe your issue in detail. Include any error messages, steps you took, and what you expected to happen."
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {newTicket.description.length} / 1000 characters
            </div>
          </div>
          
          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Attachments</label>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload-edit').click()}
            >
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
              <button 
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Choose Files
              </button>
              <p className="text-sm text-gray-500 mt-2">Supported: JPG, PNG, PDF, DOC, DOCX (Max 10MB each)</p>
            </div>
            <input
              id="file-upload-edit"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {/* Show uploaded files */}
            {newTicket.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {newTicket.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ProfileModal>

      {/* Ticket Details Modal */}
      <ProfileModal
        isOpen={showTicketDetails}
        onClose={() => setShowTicketDetails(false)}
        title={`Ticket Details - ${selectedTicket?.id || ''}`}
        description="View detailed information about your support ticket"
        onSave={() => setShowTicketDetails(false)}
        isSaving={false}
        saveText="Close"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Ticket Header Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Ticket ID</p>
                    <p className="text-lg font-semibold text-blue-600">{selectedTicket.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Category</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTicket.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedTicket.created}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-gray-900 font-medium">{selectedTicket.subject}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center">
                  {getStatusBadge(selectedTicket.status, selectedTicket.isResolved)}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{selectedTicket.description || 'No description provided.'}</p>
              </div>
            </div>


            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 ? (
                <div className="space-y-3">
                  {selectedTicket.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center flex-1">
                        {/* File type icon */}
                        <div className="flex-shrink-0 mr-3">
                          {file.type?.includes('pdf') ? (
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : file.type?.includes('image') ? (
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {/* File info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(1)}MB • {file.type || 'Unknown type'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Download button */}
                      <button 
                        onClick={() => handleFileDownload(file)}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">No attachments</p>
                  <p className="text-xs text-gray-400 mt-1">No files were attached to this ticket</p>
                </div>
              )}
            </div>

            {/* Last Updated */}
            {selectedTicket.lastUpdated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Last updated:</span> {selectedTicket.lastUpdated}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </ProfileModal>
    </div>
  );
};

export default Support;
