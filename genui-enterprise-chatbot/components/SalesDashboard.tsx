'use client';

import { useState } from 'react';

interface SalesData {
  id: number;
  salesperson: string;
  customer: string;
  product: string;
  amount: number;
  status: 'Closed Won' | 'Closed Lost' | 'In Progress' | 'Qualified';
  date: string;
  region: string;
  commission: number;
}

const mockSalesData: SalesData[] = [
  { id: 1, salesperson: 'Mike Chen', customer: 'Acme Corp', product: 'Enterprise License', amount: 50000, status: 'Closed Won', date: '2024-01-15', region: 'West', commission: 5000 },
  { id: 2, salesperson: 'Lisa Wang', customer: 'Tech Solutions Inc', product: 'Professional Suite', amount: 25000, status: 'In Progress', date: '2024-01-20', region: 'East', commission: 2500 },
  { id: 3, salesperson: 'David Rodriguez', customer: 'Global Industries', product: 'Basic Package', amount: 10000, status: 'Qualified', date: '2024-01-22', region: 'South', commission: 1000 },
  { id: 4, salesperson: 'Jenny Kim', customer: 'StartupXYZ', product: 'Starter Plan', amount: 5000, status: 'Closed Lost', date: '2024-01-18', region: 'North', commission: 0 },
  { id: 5, salesperson: 'Alex Thompson', customer: 'MegaCorp Ltd', product: 'Enterprise License', amount: 75000, status: 'Closed Won', date: '2024-01-25', region: 'West', commission: 7500 },
];

export default function SalesDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const regions = ['All', 'West', 'East', 'South', 'North'];
  const statuses = ['All', 'Closed Won', 'Closed Lost', 'In Progress', 'Qualified'];

  const filteredSalesData = mockSalesData.filter(sale => {
    const matchesSearch = sale.salesperson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || sale.region === selectedRegion;
    const matchesStatus = selectedStatus === 'All' || sale.status === selectedStatus;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Closed Won': return 'text-green-600 bg-green-100';
      case 'Closed Lost': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Qualified': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalRevenue = mockSalesData.filter(s => s.status === 'Closed Won').reduce((sum, sale) => sum + sale.amount, 0);
  const totalCommission = mockSalesData.filter(s => s.status === 'Closed Won').reduce((sum, sale) => sum + sale.commission, 0);
  const winRate = ((mockSalesData.filter(s => s.status === 'Closed Won').length / mockSalesData.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 21L9.09 15.26L16 14L9.09 13.74L8 8L6.91 13.74L0 14L6.91 15.26L8 21Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Sales Dashboard</h2>
            <p className="text-slate-400">Track sales performance and revenue metrics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Revenue</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-600">{mockSalesData.filter(s => s.status === 'Closed Won').length}</div>
            <div className="text-sm text-slate-400">Deals Won</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-secondary">{winRate}%</div>
            <div className="text-sm text-slate-400">Win Rate</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-yellow-600">${totalCommission.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Commission</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search sales data..."
              className="w-full py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.map(region => (
              <option key={region} value={region}>Region: {region}</option>
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

      {/* Sales Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="text-left py-4 px-6 text-white font-medium">Salesperson</th>
                <th className="text-left py-4 px-6 text-white font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-white font-medium">Product</th>
                <th className="text-left py-4 px-6 text-white font-medium">Amount</th>
                <th className="text-left py-4 px-6 text-white font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white font-medium">Region</th>
                <th className="text-left py-4 px-6 text-white font-medium">Commission</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesData.map((sale) => (
                <tr key={sale.id} className="border-t border-slate-700 hover:bg-slate-950/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{sale.salesperson}</div>
                    <div className="text-sm text-slate-400">{sale.date}</div>
                  </td>
                  <td className="py-4 px-6 text-white">{sale.customer}</td>
                  <td className="py-4 px-6 text-slate-400">{sale.product}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">${sale.amount.toLocaleString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{sale.region}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-green-600">${sale.commission.toLocaleString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
