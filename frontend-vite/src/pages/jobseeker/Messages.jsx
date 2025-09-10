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
  const [activeFileTab, setActiveFileTab] = useState('All');
  
  const typingTimeoutRef = useRef(null);

  // Mock data for development
  const mockMessageThreads = [
    {
      id: 1,
      company: 'TechCorp Solutions Inc.',
      jobTitle: 'Looking For React Devs to Test Our Product',
      lastMessage: 'Hi Sarah, thank you for your application! We\'ve reviewed your profile and would like to schedule an interview.',
      timestamp: '2:30 PM',
      unreadCount: 2,
      isActive: true,
      isOnline: true,
      companyId: 'techcorp-001',
      jobId: 'job-123',
      lastMessageId: 'msg-456',
      updatedAt: new Date().toISOString(),
      companyLogo: 'TECH',
      industry: 'Technology',
      location: 'San Francisco, CA',
      companySize: '50-200 employees'
    },
    {
      id: 2,
      company: 'DesignStudio Pro',
      jobTitle: 'Senior UX Designer',
      lastMessage: 'I appreciate the opportunity to interview. Could we schedule a follow-up call?',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isActive: false,
      isOnline: false,
      companyId: 'designstudio-002',
      jobId: 'job-124',
      lastMessageId: 'msg-457',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      companyLogo: 'DS',
      industry: 'Design',
      location: 'New York, NY',
      companySize: '10-50 employees'
    },
    {
      id: 3,
      company: 'DataFlow Analytics',
      jobTitle: 'Data Scientist Position',
      lastMessage: 'Thank you for your interest. We\'ll be in touch soon with next steps.',
      timestamp: '2 days ago',
      unreadCount: 1,
      isActive: false,
      isOnline: true,
      companyId: 'dataflow-003',
      jobId: 'job-125',
      lastMessageId: 'msg-458',
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      companyLogo: 'DF',
      industry: 'Analytics',
      location: 'Austin, TX',
      companySize: '200-500 employees'
    },
    {
      id: 4,
      company: 'GreenTech Solutions',
      jobTitle: 'Environmental Engineer',
      lastMessage: 'We\'re excited to move forward with your application. Let\'s discuss the role details.',
      timestamp: '3 days ago',
      unreadCount: 0,
      isActive: false,
      isOnline: false,
      companyId: 'greentech-004',
      jobId: 'job-126',
      lastMessageId: 'msg-459',
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      companyLogo: 'GT',
      industry: 'Environmental',
      location: 'Portland, OR',
      companySize: '50-200 employees'
    }
  ];

  // Mock chat messages for each thread
  const mockChatMessages = {
    1: [
      {
        id: 'msg-1',
        senderId: 'techcorp-001',
        senderName: 'TechCorp Solutions Inc.',
        content: 'Hi Sarah! Thank you for applying to our React Developer position. We\'ve reviewed your profile and are impressed with your experience.',
        timestamp: '2:30 PM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-2',
        senderId: 'user-001',
        senderName: 'Sarah Johnson',
        content: 'Thank you so much! I\'m very excited about this opportunity. I\'ve been working with React for over 3 years and love building user-friendly applications.',
        timestamp: '2:32 PM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-3',
        senderId: 'techcorp-001',
        senderName: 'TechCorp Solutions Inc.',
        content: 'That\'s fantastic! We\'d like to schedule an interview with you. Are you available for a video call this week?',
        timestamp: '2:35 PM',
        isRead: false,
        type: 'text'
      },
      {
        id: 'msg-4',
        senderId: 'user-001',
        senderName: 'Sarah Johnson',
        content: 'Yes, I\'m available! I can do Tuesday or Wednesday afternoon. What time works best for you?',
        timestamp: '2:37 PM',
        isRead: false,
        type: 'text'
      }
    ],
    2: [
      {
        id: 'msg-5',
        senderId: 'designstudio-002',
        senderName: 'DesignStudio Pro',
        content: 'Hi Sarah! We received your application for the Senior UX Designer role. Your portfolio looks impressive!',
        timestamp: 'Yesterday 10:00 AM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-6',
        senderId: 'user-001',
        senderName: 'Sarah Johnson',
        content: 'Thank you! I\'m really excited about this opportunity. I\'ve been following DesignStudio Pro\'s work and love your design philosophy.',
        timestamp: 'Yesterday 10:15 AM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-7',
        senderId: 'designstudio-002',
        senderName: 'DesignStudio Pro',
        content: 'We\'d love to learn more about your design process. Could you walk us through one of your recent projects?',
        timestamp: 'Yesterday 10:20 AM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-8',
        senderId: 'user-001',
        senderName: 'Sarah Johnson',
        content: 'Absolutely! I\'d be happy to share my design process. I typically start with user research, then move to wireframing and prototyping.',
        timestamp: 'Yesterday 10:25 AM',
        isRead: true,
        type: 'text'
      }
    ],
    3: [
      {
        id: 'msg-9',
        senderId: 'dataflow-003',
        senderName: 'DataFlow Analytics',
        content: 'Hello Sarah! We received your application for the Data Scientist position. Your background in machine learning is exactly what we\'re looking for.',
        timestamp: '2 days ago 3:00 PM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-10',
        senderId: 'user-001',
        senderName: 'Sarah Johnson',
        content: 'Thank you! I\'m passionate about using data to solve real-world problems. I\'d love to learn more about the specific challenges your team is working on.',
        timestamp: '2 days ago 3:05 PM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-11',
        senderId: 'dataflow-003',
        senderName: 'DataFlow Analytics',
        content: 'We\'re working on some exciting projects in predictive analytics and recommendation systems. We\'ll be in touch soon with next steps.',
        timestamp: '2 days ago 3:10 PM',
        isRead: false,
        type: 'text'
      }
    ],
    4: [
      {
        id: 'msg-12',
        senderId: 'greentech-004',
        senderName: 'GreenTech Solutions',
        content: 'Hi Sarah! We\'re excited about your application for the Environmental Engineer role. Your experience with sustainable technologies is impressive.',
        timestamp: '3 days ago 11:00 AM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-13',
        senderId: 'user-001',
        senderName: 'Sarah Johnson',
        content: 'Thank you! I\'m very passionate about environmental sustainability and would love to contribute to GreenTech\'s mission.',
        timestamp: '3 days ago 11:15 AM',
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-14',
        senderId: 'greentech-004',
        senderName: 'GreenTech Solutions',
        content: 'We\'d like to discuss the role details and our current projects. Are you available for a call this week?',
        timestamp: '3 days ago 11:20 AM',
        isRead: true,
        type: 'text'
      }
    ]
  };

  // Filter threads based on active tab and search
  const filteredThreads = mockMessageThreads.filter(thread => {
    const matchesSearch = thread.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && thread.unreadCount > 0) ||
                      (activeTab === 'archived' && thread.isArchived);
    return matchesSearch && matchesTab;
  });

  // Get current thread data
  const currentThread = mockMessageThreads.find(thread => thread.id === selectedThread);

  // Mock files and links data
  const mockFilesAndLinks = [
    {
      id: 1,
      name: 'Job_Description.pdf',
      type: 'pdf',
      size: '2.1 MB',
      url: '/files/job-description.pdf'
    },
    {
      id: 2,
      name: 'My_Resume.docx',
      type: 'docx',
      size: '1.8 MB',
      url: '/files/resume.docx'
    },
    {
      id: 3,
      name: 'https://www.figma.com/design/QjHdT',
      type: 'link',
      size: 'Figma Link',
      url: 'https://www.figma.com/design/QjHdT'
    }
  ];

  // Filter files based on active tab
  const filteredFiles = mockFilesAndLinks.filter(file => {
    if (activeFileTab === 'All') return true;
    if (activeFileTab === 'File') return file.type !== 'link';
    if (activeFileTab === 'Links') return file.type === 'link';
    return true;
  });

  // Get current chat messages
  const currentChatMessages = mockChatMessages[selectedThread] || [];

  // Mock API functions
  const api = {
    fetchMessageThreads: async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockMessageThreads);
        }, 500);
      });
    },
    
    fetchChatMessages: async (threadId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockChatMessages[threadId] || []);
        }, 300);
      });
    },
    
    sendMessage: async (threadId, message) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'user-001',
            senderName: 'Sarah Johnson',
            content: message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            type: 'text'
          };
          resolve(newMessage);
        }, 200);
      });
    },
    
    markAsRead: async (threadId, messageId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 100);
      });
    }
  };

  // Event handlers
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread) return;

    try {
      setIsLoading(true);
      const sentMessage = await api.sendMessage(selectedThread, newMessage);
      
      // Add message to current chat
      setChatMessages(prev => [...prev, sentMessage]);
      
      // Update thread's last message
      setMessageThreads(prev => prev.map(thread => 
        thread.id === selectedThread 
          ? { 
              ...thread, 
              lastMessage: sentMessage.content,
              timestamp: sentMessage.timestamp,
              updatedAt: new Date().toISOString()
            }
          : thread
      ));
      
      setNewMessage('');
      
      // Simulate typing indicator from company
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          // Add a mock response
          const mockResponse = {
            id: `msg-${Date.now() + 1}`,
            senderId: currentThread?.companyId,
            senderName: currentThread?.company,
            content: "Thank you for your message! We'll get back to you soon.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false,
            type: 'text'
          };
          setChatMessages(prev => [...prev, mockResponse]);
        }, 2000);
      }, 1000);
      
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadSelect = async (threadId) => {
    try {
      setIsLoading(true);
      setSelectedThread(threadId);
      const messages = await api.fetchChatMessages(threadId);
      setChatMessages(messages);
      
      // Mark messages as read
      await api.markAsRead(threadId, 'all');
      
      // Update thread unread count
      setMessageThreads(prev => prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, unreadCount: 0, isActive: true }
          : { ...thread, isActive: false }
      ));
      
    } catch (error) {
      setError('Failed to load messages. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    // Simulate typing indicator
    if (e.target.value.length > 0) {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    } else {
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const threads = await api.fetchMessageThreads();
        setMessageThreads(threads);
        
        if (threads.length > 0) {
          const firstThread = threads[0];
          setSelectedThread(firstThread.id);
          const messages = await api.fetchChatMessages(firstThread.id);
          setChatMessages(messages);
        }
      } catch (error) {
        setError('Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <JobseekerHeader disabled={false} />

      <main className="flex-1 py-6 px-6 lg:px-10 xl:px-10">
        <div className="mx-full">
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
          </div>
          )}
          
          <div className="flex overflow-hidden h-[calc(100vh-180px)]">

            {/* Left Sidebar - Message Threads */}
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

              {/* Message Threads List */}
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
                          {/* Company Avatar */}
                          <div className="flex-shrink-0 relative">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {thread.companyLogo}
                            </div>
                            {thread.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>

                          {/* Thread Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {thread.company}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {thread.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 truncate mt-1">
                              {thread.jobTitle}
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

            {/* Center Area - Chat Conversation */}
            <div className="flex-1 flex flex-col">
              {selectedThread ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {currentThread?.companyLogo || 'TECH'}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {currentThread?.company || 'TechCorp Solutions Inc.'}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {currentThread?.jobTitle || 'Looking For React Devs to Test Our Product'}
                          </p>
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

                  {/* Chat Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading ? (
                      <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        {currentChatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.senderId === 'user-001' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.senderId === 'user-001'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.senderId === 'user-001' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {isTyping && (
                          <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                              <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-xs text-gray-500 ml-2">Typing...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input Area */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button 
                        type="submit"
                        disabled={!newMessage.trim() || isLoading}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </button>
                    </form>
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

            {/* Right Sidebar - Contact Details & Actions (Desktop Only) */}
            {selectedThread && (
              <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-4">
                {/* Contact Profile */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3">
                    {currentThread?.companyLogo || 'TECH'}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {currentThread?.company || 'TechCorp Solutions Inc.'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{currentThread?.industry || 'Industry Preference'}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${currentThread?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-500">{currentThread?.isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>

                {/* Search within Chat */}
                <div className="mb-6">
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

                {/* Action Sections */}
                <div className="space-y-4">
                  {/* Schedule Interview */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => setShowScheduledInterviews(!showScheduledInterviews)}
                      className="w-full flex items-center justify-between text-left p-4 bg-blue-600 text-white"
                        >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        <span className="text-sm font-medium">Scheduled Interview</span>
                          </div>
                      <svg className={`w-4 h-4 text-white transition-transform ${showScheduledInterviews ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showScheduledInterviews && (
                      <div className="bg-white p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">Upcoming Interview</span>
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                                </div>
                              </div>
                        <div className="text-sm text-gray-600">
                          <p>Microsoft - June 25, 2:00 PM</p>
                        </div>
                          </div>
                        )}
                      </div>

                  {/* Files and Links */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => setShowFilesAndLinks(!showFilesAndLinks)}
                      className="w-full flex items-center justify-between text-left p-4 bg-blue-600 text-white"
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
                          {['All', 'File', 'Links'].map((tab) => (
                            <button
                              key={tab}
                              onClick={() => setActiveFileTab(tab)}
                              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeFileTab === tab
                                  ? 'border-gray-900 text-gray-900'
                                  : 'border-transparent text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>

                        {/* File List */}
                        <div className="space-y-3">
                          {filteredFiles.map((file) => (
                            <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                file.type === 'pdf' ? 'bg-red-100' :
                                file.type === 'docx' ? 'bg-blue-100' :
                                'bg-gray-100'
                              }`}>
                                {file.type === 'pdf' ? (
                                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                ) : file.type === 'docx' ? (
                                  <span className="text-blue-600 font-bold text-xs">W</span>
                                ) : (
                                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{file.size}</p>
                              </div>
                              {file.type !== 'link' && (
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                  </div>
                )}
              </div>
            </div>
              </div>
            )}
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
