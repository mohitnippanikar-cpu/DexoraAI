'use client';

import { useState } from 'react';
import Sidebar from '@/pages/Sidebar';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  examplePrompts: string[];
}

// Available enterprise tools
const toolsData: Tool[] = [
  {
    id: 'uploadEnterpriseDocuments',
    name: 'Enterprise Document Analysis',
    description: 'Upload and analyze business documents with AI-powered insights. Share contracts, reports, spreadsheets, presentations, and other enterprise files to extract key information, generate summaries, and get actionable business intelligence.',
    icon: '📊',
    category: 'Document Intelligence',
    examplePrompts: [
      "Upload document for analysis",
      "Analyze my business report",
      "I want to upload a contract",
      "Share file for AI insights",
      "Upload spreadsheet for analysis",
      "Analyze this presentation",
      "Extract data from document",
      "Discover insights from file"
    ]
  },
  {
    id: 'hrDashboard',
    name: 'Human Resources Dashboard',
    description: 'Comprehensive HR management system to view employee data, track personnel information, manage departments, and monitor workforce analytics. Access employee profiles, salary information, and organizational structure.',
    icon: '👥',
    category: 'Human Resources',
    examplePrompts: [
      "Show me HR dashboard",
      "View employee data",
      "Display staff information",
      "I want to see HR analytics",
      "Show employee directory",
      "Access personnel records",
      "HR department overview",
      "Workforce management"
    ]
  },
  {
    id: 'salesDashboard',
    name: 'Sales Performance Dashboard',
    description: 'Track sales metrics, revenue data, and performance analytics. Monitor deal pipelines, sales team performance, customer acquisition, and commission tracking with comprehensive sales reporting.',
    icon: '💰',
    category: 'Sales',
    examplePrompts: [
      "Show sales dashboard",
      "View sales performance",
      "Display revenue data",
      "Sales analytics",
      "Track sales metrics",
      "Show sales team data",
      "Revenue reporting",
      "Sales pipeline overview"
    ]
  },
  {
    id: 'marketingDashboard',
    name: 'Marketing Campaign Analytics',
    description: 'Monitor marketing campaign performance, track ROI, analyze customer engagement metrics, and manage marketing budgets. View campaign data across multiple channels and measure marketing effectiveness.',
    icon: '📈',
    category: 'Marketing',
    examplePrompts: [
      "Show marketing dashboard",
      "View campaign performance",
      "Marketing analytics",
      "Track campaign ROI",
      "Show marketing metrics",
      "Campaign data analysis",
      "Marketing performance",
      "Display marketing stats"
    ]
  },
  {
    id: 'financeDashboard',
    name: 'Financial Accounting Dashboard',
    description: 'Comprehensive financial management system to track income, expenses, budget allocation, and accounting records. Monitor cash flow, financial statements, and accounting transactions with detailed reporting.',
    icon: '💳',
    category: 'Finance & Accounting',
    examplePrompts: [
      "Show finance dashboard",
      "View financial data",
      "Accounting overview",
      "Track expenses and income",
      "Financial analytics",
      "Show accounting records",
      "Budget analysis",
      "Financial reporting"
    ]
  },
  {
    id: 'engineeringDashboard',
    name: 'Engineering Development Dashboard',
    description: 'Comprehensive engineering workspace with code snippet library, project tracking, development metrics, and team collaboration tools. Access code samples, monitor project progress, and manage development workflows.',
    icon: '⚙️',
    category: 'Engineering & Development',
    examplePrompts: [
      "Show engineering dashboard",
      "View code snippets",
      "Display development projects",
      "Engineering metrics",
      "Show code library",
      "Track development progress",
      "Engineering analytics",
      "Development tools overview"
    ]
  }
  ,
  {
    id: 'appointmentScheduling',
    name: 'Appointment Scheduling',
    description: 'Schedule appointments with specialists. Collects preferred dates, times, reason for visit, and contact details to request an appointment.',
    icon: '📅',
    category: 'Workflows',
    examplePrompts: [
      'Schedule an appointment',
      'Book a meeting with a specialist',
      'I need to see a doctor'
    ]
  },
  {
    id: 'searchFiles',
    name: 'File Search & Discovery',
    description: 'Search and find documents from your medical records with AI-powered search. Get relevant files with citations and key data points extracted from lab results, diagnostic reports, prescriptions, and consultation notes.',
    icon: '🔍',
    category: 'Document Intelligence',
    examplePrompts: [
      'Search for lab results',
      'Find my medical records',
      'Search files for blood test',
      'Look for diagnostic reports',
      'Find prescription documents',
      'Search for consultation notes',
      'Locate vaccination records',
      'Find recent medical imaging'
    ]
  }
];

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  
  // Function to copy text to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000); // Clear after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Function to toggle expanded prompts
  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };
  
  // Get unique categories
  const categories = Array.from(new Set(toolsData.map(tool => tool.category)));
  
  // Filter tools based on search and category
  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? tool.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar activeNavItem="discover" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto backdrop-blur-sm bg-slate-950/95">
        <div className="max-w-6xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dexora Enterprise AI Tools</h1>
          <p className="text-slate-400">Discover powerful AI capabilities to transform your business processes. Access department-specific dashboards and document analysis tools.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for enterprise AI tools and features..."
            className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-900/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white shadow-inner backdrop-blur-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Categories Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === null ? 'bg-primary text-white shadow-md border border-slate-700' : 'bg-slate-900/50 text-slate-400 border border-slate-700 hover:text-white hover:shadow-sm'}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === category ? 'bg-primary text-white shadow-md border border-slate-700' : 'bg-slate-900/50 text-slate-400 border border-slate-700 hover:text-white hover:shadow-sm'}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div 
              key={tool.id}
              className="p-4 rounded-xl border border-slate-700 backdrop-blur-sm bg-slate-800 hover:border-primary/30 transition-all hover:shadow-md group"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-950/60 flex items-center justify-center text-xl shadow-inner">
                  {tool.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white group-hover:text-primary transition-colors">{tool.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{tool.description}</p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-950/70 text-slate-400 border border-slate-700">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Example Prompts */}
              <div className="mt-3">
                <h4 className="text-sm font-medium text-white mb-2">Try these prompts:</h4>
                <div className="space-y-1.5">
                    {(expandedTools.has(tool.id) ? tool.examplePrompts : tool.examplePrompts.slice(0, 2)).map((prompt, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-700 group/prompt hover:border-primary/20 transition-all"
                      >
                        <span className="text-xs text-slate-400 flex-1 pr-2">
                          &quot;{prompt}&quot;
                        </span>
                        <button
                          onClick={() => copyToClipboard(prompt)}
                          className={`transition-all p-1 rounded text-xs ${
                            copiedText === prompt 
                              ? 'bg-green-100 text-green-600 opacity-100' 
                              : 'opacity-0 group-hover/prompt:opacity-100 hover:bg-primary/10 text-slate-400 hover:text-primary'
                          }`}
                          title={copiedText === prompt ? 'Copied!' : 'Copy prompt'}
                        >
                          {copiedText === prompt ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 5H6C5.46957 5 4.96086 5.21071 4.58579 5.58579C4.21071 5.96086 4 6.46957 4 7V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V7C20 6.46957 19.7893 5.96086 19.4142 5.58579C19.0391 5.21071 18.5304 5 18 5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 5C8 4.46957 8.21071 3.96086 8.58579 3.58579C8.96086 3.21071 9.46957 3 10 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5C16 5.53043 15.7893 6.03914 15.4142 6.41421C15.0391 6.78929 14.5304 7 14 7H10C9.46957 7 8.96086 6.78929 8.58579 6.41421C8.21071 6.03914 8 5.53043 8 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                    {tool.examplePrompts.length > 2 && (
                      <button
                        onClick={() => toggleExpanded(tool.id)}
                        className="w-full text-xs text-slate-400/70 hover:text-primary text-center pt-1 transition-colors"
                      >
                        {expandedTools.has(tool.id) 
                          ? 'Show less' 
                          : `+${tool.examplePrompts.length - 2} more examples`
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* No Results */}
          {filteredTools.length === 0 && (
            <div className="mt-6 text-center py-12 border border-slate-700 rounded-xl backdrop-blur-sm bg-slate-800 shadow-inner">
              <p className="text-slate-400 mb-1">No tools found matching your search criteria.</p>
              <p className="text-slate-400 mb-4">Try adjusting your search or filters.</p>
              <button 
                className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-all shadow-md border border-slate-700"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(null);
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}