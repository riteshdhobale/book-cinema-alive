
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
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
