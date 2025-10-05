import { ReactNode, isValidElement, useState, useRef } from 'react';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessageProps {
  role: MessageRole;
  content: string | ReactNode;
  timestamp?: Date;
  isLoading?: boolean;
  userPrompt?: string;
}

export default function ChatMessage({ 
  role, 
  content, 
  timestamp = new Date(),
  isLoading = false,
  userPrompt
}: ChatMessageProps) {
  // State to manage copy success message
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const messageContentRef = useRef<HTMLDivElement>(null);

  // Function to handle copying content
  const handleCopy = async () => {
    if (typeof content === 'string') {
      try {
        await navigator.clipboard.writeText(content);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(null), 2000);
      } catch (err) {
        setCopySuccess('Failed to copy');
        setTimeout(() => setCopySuccess(null), 2000);
      }
    }
  };

  // Function to save message as image
  const handleSaveAsImage = async () => {
    if (!messageContentRef.current) return;

    try {
      // Get text content to render
      let textToRender = '';
      if (typeof content === 'string') {
        textToRender = content;
      } else if (messageContentRef.current) {
        textToRender = messageContentRef.current.innerText || '';
      }

      if (!textToRender) {
        setSaveSuccess('No content');
        setTimeout(() => setSaveSuccess(null), 2000);
        return;
      }

      // Create an off-screen canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        setSaveSuccess('Failed');
        setTimeout(() => setSaveSuccess(null), 2000);
        return;
      }
      
      // Set font and styling
      context.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      
      // Calculate text dimensions
      const lineHeight = 24;
      const padding = 40;
      const maxWidth = 600;
      
      // Wrap text and calculate height
      const lines = [];
      const words = textToRender.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = context.measureText(testLine);
        
        if (metrics.width > maxWidth - padding * 2) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      // Push the last line
      if (currentLine) {
        lines.push(currentLine);
      }
      
      // Set canvas dimensions
      canvas.width = maxWidth;
      canvas.height = lines.length * lineHeight + padding * 2;
      
      // Reset context after resize
      context.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      
      // Fill background
      context.fillStyle = '#121212';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw border
      context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      context.lineWidth = 1;
      context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
      
      // Add heading
      context.fillStyle = '#00ADCD';
      context.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      context.fillText('GenUI Assistant', padding, padding);
      
      // Draw text
      context.fillStyle = '#ffffff';
      context.font = '15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      
      lines.forEach((line, index) => {
        // Start text below the heading
        const y = padding + 30 + (index * lineHeight);
        context.fillText(line, padding, y);
      });
      
      // Convert to image
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `genui-content-${new Date().getTime()}.png`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      setSaveSuccess('Saved!');
      setTimeout(() => setSaveSuccess(null), 2000);
    } catch (err) {
      console.error('Error saving content as image:', err);
      setSaveSuccess('Failed');
      setTimeout(() => setSaveSuccess(null), 2000);
    }
  };

  // Ensure timestamp is a Date object
  const messageTime = timestamp instanceof Date ? timestamp : new Date(timestamp);

  // Show loading animation if message is in loading state
  if (isLoading) {
    return (
      <div className="flex gap-4 py-6 px-6 mb-3 rounded-xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 backdrop-blur-sm">
        <div className="flex-shrink-0 w-9 h-9 mt-0.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg animate-pulse">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3C14.5013 5.75108 15.9228 8.81691 16 12C15.9228 15.1831 14.5013 18.2489 12 21C9.49872 18.2489 8.07725 15.1831 8 12C8.07725 8.81691 9.49872 5.75108 12 3Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex flex-col space-y-3">
            <div className="h-4 w-32 bg-slate-800/60 rounded-lg animate-pulse"></div>
            <div className="h-3 w-full bg-slate-800/40 rounded-lg animate-pulse"></div>
            <div className="h-3 w-5/6 bg-slate-800/40 rounded-lg animate-pulse"></div>
            <div className="h-3 w-3/4 bg-slate-800/40 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Determine if content is empty or can't be displayed
  const hasContent = typeof content === 'string' 
    ? content.trim().length > 0 
    : isValidElement(content);

  return (
    <div 
      className={`flex gap-4 py-6 px-6 mb-3 rounded-xl transition-all duration-200 ${
        role === 'assistant' 
          ? 'bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 backdrop-blur-sm hover:border-slate-700/50' 
          : 'bg-gradient-to-br from-slate-800/30 to-slate-800/10 border border-slate-700/40 hover:border-slate-600/50'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 mt-0.5">
        {role === 'user' ? (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-base shadow-lg border border-slate-600/50">
            👤
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg border border-primary/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3C14.5013 5.75108 15.9228 8.81691 16 12C15.9228 15.1831 14.5013 18.2489 12 21C9.49872 18.2489 8.07725 15.1831 8 12C8.07725 8.81691 9.49872 5.75108 12 3Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className={`font-semibold text-sm ${role === 'user' ? 'text-slate-300' : 'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'}`}>
            {role === 'user' ? 'You' : 'Dexora AI'}
          </div>
          <div className="text-xs text-slate-500">
            {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Display user prompt for assistant messages if available */}
        {role === 'assistant' && userPrompt && (
          <div className="mb-3 text-sm text-slate-400 italic border-l-2 border-primary/40 pl-3 py-1.5 bg-slate-900/30 rounded-r-lg">
            <span className="font-medium text-slate-300">Role-based access checked and Responding to:</span> {userPrompt}
          </div>
        )}
        <div ref={messageContentRef} className={`prose prose-sm max-w-none ${role === 'user' ? 'text-slate-200 font-normal' : 'text-slate-100'}`}>
          {typeof content === 'string' ? (
            <div className="text-[15px] leading-relaxed">
              {role === 'user' ? (
                <p className="whitespace-pre-wrap m-0">{content}</p>
              ) : (
                <div className="whitespace-pre-wrap">{content}</div>
              )}
            </div>
          ) : isValidElement(content) ? (
            content
          ) : (
            <p className="text-slate-400">Content could not be displayed</p>
          )}
          
          {/* Display a message if content is empty */}
          {!hasContent && role === 'user' && (
            <p className="text-slate-500 italic">This message appears to be empty</p>
          )}
        </div>

        {/* Action buttons for AI messages */}
        {role === 'assistant' && (
          <div className="flex items-center gap-2 mt-5 text-slate-500">
            <button 
              onClick={handleCopy}
              className="hover:text-primary hover:bg-primary/10 text-xs flex items-center gap-1.5 group relative px-3 py-1.5 rounded-lg transition-all border border-slate-700/50 hover:border-primary/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
              </svg>
              <span className="font-medium">{copySuccess ? copySuccess : "Copy"}</span>
              
              {/* Tooltip that appears on hover */}
              {!copySuccess && (
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-slate-800 text-slate-200 text-xs py-2 px-3 rounded-lg shadow-xl whitespace-nowrap border border-slate-700">
                  Copy response
                </span>
              )}
            </button>
            <button 
              onClick={handleSaveAsImage}
              className="hover:text-primary hover:bg-primary/10 text-xs flex items-center gap-1.5 group relative px-3 py-1.5 rounded-lg transition-all border border-slate-700/50 hover:border-primary/30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
              </svg>
              <span className="font-medium">{saveSuccess ? saveSuccess : "Download"}</span>
              
              {/* Tooltip that appears on hover */}
              {!saveSuccess && (
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-slate-800 text-slate-200 text-xs py-2 px-3 rounded-lg shadow-xl whitespace-nowrap border border-slate-700">
                  Download as image
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}