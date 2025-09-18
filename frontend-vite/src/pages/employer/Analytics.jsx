import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';
import api from '../../utils/api.js';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [kpis, setKpis] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchKpis = async (range) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/analytics/kpis?timeRange=${range}`);
      setKpis(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch KPIs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis(timeRange);
  }, [timeRange]);

  // Fetch analytics data from backend
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/employer/analytics?timeRange=${timeRange}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        // setAnalyticsData(data);
        
        // Mock data for now - backend ready structure
        const mockData = getMockAnalyticsData(timeRange);
        setAnalyticsData(mockData);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Mock analytics data - matches backend API response structure
  const getMockAnalyticsData = (timeRange) => {
    const baseData = {
      timeRange: timeRange,
      generatedAt: new Date().toISOString(),
      kpis: {
        totalApplications: {
          current: 1247,
          previous: 1108,
          change: 12.5,
          changeType: 'increase'
        },
        activeJobPostings: {
          current: 23,
          previous: 20,
          change: 3,
          changeType: 'increase',
          note: '3 new this week'
        },
        successfulHires: {
          current: 47,
          previous: 43,
          change: 8.2,
          changeType: 'increase',
          note: 'conversion rate'
        },
        avgTimeToHire: {
          current: 18,
          previous: 22,
          change: -18.2,
          changeType: 'decrease',
          note: 'industry avg: 24 days'
        }
      },
      hiringPipeline: {
        applicationsReceived: { count: 247, percentage: 100 },
        applicationsReviewed: { count: 186, percentage: 75 },
        interviewsScheduled: { count: 62, percentage: 25 },
        hiresCompleted: { count: 18, percentage: 7.3 }
      },
      monthlySpending: [
        { month: 'Aug', amount: 25000, spending: 25000 },
        { month: 'Sep', amount: 32000, spending: 32000 },
        { month: 'Oct', amount: 45000, spending: 45000 },
        { month: 'Nov', amount: 38000, spending: 38000 },
        { month: 'Dec', amount: 42000, spending: 42000 }
      ],
      applicationTrends: [
        { week: 'Week 1', applications: 45, interviews: 12 },
        { week: 'Week 2', applications: 52, interviews: 18 },
        { week: 'Week 3', applications: 38, interviews: 15 },
        { week: 'Week 4', applications: 67, interviews: 22 }
      ],
      skillsMatchDistribution: [
        { name: 'JavaScript', value: 30, color: '#3B82F6' },
        { name: 'React', value: 28, color: '#10B981' },
        { name: 'Node.js', value: 20, color: '#8B5CF6' },
        { name: 'Python', value: 15, color: '#F59E0B' },
        { name: 'Other', value: 7, color: '#EF4444' }
      ],
      topPerformingJobs: [
        {
          id: 1,
          title: 'Senior Software Developer',
          postedDate: '2025-01-20',
          applications: 45,
          hires: 5,
          status: 'active',
          conversionRate: 11.1
        },
        {
          id: 2,
          title: 'UX/UI Designer',
          postedDate: '2025-01-17',
          applications: 32,
          hires: 3,
          status: 'active',
          conversionRate: 9.4
        },
        {
          id: 3,
          title: 'Customer Support Specialist',
          postedDate: '2025-01-13',
          applications: 28,
          hires: 6,
          status: 'closed',
          conversionRate: 21.4
        },
        {
          id: 4,
          title: 'Digital Marketing Manager',
          postedDate: '2025-01-10',
          applications: 21,
          hires: 1,
          status: 'active',
          conversionRate: 4.8
        }
      ],
      demographics: {
        disabilityTypes: [
          { type: 'Visual Impairment', count: 45, percentage: 32.1 },
          { type: 'Hearing Impairment', count: 38, percentage: 27.1 },
          { type: 'Mobility Impairment', count: 32, percentage: 22.9 },
          { type: 'Cognitive Impairment', count: 25, percentage: 17.9 }
        ],
        experienceLevels: [
          { level: 'Entry Level', count: 67, percentage: 47.9 },
          { level: 'Mid Level', count: 45, percentage: 32.1 },
          { level: 'Senior Level', count: 28, percentage: 20.0 }
        ]
      },
      performanceMetrics: {
        averageResponseTime: '2.3 hours',
        interviewSchedulingRate: 78.5,
        offerAcceptanceRate: 85.2,
        candidateSatisfactionScore: 4.6
      }
    };

    return baseData;
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const handleExportData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employer/analytics/export?timeRange=${timeRange}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      
      // Mock implementation
      console.log('Exporting analytics data for time range:', timeRange);
      alert(`Exporting analytics data for ${timeRange}...`);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
            <p className="text-sm text-gray-500 mt-2">Preparing your data visualization</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Show main content
  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No analytics data available</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <EmployerHeader disabled={false} />

      {/* Main Content */}
      <main className="flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mx-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-16">
          
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="text-sm text-gray-600">
              <Link to="/employer/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">Analytics</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">Track your hiring performance and optimize recruitment strategies</p>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={timeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button 
                  onClick={handleExportData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis?.totalApplications.current.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">
                    +{analyticsData.kpis.totalApplications.change}% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Job Postings</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis?.activeJobPostings.current}</p>
                  <p className="text-sm text-green-600 mt-1">
                    +{analyticsData.kpis.activeJobPostings.change} new this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Successful Hires</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis?.successfulHires.current}</p>
                  <p className="text-sm text-green-600 mt-1">
                    +{analyticsData.kpis.successfulHires.change}% conversion rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Time to Hire</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis?.avgTimeToHire.current} days</p>
                  <p className="text-sm text-gray-600 mt-1">
                    (industry avg: {analyticsData.kpis.avgTimeToHire.note.split(': ')[1]})
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Hiring Pipeline */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Hiring Pipeline</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { 
                        stage: 'Applications\nReceived', 
                        count: analyticsData.hiringPipeline.applicationsReceived.count, 
                        percentage: analyticsData.hiringPipeline.applicationsReceived.percentage,
                        color: '#3B82F6'
                      },
                      { 
                        stage: 'Applications\nReviewed', 
                        count: analyticsData.hiringPipeline.applicationsReviewed.count, 
                        percentage: analyticsData.hiringPipeline.applicationsReviewed.percentage,
                        color: '#3B82F6'
                      },
                      { 
                        stage: 'Interviews\nScheduled', 
                        count: analyticsData.hiringPipeline.interviewsScheduled.count, 
                        percentage: analyticsData.hiringPipeline.interviewsScheduled.percentage,
                        color: '#10B981'
                      },
                      { 
                        stage: 'Hires\nCompleted', 
                        count: analyticsData.hiringPipeline.hiresCompleted.count, 
                        percentage: analyticsData.hiringPipeline.hiresCompleted.percentage,
                        color: '#F59E0B'
                      }
                    ]} 
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]}
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="stage" 
                      stroke="#6b7280"
                      fontSize={12}
                      width={70}
                    />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${props.payload.count} (${value}%)`, 
                        'Count'
                      ]}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill={(entry) => entry.color}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Spending Trend */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Spending Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.monthlySpending} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `₱${(value / 1000)}K`}
                    />
                    <Tooltip 
                      formatter={(value) => [`₱${value.toLocaleString()}`, 'Spending']}
                      labelStyle={{ color: '#374151' }}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="spending" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Application Trends and Skills Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Application Trends */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Application Trends</h3>
                <div className="flex space-x-2">
                  {['7d', '30d', '90d'].map((period) => (
                    <button
                      key={period}
                      onClick={() => handleTimeRangeChange(period)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        timeRange === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.applicationTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="week" 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="interviews" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Applications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Interviews</span>
                </div>
              </div>
            </div>

            {/* Skills Match Distribution */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Skills Match Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.skillsMatchDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {analyticsData.skillsMatchDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {analyticsData.skillsMatchDistribution.map((skill, index) => (
                  <div key={skill.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: skill.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{skill.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performing Jobs */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Jobs</h3>
              <Link to="/employer/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topPerformingJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">Posted {getDaysAgo(job.postedDate)} days ago</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.applications}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.hires}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{job.conversionRate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(job.postedDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          job.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* AI Chatbot */}
      <Chatbot 
        position="right" 
        showNotification={true} 
        notificationCount={3}
      />
    </div>
  );
};

export default Analytics;
