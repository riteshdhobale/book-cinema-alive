
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PDFUploader from '@/components/PDFUploader';
import PDFViewer from '@/components/PDFViewer';
import ElevenLabsSetup from '@/components/ElevenLabsSetup';
import GeminiSetup from '@/components/GeminiSetup';
import { Button } from '@/components/ui/button';
import { elevenLabsService } from '@/services/elevenLabsService';
import { geminiService } from '@/services/geminiService';

const Upload = () => {
  const { toast } = useToast();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState<number>(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [audioElements, setAudioElements] = useState<HTMLAudioElement[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Reset audio playback when component unmounts
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
      audioElements.forEach(audio => {
        audio.pause();
      });
    };
  }, [audioElements, currentAudio]);

  const handleFileUpload = (file: File) => {
    setPdfFile(file);
    setPdfText(''); // Clear any previous text
    setParagraphs([]); // Clear any previous paragraphs
    setCurrentParagraph(0); // Reset current paragraph
    setImageUrls([]); // Clear any previous images
    setIsAnimating(false); // Reset animation state
    setAudioElements([]); // Clear any previous audio elements
    
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    
    toast({
      title: "PDF Uploaded",
      description: `Successfully uploaded ${file.name}`,
    });
  };

  // Split text into paragraphs
  const splitIntoParagraphs = (text: string): string[] => {
    // Split by double newlines to get paragraphs
    const rawParagraphs = text.split(/\n\s*\n/);
    
    // Filter out empty paragraphs and trim whitespace
    return rawParagraphs
      .map(p => p.trim())
      .filter(p => p.length > 0);
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
      // For now, we'll simulate processing with a timeout and sample text
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedText = "Once upon a time, in a village nestled between towering mountains and deep forests, there lived a young girl named Elara. With fiery red hair and eyes that sparkled like emeralds, she was known for her boundless curiosity and adventurous spirit.\n\n" +
                          "One misty morning, Elara discovered an ancient book with tattered pages in her grandmother's attic. The book seemed to whisper secrets of forgotten magic and hidden realms beyond the mountains.\n\n" +
                          "As she turned each weathered page, illustrations began to shimmer and move. The forest depicted in the book started to grow from the pages, tiny leaves unfurling and branches reaching toward her fingers.\n\n" +
                          "A small fox with a silver tail leaped from the illustrated forest and landed softly on her lap. 'I've been waiting for you,' it said, its voice like wind chimes in a gentle breeze. 'The book has chosen you as its new guardian.'";
      
      setPdfText(simulatedText);
      
      // Split the text into paragraphs
      const paragraphArray = splitIntoParagraphs(simulatedText);
      setParagraphs(paragraphArray);
      
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

  const handleGenerateImages = async () => {
    if (!pdfText || paragraphs.length === 0) {
      toast({
        title: "No Content",
        description: "Please process your PDF first",
        variant: "destructive"
      });
      return;
    }

    const geminiApiKey = geminiService.getApiKey();
    if (!geminiApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Gemini API key first",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImages(true);
    
    try {
      const images: string[] = [];
      
      // Generate an image for each paragraph
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        toast({
          title: "Generating Image",
          description: `Creating visualization for paragraph ${i + 1} of ${paragraphs.length}`
        });
        
        // Generate prompt for the image based on the paragraph
        const prompt = `Create a vivid, detailed scene of: ${paragraph.substring(0, 200)}`;
        
        // Generate the image using Gemini API
        const imageUrl = await geminiService.generateImage(prompt);
        
        if (imageUrl) {
          images.push(imageUrl);
        } else {
          images.push(''); // Placeholder for failed image generation
        }
      }
      
      setImageUrls(images);
      
      toast({
        title: "Images Generated",
        description: `Successfully created ${images.length} visualizations`
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Image Generation Failed",
        description: "An error occurred while creating visualizations",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const handleAnimate = async () => {
    if (!pdfText || paragraphs.length === 0) {
      toast({
        title: "No Content",
        description: "Please process your PDF first",
        variant: "destructive"
      });
      return;
    }

    const elevenLabsApiKey = elevenLabsService.getApiKey();
    if (!elevenLabsApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key first",
        variant: "destructive"
      });
      return;
    }

    // Check if we have images for each paragraph
    if (imageUrls.length === 0 || imageUrls.length !== paragraphs.length) {
      toast({
        title: "Images Required",
        description: "Please generate images for your content first",
        variant: "destructive"
      });
      return;
    }

    setIsAnimating(true);
    setCurrentParagraph(0);
    
    try {
      const audioArray: HTMLAudioElement[] = [];
      
      // Generate speech for each paragraph
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        
        // Generate speech from the text
        const audio = await elevenLabsService.textToSpeech(paragraph);
        
        if (audio) {
          audioArray.push(audio);
          
          // Set up audio end event for the current paragraph
          audio.onended = () => {
            // Move to the next paragraph when audio finishes
            if (i < paragraphs.length - 1) {
              setCurrentParagraph(i + 1);
              audioArray[i + 1].play();
              setCurrentAudio(audioArray[i + 1]);
            } else {
              // End of story
              setIsAnimating(false);
              setCurrentAudio(null);
              toast({
                title: "Narration Complete",
                description: "Your story has been fully narrated"
              });
            }
          };
        }
      }
      
      setAudioElements(audioArray);
      
      // Start playing the first paragraph
      if (audioArray.length > 0) {
        audioArray[0].play();
        setCurrentAudio(audioArray[0]);
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

  const handleParagraphChange = (index: number) => {
    if (index >= 0 && index < paragraphs.length) {
      // Stop current audio if playing
      if (currentAudio) {
        currentAudio.pause();
      }
      
      setCurrentParagraph(index);
      
      // Play the selected paragraph audio
      if (audioElements && audioElements[index]) {
        audioElements[index].currentTime = 0; // Start from beginning
        audioElements[index].play();
        setCurrentAudio(audioElements[index]);
      }
    }
  };

  const handleApiKeySet = () => {
    toast({
      title: "Ready for Text-to-Speech",
      description: "You can now convert your PDF text to speech"
    });
  };

  const handleGeminiApiKeySet = () => {
    toast({
      title: "Ready for Text-to-Image",
      description: "You can now generate visualizations for your content"
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
            Upload your PDF and watch as BookVerse turns it into an immersive, animated experience with AI narration and visualization.
          </p>

          <div className="mb-6 flex justify-end gap-4">
            <ElevenLabsSetup onApiKeySet={handleApiKeySet} />
            <GeminiSetup onApiKeySet={handleGeminiApiKeySet} />
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
                  onClick={handleGenerateImages} 
                  className="w-full bg-bookverse-primary" 
                  disabled={!pdfText || paragraphs.length === 0 || isGeneratingImages || !geminiService.getApiKey()}
                >
                  {isGeneratingImages ? "Generating..." : "Generate Visualizations"}
                </Button>
                
                <Button 
                  onClick={handleAnimate} 
                  className="w-full bg-bookverse-accent text-bookverse-primary" 
                  disabled={
                    !pdfText || 
                    paragraphs.length === 0 || 
                    isAnimating || 
                    !elevenLabsService.getApiKey() || 
                    imageUrls.length === 0 || 
                    imageUrls.length !== paragraphs.length
                  }
                >
                  {isAnimating ? "Narrating..." : "Narrate & Animate"}
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              {pdfFile ? (
                <PDFViewer 
                  pdfFile={pdfFile} 
                  pdfText={pdfText} 
                  isAnimating={isAnimating}
                  paragraphs={paragraphs}
                  currentParagraph={currentParagraph}
                  imageUrls={imageUrls}
                  onParagraphChange={handleParagraphChange}
                />
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
              <li>Set up your Google Gemini API key for image generation</li>
              <li>Click "Generate Visualizations" to create scene images</li>
              <li>Click "Narrate & Animate" to transform your content into an interactive story</li>
              <li>Use the playback controls to navigate through your story</li>
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
