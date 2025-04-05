
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Headphones, Video } from "lucide-react";

const Hero = () => {
  return (
    <section className="hero-gradient min-h-screen pt-20 flex items-center">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transform Books Into <span className="text-bookverse-accent">Cinematic</span> Experiences
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              BookVerse brings stories to life with AI-narrated voiceovers, animated characters, and stunning visuals.
              Designed for the next generation of readers.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-bookverse-accent hover:bg-bookverse-accent/90 text-bookverse-primary">
                Upload a Book <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                Explore Library
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <Book className="text-bookverse-gold h-6 w-6" />
                <span>Read</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="text-bookverse-gold h-6 w-6" />
                <span>Watch</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="text-bookverse-gold h-6 w-6" />
                <span>Listen</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-float">
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b" 
                alt="BookVerse Interactive Reading" 
                className="rounded-lg shadow-2xl max-h-[500px] object-cover mx-auto"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-bookverse-secondary rounded-lg -z-10"></div>
            <div className="absolute -top-4 -left-4 w-40 h-40 bg-bookverse-accent rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
