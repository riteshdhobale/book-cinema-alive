
import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

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
                
                {pdfText && (
                  <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                    <p className="text-sm">{pdfText.substring(0, 100)}...</p>
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
            {pdfText}
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
