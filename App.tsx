
import React, { useState, useRef, useEffect } from 'react';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Sparkles,
  Loader2,
  Trash2,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Download,
  X,
  Layout,
  Link as LinkIcon,
  PenTool,
  Send,
  ShieldCheck,
  Activity,
  Bot,
<<<<<<< HEAD
  Wand2,
  RefreshCcw,
  Video,
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';
import { BrandIdentity, CampaignIntent, SocialPost, StepState } from './types.ts';
import * as gemini from './services/geminiService.ts';

// Defining AIStudio interface to resolve type mismatch errors in global window augmentation.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio?: AIStudio;
  }
}
=======
  ChevronRight,
  Wand2,
  Camera,
  RefreshCcw
} from 'lucide-react';
import { BrandIdentity, CampaignIntent, SocialPost, StepState } from './types';
import * as gemini from './services/geminiService';
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1

const PLATFORMS = ["Instagram", "LinkedIn", "Twitter (X)", "Facebook"];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-5 h-5 text-pink-500" />,
  LinkedIn: <Linkedin className="w-5 h-5 text-blue-400" />,
  'Twitter (X)': <Twitter className="w-5 h-5 text-sky-400" />,
  Facebook: <Facebook className="w-5 h-5 text-blue-500" />,
};

const ImageOverlay: React.FC<{ post: SocialPost, className?: string }> = ({ post, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
<<<<<<< HEAD
  
=======
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
  useEffect(() => {
    if (!canvasRef.current || !post.imageUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = post.imageUrl;
    img.onload = () => {
      const size = 1080;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
      if (post.overlayText) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fontSize = (post.overlayConfig?.fontSize || 40) * (size / 400); 
        ctx.font = `900 ${fontSize}px Inter, sans-serif`;
        const padding = 80;
        let y = size / 2;
        if (post.overlayConfig?.position === 'top') y = padding + fontSize / 2;
        if (post.overlayConfig?.position === 'bottom') y = size - padding - fontSize / 2;
        const textWidth = ctx.measureText(post.overlayText.toUpperCase()).width;
        if (post.overlayConfig?.showBackground) {
          ctx.fillStyle = post.overlayConfig.color === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
          const bgPadding = 30;
          ctx.fillRect(size / 2 - textWidth / 2 - bgPadding, y - fontSize / 2 - 15, textWidth + bgPadding * 2, fontSize + 30);
        }
        ctx.fillStyle = post.overlayConfig?.color || '#FFFFFF';
        ctx.fillText(post.overlayText.toUpperCase(), size / 2, y);
      }
    };
  }, [post.imageUrl, post.overlayText, post.overlayConfig]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900 ${className}`}>
      {post.imageUrl ? <canvas ref={canvasRef} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-slate-700" size={48} /></div>}
    </div>
  );
};

<<<<<<< HEAD
interface ChatMessage {
  role: 'user' | 'agent';
  text: string;
  sources?: { title: string; uri: string }[];
}

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [step, setStep] = useState<StepState['currentStep']>('brand');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
=======
const App: React.FC = () => {
  const [step, setStep] = useState<StepState['currentStep']>('brand');
  const [loading, setLoading] = useState(false);
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
  const [context, setContext] = useState('');
  const [links, setLinks] = useState('');
  const [assetBase64, setAssetBase64] = useState<string | null>(null);
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [intentInput, setIntentInput] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [previewPost, setPreviewPost] = useState<SocialPost | null>(null);
  const [refinementInput, setRefinementInput] = useState('');
  const [isRefining, setIsRefining] = useState(false);
<<<<<<< HEAD
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
=======
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent', text: string }[]>([]);
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
<<<<<<< HEAD
    const initApp = async () => {
      if (window.aistudio) {
        const keySelected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(keySelected);
      } else {
        // Fallback for local environments where process.env.API_KEY might be defined directly
        setHasApiKey(!!process.env.API_KEY);
      }
    };
    initApp();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per instructions: assume selection successful to mitigate race conditions
      setHasApiKey(true);
    } else {
      alert("API Key selection utility is not available in this environment. Please ensure process.env.API_KEY is configured.");
    }
  };

=======
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
<<<<<<< HEAD
      reader.onloadend = () => {
        setAssetBase64(reader.result as string);
      };
=======
      reader.onloadend = () => setAssetBase64(reader.result as string);
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);
    try {
      const geminiHistory = chatHistory.map(h => ({
        role: (h.role === 'user' ? 'user' : 'model') as 'user' | 'model',
        parts: [{ text: h.text }]
      }));
      const response = await gemini.chatWithAgent(userMsg, geminiHistory);
<<<<<<< HEAD
      setChatHistory(prev => [...prev, { 
        role: 'agent', 
        text: response.text || "I'm ready to help with your strategy!",
        sources: response.sources
      }]);
    } catch (err: any) {
      if (err.message?.includes("entity was not found")) setHasApiKey(false);
      setChatHistory(prev => [...prev, { role: 'agent', text: "Error connecting to AI service. Please verify your API key." }]);
=======
      setChatHistory(prev => [...prev, { role: 'agent', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'agent', text: "Service connection failed. Please ensure your environment is correctly configured." }]);
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleBrandInference = async () => {
    if (!context.trim()) return;
    setLoading(true);
    try {
      const data = await gemini.inferBrandIdentity(`${context}\n${links}`, assetBase64 || undefined);
<<<<<<< HEAD
      if (data) setBrand(data);
    } catch (error: any) {
      if (error.message?.includes("entity was not found")) setHasApiKey(false);
      alert("Inference failed. Please check your internet connection or API key.");
=======
      setBrand(data);
    } catch (error: any) {
      alert(`Inference failed. Please check your network connection or try again later.`);
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSetup = async () => {
    if (!intentInput.trim() || !brand || selectedPlatforms.length === 0) return;
    setLoading(true);
    try {
      const campaignData = await gemini.generateCampaignStructure(intentInput, brand, selectedPlatforms);
<<<<<<< HEAD
      if (!campaignData) return;
=======
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
      setStep('generation');
      const variations = await gemini.generatePostVariations(brand, campaignData);
      setPosts(variations.map(v => ({ ...v, isGenerating: true })));
      
      const updatedPosts = await Promise.all(variations.map(async (p: any) => {
        try {
          const imageUrl = await gemini.generateImageForPost(p.imagePrompt, brand);
          return { ...p, imageUrl, isGenerating: false };
        } catch (e: any) {
<<<<<<< HEAD
          return { ...p, isGenerating: false, error: "Visual Synthesis Error" };
=======
          return { ...p, isGenerating: false, error: "Image Error" };
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
        }
      }));
      setPosts(updatedPosts);
    } catch (error: any) {
<<<<<<< HEAD
      if (error.message?.includes("entity was not found")) setHasApiKey(false);
      alert("Campaign setup failed. Check your API key permissions.");
=======
      alert(`Campaign setup failed. Check your API usage limits.`);
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
    } finally {
      setLoading(false);
    }
  };

  const handleAIRefinement = async () => {
    if (!previewPost || !refinementInput.trim() || !brand) return;
    setIsRefining(true);
    try {
      const refined = await gemini.refinePostContent(previewPost, refinementInput, brand);
      const newImageUrl = await gemini.generateImageForPost(refined.imagePrompt, brand);
      const updated = { ...previewPost, ...refined, imageUrl: newImageUrl };
      setPreviewPost(updated);
      setPosts(prev => prev.map(p => p.id === previewPost.id ? updated : p));
      setRefinementInput('');
<<<<<<< HEAD
    } catch (e: any) {
      if (e.message?.includes("entity was not found")) setHasApiKey(false);
      alert("Refinement failed.");
=======
    } catch (e) {
      alert("Refinement failed. Try again.");
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
    } finally {
      setIsRefining(false);
    }
  };

<<<<<<< HEAD
  const handleGenerateVideo = async () => {
    if (!previewPost) return;
    setVideoLoading(true);
    try {
      const videoUrl = await gemini.generateVideoForPost(previewPost.imagePrompt);
      const updated = { ...previewPost, videoUrl };
      setPreviewPost(updated);
      setPosts(prev => prev.map(p => p.id === previewPost.id ? updated : p));
    } catch (e: any) {
      if (e.message?.includes("entity was not found")) setHasApiKey(false);
      alert("Video generation failed.");
    } finally {
      setVideoLoading(false);
    }
  };

=======
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
  const handleRegenerateImage = async () => {
    if (!previewPost || !brand) return;
    setIsRefining(true);
    try {
      const newImageUrl = await gemini.generateImageForPost(previewPost.imagePrompt, brand);
      const updated = { ...previewPost, imageUrl: newImageUrl };
      setPreviewPost(updated);
      setPosts(prev => prev.map(p => p.id === previewPost.id ? updated : p));
<<<<<<< HEAD
    } catch (e: any) {
      if (e.message?.includes("entity was not found")) setHasApiKey(false);
      alert("Regeneration failed.");
=======
    } catch (e) {
      alert("Image regeneration failed.");
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
    } finally {
      setIsRefining(false);
    }
  };

<<<<<<< HEAD
  if (hasApiKey === false) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 p-12 rounded-[3rem] text-center space-y-10 shadow-2xl animate-fade-in ring-1 ring-white/5">
          <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2rem] flex items-center justify-center shadow-indigo-600/40 shadow-2xl transform rotate-3">
            <Bot size={48} className="text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight uppercase">Activation Required</h2>
            <p className="text-slate-400 text-base font-medium leading-relaxed max-w-sm mx-auto">
              Please connect your Google API Key to access <strong>Gemini 3 Flash</strong> and <strong>Veo 3.1</strong> capabilities.
            </p>
          </div>
          <button 
            onClick={handleSelectKey}
            className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            Select API Key <ExternalLink size={18} />
          </button>
          <p className="text-xs text-slate-500">
            Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-indigo-400">billing docs</a> for setup instructions.
          </p>
        </div>
      </div>
    );
  }

=======
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 relative overflow-hidden">
      <header className="h-20 border-b border-slate-800/60 bg-[#020617]/80 backdrop-blur-md flex items-center px-8 justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"><Bot size={24} className="text-white" /></div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">PostCraft AI</h1>
            <div className="flex items-center gap-1.5"><ShieldCheck size={10} className="text-emerald-500" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Agent Active</span></div>
          </div>
        </div>
        <div className="flex items-center gap-4">
<<<<<<< HEAD
          <div className={`flex items-center gap-3 px-4 py-2 border rounded-xl bg-indigo-950/20 border-indigo-800/50 ring-1 ring-indigo-500/20`}>
            <Activity size={12} className="text-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Gemini 3 Flash</span>
=======
          <div className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all duration-300 bg-emerald-950/20 border-emerald-800/50`}>
            <Activity size={12} className="text-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Status</span>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 pb-32">
        {step === 'brand' && (
          <div className="space-y-12 animate-fade-in">
<<<<<<< HEAD
            <div className="space-y-2 text-center md:text-left"><h2 className="text-5xl font-extrabold text-white tracking-tight">Brand DNA</h2><p className="text-slate-400 text-xl font-medium">Define your core identity to generate strategic content.</p></div>
            <div className="space-y-10">
              <div className="space-y-4"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Mission & Audience</h3><textarea value={context} onChange={(e) => setContext(e.target.value)} className="w-full h-32 bg-slate-900/40 border border-slate-800 rounded-xl p-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-700" placeholder="What does your brand stand for? Who are you trying to reach?" /></div>
              <div className="space-y-4"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={14} /> Website / Social Links</h3><input value={links} onChange={(e) => setLinks(e.target.value)} className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-5 py-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-700" placeholder="https://..." /></div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Brand Assets</h3>
                <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-800 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:bg-slate-900/30 transition-all group">
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
                  {assetBase64 ? <img src={assetBase64} className="h-24 rounded-lg shadow-xl" alt="Logo" /> : <Upload className="text-slate-600 mb-2 group-hover:text-indigo-400" size={40} />}
                  <p className="text-xs text-slate-500 mt-4 uppercase font-black tracking-widest">Click to upload logo or moodboard</p>
                </div>
              </div>
              {brand ? (
                <div className="p-10 bg-indigo-950/20 border border-indigo-800/30 rounded-[2.5rem] space-y-8 animate-fade-in shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Voice</p><p className="text-sm font-bold text-white">{brand.voice}</p></div>
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Colors</p><div className="flex gap-2">{brand.colors.map(c => <div key={c} className="w-6 h-6 rounded-lg ring-1 ring-slate-700" style={{backgroundColor: c}} />)}</div></div>
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tone</p><p className="text-sm font-bold text-white">{brand.tone}</p></div>
                    <div className="space-y-2"><p className="text-[10px) font-black text-slate-500 uppercase tracking-widest">Style</p><p className="text-sm font-bold text-white">{brand.style}</p></div>
                  </div>
                  <button onClick={() => setStep('campaign')} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">Finalize & Start Campaign</button>
                </div>
              ) : (
                <button onClick={handleBrandInference} disabled={loading || !context} className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all disabled:opacity-50 shadow-xl">{loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Analyze Brand Identity</button>
=======
            <div className="space-y-2 text-center md:text-left"><h2 className="text-5xl font-extrabold text-white tracking-tight">Brand Discovery</h2><p className="text-slate-400 text-xl font-medium">Define your brand identity to get started.</p></div>
            <div className="space-y-10">
              <div className="space-y-4"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Globe size={14} /> Brand Mission & Story</h3><textarea value={context} onChange={(e) => setContext(e.target.value)} className="w-full h-32 bg-slate-900/40 border border-slate-800 rounded-xl p-5 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200 placeholder:text-slate-700" placeholder="Tell us about your brand..." /></div>
              <div className="space-y-4"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><LinkIcon size={14} /> Website or Social Handles</h3><input value={links} onChange={(e) => setLinks(e.target.value)} className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-5 py-4 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-700" placeholder="https://..." /></div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Identity Mark</h3>
                <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-800 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:bg-slate-900/30 transition-all group">
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} />
                  {assetBase64 ? <img src={assetBase64} className="h-24 rounded-lg shadow-xl" alt="Logo" /> : <Upload className="text-slate-600 mb-2 group-hover:text-indigo-400" size={40} />}
                  <p className="text-xs text-slate-500 mt-4 uppercase font-black tracking-widest">Upload Brand Mark</p>
                </div>
              </div>
              {brand ? (
                <div className="p-8 bg-indigo-950/20 border border-indigo-800/30 rounded-3xl space-y-6 animate-fade-in shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase">Voice</p><p className="text-sm font-bold text-white">{brand.voice}</p></div>
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase">Colors</p><div className="flex gap-2">{brand.colors.map(c => <div key={c} className="w-5 h-5 rounded-full ring-1 ring-slate-700" style={{backgroundColor: c}} />)}</div></div>
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase">Tone</p><p className="text-sm font-bold text-white">{brand.tone}</p></div>
                    <div className="space-y-2"><p className="text-[10px] font-black text-slate-500 uppercase">Style</p><p className="text-sm font-bold text-white">{brand.style}</p></div>
                  </div>
                  <button onClick={() => setStep('campaign')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">Analyze Brand & Plan Campaign</button>
                </div>
              ) : (
                <button onClick={handleBrandInference} disabled={loading || !context} className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all disabled:opacity-50 shadow-xl">{loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Define Brand Profile</button>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
              )}
            </div>
          </div>
        )}

        {step === 'campaign' && (
          <div className="max-w-2xl mx-auto space-y-12 animate-fade-in">
<<<<<<< HEAD
            <button onClick={() => setStep('brand')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"><ArrowLeft size={16} /> Identity Settings</button>
            <h2 className="text-5xl font-extrabold text-white tracking-tight">Strategy</h2>
            <div className="space-y-10">
              <div className="space-y-4"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">What are we promoting?</h3><input value={intentInput} onChange={(e) => setIntentInput(e.target.value)} className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-8 py-6 text-xl font-bold text-white focus:border-indigo-500/50 outline-none transition-all shadow-inner placeholder:text-slate-800" placeholder="E.g. Summer Collection Launch..." /></div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Channels</h3>
=======
            <button onClick={() => setStep('brand')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors"><ArrowLeft size={16} /> Identity Profile</button>
            <h2 className="text-5xl font-extrabold text-white tracking-tight">Campaign Strategy</h2>
            <div className="space-y-10">
              <div className="space-y-4"><h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Campaign Goal</h3><input value={intentInput} onChange={(e) => setIntentInput(e.target.value)} className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl px-8 py-6 text-xl font-bold text-white focus:border-indigo-500/50 outline-none transition-all shadow-inner placeholder:text-slate-800" placeholder="Announce 2026 launch..." /></div>
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Distribution</h3>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
                <div className="grid grid-cols-2 gap-4">
                  {PLATFORMS.map(p => (
                    <button key={p} onClick={() => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} className={`py-5 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${selectedPlatforms.includes(p) ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{PLATFORM_ICONS[p]} <span className="font-bold text-xs uppercase tracking-widest">{p}</span></button>
                  ))}
                </div>
              </div>
<<<<<<< HEAD
              <button onClick={handleCampaignSetup} disabled={loading || !intentInput || selectedPlatforms.length === 0} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-xl disabled:opacity-50">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Generate Post Variations"}</button>
=======
              <button onClick={handleCampaignSetup} disabled={loading || !intentInput || selectedPlatforms.length === 0} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-xl disabled:opacity-50">{loading ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Agent Cycle"}</button>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
            </div>
          </div>
        )}

        {step === 'generation' && (
          <div className="space-y-12 animate-fade-in">
<<<<<<< HEAD
            <div className="flex items-end justify-between border-b border-slate-800 pb-8"><h2 className="text-3xl font-black text-white uppercase tracking-tight">Drafts</h2><button onClick={() => setStep('campaign')} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2"><ArrowLeft size={14} /> New Goal</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {posts.map(post => (
                <div key={post.id} className="bg-slate-900/40 border border-slate-800 rounded-[3rem] overflow-hidden flex flex-col group hover:border-indigo-500/30 transition-all shadow-xl">
                  <div className="px-8 py-5 flex items-center justify-between border-b border-slate-800/60"><div className="flex items-center gap-3">{PLATFORM_ICONS[post.platform]} <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{post.platform}</span></div><button onClick={() => setPosts(prev => prev.filter(p => p.id !== post.id))} className="text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></div>
                  <div className="aspect-square relative">
                    {post.isGenerating ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 backdrop-blur-md"><Loader2 className="animate-spin text-indigo-500 w-12 h-12 mb-3" /><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Generating Visual...</span></div>
                    ) : (
                      <ImageOverlay post={post} className="w-full h-full" />
                    )}
                  </div>
                  <div className="p-8 space-y-6 flex-1 flex flex-col"><p className="text-sm font-medium leading-relaxed text-slate-300 line-clamp-3">"{post.caption}"</p><div className="mt-auto"><button onClick={() => setPreviewPost(post)} className="w-full py-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-3">Edit & Review <PenTool size={14} /></button></div></div>
=======
            <div className="flex items-end justify-between border-b border-slate-800 pb-8"><h2 className="text-3xl font-black text-white uppercase tracking-tight">Creative Drafts</h2><button onClick={() => setStep('campaign')} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2"><ArrowLeft size={14} /> Strategy</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {posts.map(post => (
                <div key={post.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col group hover:border-indigo-500/30 transition-all shadow-xl">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800"><div className="flex items-center gap-3">{PLATFORM_ICONS[post.platform]} <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{post.platform}</span></div><button onClick={() => setPosts(prev => prev.filter(p => p.id !== post.id))} className="text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button></div>
                  <div className="aspect-square relative">{post.isGenerating ? <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-10 backdrop-blur-sm"><Loader2 className="animate-spin text-indigo-500 w-10 h-10 mb-2" /><span className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Synthesizing Content...</span></div> : <ImageOverlay post={post} className="w-full h-full" />}</div>
                  <div className="p-8 space-y-5 flex-1 flex flex-col"><p className="text-sm font-medium leading-relaxed text-slate-300 line-clamp-4">"{post.caption}"</p><div className="mt-auto"><button onClick={() => setPreviewPost(post)} className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-3">Human-in-the-Loop Refine <PenTool size={14} /></button></div></div>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

<<<<<<< HEAD
      {previewPost && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-6xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
            {isRefining && <div className="absolute inset-0 z-[401] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4 animate-fade-in"><Loader2 size={48} className="text-indigo-500 animate-spin"/><p className="text-xl font-black uppercase tracking-widest text-white">Refining Post...</p></div>}
            {videoLoading && <div className="absolute inset-0 z-[401] bg-slate-950/80 backdrop-blur-md flex items-center justify-center flex-col gap-6 animate-fade-in"><div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" /><p className="text-xl font-black uppercase tracking-widest text-white">Synthesizing Motion...</p><p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Veo 3.1 is thinking (1-2 mins)</p></div>}
            
            <div className="p-8 flex justify-between items-center border-b border-slate-800 bg-slate-900 z-10">
              <div className="flex items-center gap-4"><div className="p-3 bg-slate-800 rounded-2xl">{PLATFORM_ICONS[previewPost.platform]}</div><h3 className="text-xl font-black uppercase tracking-widest">Post Editor</h3></div>
=======
      {/* Refinement Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-6xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative">
            {isRefining && <div className="absolute inset-0 z-[401] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center flex-col gap-4 animate-fade-in"><Loader2 size={48} className="text-indigo-500 animate-spin"/><p className="text-xl font-black uppercase tracking-widest text-white">Agent Refinement Cycle...</p></div>}
            
            <div className="p-8 flex justify-between items-center border-b border-slate-800 bg-slate-900 z-10">
              <div className="flex items-center gap-4"><div className="p-3 bg-slate-800 rounded-2xl">{PLATFORM_ICONS[previewPost.platform]}</div><h3 className="text-xl font-black uppercase tracking-widest">{previewPost.platform} Agent Review</h3></div>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
              <button onClick={() => setPreviewPost(null)} className="p-3 text-slate-500 hover:text-white transition-all"><X size={28} /></button>
            </div>
            
            <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <div className="space-y-8">
                <div className="relative group">
<<<<<<< HEAD
                  {previewPost.videoUrl ? (
                    <video src={previewPost.videoUrl} autoPlay loop muted className="aspect-square w-full object-cover rounded-[2rem] shadow-2xl ring-1 ring-white/10" />
                  ) : (
                    <ImageOverlay post={previewPost} className="aspect-square shadow-2xl ring-1 ring-white/10 rounded-[2rem]" />
                  )}
                  <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={handleRegenerateImage} className="p-4 bg-slate-950/80 backdrop-blur-md text-white rounded-2xl hover:bg-indigo-600 transition-colors shadow-xl border border-white/10" title="Regenerate Image"><RefreshCcw size={20}/></button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={handleGenerateVideo} disabled={!!previewPost.videoUrl} className={`flex-1 py-5 flex items-center justify-center gap-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${previewPost.videoUrl ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl active:scale-95'}`}>
                    {previewPost.videoUrl ? <CheckCircle2 size={18} /> : <Video size={18} />} {previewPost.videoUrl ? "Motion Asset Ready" : "Generate Motion (Veo 3.1)"}
                  </button>
=======
                  <ImageOverlay post={previewPost} className="aspect-square shadow-2xl ring-1 ring-white/10 rounded-3xl" />
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={handleRegenerateImage} className="p-3 bg-slate-950/80 backdrop-blur-md text-white rounded-full hover:bg-indigo-600 transition-colors shadow-xl" title="Regenerate Visual"><RefreshCcw size={20}/></button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2"><Camera size={16} className="text-indigo-400" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Visual Prompt</span></div>
                  <textarea value={previewPost.imagePrompt} onChange={(e) => setPreviewPost({...previewPost, imagePrompt: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-xs font-mono text-indigo-300 leading-relaxed outline-none focus:border-indigo-500/50 shadow-inner h-24" />
                  <button onClick={handleRegenerateImage} className="w-full py-4 bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Regenerate Visual from Prompt</button>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
                </div>
              </div>

              <div className="space-y-8 flex flex-col">
                <div className="space-y-4">
<<<<<<< HEAD
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Layout size={16} className="text-indigo-400" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Caption</span></div><button onClick={() => { navigator.clipboard.writeText(previewPost.caption); alert('Copied!'); }} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300">Copy to Clipboard</button></div>
                  <textarea value={previewPost.caption} onChange={(e) => setPreviewPost({...previewPost, caption: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 text-sm font-medium leading-relaxed outline-none focus:border-indigo-500/50 shadow-inner h-[200px] custom-scrollbar" />
                </div>

                <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-[2.5rem] space-y-6 ring-1 ring-white/5">
                  <div className="flex items-center gap-2"><Wand2 size={18} className="text-indigo-400" /><span className="text-xs font-black uppercase text-white tracking-widest">AI Refinement</span></div>
                  <div className="relative">
                    <input value={refinementInput} onChange={(e) => setRefinementInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAIRefinement()} placeholder="E.g. Make it more professional..." className="w-full bg-slate-900 border border-slate-800 rounded-full px-8 py-5 text-sm outline-none focus:border-indigo-500 transition-all pr-14 shadow-inner" />
                    <button onClick={handleAIRefinement} className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-all shadow-lg active:scale-90"><Send size={18}/></button>
=======
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Layout size={16} className="text-indigo-400" /><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Copy Content</span></div><button onClick={() => { navigator.clipboard.writeText(previewPost.caption); alert('Copied!'); }} className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300">Copy Caption</button></div>
                  <textarea value={previewPost.caption} onChange={(e) => setPreviewPost({...previewPost, caption: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-8 text-sm font-medium leading-relaxed outline-none focus:border-indigo-500/50 shadow-inner h-[250px] custom-scrollbar" />
                </div>

                <div className="p-8 bg-indigo-950/20 border border-indigo-500/30 rounded-[2.5rem] space-y-6">
                  <div className="flex items-center gap-2"><Wand2 size={18} className="text-indigo-400" /><span className="text-sm font-black uppercase text-white tracking-widest">Strategic Agent Instructions</span></div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Describe adjustments (e.g., "Make it more professional", "Use more emojis", "Adjust lighting to dawn").</p>
                  <div className="relative">
                    <input value={refinementInput} onChange={(e) => setRefinementInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAIRefinement()} placeholder="Feedback for your agent..." className="w-full bg-slate-950 border border-slate-800 rounded-full px-8 py-5 text-sm outline-none focus:border-indigo-500 transition-all pr-14 shadow-inner" />
                    <button onClick={handleAIRefinement} className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-all shadow-lg"><Send size={18}/></button>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
                  </div>
                </div>

                <div className="mt-auto pt-6 flex gap-4">
<<<<<<< HEAD
                  <button onClick={() => { alert('Project Exported!'); setPreviewPost(null); }} className="flex-1 py-6 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"><Download size={20}/> Download Export</button>
=======
                  <button onClick={() => { alert('Exporting Campaign Asset...'); setPreviewPost(null); }} className="flex-1 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl"><Download size={20}/> Download Package</button>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

<<<<<<< HEAD
      <div className={`fixed bottom-8 right-8 z-[300] transition-all duration-500 transform ${isChatOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="w-[420px] h-[600px] bg-slate-900/98 backdrop-blur-3xl border border-slate-800 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
          <div className="p-7 bg-slate-800/50 flex items-center justify-between border-b border-slate-800"><div className="flex items-center gap-3"><div className="p-2.5 bg-indigo-500 rounded-xl shadow-lg"><Search size={16} className="text-white" /></div><div className="flex flex-col"><span className="font-bold text-sm tracking-tight">Strategy Assistant</span><span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Gemini 3 Flash</span></div></div><button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white p-1.5 rounded-full hover:bg-slate-700 transition-all"><X size={20}/></button></div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {chatHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4 text-slate-500">
                <Sparkles size={32} className="text-indigo-400" />
                <p className="text-xs font-black uppercase tracking-widest">Ask Agent Crafty about trends, <br/> caption ideas, or strategy.</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                <div className={`max-w-[90%] p-5 rounded-3xl text-[13px] font-medium leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none shadow-lg' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700 shadow-xl'}`}>
                  {msg.text}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.sources.map((s, idx) => (
                      <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[9px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition-colors">
                        <LinkIcon size={8} /> {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isChatLoading && <div className="flex justify-start"><div className="bg-slate-800 p-4 rounded-3xl border border-slate-700 animate-pulse text-xs text-slate-400 uppercase tracking-widest">Thinking...</div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm"><div className="relative flex items-center"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="w-full bg-slate-950 border border-slate-800 rounded-full px-7 py-5 text-sm outline-none focus:border-indigo-500 transition-all pr-14 shadow-inner" placeholder="Ask about trends..." /><button onClick={handleSendMessage} className="absolute right-2.5 p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 active:scale-90 shadow-lg"><Send size={18}/></button></div></div>
        </div>
      </div>

      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`fixed bottom-8 right-8 z-[301] p-6 rounded-[2rem] shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center ${isChatOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}>{isChatOpen ? <X size={32} /> : <MessageSquare size={32} />}</button>
=======
      {/* Strategy Chat Bubble */}
      <div className={`fixed bottom-8 right-8 z-[300] transition-all duration-500 transform ${isChatOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className="w-[380px] h-[550px] bg-slate-900/95 backdrop-blur-3xl border border-slate-700 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
          <div className="p-6 bg-slate-800 flex items-center justify-between border-b border-slate-700"><div className="flex items-center gap-3"><div className="p-2 bg-indigo-500 rounded-lg shadow-lg"><Bot size={16} className="text-white" /></div><span className="font-bold text-sm tracking-tight">Agent Strategy Hub</span></div><button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-all"><X size={20}/></button></div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {chatHistory.length === 0 && (<div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-slate-500"><Sparkles size={40} className="text-indigo-400 opacity-50"/><p className="text-xs font-bold uppercase tracking-widest">Consult your agent</p></div>)}
            {chatHistory.map((msg, i) => (<div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>{msg.text}</div></div>))}
            {isChatLoading && <div className="flex justify-start"><div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 animate-pulse">Consulting...</div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="p-5 border-t border-slate-800 bg-slate-900/50"><div className="relative flex items-center"><input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="w-full bg-slate-950 border border-slate-800 rounded-full px-6 py-4 text-xs outline-none focus:border-indigo-500 transition-all pr-12 shadow-inner" placeholder="Ask about strategy..." /><button onClick={handleSendMessage} className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 active:scale-90"><Send size={16}/></button></div></div>
        </div>
      </div>

      <button onClick={() => setIsChatOpen(!isChatOpen)} className={`fixed bottom-8 right-8 z-[301] p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90 flex items-center justify-center ${isChatOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}>{isChatOpen ? <X size={28} /> : <MessageSquare size={28} />}</button>
>>>>>>> a2db434f7e51519375edf393369d7319a46cecd1
    </div>
  );
};

export default App;
