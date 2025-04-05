
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/">
            <h1 className="font-bold text-2xl text-bookverse-primary">
              Book<span className="text-bookverse-secondary">Verse</span>
            </h1>
          </Link>
        </div>
        
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="text-gray-700 hover:text-bookverse-secondary transition-colors">Features</a>
          <a href="#library" className="text-gray-700 hover:text-bookverse-secondary transition-colors">Library</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-bookverse-secondary transition-colors">How It Works</a>
          <Link to="/upload" className="text-gray-700 hover:text-bookverse-secondary transition-colors">Upload PDF</Link>
        </div>
        
        <div>
          <Link to="/upload">
            <Button className="bg-bookverse-secondary hover:bg-bookverse-secondary/90 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
