import { FormEvent, useState, useRef, KeyboardEvent, useEffect, ChangeEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading?: boolean;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export default function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [textareaHeight, setTextareaHeight] = useState<number>(48);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const [showFeatureActive, setShowFeatureActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    try {
      // Include file references in the message
      let messageWithFiles = inputValue.trim();
      if (uploadedFiles.length > 0) {
        const fileNames = uploadedFiles.map(file => file.name).join(', ');
        messageWithFiles += ` [Files: ${fileNames}]`;
      }
      
      await onSendMessage(messageWithFiles);
      
      // Clear files and input after sending
      setInputValue('');
      setUploadedFiles([]);
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = '48px';
        setTextareaHeight(48);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle key press events - specifically Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSubmit(e as unknown as FormEvent);
      }
    }
    
    // Clear Show feature on Backspace if input is empty
    if (e.key === 'Backspace' && inputValue === '' && showFeatureActive) {
      e.preventDefault();
      setShowFeatureActive(false);
    }
  };

  // Auto-resize textarea as user types and adjust button position
  const handleInput = () => {
    const textarea = inputRef.current;
    if (textarea) {
      // Save the current scroll position
      const scrollPos = textarea.scrollTop;
      
      // Reset height momentarily to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height (capped at 200px)
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
      setTextareaHeight(newHeight);
      
      // Restore the scroll position
      textarea.scrollTop = scrollPos;
    }
  };

  // Update button position when textarea height changes
  useEffect(() => {
    if (buttonsRef.current && textareaHeight) {
      // No need to calculate position for centering
    }
  }, [textareaHeight]);

  const toggleShowFeature = () => {
    setShowFeatureActive(!showFeatureActive);
  };

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (typeof window !== 'undefined') {
      // Use type assertion to access browser-specific APIs
      const windowWithSpeech = window as any;
      const SpeechRecognitionAPI = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join('');
          
          setInputValue((prev) => prev + ' ' + transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    
    return () => {
      // Clean up recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e) {
        console.error('Error starting speech recognition:', e);
        alert('Could not start speech recognition. Please try again.');
      }
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} exceeds 10MB limit`);
        return;
      }
      
      const newFile: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type
      };
      
      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            // Update the specific file with the preview
            setUploadedFiles(prev => 
              prev.map(f => 
                f.name === file.name ? { ...f, preview: e.target?.result as string } : f
              )
            );
          }
        };
        reader.readAsDataURL(file);
      }
      
      newFiles.push(newFile);
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Reset the file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter(file => file.name !== fileName));
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string): JSX.Element => {
    if (fileType.startsWith('image/')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
          <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else if (fileType.includes('doc') || fileType.includes('word')) {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
          {/* Show/Display Indicator when active */}
            {showFeatureActive && (
            <div className="absolute -top-9 left-0 right-0 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-lg shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm font-medium text-primary">Show/Display Mode Active</span>
                </div>
              </div>
            )}
            
          {/* TextArea Input */}
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            placeholder="Message Dexora AI..."
            className="w-full pr-36 pl-5 py-4 resize-none bg-slate-900 border border-slate-700 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 scrollbar-hide shadow-lg transition-all placeholder:text-slate-500"
            style={{ height: `${textareaHeight}px`, maxHeight: '200px', minHeight: '56px' }}
              disabled={isLoading}
            />
          
          {/* Buttons Container */}
          <div 
            ref={buttonsRef}
            className="absolute right-2 bottom-0 top-0 flex items-center gap-1 h-full"
          >
            {/* File Upload Button */}
            <button
              type="button"
              onClick={openFilePicker}
              className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              title="Upload files"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2 rounded-lg transition-all ${isRecording ? 'text-red-500 bg-red-500/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`ml-1 p-2.5 rounded-xl transition-all shadow-lg ${inputValue.trim() && !isLoading ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-primary/50 hover:scale-105' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
          </div>
          </div>
          
        {/* Show/Display Button */}
        <div className="mt-2 flex justify-start">
          <button
            type="button"
            onClick={toggleShowFeature}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
              showFeatureActive 
                ? 'bg-primary/20 text-primary border border-primary/30 shadow-md' 
                : 'bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:text-primary hover:border-primary/20 hover:bg-slate-900/70'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 20v-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Show/Display</span>
          </button>
                      </div>
        
        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Files to upload:</div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map(file => (
                <div key={file.name} className="flex items-center gap-2 bg-slate-900/70 backdrop-blur-sm py-2 px-3 rounded-xl border border-slate-700/60 text-slate-200 shadow-md hover:border-primary/30 transition-all">
                        {getFileIcon(file.type)}
                  <span className="text-xs truncate max-w-[120px] font-medium">{file.name}</span>
                  <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                    className="text-slate-500 hover:text-red-400 transition-colors ml-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        
        {/* Model Info Banner */}
        {showModelInfo && (
          <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl text-xs text-slate-300 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-medium">Powered by Dexora AI</span>
              <button 
                onClick={() => setShowModelInfo(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 