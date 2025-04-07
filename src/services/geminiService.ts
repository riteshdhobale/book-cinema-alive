
// This service integrates with Google's Gemini API for text-to-image generation
// and content analysis
// You'll need to provide a Gemini API key to use this service

class GeminiService {
  private apiKey: string | null = null;
  
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('gemini_api_key');
    }
    return this.apiKey;
  }

  async generateImage(
    prompt: string,
  ): Promise<string | null> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not set. Please set your Gemini API key first.');
    }

    // For development/testing purposes, we'll return placeholder images
    // In production, this would make an actual API call to Gemini
    try {
      console.log("Generating image for prompt:", prompt);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a placeholder image (in production, this would be the URL from Gemini API)
      const placeholders = [
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop"
      ];
      
      // Select a random placeholder image
      const randomIndex = Math.floor(Math.random() * placeholders.length);
      return placeholders[randomIndex];
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    }
  }

  async analyzeContent(text: string): Promise<{
    theme: string;
    mood: string;
    setting: string;
    characters: string[];
    summary: string;
  } | null> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('API key is not set. Please set your Gemini API key first.');
    }

    try {
      console.log("Analyzing content with Gemini API:", text.substring(0, 100) + "...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the Gemini API
      // For now, we'll simulate an analysis based on text content
      
      // Analyze text for basic patterns to extract info
      const hasForestWords = /forest|tree|wood|branch|leaf|leaves/i.test(text);
      const hasOceanWords = /ocean|sea|water|wave|beach|shore/i.test(text);
      const hasMountainWords = /mountain|hill|peak|summit|valley|climb/i.test(text);
      const hasCityWords = /city|street|building|urban|town|road/i.test(text);
      
      const hasMagicWords = /magic|spell|enchant|wand|potion|wizard|witch/i.test(text);
      const hasAdventureWords = /adventure|journey|quest|travel|explore|discover/i.test(text);
      const hasMysteryWords = /mystery|secret|clue|puzzle|unknown|discover/i.test(text);
      const hasRomanceWords = /love|heart|romance|kiss|embrace|passion/i.test(text);
      
      // Extract character names (simple approximation - capitalized words)
      const possibleCharacters = text.match(/\b[A-Z][a-z]+\b/g) || [];
      const characters = [...new Set(possibleCharacters)].slice(0, 5);
      
      // Determine setting based on keywords
      let setting = "Generic indoor setting";
      if (hasForestWords) setting = "Forest or woodland";
      else if (hasOceanWords) setting = "Seaside or ocean";
      else if (hasMountainWords) setting = "Mountains or hills";
      else if (hasCityWords) setting = "Urban city setting";
      
      // Determine theme based on keywords
      let theme = "General fiction";
      if (hasMagicWords) theme = "Fantasy or magical";
      else if (hasAdventureWords) theme = "Adventure";
      else if (hasMysteryWords) theme = "Mystery";
      else if (hasRomanceWords) theme = "Romance";
      
      // Determine mood (simple sentiment analysis)
      const positiveWords = /happy|joy|smile|laugh|beautiful|wonderful|good|great/i;
      const negativeWords = /sad|cry|tear|angry|upset|terrible|bad|fear|scary/i;
      const mysteriousWords = /strange|curious|wonder|mysterious|unknown|secret/i;
      
      let mood = "Neutral";
      if (positiveWords.test(text)) mood = "Positive or uplifting";
      else if (negativeWords.test(text)) mood = "Somber or tense";
      else if (mysteriousWords.test(text)) mood = "Mysterious or curious";
      
      // Create a brief summary
      const summary = `This text appears to be a ${theme.toLowerCase()} story set in a ${setting.toLowerCase()}. The overall mood seems ${mood.toLowerCase()}.`;
      
      return {
        theme,
        mood,
        setting,
        characters,
        summary
      };
    } catch (error) {
      console.error('Error analyzing content:', error);
      return null;
    }
  }

  async generateEnhancedPrompt(paragraph: string, contentAnalysis: any = null): Promise<string> {
    // Create a more detailed prompt for image generation based on paragraph content and analysis
    let enhancedPrompt = `Create a detailed illustration for this story paragraph: ${paragraph.substring(0, 200)}`;
    
    if (contentAnalysis) {
      enhancedPrompt += ` This is part of a ${contentAnalysis.theme} story with a ${contentAnalysis.mood.toLowerCase()} tone set in ${contentAnalysis.setting}.`;
      
      if (contentAnalysis.characters.length > 0) {
        enhancedPrompt += ` Characters include: ${contentAnalysis.characters.join(', ')}.`;
      }
    }
    
    enhancedPrompt += ` Make the illustration match the narrative mood and setting, with appropriate lighting and composition.`;
    
    return enhancedPrompt;
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
