import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  content: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, content }) => {
  const [copied, setCopied] = useState(false);
  
  const isCopyable = typeof content === 'string' || Array.isArray(content);
  const textToCopy = isCopyable ? (Array.isArray(content) ? content.join(', ') : content) : '';

  const handleCopy = () => {
    if (!isCopyable) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg relative transition-all duration-300 hover:shadow-indigo-accent/20 hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-indigo-accent mb-3">{title}</h3>
      {Array.isArray(content) ? (
        <div className="flex flex-wrap gap-2">
          {content.map((tag, index) => (
            <span key={index} className="bg-gray-blue/20 text-off-white text-sm font-medium px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      ) : (typeof content === 'string' ? (
         <p className="text-gray-blue whitespace-pre-wrap">{content}</p>
        ) : (
          content
        )
      )}
      {isCopyable && (
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 text-gray-blue hover:text-off-white transition-colors"
          aria-label={`Copy ${title}`}
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};

export default ResultCard;
