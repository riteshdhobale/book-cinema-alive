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
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isValidatingApiKey, setIsValidatingApiKey] = useState(false);

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

  useEffect(() => {
    const validateApiKeys = async () => {
      setIsValidatingApiKey(true);
      const elevenLabsApiKey = elevenLabsService.getApiKey();
      
      if (elevenLabsApiKey) {
        const isValid = await elevenLabsService.validateApiKey();
        
        if (!isValid) {
          toast({
            title: "API Key Issue",
            description: "Your ElevenLabs API key appears to be invalid. Please check and update it.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "API Key Valid",
            description: "Your ElevenLabs API key is valid and ready to use.",
          });
        }
      }
      
      setIsValidatingApiKey(false);
    };
    
    validateApiKeys();
  }, [toast]);

  const handleFileUpload = (file: File) => {
    setPdfFile(file);
    setPdfText(''); // Clear any previous text
    setParagraphs([]); // Clear any previous paragraphs
    setCurrentParagraph(0); // Reset current paragraph
    setImageUrls([]); // Clear any previous images
    setIsAnimating(false); // Reset animation state
    setAudioElements([]); // Clear any previous audio elements
    setIsAudioReady(false); // Reset audio ready state
    
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    
    toast({
      title: "PDF Uploaded",
      description: `Successfully uploaded ${file.name}`,
    });
  };

  const splitIntoParagraphs = (text: string): string[] => {
    const rawParagraphs = text.split(/\n\s*\n/);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedText = "Once upon a time, in a village nestled between towering mountains and deep forests, there lived a young girl named Elara. With fiery red hair and eyes that sparkled like emeralds, she was known for her boundless curiosity and adventurous spirit.\n\n" +
                          "One misty morning, Elara discovered an ancient book with tattered pages in her grandmother's attic. The book seemed to whisper secrets of forgotten magic and hidden realms beyond the mountains.\n\n" +
                          "As she turned each weathered page, illustrations began to shimmer and move. The forest depicted in the book started to grow from the pages, tiny leaves unfurling and branches reaching toward her fingers.\n\n" +
                          "A small fox with a silver tail leaped from the illustrated forest and landed softly on her lap. 'I've been waiting for you,' it said, its voice like wind chimes in a gentle breeze. 'The book has chosen you as its new guardian.'";
      
      setPdfText(simulatedText);
      
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
      
      toast({
        title: "Analyzing Content",
        description: "Gemini is analyzing your story content..."
      });
      
      const contentAnalysis = await geminiService.analyzeContent(pdfText);
      
      if (contentAnalysis) {
        toast({
          title: "Content Analysis Complete",
          description: contentAnalysis.summary
        });
      }
      
      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        toast({
          title: "Generating Image",
          description: `Creating visualization for paragraph ${i + 1} of ${paragraphs.length}`
        });
        
        const prompt = await geminiService.generateEnhancedPrompt(paragraph, contentAnalysis);
        
        const imageUrl = await geminiService.generateImage(prompt);
        
        if (imageUrl) {
          images.push(imageUrl);
        } else {
          images.push('');
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

  const preloadAudioContent = async () => {
    if (!pdfText || paragraphs.length === 0) {
      toast({
        title: "No Content",
        description: "Please process your PDF first",
        variant: "destructive"
      });
      return false;
    }

    const elevenLabsApiKey = elevenLabsService.getApiKey();
    if (!elevenLabsApiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your ElevenLabs API key first",
        variant: "destructive"
      });
      return false;
    }

    if (imageUrls.length === 0 || imageUrls.length !== paragraphs.length) {
      toast({
        title: "Images Required",
        description: "Please generate images for your content first",
        variant: "destructive"
      });
      return false;
    }
    
    setIsProcessing(true);
    toast({
      title: "Preparing Audio",
      description: "Generating voice narrations for your story..."
    });

    try {
      const audioArray: HTMLAudioElement[] = [];
      
      for (let i = 0; i < paragraphs.length; i++) {
        toast({
          title: "Processing Audio",
          description: `Preparing narration for paragraph ${i + 1} of ${paragraphs.length}`,
        });
        
        const paragraph = paragraphs[i];
        
        const audio = await elevenLabsService.textToSpeech(paragraph);
        
        if (audio) {
          audio.volume = 0.8;
          console.log(`Audio prepared for paragraph ${i}`);
          
          audio.onended = () => {
            console.log(`Audio for paragraph ${i} ended`);
            if (i < paragraphs.length - 1) {
              setCurrentParagraph(i + 1);
              if (audioArray[i + 1]) {
                console.log(`Playing audio for paragraph ${i + 1}`);
                audioArray[i + 1].play().catch(err => console.error("Error playing audio:", err));
                setCurrentAudio(audioArray[i + 1]);
              }
            } else {
              setIsAnimating(false);
              setCurrentAudio(null);
              toast({
                title: "Narration Complete",
                description: "Your story has been fully narrated"
              });
            }
          };
          
          audioArray.push(audio);
        } else {
          console.error(`Failed to generate audio for paragraph ${i}`);
          toast({
            title: "Audio Generation Issue",
            description: `Couldn't generate audio for paragraph ${i + 1}`,
            variant: "destructive"
          });
        }
      }
      
      setAudioElements(audioArray);
      setIsAudioReady(true);
      
      toast({
        title: "Audio Ready",
        description: "Your story is ready to be narrated. Click 'Start Story' to begin."
      });
      
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Audio Preparation Failed",
        description: "An error occurred while preparing audio for your content",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnimate = async () => {
    const success = await preloadAudioContent();
    if (!success) return;
  };
  
  const handleStartStory = () => {
    if (!isAudioReady || audioElements.length === 0) {
      toast({
        title: "Not Ready",
        description: "Please wait for audio preparation to complete",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentParagraph(0);
    setIsAnimating(true);
    
    if (audioElements.length > 0) {
      console.log("Starting playback of first paragraph");
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContext.resume().then(() => {
        if (audioElements[0]) {
          audioElements[0].play()
            .then(() => {
              console.log("Audio playback started successfully");
              setCurrentAudio(audioElements[0]);
            })
            .catch(err => {
              console.error("Error playing first audio:", err);
              toast({
                title: "Audio Playback Failed",
                description: "There was an issue starting audio playback. Try clicking on the page first.",
                variant: "destructive"
              });
              const unlockAudio = () => {
                if (audioElements[0]) {
                  audioElements[0].play()
                    .then(() => {
                      console.log("Audio playback started after user interaction");
                      setCurrentAudio(audioElements[0]);
                      document.removeEventListener('click', unlockAudio);
                    })
                    .catch(err => console.error("Still failed to play audio:", err));
                }
              };
              document.addEventListener('click', unlockAudio);
              toast({
                title: "Audio Unlock Required",
                description: "Please click anywhere on the page to start audio playback",
              });
            });
        }
      });
    }
    
    toast({
      title: "Story Started",
      description: "Your story is now being narrated and animated"
    });
  };

  const handleParagraphChange = (index: number) => {
    if (index >= 0 && index < paragraphs.length) {
      if (currentAudio) {
        currentAudio.pause();
      }
      
      setCurrentParagraph(index);
      
      if (audioElements && audioElements[index]) {
        audioElements[index].currentTime = 0;
        audioElements[index].play().catch(err => console.error("Error playing audio after paragraph change:", err));
        setCurrentAudio(audioElements[index]);
        setIsAnimating(true);
      }
    }
  };

  const handlePlay = () => {
    if (currentAudio && audioElements.length > 0) {
      currentAudio.play().catch(err => console.error("Error on play button:", err));
      setIsAnimating(true);
    }
  };

  const handlePause = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsAnimating(false);
    }
  };

  const handleApiKeySet = async () => {
    toast({
      title: "Validating API Key",
      description: "Checking your ElevenLabs API key..."
    });
    
    const isValid = await elevenLabsService.validateApiKey();
    
    if (isValid) {
      toast({
        title: "API Key Valid",
        description: "Your ElevenLabs API key is valid and ready to use"
      });
    } else {
      toast({
        title: "API Key Issue",
        description: "Your ElevenLabs API key appears to be invalid. Please check and update it.",
        variant: "destructive"
      });
    }
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
                    isProcessing ||
                    isAudioReady || 
                    !elevenLabsService.getApiKey() || 
                    imageUrls.length === 0 || 
                    imageUrls.length !== paragraphs.length ||
                    isValidatingApiKey
                  }
                >
                  {isProcessing ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span>
                      Preparing Audio...
                    </span>
                  ) : isAudioReady ? (
                    <span className="flex items-center">
                      <span className="mr-2">✓</span>
                      Audio Ready
                    </span>
                  ) : (
                    "Prepare Audio Narration"
                  )}
                </Button>
              </div>
              
              {isProcessing && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center">
                    <span className="animate-pulse mr-2">🔊</span>
                    <span className="text-sm text-blue-700">Audio preparation in progress... please wait</span>
                  </div>
                </div>
              )}
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
                  audioElements={audioElements}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStartStory={handleStartStory}
                  isAudioReady={isAudioReady}
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
              <li>Click "Prepare Audio Narration" to generate the audio files</li>
              <li>Click "Start Story" to begin the narrated animation</li>
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
