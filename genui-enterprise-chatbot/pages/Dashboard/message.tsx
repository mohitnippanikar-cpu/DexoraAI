"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className="flex gap-4 py-6 px-6 mb-3 rounded-xl bg-gradient-to-br from-slate-900/40 to-slate-900/20 border border-slate-800/50 backdrop-blur-sm"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="text-[15px] leading-relaxed text-slate-100 whitespace-pre-wrap">
        {text}
      </div>
    </motion.div>
  );
};

interface MessageProps {
  role: string;
  content: ReactNode;
  prompt?: string;
}

export const Message = ({ role, content, prompt }: MessageProps) => {
  return <div>{content}</div>;
};

// Default export to satisfy Next.js page export requirement. Named exports above
// are used elsewhere in the app.
export default function MessagePage() {
  return null;
}
