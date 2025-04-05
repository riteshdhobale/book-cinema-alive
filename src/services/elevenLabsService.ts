
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
