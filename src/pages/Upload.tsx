
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PDFUploader from '@/components/PDFUploader';
import PDFViewer from '@/components/PDFViewer';
import ElevenLabsSetup from '@/components/ElevenLabsSetup';
import { Button } from '@/components/ui/button';
import { elevenLabsService } from '@/services/elevenLabsService';

const Upload = () => {
  const { toast } = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleFileUpload = (file: File) => {
    setPdfFile(file);
    setPdfText(''); // Clear any previous text
    setIsAnimating(false); // Reset animation state
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    
    toast({
      title: "PDF Uploaded",
      description: `Successfully uploaded ${file.name}`,
    });
  };

  const handleProcess = async () => {
    if (!pdfFile) {
      toast({
        title: "No PDF Selected",
        description: "Please upload a PDF file first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // In a real implementation, this would use a PDF extraction library
      // For now, we'll simulate processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedText = "Once upon a time, in a village nestled between towering mountains and deep forests, there lived a young girl named Elara. With fiery red hair and eyes that sparkled like emeralds, she was known for her boundless curiosity and adventurous spirit.";
      setPdfText(simulatedText);
      toast({
        title: "Processing Complete",
        description: "Your PDF has been processed successfully"
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "An error occurred while processing your PDF",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnimate = async () => {
    if (!pdfText) {
      toast({
        title: "No Content",
        description: "Please process your PDF first",
        variant: "destructive"
      });
      return;
    }

    const apiKey = elevenLabsService.getApiKey();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key first",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    
    try {
      // Generate speech from the text
      const audio = await elevenLabsService.textToSpeech(pdfText);
      
      if (audio) {
        setAudioElement(audio);
        audio.play();
        
        audio.onended = () => {
          setIsAnimating(false);
          toast({
            title: "Narration Complete",
            description: "Your content has been narrated successfully"
          });
        };
      } else {
        throw new Error("Failed to generate speech");
      }
      
      toast({
        title: "Animation Started",
        description: "Your content is now being narrated and animated"
      });
    } catch (error) {
      console.error(error);
      setIsAnimating(false);
      toast({
        title: "Animation Failed",
        description: "An error occurred while animating your content",
        variant: "destructive"
      });
    }
  };

  const handleApiKeySet = () => {
    toast({
      title: "Ready for Text-to-Speech",
      description: "You can now convert your PDF text to speech"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-bookverse-primary">
            Transform Your PDF
          </h1>
          <p className="text-lg mb-8">
            Upload your PDF and watch as BookVerse turns it into an immersive, animated experience with AI narration.
          </p>

          <div className="mb-6 flex justify-end">
            <ElevenLabsSetup onApiKeySet={handleApiKeySet} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Upload Your PDF</h2>
              <PDFUploader onFileUpload={handleFileUpload} />
              
              <div className="mt-6 space-y-4">
                <Button 
                  onClick={handleProcess} 
                  className="w-full bg-bookverse-secondary" 
                  disabled={!pdfFile || isProcessing}
                >
                  {isProcessing ? "Processing..." : "Process PDF"}
                </Button>
                
                <Button 
                  onClick={handleAnimate} 
                  className="w-full bg-bookverse-accent text-bookverse-primary" 
                  disabled={!pdfText || isAnimating || !elevenLabsService.getApiKey()}
                >
                  {isAnimating ? "Narrating..." : "Narrate & Animate"}
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              {pdfFile ? (
                <PDFViewer pdfFile={pdfFile} pdfText={pdfText} isAnimating={isAnimating} />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500">
                  No PDF uploaded yet
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-12 bg-bookverse-primary/10 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Upload your PDF document</li>
              <li>Click "Process PDF" to extract and analyze the text</li>
              <li>Set up your ElevenLabs API key for text-to-speech</li>
              <li>Click "Narrate & Animate" to transform your content</li>
              <li>Enjoy your story with AI narration and visuals</li>
            </ol>
            <p className="mt-4 text-sm text-gray-600">
              Note: For the best experience, use PDFs with clear text content and fewer than 20 pages.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Upload;
