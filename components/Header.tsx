
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 text-center border-b border-slate-700/50">
      <div className="inline-flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 text-transparent bg-clip-text">
          Menu Hero Shot Generator
        </h1>
      </div>
      <p className="mt-2 text-md text-slate-400 max-w-2xl mx-auto">
        Transform your simple menu photos into stunning, professional-quality images with AI.
      </p>
    </header>
  );
};
