
export interface BrandIdentity {
  name: string;
  voice: string;
  colors: string[];
  tone: string;
  style: string;
  websiteContent?: string;
  logoUrl?: string;
  assetData?: string; 
}

export interface CampaignIntent {
  platforms: string[];
  postType: string;
  keyMessage: string;
  constraints: {
    tone: string;
    cta: string;
    themeColors: string;
    includeLogo: boolean;
    realisticImages: boolean;
    videoPreview: boolean;
  };
}

export interface SocialPost {
  id: string;
  platform: string;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  reasoning: string;
  isGenerating?: boolean;
  error?: string;
  imagePrompt: string;
  suggestedTags: string[];
  overlayText: string;
  overlayConfig: {
    position: 'top' | 'middle' | 'bottom';
    color: string;
    fontSize: number;
    showBackground: boolean;
  };
}

export interface StepState {
  currentStep: 'brand' | 'campaign' | 'generation' | 'review';
}
