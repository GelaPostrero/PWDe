import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployerHeader from '../../components/ui/EmployerHeader.jsx';
import Footer from '../../components/ui/Footer.jsx';
import Chatbot from '../../components/ui/Chatbot.jsx';

const EmployerTransactions = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addFundsAmount, setAddFundsAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(6);

  // Fetch financial data from backend
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/employer/financial-dashboard', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const data = await response.json();
        // setFinancialData(data);
        
        // Mock data for now - backend ready structure
        const mockData = getMockFinancialData();
        setFinancialData(mockData);
        setSelectedPaymentMethod(mockData.paymentMethods[0].id);
      } catch (err) {
        setError('Failed to load financial data');
        console.error('Error fetching financial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  // Mock financial data - matches backend API response structure
  const getMockFinancialData = () => {
    return {
      financialSummary: {
        availableBalance: 24850.00,
        inEscrow: 5000.00,
        totalSpent: 32450.00,
        monthlySpending: 7250.00
      },
      paymentMethods: [
        {
          id: 'gcash-001',
          type: 'gcash',
          name: 'GCash',
          maskedNumber: '+63 917 **** 5678',
          addedDate: '2023-07-15',
          isDefault: true,
          icon: '📱'
        },
        {
          id: 'bpi-001',
          type: 'bank',
          name: 'BPI Bank Account',
          maskedNumber: '****1234',
          addedDate: '2023-06-22',
          isDefault: false,
          icon: '🏦'
        },
        {
          id: 'visa-001',
          type: 'card',
          name: 'Visa',
          maskedNumber: '****4587',
          addedDate: '2023-06-22',
          isDefault: false,
          icon: '💳'
        }
      ],
      transactions: [
        {
          id: 'txn-001',
          date: '2023-08-21',
          description: 'Payment to Maria Santos (Project: Website Redesign)',
          type: 'payment',
          amount: -3000.00,
          status: 'completed',
          reference: 'PAY-20230821-001',
          freelancerName: 'Maria Santos',
          projectName: 'Website Redesign'
        },
        {
          id: 'txn-002',
          date: '2023-08-20',
          description: 'Deposit to Account (Ref: DP-22081455)',
          type: 'deposit',
          amount: 12500.00,
          status: 'completed',
          reference: 'DP-22081455',
          paymentMethod: 'GCash'
        },
        {
          id: 'txn-003',
          date: '2023-08-18',
          description: 'Escrow for E-commerce Website Development (Freelancer: John Reyes)',
          type: 'escrow',
          amount: -5000.00,
          status: 'completed',
          reference: 'ESC-20230818-001',
          freelancerName: 'John Reyes',
          projectName: 'E-commerce Website Development'
        },
        {
          id: 'txn-004',
          date: '2023-08-15',
          description: 'Payment to Carlos Mendoza (Project: Logo Design)',
          type: 'payment',
          amount: -5000.00,
          status: 'completed',
          reference: 'PAY-20230815-001',
          freelancerName: 'Carlos Mendoza',
          projectName: 'Logo Design'
        },
        {
          id: 'txn-005',
          date: '2023-08-10',
          description: 'Deposit to Account (Ref: DP-22081023)',
          type: 'deposit',
          amount: 12500.00,
          status: 'completed',
          reference: 'DP-22081023',
          paymentMethod: 'BPI Bank Account'
        },
        {
          id: 'txn-006',
          date: '2023-08-05',
          description: 'Deposit to Account (Ref: DP-22080523)',
          type: 'deposit',
          amount: 12500.00,
          status: 'failed',
          reference: 'DP-22080523',
          paymentMethod: 'Visa'
        },
        {
          id: 'txn-007',
          date: '2023-08-01',
          description: 'Payment to Anna Cruz (Project: Mobile App Development)',
          type: 'payment',
          amount: -8000.00,
          status: 'completed',
          reference: 'PAY-20230801-001',
          freelancerName: 'Anna Cruz',
          projectName: 'Mobile App Development'
        },
        {
          id: 'txn-008',
          date: '2023-07-28',
          description: 'Escrow for Database Optimization (Freelancer: Miguel Reyes)',
          type: 'escrow',
          amount: -3500.00,
          status: 'completed',
          reference: 'ESC-20230728-001',
          freelancerName: 'Miguel Reyes',
          projectName: 'Database Optimization'
        }
      ]
    };
  };

  const handleAddFunds = async () => {
    if (!addFundsAmount || parseFloat(addFundsAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/employer/add-funds', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     amount: parseFloat(addFundsAmount),
      //     paymentMethodId: selectedPaymentMethod
      //   })
      // });
      // const result = await response.json();
      // if (response.ok) {
      //   // Refresh financial data
      //   fetchFinancialData();
      //   setAddFundsAmount('');
      //   alert('Funds added successfully!');
      // }
      
      // Mock implementation
      console.log('Adding funds:', { amount: addFundsAmount, paymentMethod: selectedPaymentMethod });
      alert(`Adding ₱${addFundsAmount} to your account...`);
      setAddFundsAmount('');
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds. Please try again.');
    }
  };

  const handleExportTransactions = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/employer/transactions/export', {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      
      // Mock implementation
      console.log('Exporting transactions...');
      alert('Exporting transaction history...');
    } catch (error) {
      console.error('Error exporting transactions:', error);
      alert('Failed to export transactions. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getTransactionTypeLabel = (type) => {
    const labels = {
      payment: 'Payment',
      deposit: 'Deposit',
      escrow: 'Escrow',
      refund: 'Refund'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      failed: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const getPaymentMethodIcon = (type) => {
    const icons = {
      gcash: '📱',
      bank: '🏦',
      card: '💳'
    };
    return icons[type] || '💳';
  };

  // Filter and search transactions
  const filteredTransactions = financialData?.transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date);
      case 'amount':
        return Math.abs(b.amount) - Math.abs(a.amount);
      case 'description':
        return a.description.localeCompare(b.description);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

  const processingFee = addFundsAmount ? parseFloat(addFundsAmount) * 0.015 : 0;
  const totalAmount = addFundsAmount ? parseFloat(addFundsAmount) + processingFee : 0;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading financial data...</p>
            <p className="text-sm text-gray-500 mt-2">Preparing your financial dashboard</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Financial Data</h2>
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
  if (!financialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <EmployerHeader disabled={false} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No financial data available</p>
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
              <span className="text-gray-900">Transactions</span>
            </nav>
          </div>

          {/* Page Header */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your funds and job payments</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>+ Add Payment Method</span>
              </button>
            </div>
          </div>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Balance</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialData.financialSummary.availableBalance)}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Escrow</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialData.financialSummary.inEscrow)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialData.financialSummary.totalSpent)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(financialData.financialSummary.monthlySpending)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Add Funds and Payment Methods Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Add Funds Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Funds</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₱</span>
                    </div>
                    <input
                      type="number"
                      value={addFundsAmount}
                      onChange={(e) => setAddFundsAmount(e.target.value)}
                      className="block w-full pl-8 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        MAX
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Available: {formatCurrency(financialData.financialSummary.availableBalance)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {financialData.paymentMethods.map((method) => (
                      <option key={method.id} value={method.id}>
                        {method.name} ({method.maskedNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing Fee (1.5%)</span>
                      <span className="text-gray-900">{formatCurrency(processingFee)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Funds will be available in your account immediately after processing.
                  </p>
                </div>

                <button
                  onClick={handleAddFunds}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Add Funds {formatCurrency(totalAmount)}
                </button>
              </div>
            </div>

            {/* Saved Payment Methods Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Saved Payment Methods</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  + Add New Method
                </button>
              </div>
              
              <div className="space-y-4">
                {financialData.paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {getPaymentMethodIcon(method.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{method.name}</h4>
                            {method.isDefault && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{method.maskedNumber}</p>
                          <p className="text-xs text-gray-500">Added on: {formatDate(method.addedDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
              <button 
                onClick={handleExportTransactions}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export</span>
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="payment">Payments</option>
                  <option value="deposit">Deposits</option>
                  <option value="escrow">Escrow</option>
                  <option value="refund">Refunds</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Sort by Date</option>
                  <option value="amount">Sort by Amount</option>
                  <option value="description">Sort by Description</option>
                </select>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.reference && (
                            <div className="text-gray-500 text-xs">Ref: {transaction.reference}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTransactionTypeLabel(transaction.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                        <button className="hover:text-blue-800 transition-colors">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, sortedTransactions.length)} of {sortedTransactions.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
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

export default EmployerTransactions;
