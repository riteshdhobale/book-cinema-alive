
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
      // For testing purposes, we'll use placeholder audio with the Web Speech API
      // This helps ensure audio works without requiring API calls
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
        
        // Set up dummy audio element with events
        audio.onended = () => {
          console.log('Audio ended');
        };
        
        // Store the speech promise in a property of the audio element
        // @ts-ignore - Adding custom property for development
        audio.speechPromise = speechPromise;
        
        // Method to start playing
        // @ts-ignore - Adding custom method for development
        audio.play = async () => {
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
          window.speechSynthesis.pause();
        };
        
        return audio;
      }
      
      // Actual ElevenLabs implementation
      const audioData = await this.generateSpeech(text, options);
      
      if (!audioData) {
        return null;
      }
      
      // Convert the ArrayBuffer to a Blob
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      
      // Create an audio element and set its source to the blob
      const audio = new Audio();
      audio.src = URL.createObjectURL(blob);
      
      return audio;
    } catch (error) {
      console.error('Error in text-to-speech process:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const elevenLabsService = new ElevenLabsService();
