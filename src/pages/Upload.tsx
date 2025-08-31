import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PDFUploader from "../components/PDFUploader";
import { PDFViewer } from "../components/PDFViewer";
import { elevenLabsService } from "../services/elevenLabsService";
import { geminiService } from "../services/geminiService";
import ElevenLabsSetup from "../components/ElevenLabsSetup";
import GeminiSetup from "../components/GeminiSetup";
import { toast } from "sonner";

export default function Upload() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [mediaData, setMediaData] = useState<Record<number, { url: string; type: 'image' | 'video' }>>({});
  const [audioReady, setAudioReady] = useState(false);
  const [contentAnalysis, setContentAnalysis] = useState<any>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [mediaGenerationQueue, setMediaGenerationQueue] = useState<number[]>([]);

  const handleFileUpload = async (file: File) => {
    setPdfFile(file);
    setIsAnimating(false);
    setImageUrls({});
    setMediaData({});
    setAudioReady(false);
    setContentAnalysis(null);
    
    // Simulate PDF text extraction
    const simulatedText = `Once upon a time, in a village nestled between towering mountains and deep forests, there lived a young girl named Elara. With fiery red hair and eyes that sparkled like emeralds, she was known for her boundless curiosity and adventurous spirit.

One misty morning, Elara discovered an ancient book with tattered pages in her grandmother's attic. The book seemed to whisper secrets of forgotten magic and hidden realms beyond the mountains.

As she turned each weathered page, illustrations began to shimmer and move. The forest depicted in the book started to grow from the pages, tiny leaves unfurling and branches reaching toward her fingers.

A small fox with a silver tail leaped from the illustrated forest and landed softly on her lap. 'I've been waiting for you,' it said, its voice like wind chimes in a gentle breeze. 'The book has chosen you as its new guardian.'`;
    
    setPdfText(simulatedText);
    
    // Split text into paragraphs
    const paras = simulatedText
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 20)
      .slice(0, 10);
      
    setParagraphs(paras);
    setCurrentParagraph(0);
    
    toast.success(`PDF processed: ${paras.length} paragraphs found`);
  };

  const generateMediaForParagraphs = async () => {
    if (!geminiService.getApiKey()) {
      console.log("No Gemini API key found, skipping media generation");
      return;
    }

    try {
      setIsGeneratingMedia(true);
      setGenerationProgress("Analyzing your story with Gemini Pro...");
      
      // Analyze content first if not already done
      if (!contentAnalysis && pdfText) {
        console.log("🧠 Analyzing PDF content for immersive media generation...");
        const analysis = await geminiService.analyzeContent(pdfText);
        setContentAnalysis(analysis);
        
        if (analysis) {
          toast.success(`Story analyzed: ${analysis.theme} genre with ${analysis.mood.toLowerCase()} mood`);
        }
      }

      // Generate media for first few paragraphs intelligently
      const mediaToGenerate = Math.min(4, paragraphs.length);
      const queue = Array.from({ length: mediaToGenerate }, (_, i) => i);
      setMediaGenerationQueue(queue);
      
      for (let i = 0; i < mediaToGenerate; i++) {
        if (!mediaData[i] && !imageUrls[i] && paragraphs[i]) {
          setGenerationProgress(`Creating immersive visuals for scene ${i + 1}...`);
          console.log(`🎨 Generating adaptive media for paragraph ${i + 1}...`);
          
          const result = await geminiService.generateAdaptiveMedia(
            paragraphs[i], 
            contentAnalysis
          );
          
          if (result.url) {
            if (result.type === 'video') {
              setMediaData(prev => ({
                ...prev,
                [i]: result
              }));
              toast.success(`Generated ${result.type === 'video' ? '🎬 video' : '🎨 image'} for scene ${i + 1}`);
            } else {
              setImageUrls(prev => ({
                ...prev,
                [i]: result.url
              }));
            }
          }
          
          // Remove from queue
          setMediaGenerationQueue(prev => prev.filter(idx => idx !== i));
        }
      }
      
      setGenerationProgress("✨ All visuals ready! Your immersive experience awaits...");
      
      setTimeout(() => {
        setIsGeneratingMedia(false);
        setGenerationProgress("");
      }, 1500);
      
    } catch (error) {
      console.error('Error generating media:', error);
      toast.error("Media generation failed, using fallback images");
      setIsGeneratingMedia(false);
      setGenerationProgress("");
    }
  };

  useEffect(() => {
    if (paragraphs.length > 0 && !Object.keys(imageUrls).length && !Object.keys(mediaData).length) {
      generateMediaForParagraphs();
    }
  }, [paragraphs]);

  const prepareAudio = async () => {
    if (!elevenLabsService.getApiKey()) {
      toast.error("Please set your ElevenLabs API key first");
      return;
    }

    try {
      toast.info("Preparing audio narration...");
      // Simulate audio preparation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAudioReady(true);
      toast.success("Audio preparation complete!");
    } catch (error) {
      toast.error("Failed to prepare audio");
    }
  };

  const handlePlay = () => {
    setIsAnimating(true);
  };

  const handlePause = () => {
    setIsAnimating(false);
  };

  const handleStartStory = () => {
    if (!audioReady) {
      toast.error("Please prepare audio first");
      return;
    }
    
    setCurrentParagraph(0);
    setIsAnimating(true);
    toast.success("Starting your immersive story experience!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Transform Your Reading Experience
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your PDF and watch it come to life with AI-generated visuals, voice narration, and immersive animations.
            </p>
          </div>

          {/* API Setup */}
          <div className="flex justify-center gap-4 mb-8">
            <ElevenLabsSetup onApiKeySet={() => toast.success("ElevenLabs API key configured!")} />
            <GeminiSetup onApiKeySet={() => toast.success("Gemini API key configured!")} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Upload Your PDF</h2>
                <PDFUploader onFileUpload={handleFileUpload} />
                
                {paragraphs.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Found {paragraphs.length} paragraphs
                    </div>
                    
                    {!audioReady && (
                      <button
                        onClick={prepareAudio}
                        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                        disabled={!elevenLabsService.getApiKey()}
                      >
                        Prepare Audio Narration
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Progress Info */}
              {(isGeneratingMedia || audioReady) && (
                <div className="bg-card p-4 rounded-lg border space-y-3">
                  <h3 className="font-medium">Progress</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${Object.keys(mediaData).length > 0 || Object.keys(imageUrls).length > 0 ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                      <span>AI Visuals {isGeneratingMedia ? 'Generating...' : 'Ready'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${audioReady ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span>Audio Narration {audioReady ? 'Ready' : 'Pending'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Viewer Section */}
            <div className="lg:col-span-2">
              <PDFViewer
                pdfFile={pdfFile}
                pdfText={pdfText}
                isAnimating={isAnimating}
                currentParagraph={currentParagraph}
                paragraphs={paragraphs}
                imageUrls={imageUrls}
                mediaData={mediaData}
                onPlay={handlePlay}
                onPause={handlePause}
                onParagraphChange={setCurrentParagraph}
                onStartStory={handleStartStory}
                audioReady={audioReady}
                isGeneratingMedia={isGeneratingMedia}
                generationProgress={generationProgress}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}