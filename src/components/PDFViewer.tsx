import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Sparkles, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Progress } from './ui/progress';
import { MediaPlayer } from './MediaPlayer';

interface PDFViewerProps {
  pdfFile: File | null;
  pdfText: string;
  isAnimating: boolean;
  currentParagraph: number;
  paragraphs: string[];
  imageUrls: Record<number, string>;
  mediaData: Record<number, { url: string; type: 'image' | 'video' }>;
  onPlay: () => void;
  onPause: () => void;
  onParagraphChange: (index: number) => void;
  onStartStory: () => void;
  audioReady: boolean;
  isGeneratingMedia: boolean;
  generationProgress: string;
}

export function PDFViewer({
  pdfFile,
  pdfText,
  isAnimating,
  currentParagraph,
  paragraphs,
  imageUrls,
  mediaData,
  onPlay,
  onPause,
  onParagraphChange,
  onStartStory,
  audioReady,
  isGeneratingMedia,
  generationProgress
}: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  // Create object URL for PDF when file changes
  useEffect(() => {
    if (pdfFile) {
      const url = URL.createObjectURL(pdfFile);
      setPdfUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
        setPdfUrl(null);
      };
    }
  }, [pdfFile]);

  // Reset media loaded states when paragraph changes
  useEffect(() => {
    setImageLoaded(false);
    setMediaLoaded(false);
  }, [currentParagraph]);

  // Update progress during animation
  useEffect(() => {
    if (isAnimating) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setProgress(prev => (prev < 95 ? prev + 1 : prev));
      }, 200);
      
      return () => clearInterval(interval);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isAnimating]);

  const togglePlay = () => {
    const newPlayState = !isPlaying;
    setIsPlaying(newPlayState);
    
    if (newPlayState) {
      onPlay();
    } else {
      onPause();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Apply mute to any audio elements in the document
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.muted = !isMuted;
    });
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Apply volume to any audio elements in the document
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = newVolume;
    });
  };

  const handleNextParagraph = () => {
    if (currentParagraph < paragraphs.length - 1) {
      onParagraphChange(currentParagraph + 1);
    }
  };

  const handlePreviousParagraph = () => {
    if (currentParagraph > 0) {
      onParagraphChange(currentParagraph - 1);
    }
  };

  const handleStartStory = () => {
    onStartStory();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleMediaLoad = () => {
    setMediaLoaded(true);
  };

  if (!pdfFile && !pdfText) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
        <div className="text-center space-y-4">
          <div className="text-4xl">📚</div>
          <p className="text-muted-foreground">Upload a PDF to start your immersive reading experience</p>
        </div>
      </div>
    );
  }

  const currentImageUrl = imageUrls[currentParagraph];
  const currentMediaData = mediaData[currentParagraph];
  const showPdf = !currentImageUrl && !currentMediaData && pdfUrl;

  return (
    <div className="flex-1 flex flex-col space-y-4">
      {/* Main Content Display */}
      <div className="relative aspect-video bg-gradient-to-br from-background to-muted rounded-lg overflow-hidden shadow-xl">
        {/* Content Area */}
        {currentMediaData ? (
          <MediaPlayer
            url={currentMediaData.url}
            type={currentMediaData.type}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayToggle={togglePlay}
            onMuteToggle={toggleMute}
            className="w-full h-full"
            autoPlay={isAnimating}
          />
        ) : currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt={`Illustration for paragraph ${currentParagraph + 1}`}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
          />
        ) : showPdf ? (
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        ) : null}

        {/* Animation Progress Overlay */}
        {isAnimating && !currentImageUrl && !currentMediaData && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white space-y-4 max-w-md mx-auto px-6">
              <div className="text-2xl font-bold">Reading Progress</div>
              <Progress value={progress} className="w-full bg-white/20" />
              <div className="text-lg leading-relaxed">
                {paragraphs[currentParagraph]}
              </div>
            </div>
          </div>
        )}

        {/* Media Generation Progress Overlay */}
        {isGeneratingMedia && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center text-white space-y-6 max-w-md mx-auto px-6">
              <div className="flex items-center justify-center space-x-3">
                <Wand2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-2xl font-bold">Creating Magic</div>
              </div>
              <div className="text-lg text-primary/80">
                {generationProgress}
              </div>
              <div className="space-y-2">
                <Progress value={50} className="w-full bg-white/20" />
                <p className="text-sm text-white/70">
                  Generating immersive visuals with Gemini Pro...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Start Story Button */}
        {paragraphs.length > 0 && audioReady && (imageLoaded || mediaLoaded || currentMediaData) && !isAnimating && !isGeneratingMedia && (
          <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={handleStartStory}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-bold py-3 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Immersive Experience
            </Button>
          </div>
        )}
      </div>

      {/* Text Content Display */}
      {pdfText && (
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg border max-h-40 overflow-y-auto">
            {paragraphs.length > 0 ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Paragraph {currentParagraph + 1} of {paragraphs.length}</span>
                  {audioReady && (
                    <span className="flex items-center text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Audio Ready
                    </span>
                  )}
                </div>
                <p className={`text-foreground ${isPlaying ? 'text-primary font-medium' : ''}`}>
                  {paragraphs[currentParagraph]}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">{pdfText.substring(0, 500)}...</p>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between gap-4 p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-2">
              <Button
                variant={isPlaying ? "default" : "outline"}
                size="sm"
                onClick={togglePlay}
                disabled={!audioReady}
                className="rounded-full"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                disabled={!audioReady}
                className="rounded-full"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousParagraph}
                disabled={currentParagraph === 0 || !audioReady}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextParagraph}
                disabled={currentParagraph === paragraphs.length - 1 || !audioReady}
                className="rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-xs">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => handleVolumeChange([value[0] / 100])}
                max={100}
                step={1}
                className="flex-1"
                disabled={!audioReady}
              />
              <span className="text-sm text-muted-foreground w-10">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Audio Preparation Status */}
          {!audioReady && paragraphs.length > 0 && !isGeneratingMedia && (
            <div className="flex items-center justify-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="text-amber-700 text-sm font-medium">
                ⏳ Please wait for audio preparation to complete
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}