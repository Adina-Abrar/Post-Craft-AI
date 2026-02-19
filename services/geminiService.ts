
import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity, CampaignIntent, SocialPost } from "../types.ts";

/**
 * Robustly extracts and parses JSON from a string, handling Markdown blocks or extra text.
 */
const parseGeminiJson = (text: string | undefined) => {
  if (!text) throw new Error("AI returned an empty response.");
  try {
    const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    const cleanText = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("JSON Parsing Error. Raw text from AI:", text);
    throw new Error("The AI response was not in a valid format. Please try again.");
  }
};

/**
 * Creates a fresh instance of the AI client using the current environment variable.
 */
const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please select your API key using the activation screen.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const chatWithAgent = async (message: string, history: any[] = []) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "You are 'Agent Crafty', an enthusiastic Junior Social Media Manager. Use Google Search to stay updated. Be concise and strategic.",
        tools: [{ googleSearch: {} }]
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#'
      }));

    return {
      text: response.text,
      sources
    };
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

export const inferBrandIdentity = async (rawInput: string, assetBase64?: string): Promise<BrandIdentity> => {
  const ai = getAI();
  const prompt = `Analyze this brand context using Gemini 3 Flash. Extract a high-fidelity brand DNA. 
    Return ONLY a JSON object with: name, voice, colors (array of hex codes), tone, style.
    Context: ${rawInput}`;

  const parts: any[] = [{ text: prompt }];
  if (assetBase64) {
    const data = assetBase64.replace(/^data:image\/[a-z]+;base64,/, "");
    parts.push({ inlineData: { mimeType: "image/png", data } });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            voice: { type: Type.STRING },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
            tone: { type: Type.STRING },
            style: { type: Type.STRING },
          },
          required: ["name", "voice", "colors", "tone", "style"],
        }
      }
    });
    return { ...parseGeminiJson(response.text), assetData: assetBase64 };
  } catch (error) {
    console.error("Brand Inference Error:", error);
    throw error;
  }
};

export const generateCampaignStructure = async (intentPrompt: string, brand: BrandIdentity, platforms: string[]): Promise<CampaignIntent> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Plan a campaign for brand: ${brand.name}. Goal: ${intentPrompt}. Platforms: ${platforms.join(', ')}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
            postType: { type: Type.STRING },
            keyMessage: { type: Type.STRING },
            constraints: {
              type: Type.OBJECT,
              properties: {
                tone: { type: Type.STRING },
                cta: { type: Type.STRING },
                themeColors: { type: Type.STRING },
                includeLogo: { type: Type.BOOLEAN },
                realisticImages: { type: Type.BOOLEAN },
                videoPreview: { type: Type.BOOLEAN },
              },
              required: ["tone", "cta", "themeColors", "includeLogo", "realisticImages", "videoPreview"]
            }
          },
          required: ["platforms", "postType", "keyMessage", "constraints"],
        }
      }
    });
    return parseGeminiJson(response.text);
  } catch (error) {
    console.error("Campaign Generation Error:", error);
    throw error;
  }
};

export const generatePostVariations = async (brand: BrandIdentity, intent: CampaignIntent): Promise<SocialPost[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate high-engagement posts for: ${JSON.stringify(intent)}. Identity: ${JSON.stringify(brand)}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              platform: { type: Type.STRING },
              caption: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              imagePrompt: { type: Type.STRING },
              suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
              overlayText: { type: Type.STRING },
              overlayConfig: {
                type: Type.OBJECT,
                properties: {
                  position: { type: Type.STRING, enum: ['top', 'middle', 'bottom'] },
                  color: { type: Type.STRING },
                  fontSize: { type: Type.NUMBER },
                  showBackground: { type: Type.BOOLEAN }
                },
                required: ["position", "color", "fontSize", "showBackground"]
              }
            },
            required: ["id", "platform", "caption", "reasoning", "imagePrompt", "suggestedTags", "overlayText", "overlayConfig"]
          }
        }
      }
    });
    return parseGeminiJson(response.text);
  } catch (error) {
    console.error("Post Variations Error:", error);
    throw error;
  }
};

export const refinePostContent = async (currentPost: SocialPost, instruction: string, brand: BrandIdentity): Promise<{ caption: string, imagePrompt: string, reasoning: string }> => {
  const ai = getAI();
  const prompt = `Refine this post. Feedback: ${instruction}. Context: ${JSON.stringify(brand)}. Current Caption: ${currentPost.caption}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["caption", "imagePrompt", "reasoning"]
        }
      }
    });
    return parseGeminiJson(response.text);
  } catch (error) {
    console.error("Refine Post Error:", error);
    throw error;
  }
};

export const generateImageForPost = async (imagePrompt: string, brand: BrandIdentity): Promise<string> => {
  const ai = getAI();
  const parts: any[] = [{ text: `Social Media Visual: ${imagePrompt}. Style: ${brand.style}. Colors: ${brand.colors.join(', ')}.` }];
  
  if (brand.assetData) {
    const data = brand.assetData.replace(/^data:image\/[a-z]+;base64,/, "");
    parts.unshift({ inlineData: { mimeType: "image/png", data } });
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: { 
        imageConfig: { 
          aspectRatio: "1:1",
          imageSize: "1K"
        } 
      }
    });
    
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error("Visual synthesis failed.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const generateVideoForPost = async (prompt: string): Promise<string> => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic Promo: ${prompt}. Motion blur, studio lighting.`,
      config: {
        numberOfVideos: 1,
        resolution: '1080p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed.");
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};
