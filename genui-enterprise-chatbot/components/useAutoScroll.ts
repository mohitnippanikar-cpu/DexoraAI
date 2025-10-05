"use client";

import { useEffect, useRef, MutableRefObject } from 'react';

/**
 * Hook to automatically scroll to the bottom of a container when content changes
 * @param dependencies - Array of dependencies that trigger scrolling when changed
 * @param smoothScroll - Whether to use smooth scrolling behavior
 * @returns A ref to attach to the scrollable container
 */
export default function useAutoScroll(
  dependencies: any[] = [], 
  smoothScroll: boolean = false
): MutableRefObject<HTMLDivElement | null> {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      const behavior = smoothScroll ? 'smooth' : 'auto';
      
      // Use scrollIntoView for better compatibility
      const lastChild = scrollElement.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({ behavior, block: 'end' });
      } else {
        // Fallback to manual scrolling
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Immediate scroll
    scrollToBottom();
    
    // Additional scroll after a short delay to catch any content rendering
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    // Another scroll after longer delay to catch images or other resources loading
    const secondTimer = setTimeout(() => {
      scrollToBottom();
    }, 300);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(secondTimer);
    };
  }, dependencies);
  
  // Expose scroll function for manual triggers
  scrollRef.current?.setAttribute('scrollToBottom', scrollToBottom.toString());
  
  return scrollRef;
} 