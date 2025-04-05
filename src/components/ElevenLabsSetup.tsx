
import React, { useState, useEffect } from 'react';
import { elevenLabsService } from '@/services/elevenLabsService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Info } from 'lucide-react';

interface ElevenLabsSetupProps {
  onApiKeySet: () => void;
}

const ElevenLabsSetup = ({ onApiKeySet }: ElevenLabsSetupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const key = elevenLabsService.getApiKey();
    setHasKey(!!key);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key",
        variant: "destructive"
      });
      return;
    }

    elevenLabsService.setApiKey(apiKey.trim());
    setHasKey(true);
    setIsOpen(false);
    onApiKeySet();
    
    toast({
      title: "API Key Saved",
      description: "Your ElevenLabs API key has been saved successfully"
    });
  };

  const handleReset = () => {
    setApiKey('');
    elevenLabsService.setApiKey('');
    setHasKey(false);
    
    toast({
      title: "API Key Removed",
      description: "Your ElevenLabs API key has been removed"
    });
  };

  return (
    <>
      <Button 
        variant={hasKey ? "outline" : "default"}
        className={hasKey ? "border-green-500 text-green-600" : "bg-bookverse-secondary"}
        onClick={() => setIsOpen(true)}
      >
        {hasKey ? "ElevenLabs API Key ✓" : "Set ElevenLabs API Key"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ElevenLabs API Setup</DialogTitle>
            <DialogDescription>
              Enter your ElevenLabs API key to enable text-to-speech functionality.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  You can get an API key by signing up at{" "}
                  <a 
                    href="https://elevenlabs.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    elevenlabs.io
                  </a>
                </p>
              </div>
            </div>

            {hasKey && (
              <div className="flex items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-red-500 border-red-300 hover:bg-red-50"
                  onClick={handleReset}
                >
                  Remove API Key
                </Button>
                <p className="ml-2 text-sm text-gray-500">
                  This will remove your saved API key.
                </p>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Key</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ElevenLabsSetup;
