
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-accent"></div>
      <p className="text-gray-blue">Generating content, please wait...</p>
    </div>
  );
};

export default Loader;
