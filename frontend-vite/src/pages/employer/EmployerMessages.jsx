import React, { useState, useEffect, useRef } from 'react';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const EmployerMessages = () => {
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
  
  // Schedule Interview form state
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  
  // Files and Links state
  const [activeFileTab, setActiveFileTab] = useState('all'); // 'all', 'file', 'links'
  
  const typingTimeoutRef = useRef(null);

  // Mock files and links data
  const mockFilesAndLinks = {
    all: [
      {
        id: 1,
        name: 'Job_Description.pdf',
        type: 'pdf',
        size: '2.1 MB',
        category: 'file',
        icon: 'pdf'
      },
      {
        id: 2,
        name: 'My_Resume.docx',
        type: 'docx',
        size: '1.8 MB',
        category: 'file',
        icon: 'word'
      },
      {
        id: 3,
        name: 'https://www.figma.com/design/QjHdT',
        type: 'link',
        size: '',
        category: 'link',
        icon: 'link'
      }
    ],
    file: [
      {
        id: 1,
        name: 'Job_Description.pdf',
        type: 'pdf',
        size: '2.1 MB',
        category: 'file',
        icon: 'pdf'
      },
      {
        id: 2,
        name: 'My_Resume.docx',
        type: 'docx',
        size: '1.8 MB',
        category: 'file',
        icon: 'word'
      }
    ],
    links: [
      {
        id: 3,
        name: 'https://www.figma.com/design/QjHdT',
        type: 'link',
        size: '',
        category: 'link',
        icon: 'link'
      }
    ]
  };

  // Mock data for development - Employer perspective
  const mockMessageThreads = [
    {
      id: 1,
      candidateName: 'Sarah Johnson',
      candidateRole: 'Frontend Developer',
      candidateAvatar: 'SJ',
      lastMessage: 'Thank you for considering my application. I wanted',
      lastMessageTime: '2:30 PM',
      unreadCount: 2,
      isArchived: false,
      applicationStatus: 'Application Received',
      applicationDate: 'Applied 3 days ago',
      isOnline: true,
      jobTitle: 'Frontend Developer Position'
    },
    {
      id: 2,
      candidateName: 'Michael Chen',
      candidateRole: 'UX Designer',
      candidateAvatar: 'MC',
      lastMessage: 'I\'m very interested in the UX Designer role...',
      lastMessageTime: 'Yesterday',
      unreadCount: 0,
      isArchived: false,
      applicationStatus: 'Interview Scheduled',
      applicationDate: 'Applied 5 days ago',
      isOnline: false,
      jobTitle: 'UX Designer Role'
    },
    {
      id: 3,
      candidateName: 'Emily Rodriguez',
      candidateRole: 'Marketing Manager',
      candidateAvatar: 'ER',
      lastMessage: 'Thank you for the opportunity to interview...',
      lastMessageTime: '2 days ago',
      unreadCount: 1,
      isArchived: false,
      applicationStatus: 'Under Review',
      applicationDate: 'Applied 1 week ago',
      isOnline: false,
      jobTitle: 'Marketing Manager'
    }
  ];

  const mockChatMessages = {
    1: [
      {
        id: 1,
        sender: 'candidate',
        message: 'Hello! Thank you for considering my application for the Frontend Developer position. I\'m very excited about this opportunity and would love to discuss how my skills align with your needs.',
        timestamp: 'Today 2:15 PM',
        attachment: {
          name: 'Resume_Sarah_Johnson.pdf',
          type: 'pdf',
          size: '2.4 MB'
        }
      },
      {
        id: 2,
        sender: 'employer',
        message: 'Hi Sarah, thank you for your application! We\'ve reviewed your resume and are impressed with your experience. We\'d like to schedule an initial interview. Are you available this week?',
        timestamp: 'Today 2:30 PM',
        isRead: true
      }
    ],
    2: [
      {
        id: 3,
        sender: 'candidate',
        message: 'I\'m very interested in the UX Designer role at your company. I have 5 years of experience in user research and design.',
        timestamp: 'Yesterday 3:45 PM',
        isRead: true
      },
      {
        id: 4,
        sender: 'employer',
        message: 'Great to hear from you, Michael! Your portfolio looks impressive. Let\'s schedule a call to discuss the role further.',
        timestamp: 'Yesterday 4:00 PM',
        isRead: true
      }
    ],
    3: [
      {
        id: 5,
        sender: 'candidate',
        message: 'Thank you for the opportunity to interview for the Marketing Manager position. I\'m excited about the possibility of joining your team.',
        timestamp: '2 days ago 10:30 AM',
        isRead: false
      }
    ]
  };

  // Mock API object
  const api = {
    // Fetch message threads
    fetchMessageThreads: async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/employer/message-threads', {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 500));
        setMessageThreads(mockMessageThreads);
        setCurrentUser({ name: 'TechCorp', role: 'HR Manager' });
      } catch (err) {
        console.error('Error fetching message threads:', err);
        setError('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    },

    // Fetch chat messages for a specific thread
    fetchChatMessages: async (threadId) => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/messages/${threadId}`, {
        //   method: 'GET',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 300));
        setChatMessages(mockChatMessages[threadId] || []);
        setSelectedThread(threadId);
      } catch (err) {
        console.error('Error fetching chat messages:', err);
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    },

    // Send a new message
    sendMessage: async (threadId, messageData) => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/messages/${threadId}`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(messageData)
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const newMessage = {
          id: Date.now(),
          sender: 'employer',
          message: messageData.message,
          timestamp: new Date().toLocaleString('en-US', { 
            weekday: 'short', 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          attachment: messageData.attachment,
          isRead: false
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        
        // Update thread's last message
        setMessageThreads(prev => prev.map(thread => 
          thread.id === threadId 
            ? { 
                ...thread, 
                lastMessage: messageData.message.substring(0, 50) + '...',
                lastMessageTime: new Date().toLocaleString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })
              }
            : thread
        ));
        
      } catch (err) {
        console.error('Error sending message:', err);
        setError('Failed to send message');
        throw err;
      }
    },

    // Mark messages as read
    markAsRead: async (threadId, messageIds) => {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/employer/messages/${threadId}/read`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ messageIds })
        // });
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update thread unread count
        setMessageThreads(prev => prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, unreadCount: 0 }
            : thread
        ));
        
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    },

    // Upload attachment
    uploadAttachment: async (file) => {
      try {
        // TODO: Replace with actual API call
        // const formData = new FormData();
        // formData.append('file', file);
        // const response = await fetch('/api/employer/upload', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   },
        //   body: formData
        // });
        // const data = await response.json();
        
        // Mock API response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          name: file.name,
          type: file.type,
          size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
          url: URL.createObjectURL(file)
        };
      } catch (err) {
        console.error('Error uploading attachment:', err);
        setError('Failed to upload file');
        throw err;
      }
    },

    // Search messages
    searchMessages: async (query, threadId = null) => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/employer/messages/search', {
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
        const allMessages = Object.values(mockChatMessages).flat();
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
    } catch (err) {
      // Error already handled in API function
    }
  };

  const handleThreadSelect = async (threadId) => {
    setShowMobileSidebar(false);
    try {
      await api.fetchChatMessages(threadId);
      await api.markAsRead(threadId, chatMessages.map(msg => msg.id));
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
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  // Filter threads based on active tab and search
  const filteredThreads = messageThreads.filter(thread => {
    const matchesSearch = thread.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.candidateRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && thread.unreadCount > 0) ||
                      (activeTab === 'archived' && thread.isArchived);
    return matchesSearch && matchesTab;
  });

  // Get current thread data
  const currentThread = messageThreads.find(thread => thread.id === selectedThread);

  // Helper functions
  const getFileIcon = (iconType) => {
    switch (iconType) {
      case 'pdf':
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'word':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'link':
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleScheduleInterview = () => {
    if (interviewDate && interviewTime) {
      console.log('Scheduling interview:', { date: interviewDate, time: interviewTime });
      // TODO: Implement actual scheduling API call
      setInterviewDate('');
      setInterviewTime('');
      setShowScheduledInterviews(false);
    }
  };

  const handleDownloadFile = (fileId) => {
    console.log('Downloading file:', fileId);
    // TODO: Implement actual download functionality
  };

  const handleOpenLink = (link) => {
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EmployerHeader disabled={false} />

      <main className="flex-1 flex overflow-hidden py-6 px-6 lg:px-10 xl:px-10">
        {/* Left Sidebar - Conversation List */}
        <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${showMobileSidebar ? 'block' : 'hidden md:flex'}`}>
          
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-gray-200">
            {['all', 'unread', 'archived'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadSelect(thread.id)}
                    className={`p-4 cursor-pointer transition-colors border-l-4 ${
                      selectedThread === thread.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Candidate Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {thread.candidateAvatar}
                        </div>
                      </div>

                      {/* Thread Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {thread.candidateName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {thread.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {thread.candidateRole}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {thread.lastMessage}
                        </p>
                        {thread.unreadCount > 0 && (
                          <div className="flex items-center justify-between mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {thread.unreadCount} unread
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentThread ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {currentThread.candidateAvatar}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {currentThread.candidateName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Applied for {currentThread.candidateRole}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {currentThread.applicationStatus}
                        </span>
                        <span className="text-xs text-gray-500">
                          {currentThread.applicationDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages - Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ 
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
                      <div key={msg.id} className={`flex ${msg.sender === 'employer' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg ${msg.sender === 'employer' ? 'order-2' : 'order-1'}`}>
                          {msg.sender === 'candidate' && (
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {currentThread?.candidateAvatar || 'SJ'}
                              </div>
                              <span className="text-xs text-gray-500">{currentThread?.candidateName || 'Sarah Johnson'}</span>
                            </div>
                          )}
                          <div className={`rounded-lg p-3 ${
                            msg.sender === 'employer' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            {msg.attachment && (
                              <div className="mt-2 p-2 bg-white bg-opacity-20 rounded border border-white border-opacity-30">
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-xs">{msg.attachment.name}</span>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-75">{msg.timestamp}</span>
                              {msg.sender === 'employer' && msg.isRead && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input Area */}
              <div className="bg-white border-t border-gray-200 p-4">
                {selectedAttachment && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-blue-600">{selectedAttachment.name}</span>
                    </div>
                    <button
                      onClick={() => setSelectedAttachment(null)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <div className="flex items-end space-x-2">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
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
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {newMessage.length}/1000
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedAttachment}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Contact Details & Actions (Desktop Only) */}
        {currentThread && (
          <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-4">
            {/* Contact Profile */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3">
                {currentThread.candidateAvatar}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {currentThread.candidateName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {currentThread.candidateRole}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            </div>

            {/* Search within Chat */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Action Sections */}
            <div className="space-y-4">
              {/* Schedule Interview */}
              <div className="bg-blue-600 rounded-t-lg">
                <button
                  onClick={() => setShowScheduledInterviews(!showScheduledInterviews)}
                  className="w-full flex items-center justify-between text-left p-4 text-white"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Schedule Interview</span>
                  </div>
                  <svg className={`w-4 h-4 text-white transition-transform ${showScheduledInterviews ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showScheduledInterviews && (
                  <div className="bg-white p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={interviewDate}
                          onChange={(e) => setInterviewDate(e.target.value)}
                          placeholder="mm/dd/yy"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={interviewTime}
                          onChange={(e) => setInterviewTime(e.target.value)}
                          placeholder="--:-- --"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setShowScheduledInterviews(false)}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleScheduleInterview}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Files and Links */}
              <div className="bg-blue-600 rounded-t-lg">
                <button
                  onClick={() => setShowFilesAndLinks(!showFilesAndLinks)}
                  className="w-full flex items-center justify-between text-left p-4 text-white"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm font-medium">Files and Links</span>
                  </div>
                  <svg className={`w-4 h-4 text-white transition-transform ${showFilesAndLinks ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showFilesAndLinks && (
                  <div className="bg-white p-4">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-4">
                      {['all', 'file', 'links'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveFileTab(tab)}
                          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                            activeFileTab === tab
                              ? 'border-black text-gray-900'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Files and Links List */}
                    <div className="space-y-3">
                      {mockFilesAndLinks[activeFileTab].map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {getFileIcon(item.icon)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">
                                {item.name}
                              </p>
                              {item.size && (
                                <p className="text-xs text-gray-500">
                                  {item.size}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => item.category === 'file' ? handleDownloadFile(item.id) : handleOpenLink(item.name)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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

export default EmployerMessages;
