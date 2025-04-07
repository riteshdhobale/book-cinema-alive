
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Library from '@/components/Library';
import DemoSection from '@/components/DemoSection';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Library />
      <DemoSection />
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">New Feature: AI-Powered Story Visualization</h2>
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">Text-to-Animation Synchronized with Voice</h3>
                <p className="text-gray-700 mb-6">
                  Our latest feature brings your stories to life with AI-powered visuals that sync perfectly with narration.
                  Upload your PDF, and watch as each paragraph is illustrated and narrated in real-time.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Google Gemini AI for stunning visualizations</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Paragraph-by-paragraph synchronized playback</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>ElevenLabs voice narration for immersive audio</span>
                  </li>
                </ul>
                <div>
                  <a 
                    href="/upload" 
                    className="px-4 py-2 bg-bookverse-primary text-white rounded-md hover:bg-bookverse-primary/90 transition-colors"
                  >
                    Try It Now
                  </a>
                </div>
              </div>
              <div className="bg-gray-100 p-6 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop"
                  alt="AI-powered story visualization" 
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
