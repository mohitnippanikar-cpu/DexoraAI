'use client';

import { useState } from 'react';

interface MarketingCampaign {
  id: number;
  name: string;
  channel: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate: string;
  roi: number;
}

const mockMarketingData: MarketingCampaign[] = [
  { id: 1, name: 'Q1 Product Launch', channel: 'Google Ads', status: 'Active', budget: 15000, spent: 8500, impressions: 250000, clicks: 12500, conversions: 125, startDate: '2024-01-01', endDate: '2024-03-31', roi: 2.8 },
  { id: 2, name: 'Social Media Awareness', channel: 'Facebook', status: 'Active', budget: 8000, spent: 6200, impressions: 180000, clicks: 9000, conversions: 90, startDate: '2024-01-15', endDate: '2024-02-28', roi: 1.9 },
  { id: 3, name: 'Email Newsletter', channel: 'Email', status: 'Completed', budget: 3000, spent: 2800, impressions: 50000, clicks: 2500, conversions: 75, startDate: '2024-01-01', endDate: '2024-01-31', roi: 3.2 },
  { id: 4, name: 'LinkedIn B2B Campaign', channel: 'LinkedIn', status: 'Paused', budget: 12000, spent: 4500, impressions: 85000, clicks: 3400, conversions: 42, startDate: '2024-01-10', endDate: '2024-02-28', roi: 1.5 },
  { id: 5, name: 'Content Marketing', channel: 'Blog/SEO', status: 'Active', budget: 5000, spent: 2200, impressions: 125000, clicks: 6250, conversions: 95, startDate: '2024-01-01', endDate: '2024-06-30', roi: 4.1 },
];

export default function MarketingDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const channels = ['All', 'Google Ads', 'Facebook', 'Email', 'LinkedIn', 'Blog/SEO'];
  const statuses = ['All', 'Active', 'Paused', 'Completed', 'Draft'];

  const filteredCampaigns = mockMarketingData.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === 'All' || campaign.channel === selectedChannel;
    const matchesStatus = selectedStatus === 'All' || campaign.status === selectedStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Paused': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-blue-600 bg-blue-100';
      case 'Draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 3) return 'text-green-600';
    if (roi >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalBudget = mockMarketingData.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = mockMarketingData.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalConversions = mockMarketingData.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const avgROI = (mockMarketingData.reduce((sum, campaign) => sum + campaign.roi, 0) / mockMarketingData.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Marketing Dashboard</h2>
            <p className="text-slate-400">Track campaign performance and marketing metrics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-primary">${totalBudget.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Budget</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-yellow-600">${totalSpent.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Total Spent</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-600">{totalConversions}</div>
            <div className="text-sm text-slate-400">Conversions</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-secondary">{avgROI}x</div>
            <div className="text-sm text-slate-400">Avg ROI</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search campaigns..."
              className="w-full py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>Channel: {channel}</option>
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

      {/* Marketing Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="text-left py-4 px-6 text-white font-medium">Campaign</th>
                <th className="text-left py-4 px-6 text-white font-medium">Channel</th>
                <th className="text-left py-4 px-6 text-white font-medium">Budget</th>
                <th className="text-left py-4 px-6 text-white font-medium">Spent</th>
                <th className="text-left py-4 px-6 text-white font-medium">Impressions</th>
                <th className="text-left py-4 px-6 text-white font-medium">Clicks</th>
                <th className="text-left py-4 px-6 text-white font-medium">Conversions</th>
                <th className="text-left py-4 px-6 text-white font-medium">ROI</th>
                <th className="text-left py-4 px-6 text-white font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-slate-700 hover:bg-slate-950/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{campaign.name}</div>
                    <div className="text-sm text-slate-400">{campaign.startDate} - {campaign.endDate}</div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{campaign.channel}</td>
                  <td className="py-4 px-6 text-white">${campaign.budget.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">${campaign.spent.toLocaleString()}</div>
                    <div className="text-sm text-slate-400">
                      {((campaign.spent / campaign.budget) * 100).toFixed(0)}% used
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{campaign.impressions.toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-400">{campaign.clicks.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-green-600">{campaign.conversions}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`font-medium ${getROIColor(campaign.roi)}`}>{campaign.roi}x</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
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
