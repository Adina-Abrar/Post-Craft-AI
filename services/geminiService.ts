
import { GoogleGenAI, Type } from "@google/genai";
import { BrandIdentity, CampaignIntent, SocialPost } from "../types";

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
const createAIClient = () => {
  // Always use process.env.API_KEY as the source for the API key.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const chatWithAgent = async (message: string, history: any[] = []) => {
  const ai = createAIClient();
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a senior Social Media Strategist. Provide concise, expert advice on branding and campaigns.",
      },
      history: history.length > 0 ? history : undefined,
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

export const inferBrandIdentity = async (rawInput: string, assetBase64?: string): Promise<BrandIdentity> => {
  const ai = createAIClient();
  const prompt = `Act as a senior brand strategist. Analyze the following context and extract a brand identity. 
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
  const ai = createAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Plan a social media campaign for brand: ${brand.name}. Goal: ${intentPrompt}. Platforms: ${platforms.join(', ')}`,
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
  const ai = createAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate human-like social media posts for: ${JSON.stringify(intent)}. Brand Identity: ${JSON.stringify(brand)}. Ensure captions are engaging and tailored to each platform.`,
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
  const ai = createAIClient();
  const prompt = `Refine this social media post based on user feedback.
    Current Caption: ${currentPost.caption}
    Current Image Prompt: ${currentPost.imagePrompt}
    User Instruction: ${instruction}
    Brand Context: ${JSON.stringify(brand)}
    Return ONLY a JSON object with: caption, imagePrompt, reasoning.`;

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
  const ai = createAIClient();
  const parts: any[] = [{ text: `A professional social media visual. Prompt: ${imagePrompt}. Artistic Vibe: ${brand.style}. Colors: ${brand.colors.join(', ')}.` }];
  
  if (brand.assetData) {
    const data = brand.assetData.replace(/^data:image\/[a-z]+;base64,/, "");
    parts.unshift({ inlineData: { mimeType: "image/png", data } });
  }
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { 
        imageConfig: { 
          aspectRatio: "1:1"
        } 
      }
    });
    
    // Iterate through parts to find the image part as recommended by the guidelines.
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error("Visual synthesis failed.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
