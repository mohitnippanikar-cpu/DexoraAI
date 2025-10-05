'use client';

import { useState } from 'react';

interface FinancialRecord {
  id: number;
  date: string;
  description: string;
  category: string;
  type: 'Income' | 'Expense';
  amount: number;
  account: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  reference: string;
}

const mockFinancialData: FinancialRecord[] = [
  { id: 1, date: '2024-01-15', description: 'Q1 Product Sales Revenue', category: 'Revenue', type: 'Income', amount: 125000, account: 'Sales Revenue', status: 'Approved', reference: 'INV-2024-001' },
  { id: 2, date: '2024-01-20', description: 'Office Rent Payment', category: 'Operational', type: 'Expense', amount: -8500, account: 'Rent Expense', status: 'Approved', reference: 'EXP-2024-002' },
  { id: 3, date: '2024-01-22', description: 'Marketing Campaign Investment', category: 'Marketing', type: 'Expense', amount: -15000, account: 'Marketing Expense', status: 'Approved', reference: 'EXP-2024-003' },
  { id: 4, date: '2024-01-25', description: 'Software Licensing Revenue', category: 'Revenue', type: 'Income', amount: 45000, account: 'License Revenue', status: 'Pending', reference: 'INV-2024-004' },
  { id: 5, date: '2024-01-28', description: 'Employee Salaries', category: 'Payroll', type: 'Expense', amount: -85000, account: 'Payroll Expense', status: 'Approved', reference: 'PAY-2024-005' },
  { id: 6, date: '2024-01-30', description: 'Equipment Purchase', category: 'Assets', type: 'Expense', amount: -12000, account: 'Equipment', status: 'Approved', reference: 'EXP-2024-006' },
];

export default function FinanceDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const types = ['All', 'Income', 'Expense'];
  const categories = ['All', 'Revenue', 'Operational', 'Marketing', 'Payroll', 'Assets'];
  const statuses = ['All', 'Approved', 'Pending', 'Rejected'];

  const filteredFinancialData = mockFinancialData.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || record.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || record.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || record.status === selectedStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Income' ? 'text-green-600' : 'text-red-600';
  };

  const totalIncome = mockFinancialData.filter(r => r.type === 'Income' && r.status === 'Approved').reduce((sum, record) => sum + record.amount, 0);
  const totalExpenses = Math.abs(mockFinancialData.filter(r => r.type === 'Expense' && r.status === 'Approved').reduce((sum, record) => sum + record.amount, 0));
  const netIncome = totalIncome - totalExpenses;
  const pendingAmount = mockFinancialData.filter(r => r.status === 'Pending').reduce((sum, record) => sum + Math.abs(record.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1V23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6312 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6312 13.6815 18 14.5717 18 15.5C18 16.4283 17.6312 17.3185 16.9749 17.9749C16.3185 18.6312 15.4283 19 14.5 19H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Finance Dashboard</h2>
            <p className="text-slate-400">Monitor financial transactions and accounting data</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Income</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Expenses</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netIncome.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Net Income</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search financial records..."
              className="w-full py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {types.map(type => (
              <option key={type} value={type}>Type: {type}</option>
            ))}
          </select>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>Category: {category}</option>
            ))}
          </select>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>Status: {status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="text-left py-4 px-6 text-white font-medium">Date</th>
                <th className="text-left py-4 px-6 text-white font-medium">Description</th>
                <th className="text-left py-4 px-6 text-white font-medium">Category</th>
                <th className="text-left py-4 px-6 text-white font-medium">Type</th>
                <th className="text-left py-4 px-6 text-white font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-white font-medium">Account</th>
                <th className="text-left py-4 px-6 text-white font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white font-medium">Reference</th>
              </tr>
            </thead>
            <tbody>
              {filteredFinancialData.map((record) => (
                <tr key={record.id} className="border-t border-slate-700 hover:bg-slate-950/30 transition-colors">
                  <td className="py-4 px-6 text-slate-400">{record.date}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{record.description}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{record.category}</td>
                  <td className="py-4 px-6">
                    <span className={`font-medium ${getTypeColor(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`font-medium ${getTypeColor(record.type)}`}>
                      ${Math.abs(record.amount).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{record.account}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-sm">{record.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
