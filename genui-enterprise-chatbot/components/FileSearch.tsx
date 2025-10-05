"use client";

import { useState } from 'react';

interface FileResult {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  category: string;
  citations: string[];
  relevanceScore: number;
}

interface FileSearchProps {
  initialQuery?: string;
  results?: FileResult[];
}

export default function FileSearch({ initialQuery = '', results = [] }: FileSearchProps) {
  const [activeFile, setActiveFile] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Search Results Header */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-5 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Search Results ({results.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Query: &quot;<span className="text-white font-medium">{initialQuery}</span>&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <p className="text-slate-400">No files found matching your query</p>
            <p className="text-sm text-slate-500 mt-2">Try different keywords or upload more documents</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {results.map((file) => (
              <div key={file.id} className="p-5 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-4">
                  {/* File Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                  </div>

                  {/* File Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{file.name}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <span>•</span>
                          <span>{file.uploadDate}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md font-medium">
                            {file.category}
                          </span>
                        </div>
                      </div>

                      {/* Relevance Score */}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span className="text-xs font-semibold text-white">{file.relevanceScore}%</span>
                      </div>
                    </div>

                    {/* Citations */}
                    {file.citations && file.citations.length > 0 && (
                      <div className="mt-3">
                        <button
                          onClick={() => setActiveFile(activeFile === file.id ? null : file.id)}
                          className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mb-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 3v18h18"></path>
                            <path d="m19 9-5 5-4-4-3 3"></path>
                          </svg>
                          <span>
                            {activeFile === file.id ? 'Hide' : 'Show'} Citations ({file.citations.length})
                          </span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="12" 
                            height="12" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className={`transition-transform duration-200 ${activeFile === file.id ? 'rotate-180' : ''}`}
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                        
                        {activeFile === file.id && (
                          <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {file.citations.map((citation, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[10px] font-bold text-blue-400">{idx + 1}</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed flex-1">
                                  &quot;{citation}&quot;
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-3">
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/25 text-white rounded-lg text-xs font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        View File
                      </button>
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download
                      </button>
                      <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                          <polyline points="16 6 12 2 8 6"></polyline>
                          <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
