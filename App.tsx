import React, { useState, useCallback, useRef } from 'react';
import { generateYouTubeContent, generateThumbnail } from './services/geminiService.ts';
import type { YouTubeContent } from './types.ts';
import Loader from './components/Loader.tsx';
import ResultCard from './components/ResultCard.tsx';
import SeoScore from './components/SeoScore.tsx';

const TitleOptions: React.FC<{ titles: string[] }> = ({ titles }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ul className="space-y-3">
      {titles.map((title, index) => (
        <li key={index} className="flex items-center justify-between gap-3 bg-gray-blue/10 p-3 rounded-md">
          <span className="text-gray-blue">{title}</span>
          <button
            onClick={() => handleCopy(title, index)}
            className="text-gray-blue hover:text-off-white transition-colors flex-shrink-0"
            aria-label={`Copy title ${index + 1}`}
          >
            {copiedIndex === index ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};


const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<YouTubeContent | null>(null);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a video topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setThumbnailUrls([]);
    setShowInterstitial(false);

    try {
      const textPromise = generateYouTubeContent(topic);
      
      const thumbnailPrompts = [
        `A visually stunning and clickbait YouTube thumbnail for a video about "${topic}". High contrast, vibrant colors, clear subject, and engaging text.`,
        `An aesthetic and cinematic YouTube thumbnail for a video about "${topic}". Minimalist design, professional typography, high-quality imagery.`,
        `An engaging and informative graphic-style YouTube thumbnail for a video about "${topic}". Use icons, bold text overlays, and a clear visual hierarchy to convey the video's content.`,
      ];

      const imagePromises = thumbnailPrompts.map(prompt => generateThumbnail(prompt));

      const [textContent, ...images] = await Promise.all([textPromise, ...imagePromises]);
      
      setGeneratedContent(textContent);
      setThumbnailUrls(images);
      setIsLoading(false);
      setShowInterstitial(true);

      setTimeout(() => {
        setShowInterstitial(false);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 2500);


    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      setIsLoading(false);
    }
  }, [topic]);

  return (
    <div className="min-h-screen bg-navy text-off-white font-sans flex flex-col items-center p-4 sm:p-8 transition-colors duration-500">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center pt-8">

        <h1 className="text-3xl sm:text-5xl font-bold text-center mt-4 bg-clip-text text-transparent bg-gradient-to-r from-off-white to-gray-blue">
          YouTube SEO Content Generator
        </h1>
        <p className="text-gray-blue mt-4 text-center max-w-2xl">
          Enter your video topic and let AI craft the perfect title, description, tags, and even generate unique thumbnail ideas to boost your channel's visibility.
        </p>

        <div className="w-full max-w-2xl mt-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'How to bake a sourdough bread'"
              className="flex-grow bg-slate-800/50 text-off-white placeholder-gray-blue px-6 py-4 rounded-full border-2 border-transparent focus:border-indigo-accent focus:ring-0 focus:outline-none transition-all duration-300 shadow-lg"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="bg-green-cta text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>

        <div ref={resultsRef} className="w-full mt-16 transition-opacity duration-700 ease-in-out">
          {isLoading && <Loader />}
          {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
          
          {showInterstitial && (
            <div className="flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-3xl font-bold text-indigo-accent animate-pulse">
                    Be Thankful to Lord Yogesh
                </h2>
            </div>
          )}
          
          {generatedContent && !showInterstitial && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-indigo-accent mb-2">Overall SEO Score</h3>
                    <p className="text-gray-blue">{generatedContent.scoreJustification}</p>
                 </div>
                 <SeoScore score={generatedContent.seoScore} />
              </div>
              
              <ResultCard title="Generated Title Options" content={<TitleOptions titles={generatedContent.titles} />} />
              <ResultCard title="Keyword Analysis" content={generatedContent.keywordAnalysis} />
              <ResultCard title="Generated Description" content={generatedContent.description} />
              <ResultCard title="Generated Tags" content={generatedContent.tags} />
              
              <div>
                 <h3 className="text-lg font-semibold text-indigo-accent mb-3 text-center">AI-Generated Thumbnails</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {thumbnailUrls.map((url, index) => (
                      <div key={index} className="group relative bg-slate-800/50 p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-indigo-accent/20 hover:scale-105">
                        <img src={url} alt={`Generated thumbnail ${index + 1}`} className="w-full h-auto rounded-md aspect-video object-cover" />
                        <a
                          href={url}
                          download={`thumbnail-${topic.replace(/\s+/g, '-')}-${index + 1}.png`}
                          className="absolute top-2 right-2 bg-green-cta/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          aria-label="Download thumbnail"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </a>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="w-full text-center mt-16 py-4">
        <p className="text-gray-blue font-bold text-2xl animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-indigo-accent via-green-cta to-indigo-accent">
          Made By Your Dad, You Little Bitch!!!
        </p>
      </footer>
    </div>
  );
};

export default App;