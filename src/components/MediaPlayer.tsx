import React, { useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';

interface MediaPlayerProps {
  url: string;
  type: 'image' | 'video';
  isPlaying?: boolean;
  isMuted?: boolean;
  onPlayToggle?: () => void;
  onMuteToggle?: () => void;
  className?: string;
  autoPlay?: boolean;
}

export function MediaPlayer({
  url,
  type,
  isPlaying = false,
  isMuted = false,
  onPlayToggle,
  onMuteToggle,
  className = "",
  autoPlay = false
}: MediaPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && type === 'video') {
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, type]);

  useEffect(() => {
    if (videoRef.current && type === 'video') {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, type]);

  if (type === 'image') {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={url}
          alt="Story illustration"
          className="w-full h-full object-cover rounded-lg animate-fade-in"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover rounded-lg"
        loop
        muted={isMuted}
        playsInline
        autoPlay={autoPlay}
        onLoadedData={() => {
          if (autoPlay && videoRef.current) {
            videoRef.current.play().catch(console.error);
          }
        }}
      />
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
      
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPlayToggle}
            className="text-white hover:text-primary bg-black/20 hover:bg-black/40 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onMuteToggle}
            className="text-white hover:text-primary bg-black/20 hover:bg-black/40 backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="text-white text-xs bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
          AI Generated Video
        </div>
      </div>
    </div>
  );
}