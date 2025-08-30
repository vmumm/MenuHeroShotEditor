
import React, { useEffect, useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { ImageWithDownload } from './ImageWithDownload';

interface GeneratedImageProps {
  imageUrls: string[] | null;
  isLoading: boolean;
}

const loadingMessages = [
  "Preheating the virtual ovens...",
  "Adjusting the lighting...",
  "Plating the pixels perfectly...",
  "Consulting with digital chefs...",
  "Adding a touch of AI magic...",
  "Rendering delicious details...",
  "Generating a few options for you...",
];

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrls, isLoading }) => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-slate-400 p-4">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4 animate-pulse text-cyan-400" />
          <p className="font-semibold text-slate-200">Generating your masterpieces...</p>
          <p className="text-sm mt-1 transition-opacity duration-500">{message}</p>
        </div>
      );
    }
    if (imageUrls && imageUrls.length > 0) {
      if (imageUrls.length === 3) {
        return (
          <div className="w-full h-full p-2 grid gap-2 grid-cols-2">
            <div className="col-span-2">
              <ImageWithDownload imageUrl={imageUrls[0]} index={0} />
            </div>
            <div className="col-span-1">
              <ImageWithDownload imageUrl={imageUrls[1]} index={1} />
            </div>
            <div className="col-span-1">
              <ImageWithDownload imageUrl={imageUrls[2]} index={2} />
            </div>
          </div>
        );
      }
      // Fallback for different number of images
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-2">
            {imageUrls.map((url, index) => (
              <ImageWithDownload key={index} imageUrl={url} index={index} />
            ))}
        </div>
      );
    }
    return (
      <div className="text-center text-slate-500 p-4">
        <SparklesIcon className="w-12 h-12 mx-auto mb-2" />
        <p>Your generated hero shots will appear here.</p>
      </div>
    );
  };

  return (
    <div className={`flex-grow flex justify-center items-center w-full bg-slate-900 rounded-lg overflow-hidden transition-all duration-300 ${!imageUrls && !isLoading ? 'aspect-video' : 'min-h-[300px]'}`}>
      {renderContent()}
    </div>
  );
};
