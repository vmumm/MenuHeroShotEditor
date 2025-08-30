
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageWithDownloadProps {
  imageUrl: string;
  index: number;
}

export const ImageWithDownload: React.FC<ImageWithDownloadProps> = ({ imageUrl, index }) => {
  return (
    <div className="relative group aspect-video rounded-lg overflow-hidden bg-slate-900">
      <img src={imageUrl} alt={`Generated option ${index + 1}`} className="object-contain w-full h-full" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
        <a
          href={imageUrl}
          download={`menu-hero-shot-${index + 1}.png`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-500 transition-colors"
          aria-label={`Download image ${index + 1}`}
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download</span>
        </a>
      </div>
    </div>
  );
};
