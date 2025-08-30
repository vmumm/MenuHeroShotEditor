
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { GeneratedImage } from './components/GeneratedImage';
import { generateHeroShot } from './services/geminiService';

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setGeneratedImages(null); // Clear previous results
    setError(null);
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!uploadedFile) {
      setError('Please upload an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      // FileReader result is a data URL (e.g., "data:image/jpeg;base64,...")
      // We need to extract the raw base64 part for the API
      const base64Data = imagePreview?.split(',')[1];
      if (!base64Data) {
        throw new Error('Could not read image data.');
      }

      const resultBase64Array = await generateHeroShot(base64Data, uploadedFile.type, prompt);
      const resultImageUrls = resultBase64Array.map(base64 => `data:image/png;base64,${base64}`);
      setGeneratedImages(resultImageUrls);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, prompt, imagePreview]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Input Column */}
          <div className="flex flex-col gap-6 bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            <div>
              <h2 className="text-xl font-semibold text-cyan-400 mb-2">1. Upload Menu Item Photo</h2>
              <p className="text-sm text-slate-400 mb-4">Upload a clear photo of the dish you want to transform.</p>
              <ImageUploader onImageUpload={handleImageUpload} imagePreviewUrl={imagePreview} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-cyan-400 mb-2">2. Describe Your Hero Shot (Optional)</h2>
              <p className="text-sm text-slate-400 mb-4">Be descriptive! Mention lighting, plating, background, and mood.</p>
              <PromptInput
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onSubmit={handleGenerateClick}
                isLoading={isLoading}
                disabled={!uploadedFile}
              />
            </div>
          </div>

          {/* Output Column */}
          <div className="flex flex-col bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">3. Generated Hero Shots</h2>
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
            <GeneratedImage imageUrls={generatedImages} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
