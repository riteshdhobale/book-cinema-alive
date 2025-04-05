
import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

interface PDFViewerProps {
  pdfFile: File;
  pdfText: string;
  isAnimating: boolean;
}

const PDFViewer = ({ pdfFile, pdfText, isAnimating }: PDFViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Animation frames for each paragraph (in a real implementation, these would be generated)
  const [animationFrames, setAnimationFrames] = useState<string[]>([]);
  
  useEffect(() => {
    // Create a URL for the PDF file
    const url = URL.createObjectURL(pdfFile);
    setPdfUrl(url);
    
    // Clean up URL when component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfFile]);

  useEffect(() => {
    if (pdfText) {
      // Split text into paragraphs (simple split by periods followed by space)
      const textParagraphs = pdfText
        .split(/(?<=\.)\s+/)
        .filter(para => para.trim().length > 0);
      setParagraphs(textParagraphs);
      
      // Simulate animation frames for each paragraph
      // In a real implementation, this would call an AI image generation API
      const placeholderFrames = textParagraphs.map((_, index) => 
        `https://picsum.photos/seed/${index + 1}/800/450`
      );
      setAnimationFrames(placeholderFrames);
    }
  }, [pdfText]);

  useEffect(() => {
    if (isAnimating) {
      setIsPlaying(true);
      setCurrentParagraphIndex(0);
      setProgress(0);
      
      if (animationFrames.length > 0) {
        setCurrentImage(animationFrames[0]);
      }
    }
  }, [isAnimating, animationFrames]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the TTS and animation
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, this would control the audio
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    // In a real implementation, this would adjust the TTS volume
  };

  const nextParagraph = () => {
    if (currentParagraphIndex < paragraphs.length - 1) {
      setCurrentParagraphIndex(prev => prev + 1);
      setProgress((currentParagraphIndex + 1) / paragraphs.length * 100);
      
      // Update animation frame
      if (animationFrames.length > currentParagraphIndex + 1) {
        setCurrentImage(animationFrames[currentParagraphIndex + 1]);
      }
    }
  };

  return (
    <div className="space-y-4">
      {pdfUrl && (
        <div className="relative border rounded-lg overflow-hidden" style={{ height: '300px' }}>
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-full"
          />
          
          {isAnimating && (
            <div className="absolute inset-0 bg-bookverse-primary/80 flex items-center justify-center text-white p-4">
              <div className="w-full max-w-xs text-center space-y-4">
                <div className="animate-pulse mb-2">
                  <span className="text-lg font-semibold">Narrating & Animating...</span>
                </div>
                
                {currentImage && (
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={currentImage} 
                      alt="Generated animation frame" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                {paragraphs.length > 0 && (
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <p className="text-sm">
                      {paragraphs[currentParagraphIndex]}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs">
                    <span>Paragraph {currentParagraphIndex + 1} of {paragraphs.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {pdfText && (
        <div className="space-y-3">
          <div className="p-3 bg-gray-100 rounded-md max-h-36 overflow-y-auto text-sm">
            {paragraphs.length > 0 ? (
              <div className="space-y-2">
                {paragraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={`${index === currentParagraphIndex && isAnimating ? 
                      'bg-bookverse-secondary/20 p-1 rounded' : ''}`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : pdfText}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full" 
              onClick={togglePlay}
              disabled={paragraphs.length === 0}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full" 
              onClick={toggleMute}
              disabled={paragraphs.length === 0}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={nextParagraph}
              disabled={paragraphs.length === 0 || currentParagraphIndex >= paragraphs.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="flex-grow flex items-center space-x-2">
              <Slider 
                defaultValue={[80]} 
                max={100} 
                step={1}
                value={[volume]}
                onValueChange={handleVolumeChange}
                className="flex-grow"
              />
              <span className="text-xs w-8">{volume}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
