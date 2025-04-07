
import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface PDFViewerProps {
  pdfFile: File;
  pdfText: string;
  isAnimating: boolean;
  currentParagraph?: number;
  paragraphs?: string[];
  imageUrls?: string[];
  onParagraphChange?: (index: number) => void;
  audioElements?: HTMLAudioElement[];
  onPlay?: () => void;
  onPause?: () => void;
}

const PDFViewer = ({ 
  pdfFile, 
  pdfText, 
  isAnimating, 
  currentParagraph = 0,
  paragraphs = [],
  imageUrls = [],
  onParagraphChange,
  audioElements = [],
  onPlay,
  onPause
}: PDFViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  
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
    if (isAnimating) {
      setIsPlaying(true);
      // Simulate animation progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return newProgress;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [isAnimating]);
  
  const togglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    // Call the appropriate parent handler
    if (newPlayState) {
      if (onPlay) onPlay();
    } else {
      if (onPause) onPause();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Apply mute state to audio elements
    if (audioElements && audioElements.length > 0) {
      const currentAudio = audioElements[currentParagraph];
      if (currentAudio) {
        currentAudio.muted = !isMuted;
      }
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Apply volume to audio elements
    if (audioElements && audioElements.length > 0) {
      audioElements.forEach(audio => {
        if (audio) {
          audio.volume = newVolume / 100;
        }
      });
    }
  };

  const handleNextParagraph = () => {
    if (onParagraphChange && paragraphs.length > 0 && currentParagraph < paragraphs.length - 1) {
      onParagraphChange(currentParagraph + 1);
    }
  };

  const handlePreviousParagraph = () => {
    if (onParagraphChange && paragraphs.length > 0 && currentParagraph > 0) {
      onParagraphChange(currentParagraph - 1);
    }
  };

  return (
    <div className="space-y-4">
      {pdfUrl && (
        <div className="relative border rounded-lg overflow-hidden" style={{ height: '300px' }}>
          {imageUrls && imageUrls[currentParagraph] ? (
            <div className="w-full h-full relative">
              <img 
                src={imageUrls[currentParagraph]} 
                alt={`Visualization for paragraph ${currentParagraph + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div className="text-white text-sm">
                  {paragraphs && paragraphs[currentParagraph] && (
                    <p>{paragraphs[currentParagraph].substring(0, 100)}...</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-full"
            />
          )}
          
          {isAnimating && !imageUrls[currentParagraph] && (
            <div className="absolute inset-0 bg-bookverse-primary/80 flex items-center justify-center text-white p-4">
              <div className="w-full max-w-xs text-center space-y-4">
                <div className="animate-pulse mb-2">
                  <span className="text-lg font-semibold">Narrating & Animating...</span>
                </div>
                
                {paragraphs && paragraphs[currentParagraph] && (
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <p className="text-sm">{paragraphs[currentParagraph].substring(0, 100)}...</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-bookverse-accent"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Processing</span>
                    <span>{progress}%</span>
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
            {paragraphs && paragraphs.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
                  <span>Paragraph {currentParagraph + 1} of {paragraphs.length}</span>
                  <span>{Math.floor(progress)}% complete</span>
                </div>
                <p className="font-medium">{paragraphs[currentParagraph]}</p>
              </>
            ) : (
              pdfText
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full" 
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full" 
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full" 
                onClick={handlePreviousParagraph}
                disabled={currentParagraph === 0 || paragraphs.length === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full" 
                onClick={handleNextParagraph}
                disabled={currentParagraph === paragraphs.length - 1 || paragraphs.length === 0}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
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
