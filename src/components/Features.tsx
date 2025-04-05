
import React from 'react';
import { Book, Headphones, Video, Volume } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="bg-bookverse-light py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-bookverse-primary mb-4">Experience Books Like Never Before</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            BookVerse transforms traditional reading into an AI-powered cinematic experience with three key features:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card bg-white p-8 shadow-lg">
            <div className="h-14 w-14 rounded-full bg-bookverse-secondary/10 flex items-center justify-center mb-6">
              <Volume className="h-7 w-7 text-bookverse-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-bookverse-primary">AI-Narrated Voiceovers</h3>
            <p className="text-gray-600">
              Professional voice actors bring characters to life with distinct personalities and emotions that match the story.
            </p>
          </div>
          
          <div className="feature-card bg-white p-8 shadow-lg">
            <div className="h-14 w-14 rounded-full bg-bookverse-secondary/10 flex items-center justify-center mb-6">
              <Video className="h-7 w-7 text-bookverse-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-bookverse-primary">Animated Characters</h3>
            <p className="text-gray-600">
              Characters leap off the page with bitmoji-like animations that express emotions and actions described in the text.
            </p>
          </div>
          
          <div className="feature-card bg-white p-8 shadow-lg">
            <div className="h-14 w-14 rounded-full bg-bookverse-secondary/10 flex items-center justify-center mb-6">
              <Book className="h-7 w-7 text-bookverse-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-bookverse-primary">Visual Storytelling</h3>
            <p className="text-gray-600">
              AI generates scene-by-scene visuals that match the narrative, creating an immersive movie-like experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
