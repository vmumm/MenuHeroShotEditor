
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onSubmit, isLoading, disabled }) => {
  return (
    <div className="flex flex-col gap-4">
      <textarea
        value={value}
        onChange={onChange}
        placeholder="e.g., 'A juicy burger on a rustic wooden board, with dramatic side lighting, a craft beer in the background, and a shallow depth of field.'"
        className="w-full h-32 p-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-slate-200 placeholder-slate-500 resize-none"
        disabled={isLoading || disabled}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || disabled}
        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-cyan-600 rounded-lg shadow-md hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generate Images
          </>
        )}
      </button>
    </div>
  );
};
