
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-bookverse-primary to-bookverse-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your Reading Experience?
        </h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
          Join thousands of readers who are discovering the joy of immersive, AI-powered storytelling with BookVerse.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/upload">
            <Button size="lg" className="bg-bookverse-accent hover:bg-bookverse-accent/90 text-bookverse-primary">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
