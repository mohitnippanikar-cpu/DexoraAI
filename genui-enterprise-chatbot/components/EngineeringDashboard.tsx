'use client';

import { useState } from 'react';

interface CodeSnippet {
  id: number;
  title: string;
  language: string;
  code: string;
  author: string;
  tags: string[];
  likes: number;
  created: string;
  category: 'Frontend' | 'Backend' | 'DevOps' | 'Algorithm' | 'Utility';
}

interface Project {
  id: number;
  name: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Planning';
  progress: number;
  team: string[];
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
}

const mockCodeSnippets: CodeSnippet[] = [
  {
    id: 1,
    title: "React Custom Hook for API Calls",
    language: "typescript",
    code: `import { useState, useEffect } from 'react';

const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApi;`,
    author: "Sarah Chen",
    tags: ["react", "hooks", "typescript", "api"],
    likes: 24,
    created: "2024-01-28",
    category: "Frontend"
  },
  {
    id: 2,
    title: "Python Async Rate Limiter",
    language: "python",
    code: `import asyncio
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_calls: int, time_window: int):
        self.max_calls = max_calls
        self.time_window = time_window
        self.calls = defaultdict(list)
    
    async def acquire(self, key: str) -> bool:
        now = time.time()
        # Clean old entries
        self.calls[key] = [
            call_time for call_time in self.calls[key]
            if now - call_time < self.time_window
        ]
        
        if len(self.calls[key]) < self.max_calls:
            self.calls[key].append(now)
            return True
        return False

# Usage
limiter = RateLimiter(max_calls=10, time_window=60)
if await limiter.acquire("user_123"):
    print("Request allowed")`,
    author: "Mike Rodriguez",
    tags: ["python", "async", "rate-limiting", "backend"],
    likes: 18,
    created: "2024-01-27",
    category: "Backend"
  },
  {
    id: 3,
    title: "Docker Multi-Stage Build",
    language: "dockerfile",
    code: `# Multi-stage build for Node.js app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
USER node
CMD ["npm", "start"]`,
    author: "Alex Thompson",
    tags: ["docker", "nodejs", "devops", "optimization"],
    likes: 31,
    created: "2024-01-26",
    category: "DevOps"
  },
  {
    id: 4,
    title: "Binary Search Implementation",
    language: "javascript",
    code: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Usage
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sortedArray, 7)); // Output: 3`,
    author: "Emma Wilson",
    tags: ["algorithm", "search", "javascript", "datastructures"],
    likes: 15,
    created: "2024-01-25",
    category: "Algorithm"
  }
];

const mockProjects: Project[] = [
  { id: 1, name: "E-commerce Platform", status: "Active", progress: 75, team: ["Sarah", "Mike", "Alex"], deadline: "2024-02-15", priority: "High" },
  { id: 2, name: "Mobile App Redesign", status: "Active", progress: 45, team: ["Emma", "David"], deadline: "2024-03-01", priority: "Medium" },
  { id: 3, name: "API Gateway Migration", status: "Planning", progress: 10, team: ["Mike", "Alex"], deadline: "2024-02-28", priority: "High" },
  { id: 4, name: "Documentation Portal", status: "Completed", progress: 100, team: ["Sarah", "Emma"], deadline: "2024-01-20", priority: "Low" },
];

export default function EngineeringDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);

  const languages = ['All', 'typescript', 'python', 'javascript', 'dockerfile'];
  const categories = ['All', 'Frontend', 'Backend', 'DevOps', 'Algorithm', 'Utility'];

  const filteredSnippets = mockCodeSnippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLanguage = selectedLanguage === 'All' || snippet.language === selectedLanguage;
    const matchesCategory = selectedCategory === 'All' || snippet.category === selectedCategory;
    return matchesSearch && matchesLanguage && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Completed': return 'text-blue-600 bg-blue-100';
      case 'On Hold': return 'text-yellow-600 bg-yellow-100';
      case 'Planning': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'typescript': return '🔷';
      case 'javascript': return '🟨';
      case 'python': return '🐍';
      case 'dockerfile': return '🐳';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Engineering Dashboard</h2>
            <p className="text-slate-400">Code snippets, projects, and development metrics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-primary">{mockCodeSnippets.length}</div>
            <div className="text-sm text-slate-400">Code Snippets</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-600">{mockProjects.filter(p => p.status === 'Active').length}</div>
            <div className="text-sm text-slate-400">Active Projects</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-blue-600">{mockProjects.filter(p => p.status === 'Completed').length}</div>
            <div className="text-sm text-slate-400">Completed</div>
          </div>
          <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-secondary">{Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)}%</div>
            <div className="text-sm text-slate-400">Avg Progress</div>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Code Snippets Library</h3>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search code snippets..."
              className="w-full py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="py-3 px-4 rounded-lg bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary text-white"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>Language: {lang}</option>
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
        </div>

        {/* Code Snippets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSnippets.map((snippet) => (
            <div 
              key={snippet.id} 
              className="bg-slate-950/50 rounded-lg p-4 border border-slate-700 hover:border-primary transition-colors cursor-pointer"
              onClick={() => setSelectedSnippet(snippet)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getLanguageIcon(snippet.language)}</span>
                  <h4 className="font-medium text-white">{snippet.title}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(snippet.category)}`}>
                  {snippet.category}
                </span>
              </div>
              
              <div className="bg-gray-900 rounded-md p-3 mb-3 overflow-hidden">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap line-clamp-4">
                  {snippet.code.substring(0, 150)}...
                </pre>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">by {snippet.author}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{snippet.created}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500">❤️</span>
                  <span className="text-slate-400">{snippet.likes}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {snippet.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Active Projects</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-950/50">
              <tr>
                <th className="text-left py-4 px-6 text-white font-medium">Project</th>
                <th className="text-left py-4 px-6 text-white font-medium">Status</th>
                <th className="text-left py-4 px-6 text-white font-medium">Progress</th>
                <th className="text-left py-4 px-6 text-white font-medium">Team</th>
                <th className="text-left py-4 px-6 text-white font-medium">Priority</th>
                <th className="text-left py-4 px-6 text-white font-medium">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {mockProjects.map((project) => (
                <tr key={project.id} className="border-t border-slate-700 hover:bg-slate-950/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-white">{project.name}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{width: `${project.progress}%`}}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-400">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex -space-x-2">
                      {project.team.map((member, index) => (
                        <div 
                          key={member}
                          className="w-8 h-8 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-white"
                          title={member}
                        >
                          {member[0]}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{project.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippet Modal */}
      {selectedSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-slate-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedSnippet.title}</h3>
                <p className="text-slate-400">by {selectedSnippet.author} • {selectedSnippet.created}</p>
              </div>
              <button 
                onClick={() => setSelectedSnippet(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm flex items-center gap-2">
                  {getLanguageIcon(selectedSnippet.language)} {selectedSnippet.language}
                </span>
                <button className="text-gray-400 hover:text-white text-sm">
                  📋 Copy
                </button>
              </div>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                {selectedSnippet.code}
              </pre>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedSnippet.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
