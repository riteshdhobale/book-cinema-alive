
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { geminiService } from '@/services/geminiService';
import { ImageIcon } from 'lucide-react';

interface GeminiSetupProps {
  onApiKeySet?: () => void;
}

const GeminiSetup = ({ onApiKeySet }: GeminiSetupProps) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const savedKey = geminiService.getApiKey();
    setHasKey(!!savedKey);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      geminiService.setApiKey(apiKey.trim());
      setHasKey(true);
      setIsDialogOpen(false);
      if (onApiKeySet) {
        onApiKeySet();
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasKey ? "outline" : "default"}
          className={hasKey ? "text-green-500 border-green-500" : ""}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {hasKey ? "Gemini API Key Set" : "Set Gemini API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Gemini API Setup</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Enter your Google Gemini API key to enable text-to-image generation.
            You can get an API key from the 
            <a 
              href="https://ai.google.dev/tutorials/rest_quickstart" 
              target="_blank" 
              rel="noreferrer"
              className="text-primary underline ml-1"
            >
              Google AI Developer Portal
            </a>.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally in your browser and is not sent to our servers.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveKey}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiSetup;
