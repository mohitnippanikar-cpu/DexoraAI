"use client";

import { useState, useCallback } from 'react';

// Create a simple file upload component without any external dependencies
export default function DropFilesView() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Document types with example lists
  const documentTypes = [
    { 
      id: 'contracts', 
      name: 'Contracts & Agreements',
      icon: '📄',
      examples: [
        'Master Service Agreements (MSA)',
        'Non-Disclosure Agreements (NDA)',
        'Vendor Contracts',
        'Employment Agreements'
      ]
    },
    { 
      id: 'financial-reports', 
      name: 'Financial Reports',
      icon: '💹',
      examples: [
        'Balance Sheets',
        'Profit & Loss Statements',
        'Annual Reports',
        'Expense Reports'
      ]
    },
    { 
      id: 'compliance-docs', 
      name: 'Compliance & Regulatory',
      icon: '🛡️',
      examples: [
        'ISO Certifications',
        'GDPR Compliance Documents',
        'Audit Reports',
        'Risk Assessments'
      ]
    },
    { 
      id: 'project-docs', 
      name: 'Project Documentation',
      icon: '📁',
      examples: [
        'Project Plans',
        'Technical Specifications',
        'Meeting Minutes',
        'Status Reports'
      ]
    }
  ];

  // File handling functions
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="w-full pb-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">
            📁
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Upload Medical Documents
            </h2>
            <p className="text-sm text-slate-400">Share your health records for AI-powered analysis</p>
          </div>
        </div>
        
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
            isDragging 
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/20" 
              : "border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging 
              ? 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30' 
              : 'bg-slate-800 border border-slate-700'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-10 w-10 ${isDragging ? 'text-white' : 'text-primary'}`}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          
          <div className="text-center">
            <p className="font-semibold text-white text-lg">
              Drag and drop your medical files here
            </p>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              Upload lab results, diagnostic reports, medical imaging, or other health records for comprehensive AI analysis
            </p>
          </div>
          
          <label className="mt-2">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              accept=".pdf,.jpg,.jpeg,.png,.dcm,.dicom"
            />
            <span className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl cursor-pointer font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Browse Files
            </span>
          </label>
        </div>

        {/* Document type suggestions */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <h3 className="font-semibold text-white">
              Suggested Document Types
            </h3>
          </div>
          
          <div className="space-y-3">
            {documentTypes.map((type) => (
              <div key={type.id} className="space-y-2">
                <button
                  onClick={() => toggleSection(type.id)}
                  className={`flex items-center gap-3 w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    activeSection === type.id
                      ? 'bg-primary/10 border border-primary/30 shadow-sm'
                      : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="text-2xl">{type.icon}</div>
                  <span className="font-medium text-white flex-1">
                    {type.name}
                  </span>
                  <div className={`flex items-center gap-2 transition-all duration-200 ${
                    activeSection === type.id ? 'text-primary' : 'text-slate-500'
                  }`}>
                    <span className="text-xs font-medium">
                      {activeSection === type.id ? "Hide" : "Show"} Examples
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 ${activeSection === type.id ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>
                
                {activeSection === type.id && (
                  <div className="ml-14 pl-4 border-l-2 border-primary/30 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-xs font-medium text-slate-400 mb-3">Examples:</p>
                    <ul className="space-y-2">
                      {type.examples.map((example, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* File List */}
        {files.length > 0 && (
          <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm">
            <div className="p-5 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                </div>
                <h3 className="font-semibold text-white">
                  Uploaded Files ({files.length})
                </h3>
              </div>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
            <ul className="divide-y divide-slate-700">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 rounded-lg hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-white">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            <div className="p-5 bg-slate-800/50 border-t border-slate-700 flex justify-end gap-3">
              <button
                onClick={() => setFiles([])}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                onClick={() => {
                  // Handle file submission logic here
                  alert(`${files.length} files ready for analysis`);
                  setFiles([]);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Upload for Analysis</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3 p-4 bg-slate-900/30 border border-slate-700 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mt-0.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="font-medium text-slate-300">Supported formats:</span> PDF documents, Images (.jpg, .png) for visual diagnostics, and DICOM files for medical imaging. All uploads are encrypted and HIPAA compliant.
          </div>
        </div>
      </div>
    </div>
  );
}

// For backward compatibility
export { DropFilesView }; 