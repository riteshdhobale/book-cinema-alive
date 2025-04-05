
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Pause, Play, Video } from 'lucide-react';

const DemoSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-bookverse-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See How It Works</h2>
            <p className="text-lg opacity-90">
              BookVerse transforms plain text into an immersive experience in three simple steps:
            </p>
            
            <div className="space-y-6 mt-8">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-bookverse-secondary flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-xl">Upload</h3>
                  <p className="opacity-80">Upload any PDF, ebook, or text document to our platform.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-bookverse-secondary flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-xl">Transform</h3>
                  <p className="opacity-80">Our AI analyzes the content and generates narration, visuals, and animations.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-bookverse-secondary flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl">Experience</h3>
                  <p className="opacity-80">Enjoy your book as a cinematic experience - read, watch, and listen!</p>
                </div>
              </div>
            </div>
            
            <Button className="mt-6 bg-bookverse-accent hover:bg-bookverse-accent/90 text-bookverse-primary">
              Try It Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="lg:col-span-3 relative">
            <div className="bg-white p-6 rounded-lg shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bookverse-light p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-5 w-5 text-bookverse-secondary" />
                    <h4 className="font-semibold text-bookverse-primary">Original Text</h4>
                  </div>
                  <div className="text-gray-800 text-sm">
                    <p>"Once upon a time, in a village nestled between towering mountains and deep forests, there lived a young girl named Elara. With fiery red hair and eyes that sparkled like emeralds, she was known for her boundless curiosity."</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-bookverse-secondary/20 to-bookverse-accent/20 p-4 rounded-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-5 w-5 text-bookverse-secondary" />
                    <h4 className="font-semibold text-bookverse-primary">BookVerse Experience</h4>
                  </div>
                  <div className="aspect-video bg-bookverse-primary/10 rounded-md flex items-center justify-center mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                      alt="AI visualization" 
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-bookverse-primary/10 rounded-full flex-shrink-0"></div>
                    <div className="text-xs text-gray-700">"Once upon a time, in a village nestled between..."</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-bookverse-light p-4 rounded-md">
                <h4 className="font-semibold text-bookverse-primary mb-2">Experience Controls</h4>
                <div className="flex items-center gap-3 text-bookverse-primary">
                  <Button variant="outline" size="sm" className="border-bookverse-secondary text-bookverse-secondary">
                    <Play className="h-4 w-4 mr-1" /> Play
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <Pause className="h-4 w-4 mr-1" /> Pause
                  </Button>
                  <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-bookverse-secondary"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 h-40 w-40 bg-bookverse-accent rounded-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 h-40 w-40 bg-bookverse-secondary rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
