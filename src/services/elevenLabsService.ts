
// This service integrates with ElevenLabs API for text-to-speech
// You'll need to get an API key from https://elevenlabs.io/

interface TTSOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export const defaultVoices = {
  aria: "9BWtsMINqrJLrRacOk9x",
  roger: "CwhRBWXzGAHq8TQ4Fs17",
  sarah: "EXAVITQu4vr4xnSDxMaL",
  george: "JBFqnCBsd6RMkjVDRZzb"
};

export const defaultModels = {
  multilingualV2: "eleven_multilingual_v2",
  turboV2: "eleven_turbo_v2"
};

class ElevenLabsService {
  private apiKey: string | null = null;
  
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('elevenlabs_api_key', key);
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('elevenlabs_api_key');
    }
    return this.apiKey;
  }
  
  async generateSpeech(
    text: string,
    options: TTSOptions = {}
  ): Promise<ArrayBuffer | null> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not set. Please set your ElevenLabs API key first.');
    }
    
    const {
      voiceId = defaultVoices.sarah,
      modelId = defaultModels.multilingualV2,
      stability = 0.5,
      similarityBoost = 0.75
    } = options;

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    try {
      console.log('Generating speech with ElevenLabs API...', { voiceId, modelId });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        throw new Error(`ElevenLabs API error: ${response.status} ${errorText}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error generating speech:', error);
      return null;
    }
  }

  async textToSpeech(text: string, options?: TTSOptions): Promise<HTMLAudioElement | null> {
    try {
      // For testing purposes with Web Speech API in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using Web Speech API for development');
        const audio = new Audio();
        
        // Create speech synthesis for development testing
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        
        // Convert the speech to audio
        const speechPromise = new Promise<void>((resolve) => {
          speech.onend = () => resolve();
          window.speechSynthesis.speak(speech);
        });
        
        // Set up audio element with events
        audio.onended = () => {
          console.log('Web Speech Audio ended');
        };
        
        // Store the speech promise in a property of the audio element
        // @ts-ignore - Adding custom property for development
        audio.speechPromise = speechPromise;
        
        // Method to start playing
        // @ts-ignore - Adding custom method for development
        audio.play = async () => {
          console.log('Playing Web Speech audio');
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          } else {
            speech.rate = 1;
            window.speechSynthesis.speak(speech);
          }
          return Promise.resolve();
        };
        
        // Method to pause
        // @ts-ignore - Adding custom method for development
        audio.pause = () => {
          console.log('Pausing Web Speech audio');
          window.speechSynthesis.pause();
        };
        
        return audio;
      }
      
      // Actual ElevenLabs implementation
      console.log('Generating audio with ElevenLabs...');
      const audioData = await this.generateSpeech(text, options);
      
      if (!audioData) {
        console.error('Failed to get audio data from ElevenLabs');
        return null;
      }
      
      // Convert the ArrayBuffer to a Blob
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      // Create an audio element and set its source to the blob
      const audio = new Audio(url);
      
      // Add event listeners for debugging
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio is ready to play through without buffering');
      });
      
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
      
      audio.addEventListener('ended', () => {
        console.log('Audio playback ended');
        URL.revokeObjectURL(url);
      });
      
      // Preload the audio
      audio.preload = 'auto';
      
      return audio;
    } catch (error) {
      console.error('Error in text-to-speech process:', error);
      return null;
    }
  }
  
  // Helper method to validate if the API key is working
  async validateApiKey(): Promise<boolean> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return false;
    }
    
    try {
      // Make a small request to test the API key
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error validating ElevenLabs API key:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const elevenLabsService = new ElevenLabsService();
