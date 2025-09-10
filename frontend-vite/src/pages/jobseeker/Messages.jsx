import React, { useState, useEffect, useRef } from 'react';
import JobseekerHeader from '../../components/ui/JobseekerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const Messages = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'archived'
  const [selectedThread, setSelectedThread] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Message threads state
  const [messageThreads, setMessageThreads] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI state
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showScheduledInterviews, setShowScheduledInterviews] = useState(false);
  const [showFilesAndLinks, setShowFilesAndLinks] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  
  const typingTimeoutRef = useRef(null);

  // Mock data for development
  const mockMessageThreads = [
    {
      id: 1,
      company: 'TechCorp Solutions Inc.',
      jobTitle: 'Looking For React Devs to Test Our Product',
      lastMessage: 'Hi Sarah, thank you for your application! We\'ve',
      timestamp: '2:30 PM',
      unreadCount: 2,
      isActive: true,
      isOnline: true,
      companyId: 'techcorp-001',
      jobId: 'job-123',
      lastMessageId: 'msg-456',
      updatedAt: new Date().toISOString(),
      companyLogo: 'TECH'
    },
    {
      id: 2,
      company: 'Michael Chen',
      jobTitle: 'UX Designer Role',
      lastMessage: 'I appreciate the opportunity to interview. Could we schedule...',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isActive: false,
      isOnline: false,
      companyId: 'michael-chen-002',
      jobId: 'job-124',
      lastMessageId: 'msg-457',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      companyLogo: 'MC'
    },
    {
      id: 3,
      company: 'Emily Rodriguez',
      jobTitle: 'Marketing Manager',
      lastMessage: 'I would like to discuss accommodation needs for the interview...',
      timestamp: '2 days ago',
      unreadCount: 0,
      isActive: false,
      isOnline: false,
      companyId: 'emily-rodriguez-003',
      jobId: 'job-125',
      lastMessageId: 'msg-458',
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      companyLogo: 'ER'
    }
  ];

  const mockChatMessages = [
    {
      id: 'msg-456',
      sender: 'user',
      senderId: 'user-123',
      message: 'Hello! Thank you for considering my application for the Frontend Developer position. I\'m very excited about this opportunity and would love to discuss how my skills align with your needs.',
      timestamp: 'Today 2:30 PM',
      attachment: {
        id: 'att-001',
        name: 'Resume_Sarah_Johnson.pdf',
        type: 'pdf',
        size: '2.4 MB',
        url: '/uploads/resume.pdf'
      },
      isRead: true,
      threadId: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'msg-455',
      sender: 'company',
      senderId: 'techcorp-001',
      message: 'Hi Sarah, thank you for your application! We\'ve reviewed your resume and are impressed with your experience. We\'d like to schedule an initial interview. Are you available this week?',
      timestamp: 'Today 2:15 PM',
      attachment: null,
      isRead: true,
      threadId: 1,
      createdAt: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'msg-452',
      sender: 'user',
      senderId: 'user-123',
      message: 'Perfect! Tomorrow at 2:00 PM works great for me. I\'ll be ready for the video call. Thank you for this opportunity!',
      timestamp: 'Today 2:00 PM',
      attachment: null,
      isRead: true,
      threadId: 1,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'msg-451',
      sender: 'company',
      senderId: 'techcorp-001',
      message: 'Excellent! I\'m looking forward to speaking with you tomorrow. We\'ll discuss the role in detail and answer any questions you might have.',
      timestamp: 'Today 1:55 PM',
      attachment: null,
      isRead: true,
      threadId: 1,
      createdAt: new Date(Date.now() - 2100000).toISOString()
    },
  
  ];

  // Mock data for dropdowns
  const mockScheduledInterviews = [
    {
      id: 1,
      title: 'Initial Interview',
      date: '2024-01-15',
      time: '2:00 PM',
      type: 'Video Call',
      status: 'Scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    }
  ];

  const mockFilesAndLinks = [
    {
      id: 1,
      name: 'Resume_Sarah_Johnson.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-10',
      url: '/uploads/resume.pdf'
    },
    {
      id: 2,
      name: 'Portfolio_Examples.pdf',
      type: 'pdf',
      size: '5.2 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: '2024-01-10',
      url: '/uploads/portfolio.pdf'
    },
    {
      id: 3,
      name: 'Company_Culture_Guide.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadedBy: 'TechCorp Solutions Inc.',
      uploadedAt: '2024-01-09',
      url: '/uploads/company-culture.pdf'
    }
  ];

  // API Functions - Ready for backend integration
  const api = {
    // Fetch message threads
    fetchMessageThreads: async (filters = {}) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/messages/threads', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   params: filters
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = mockMessageThreads;
        
        setMessageThreads(data);
        return data;
      } catch (err) {
        setError('Failed to load message threads');
        console.error('Error fetching message threads:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },

    // Fetch chat messages for a thread
    fetchChatMessages: async (threadId) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/messages/threads/${threadId}/messages`, {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 300));
        const data = mockChatMessages.filter(msg => msg.threadId === threadId);
        
        setChatMessages(data);
        return data;
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error fetching chat messages:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },

    // Send a new message
    sendMessage: async (threadId, messageData) => {
      try {
        setError(null);
        
        const messagePayload = {
          threadId,
          message: messageData.message,
          attachment: messageData.attachment,
          timestamp: new Date().toISOString()
        };
        
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/messages/threads/${threadId}/messages`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(messagePayload)
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 200));
        const newMessage = {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderId: 'user-123',
          message: messageData.message,
          timestamp: 'Just now',
          attachment: messageData.attachment,
          isRead: false,
          threadId,
          createdAt: new Date().toISOString()
        };
        
        setChatMessages(prev => [newMessage, ...prev]);
        
        // Update thread's last message
        setMessageThreads(prev => prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, lastMessage: messageData.message, timestamp: 'Just now', unreadCount: 0 }
            : thread
        ));
        
        return newMessage;
      } catch (err) {
        setError('Failed to send message');
        console.error('Error sending message:', err);
        throw err;
      }
    },

    // Mark messages as read
    markAsRead: async (threadId, messageIds) => {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/messages/threads/${threadId}/read`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ messageIds })
        // });
        
        // Update local state
        setChatMessages(prev => prev.map(msg => 
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        ));
        
        setMessageThreads(prev => prev.map(thread => 
          thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
        ));
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    },

    // Upload file attachment
    uploadAttachment: async (file) => {
      try {
        // TODO: Replace with actual API call
        // const formData = new FormData();
        // formData.append('file', file);
        // 
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   },
        //   body: formData
        // });
        // const data = await response.json();
        
        // Mock upload response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const attachment = {
          id: `att-${Date.now()}`,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          url: URL.createObjectURL(file)
        };
        
        return attachment;
      } catch (err) {
        setError('Failed to upload file');
        console.error('Error uploading file:', err);
        throw err;
      }
    },

    // Search messages
    searchMessages: async (query, threadId = null) => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/messages/search', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   params: { query, threadId }
        // });
        // const data = await response.json();
        
        // Mock search response
        await new Promise(resolve => setTimeout(resolve, 200));
        const allMessages = mockChatMessages;
        const filtered = allMessages.filter(msg => 
          msg.message.toLowerCase().includes(query.toLowerCase())
        );
        
        return filtered;
      } catch (err) {
        console.error('Error searching messages:', err);
        return [];
      }
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await api.fetchMessageThreads();
        if (selectedThread) {
          await api.fetchChatMessages(selectedThread);
        }
      } catch (err) {
        console.error('Error initializing data:', err);
      }
    };
    
    initializeData();
  }, []);

  // Event handlers
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedAttachment) return;
    
    try {
      const messageData = {
        message: newMessage.trim(),
        attachment: selectedAttachment
      };
      
      await api.sendMessage(selectedThread, messageData);
      setNewMessage('');
      setSelectedAttachment(null);
      // scrollToBottom() will be called automatically by useEffect
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleThreadSelect = async (threadId) => {
    setSelectedThread(threadId);
    setShowMobileSidebar(false); // Close mobile sidebar when thread is selected
    try {
      await api.fetchChatMessages(threadId);
      await api.markAsRead(threadId, chatMessages.map(msg => msg.id));
      // scrollToBottom() will be called automatically by useEffect
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      const attachment = await api.uploadAttachment(file);
      setSelectedAttachment(attachment);
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll to bottom when new messages are added or when typing
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Filter threads based on active tab and search
  const filteredThreads = messageThreads.filter(thread => {
    const matchesSearch = thread.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && thread.unreadCount > 0) ||
                      (activeTab === 'archived' && thread.isArchived);
    return matchesSearch && matchesTab;
  });

  // Get current thread data
  const currentThread = messageThreads.find(thread => thread.id === selectedThread);



  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 sm:py-8 pb-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
          </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
            
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white rounded-lg shadow mb-4">
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
              {selectedThread && (
                <button
                  onClick={() => setShowMobileDetails(!showMobileDetails)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Left Sidebar - Message Threads */}
            <div className={`lg:col-span-4 flex flex-col ${showMobileSidebar ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:flex'}`}>
              <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0">
                {/* Mobile Sidebar Header */}
                {showMobileSidebar && (
                  <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                    <button
                      onClick={() => setShowMobileSidebar(false)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search messages..."
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex space-x-1">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'unread', label: 'Unread' },
                      { id: 'archived', label: 'Archived' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Threads List */}
                <div className="flex-1 overflow-y-auto chat-messages-scrollable">
                  {isLoading ? (
                    <div className="p-8 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading conversations...</p>
                    </div>
                  ) : filteredThreads.length === 0 ? (
                    <div className="p-8 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-gray-500">No conversations found</p>
                    </div>
                  ) : (
                    filteredThreads.map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => handleThreadSelect(thread.id)}
                        className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          selectedThread === thread.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {thread.companyLogo}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {thread.company}
                              </p>
                              <span className="text-xs text-gray-500">{thread.timestamp}</span>
                            </div>
                            <p className="text-xs text-blue-600 truncate mt-1 font-medium">
                              {thread.jobTitle}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {thread.lastMessage}
                            </p>
                            {thread.unreadCount > 0 && (
                              <div className="flex items-center justify-between mt-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-1">
                                  {thread.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Center Area - Chat Conversation */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0 relative mb-24 overflow-hidden">
                {/* Mobile Chat Header */}
                {selectedThread && (
                  <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowMobileSidebar(true)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                          {currentThread?.companyLogo || 'TECH'}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{currentThread?.company || 'TechCorp Solutions Inc.'}</h3>
                          <p className="text-xs text-blue-600 font-medium">{currentThread?.jobTitle || 'Looking For React Devs to Test Our Product'}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowMobileDetails(!showMobileDetails)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedThread ? (
                  <>
                    {/* Conversation Header - Desktop Only */}
                    <div className="hidden lg:block p-4 border-b border-gray-200 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {currentThread?.companyLogo || 'TECH'}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{currentThread?.company || 'TechCorp Solutions Inc.'}</h3>
                            <p className="text-xs text-blue-600 font-medium">{currentThread?.jobTitle || 'Looking For React Devs to Test Our Product'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                          <button className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages - Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages-scrollable" style={{ 
                      maxHeight: 'calc(100vh - 200px)',
                      minHeight: '200px'
                    }}>
                      {isLoading ? (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <>
                          {chatMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                {msg.sender === 'company' && (
                                  <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                      {currentThread?.companyLogo || 'TECH'}
                                    </div>
                                    <span className="text-xs text-gray-500">{currentThread?.company || 'TechCorp'}</span>
                                  </div>
                                )}
                                <div className={`rounded-lg p-3 ${
                                  msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-900'
                                }`}>
                                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                  {msg.attachment && (
                                    <div className="mt-2 p-2 bg-white bg-opacity-20 rounded">
                                      <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span className="text-xs">{msg.attachment.name}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className={`flex items-center space-x-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                  {msg.sender === 'user' && msg.isRead && (
                                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Typing indicator inside scrollable area */}
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                    {currentThread?.companyLogo || 'TECH'}
                                  </div>
                                  <span className="text-xs text-gray-500">{currentThread?.company || 'TechCorp'}</span>
                                </div>
                                <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                                  <div className="flex items-center space-x-1">
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">typing...</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Message Input - Fixed at Bottom */}
                    <div className="sticky bottom-0 p-4 pb-6 border-t border-gray-200 flex-shrink-0 bg-white z-10">
                      {/* Selected Attachment Preview */}
                      {selectedAttachment && (
                        <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-blue-600">{selectedAttachment.name}</span>
                          </div>
                          <button
                            onClick={() => setSelectedAttachment(null)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-end space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-1">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="text-xs text-gray-500 hidden sm:block">{newMessage.length}/1000</span>
                          <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() && !selectedAttachment}
                            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          handleTyping();
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                        maxLength={1000}
                        rows={1}
                        style={{
                          minHeight: '44px',
                          maxHeight: '80px',
                          height: 'auto'
                        }}
                        onInput={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
                        }}
                      />
                      
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                      <p className="text-gray-500">Choose a message thread to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Contact Details */}
            <div className={`lg:col-span-3 flex flex-col ${showMobileDetails ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:flex'}`}>
              <div className="bg-white rounded-lg shadow flex-1 flex flex-col min-h-0">
                {/* Mobile Details Header */}
                {showMobileDetails && (
                  <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
                    <button
                      onClick={() => setShowMobileDetails(false)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedThread ? (
                  <>
                    {/* Company Profile */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-3">
                          {currentThread?.companyLogo || 'TECH'}
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">{currentThread?.company || 'TechCorp Solutions Inc.'}</h3>
                        <p className="text-xs text-gray-600 mb-2">Industry Preference</p>
                        <div className="flex items-center justify-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600">Online</span>
                        </div>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search messages..."
                          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Collapsible Sections */}
                    <div className="flex-1 p-4 space-y-4">
                      {/* Scheduled Interview Section */}
                      <div className="border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => setShowScheduledInterviews(!showScheduledInterviews)}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Scheduled Interview</span>
                          </div>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showScheduledInterviews ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showScheduledInterviews && (
                          <div className="px-3 pb-3 space-y-2">
                            {mockScheduledInterviews.map((interview) => (
                              <div key={interview.id} className="p-3 bg-blue-50 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                                  <h4 className="text-sm font-medium text-gray-900">{interview.title}</h4>
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full self-start sm:self-auto">
                                    {interview.status}
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <p>📅 {interview.date} at {interview.time}</p>
                                  <p>📹 {interview.type}</p>
                                  <a 
                                    href={interview.meetingLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    Join Meeting
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Files and Links Section */}
                      <div className="border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => setShowFilesAndLinks(!showFilesAndLinks)}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Files and Links</span>
                          </div>
                          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showFilesAndLinks ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {showFilesAndLinks && (
                          <div className="px-3 pb-3 space-y-2">
                            {mockFilesAndLinks.map((file) => (
                              <div key={file.id} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{file.size} • {file.uploadedBy}</p>
                                  </div>
                                  <a 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                      <p className="text-gray-500 text-sm">Select a conversation to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Chatbot 
        position="right" 
        showNotification={true} 
        notificationCount={3}
      />
    </div>
  );
};

export default Messages;
