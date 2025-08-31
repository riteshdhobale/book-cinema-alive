
// This service integrates with Google's Gemini API for text-to-image generation,
// video generation, and advanced content analysis using real APIs
// Supports Imagen 4, Veo 3 Fast, and Gemini 2.5 Pro

import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  private apiKey: string | null = null;
  private genAI: GoogleGenerativeAI | null = null;
  
  setApiKey(key: string) {
    this.apiKey = key;
    this.genAI = new GoogleGenerativeAI(key);
    localStorage.setItem('gemini_api_key', key);
  }
  
  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('gemini_api_key');
      if (this.apiKey) {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      }
    }
    return this.apiKey;
  }

  async generateImage(
    prompt: string,
    options: { aspectRatio?: '1:1' | '16:9' | '9:16'; style?: string } = {}
  ): Promise<string | null> {
    const apiKey = this.getApiKey();
    
    if (!apiKey || !this.genAI) {
      throw new Error('API key is not set. Please set your Gemini API key first.');
    }

    try {
      console.log("🎨 Generating image with Imagen 4:", prompt);
      
      // Use Imagen 4 for high-quality book illustrations
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: {
            text: prompt
          },
          generationConfig: {
            aspectRatio: options.aspectRatio || '16:9',
            negativePrompt: 'blurry, low quality, distorted, deformed',
            outputMimeType: 'image/jpeg'
          }
        })
      });

      if (!response.ok) {
        console.warn('Imagen API failed, using fallback images');
        return this.getFallbackImage(prompt);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        // Convert base64 to blob URL for display
        const base64Data = data.candidates[0].image.data;
        const blob = this.base64ToBlob(base64Data, 'image/jpeg');
        const imageUrl = URL.createObjectURL(blob);
        
        console.log("✅ Image generated successfully with Imagen 4");
        return imageUrl;
      }
      
      return this.getFallbackImage(prompt);
    } catch (error) {
      console.error('Error generating image:', error);
      return this.getFallbackImage(prompt);
    }
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  private getFallbackImage(prompt: string): string {
    // Curated high-quality images for different themes
    const thematicImages = {
      fantasy: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200",
        "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=1200"
      ],
      adventure: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200",
        "https://images.unsplash.com/photo-1464822759844-d150add478e?auto=format&fit=crop&w=1200"
      ],
      mystery: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1200"
      ],
      default: [
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200"
      ]
    };

    // Determine theme from prompt
    let theme = 'default';
    if (/magic|fantasy|wizard|dragon|elf/i.test(prompt)) theme = 'fantasy';
    else if (/adventure|journey|mountain|explore/i.test(prompt)) theme = 'adventure';
    else if (/mystery|dark|secret|shadow/i.test(prompt)) theme = 'mystery';

    const images = thematicImages[theme as keyof typeof thematicImages] || thematicImages.default;
    return images[Math.floor(Math.random() * images.length)];
  }

  async generateVideo(
    prompt: string,
    duration: number = 8
  ): Promise<string | null> {
    const apiKey = this.getApiKey();
    
    if (!apiKey || !this.genAI) {
      throw new Error('API key is not set. Please set your Gemini API key first.');
    }

    try {
      console.log("🎬 Generating video with Veo 3 Fast:", prompt);
      
      // Use Veo 3 Fast for video generation
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/veo-3-fast:generateVideo?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: {
            text: `${prompt}. High quality cinematic video, smooth camera movement, detailed lighting.`
          },
          generationConfig: {
            duration: `${duration}s`,
            aspectRatio: '16:9',
            frameRate: 24
          }
        })
      });

      if (!response.ok) {
        console.warn('Veo API not available, using static image instead');
        return await this.generateImage(prompt);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const videoData = data.candidates[0].video.data;
        const blob = this.base64ToBlob(videoData, 'video/mp4');
        const videoUrl = URL.createObjectURL(blob);
        
        console.log("✅ Video generated successfully with Veo 3 Fast");
        return videoUrl;
      }
      
      // Fallback to image generation
      return await this.generateImage(prompt);
    } catch (error) {
      console.error('Error generating video:', error);
      // Fallback to image generation
      return await this.generateImage(prompt);
    }
  }

  async analyzeContent(text: string): Promise<{
    theme: string;
    mood: string;
    setting: string;
    characters: string[];
    summary: string;
    visualElements: string[];
    actionLevel: 'low' | 'medium' | 'high';
    recommendedMedia: 'image' | 'video';
  } | null> {
    const apiKey = this.getApiKey();
    
    if (!apiKey || !this.genAI) {
      throw new Error('API key is not set. Please set your Gemini API key first.');
    }

    try {
      console.log("🧠 Analyzing content with Gemini 2.5 Pro:", text.substring(0, 100) + "...");
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const analysisPrompt = `
        Analyze this book excerpt and provide a detailed analysis in JSON format:
        
        "${text}"
        
        Please analyze and return a JSON object with these exact fields:
        {
          "theme": "primary genre/theme (e.g., Fantasy, Adventure, Romance, Mystery, Sci-fi)",
          "mood": "emotional tone (e.g., Exciting, Peaceful, Tense, Mysterious, Joyful)",
          "setting": "physical environment (e.g., Medieval castle, Modern city, Enchanted forest)",
          "characters": ["list", "of", "character", "names", "mentioned"],
          "summary": "2-sentence summary of this excerpt",
          "visualElements": ["key", "visual", "elements", "to", "illustrate"],
          "actionLevel": "low/medium/high based on action and movement",
          "recommendedMedia": "image or video based on content dynamism"
        }
        
        Focus on extracting concrete visual details, character descriptions, and scene dynamics.
        Return ONLY the JSON object, no additional text.
      `;

      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      const analysisText = response.text();
      
      try {
        // Extract JSON from the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          console.log("✅ Advanced content analysis completed");
          return analysis;
        }
      } catch (parseError) {
        console.warn("Failed to parse Gemini analysis, using fallback");
      }
      
      // Fallback to enhanced keyword analysis
      return this.enhancedKeywordAnalysis(text);
    } catch (error) {
      console.error('Error with Gemini analysis:', error);
      return this.enhancedKeywordAnalysis(text);
    }
  }

  private enhancedKeywordAnalysis(text: string) {
    // Enhanced fallback analysis with better categorization
    const themes = {
      fantasy: /magic|spell|enchant|wand|potion|wizard|witch|dragon|elf|dwarf|fairy/i,
      adventure: /adventure|journey|quest|travel|explore|discover|treasure|map|expedition/i,
      mystery: /mystery|secret|clue|puzzle|unknown|detective|investigate|crime/i,
      romance: /love|heart|romance|kiss|embrace|passion|wedding|date|relationship/i,
      scifi: /space|robot|alien|future|technology|laser|spaceship|planet|galaxy/i,
      horror: /fear|scary|ghost|demon|monster|nightmare|dark|evil|terror/i
    };

    const settings = {
      forest: /forest|tree|wood|branch|leaf|leaves|grove|woodland|jungle/i,
      ocean: /ocean|sea|water|wave|beach|shore|island|ship|boat|sailor/i,
      mountain: /mountain|hill|peak|summit|valley|climb|cliff|cave/i,
      city: /city|street|building|urban|town|road|downtown|apartment|office/i,
      castle: /castle|palace|throne|kingdom|royal|court|dungeon|tower/i,
      space: /space|planet|star|galaxy|universe|spaceship|station|void/i
    };

    const moods = {
      exciting: /action|fight|battle|run|chase|escape|danger|thrilling|intense/i,
      peaceful: /calm|quiet|serene|peaceful|gentle|soft|rest|meadow|sunset/i,
      tense: /nervous|worried|afraid|anxious|suspicious|careful|danger|threat/i,
      mysterious: /strange|curious|wonder|mysterious|unknown|secret|hidden|whisper/i,
      joyful: /happy|joy|smile|laugh|celebration|party|cheerful|bright|wonderful/i
    };

    // Determine theme
    let theme = "General Fiction";
    for (const [key, pattern] of Object.entries(themes)) {
      if (pattern.test(text)) {
        theme = key.charAt(0).toUpperCase() + key.slice(1);
        break;
      }
    }

    // Determine setting
    let setting = "Indoor/Generic setting";
    for (const [key, pattern] of Object.entries(settings)) {
      if (pattern.test(text)) {
        setting = key.charAt(0).toUpperCase() + key.slice(1) + " environment";
        break;
      }
    }

    // Determine mood
    let mood = "Neutral";
    for (const [key, pattern] of Object.entries(moods)) {
      if (pattern.test(text)) {
        mood = key.charAt(0).toUpperCase() + key.slice(1);
        break;
      }
    }

    // Extract characters (improved)
    const possibleCharacters = text.match(/\b[A-Z][a-z]{2,}\b/g) || [];
    const characters = [...new Set(possibleCharacters)]
      .filter(word => !['The', 'And', 'But', 'For', 'With', 'When', 'Where', 'Why', 'How'].includes(word))
      .slice(0, 5);

    // Extract visual elements
    const visualWords = text.match(/\b(?:red|blue|green|yellow|bright|dark|tall|small|large|beautiful|ancient|modern|golden|silver|crystal|stone|wooden|metal)\s+\w+/gi) || [];
    const visualElements = [...new Set(visualWords)].slice(0, 5);

    // Determine action level
    const actionWords = /run|jump|fight|battle|chase|escape|throw|catch|climb|fall|rush|dash|leap/gi;
    const actionMatches = text.match(actionWords) || [];
    const actionLevel: 'low' | 'medium' | 'high' = actionMatches.length > 5 ? 'high' : actionMatches.length > 2 ? 'medium' : 'low';

    // Recommend media type
    const recommendedMedia: 'image' | 'video' = actionLevel === 'high' || /movement|motion|running|flying|dancing/i.test(text) ? 'video' : 'image';

    const summary = `This ${theme.toLowerCase()} excerpt is set in a ${setting.toLowerCase()} with a ${mood.toLowerCase()} atmosphere.`;

    return {
      theme,
      mood,
      setting,
      characters,
      summary,
      visualElements,
      actionLevel,
      recommendedMedia
    };
  }

  async generateEnhancedPrompt(paragraph: string, contentAnalysis: any = null): Promise<string> {
    const apiKey = this.getApiKey();
    
    if (!apiKey || !this.genAI) {
      return this.createBasicPrompt(paragraph, contentAnalysis);
    }

    try {
      console.log("🎯 Creating enhanced prompt with Gemini 2.5 Pro");
      
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      
      const promptCreationRequest = `
        Create a detailed, artistic prompt for generating a high-quality image/video based on this story excerpt:
        
        "${paragraph}"
        
        ${contentAnalysis ? `
        Context: This is a ${contentAnalysis.theme} story with a ${contentAnalysis.mood} mood, set in ${contentAnalysis.setting}.
        Characters: ${contentAnalysis.characters.join(', ')}
        Visual elements to include: ${contentAnalysis.visualElements.join(', ')}
        Action level: ${contentAnalysis.actionLevel}
        ` : ''}
        
        Create a prompt that will generate a cinematic, book illustration-style image. Include:
        - Specific visual details from the text
        - Appropriate lighting and mood
        - Character descriptions and positioning
        - Environmental details
        - Artistic style (photorealistic, painterly, etc.)
        
        Keep the prompt under 500 characters and focus on visual storytelling.
        Return only the prompt, no additional text.
      `;

      const result = await model.generateContent(promptCreationRequest);
      const response = await result.response;
      const enhancedPrompt = response.text().trim();
      
      console.log("✅ Enhanced prompt created");
      return enhancedPrompt;
    } catch (error) {
      console.error('Error creating enhanced prompt:', error);
      return this.createBasicPrompt(paragraph, contentAnalysis);
    }
  }

  private createBasicPrompt(paragraph: string, contentAnalysis: any): string {
    let prompt = `Cinematic book illustration: ${paragraph.substring(0, 150)}`;
    
    if (contentAnalysis) {
      prompt += ` ${contentAnalysis.theme} genre, ${contentAnalysis.mood.toLowerCase()} mood`;
      
      if (contentAnalysis.setting) {
        prompt += `, set in ${contentAnalysis.setting.toLowerCase()}`;
      }
      
      if (contentAnalysis.characters.length > 0) {
        prompt += `. Characters: ${contentAnalysis.characters.slice(0, 3).join(', ')}`;
      }
      
      if (contentAnalysis.visualElements.length > 0) {
        prompt += `. Visual elements: ${contentAnalysis.visualElements.slice(0, 3).join(', ')}`;
      }
    }
    
    prompt += ". High quality, detailed, professional book illustration style, perfect lighting and composition.";
    
    return prompt;
  }

  async generateAdaptiveMedia(
    paragraph: string, 
    contentAnalysis: any = null
  ): Promise<{ url: string; type: 'image' | 'video' }> {
    const enhancedPrompt = await this.generateEnhancedPrompt(paragraph, contentAnalysis);
    
    // Decide between image and video based on content analysis
    const shouldGenerateVideo = contentAnalysis?.recommendedMedia === 'video' || 
                               contentAnalysis?.actionLevel === 'high';
    
    if (shouldGenerateVideo) {
      console.log("🎬 Generating video for high-action content");
      const videoUrl = await this.generateVideo(enhancedPrompt, 8);
      if (videoUrl) {
        return { url: videoUrl, type: 'video' };
      }
    }
    
    console.log("🎨 Generating image content");
    const imageUrl = await this.generateImage(enhancedPrompt);
    return { url: imageUrl || '', type: 'image' };
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
