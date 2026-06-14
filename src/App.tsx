import { useState, useEffect, useRef, MouseEvent, ChangeEvent } from 'react';
import {
  LayoutDashboard,
  Package,
  Brain,
  FileText,
  Camera,
  Video,
  Send,
  Coins,
  PlusCircle,
  Download,
  Share2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Search,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Eye,
  Heart,
  Menu,
  X,
  Plus,
  Coins as CoinIcon,
  Sun,
  Moon
} from 'lucide-react';

// Interfaces for structured data
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageBlob?: string; // Base64
}

interface AnalysisResult {
  usp: string[];
  targetAudience: string[];
  brandVoice: string;
  competitorAnalysis: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  contentStrategy: string[];
}

interface CopywritingResult {
  hooks: string[];
  bodyText: string;
  hashtags: string[];
  callToAction: string;
}

interface PhotoConceptResult {
  visualDescription: string;
  composition: string;
  props: string;
  backgroundSetting: string;
  promptForGenerative: string;
}

interface VideoScene {
  sceneId: number;
  time: string;
  visual: string;
  audio: string;
}

interface VideoScriptResult {
  backsoundSuggestion: string;
  scenes: VideoScene[];
}

interface SavedContent {
  id: string;
  productId: string;
  type: 'copywriting' | 'photo' | 'video';
  title: string;
  data: any;
  createdAt: string;
}

interface SimulatedPost {
  id: string;
  productId: string;
  productName: string;
  contentId: string;
  platform: 'Instagram' | 'TikTok' | 'WhatsApp';
  caption: string;
  imageUrl?: string;
  views: number;
  likes: number;
  shares: number;
  sales: number;
  createdAt: string;
}

interface CreditTransaction {
  id: string;
  type: 'gain' | 'spend';
  amount: number;
  description: string;
  date: string;
}

// Initial Sample Products
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Sambal Bajak Bu Sastro',
    description: 'Sambal bajak khas Jawa Timur dengan racikan resep turun-temurun menggunakan cabai rawit segar lokal dan terasi pilihan. Pedas mantap instan menggugah selera tanpa pengawet.',
    price: 25000,
    category: 'Kuliner'
  },
  {
    id: 'prod-2',
    title: 'Kemeja Batik Tulis Sogan Bengawan',
    description: 'Kemeja kriya kain katun batik tulis premium bermotif klasik Sogan Khas Solo Bengawan. Serat kain sejuk dan disadur murni menggunakan lilin alami premium.',
    price: 349000,
    category: 'Fashion'
  }
];

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
}

function CustomSelect({ value, onChange, options, placeholder = "Pilih opsi..." }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative font-sans" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all flex items-center justify-between shadow-sm cursor-pointer hover:border-indigo-300"
      >
        <span className="flex items-center gap-2 truncate pr-4">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-base leading-none">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
             <span className="text-zinc-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden elya-shadow animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-zinc-100 bg-zinc-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -tranzinc-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-zinc-400"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition-colors flex items-center gap-2 mb-0.5 last:mb-0 ${
                    value === opt.value 
                      ? 'bg-indigo-50 text-indigo-700 font-bold' 
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800'
                  }`}
                >
                  {opt.icon && <span className="text-base leading-none">{opt.icon}</span>}
                  <span>{opt.label}</span>
                  {value === opt.value && <CheckCircle className="w-3.5 h-3.5 text-indigo-500 ml-auto shrink-0" />}
                </button>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-zinc-400">
                Tidak ada hasil.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'analysis' | 'content' | 'posts' | 'wallet'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme state (dark/light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('demelo_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('demelo_theme', theme);
  }, [theme]);

  // Content Sub-tabs
  const [contentSubTab, setContentSubTab] = useState<'copywriter' | 'photographer' | 'videographer'>('copywriter');

  // Core Data States with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('demelo_products');
    return saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    const saved = localStorage.getItem('demelo_products');
    const items = saved ? JSON.parse(saved) : SAMPLE_PRODUCTS;
    return items[0]?.id || '';
  });

  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem('demelo_credits');
    return saved ? parseInt(saved) : 250; // starts with 250 credits
  });

  const [transactions, setTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem('demelo_transactions');
    return saved ? JSON.parse(saved) : [
      { id: 'tx-init', type: 'gain', amount: 250, description: 'Bonus Sambutan Pendaftaran DEMELO', date: new Date().toLocaleDateString('id-ID') }
    ];
  });

  const [savedContents, setSavedContents] = useState<SavedContent[]>(() => {
    const saved = localStorage.getItem('demelo_saved_contents');
    return saved ? JSON.parse(saved) : [];
  });

  const [simulatedPosts, setSimulatedPosts] = useState<SimulatedPost[]>(() => {
    const saved = localStorage.getItem('demelo_posts');
    return saved ? JSON.parse(saved) : [];
  });

  // Action/loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [activeCopywriting, setActiveCopywriting] = useState<CopywritingResult | null>(null);
  const [activePhotoConcept, setActivePhotoConcept] = useState<PhotoConceptResult | null>(null);
  const [activeVideoScript, setActiveVideoScript] = useState<VideoScriptResult | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Form states for product creation
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Kuliner');
  const [newImg, setNewImg] = useState<string>('');

  // Copywriting Settings Form
  const [copyChannel, setCopyChannel] = useState<'Instagram' | 'WhatsApp' | 'TikTok' | 'Facebook Ad'>('Instagram');
  const [copyTone, setCopyTone] = useState<'Ramah Bersahabat' | 'Diskon Heboh' | 'Professional Edukatif' | 'Humor Lokal'>('Ramah Bersahabat');

  // Photo Style Form
  const [photoStyle, setPhotoStyle] = useState<'Studio Minimalist' | 'Tropical Oasis' | 'Retro Vintage' | 'Cyberpunk Neon'>('Studio Minimalist');

  // Video Objective Form
  const [videoObjective, setVideoObjective] = useState<'Pengenalan Produk (Unboxing)' | 'Review Testimoni' | 'Edukasi Solusi & Manfaat'>('Pengenalan Produk (Unboxing)');

  // Topup Modal State
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ id: string; name: string; price: number; credits: number } | null>(null);
  const [payingStep, setPayingStep] = useState<'none' | 'qris' | 'success'>('none');

  // Canvas Refs
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('demelo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('demelo_credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('demelo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('demelo_saved_contents', JSON.stringify(savedContents));
  }, [savedContents]);

  useEffect(() => {
    localStorage.setItem('demelo_posts', JSON.stringify(simulatedPosts));
  }, [simulatedPosts]);

  // Simulated metrics growth ticker
  useEffect(() => {
    const handle = setInterval(() => {
      setSimulatedPosts(prev => {
        if (prev.length === 0) return prev;
        return prev.map(p => {
          // Slowly increase stats
          const viewsAdd = Math.floor(Math.random() * 8) + 2;
          const likesAdd = Math.random() > 0.4 ? Math.floor(Math.random() * 3) + 1 : 0;
          const sharesAdd = Math.random() > 0.8 ? 1 : 0;
          // Every 15th view has a chance to generate local sales!
          const salesAdd = Math.random() > 0.92 ? 1 : 0;
          return {
            ...p,
            views: p.views + viewsAdd,
            likes: p.likes + likesAdd,
            shares: p.shares + sharesAdd,
            sales: p.sales + salesAdd
          };
        });
      });
    }, 4000);
    return () => clearInterval(handle);
  }, []);

  // Set default analysis on product selection
  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  useEffect(() => {
    setActiveAnalysis(null);
    setActiveCopywriting(null);
    setActivePhotoConcept(null);
    setActiveVideoScript(null);
  }, [selectedProductId]);

  // Credit Deduction controller helper
  const deductCredits = (cost: number, description: string): boolean => {
    if (credits < cost) {
      setErrorNotice(`Kredit Anda tidak mencukupi. Anda membutuhkan ${cost} kredit sedangkan sisa kredit Anda adalah ${credits} kredit.`);
      setActiveTab('wallet');
      return false;
    }
    const newBal = credits - cost;
    setCredits(newBal);
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'spend',
        amount: cost,
        description,
        date: new Date().toLocaleDateString('id-ID')
      },
      ...prev
    ]);
    return true;
  };

  // 1. Create product handler
  const handleCreateProduct = () => {
    if (!newTitle.trim()) {
      alert('Mohon isi nama produk!');
      return;
    }
    const product: Product = {
      id: `prod-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      price: parseInt(newPrice) || 0,
      category: newCategory,
      imageBlob: newImg || undefined
    };
    setProducts(prev => [product, ...prev]);
    setSelectedProductId(product.id);
    setNewTitle('');
    setNewDesc('');
    setNewPrice('');
    setNewImg('');
    setActiveTab('analysis'); // Walk user to Step 2!
  };

  const handleDeleteProduct = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (confirm('Hapus produk ini? Semua konten terkait akan tetap tersimpan tapi tidak terikat lagi.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      if (selectedProductId === id) {
        const remaining = products.filter(p => p.id !== id);
        if (remaining.length > 0) {
          setSelectedProductId(remaining[0].id);
        }
      }
    }
  };

  // File to Base64 reader for premium photo uploads
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. AI Marketing Analysis Trigger (Free Step)
  const triggerAnalyzeProduct = async () => {
    if (!activeProduct) return;
    setLoading(true);
    setErrorNotice(null);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeProduct.title,
          description: activeProduct.description,
          category: activeProduct.category,
          price: activeProduct.price
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setActiveAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorNotice('Gagal menghubungkan ke AI. Mengaktifkan mesin analisis mandiri...');
    } finally {
      setLoading(false);
    }
  };

  // 3. (A) Copywriter AI Trigger (Costs 10 Credits)
  const triggerCopywriting = async () => {
    if (!activeProduct) return;
    const cost = 10;
    const desc = `Buat Copywriting (${copyChannel}) - ${activeProduct.title}`;
    
    setLoading(true);
    setErrorNotice(null);
    
    try {
      const res = await fetch('/api/gemini/copywriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeProduct.title,
          description: activeProduct.description,
          category: activeProduct.category,
          channel: copyChannel,
          tone: copyTone
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Deduct only when API is successful
      if (deductCredits(cost, desc)) {
        setActiveCopywriting(data);
        // Save to collection
        const newSaved: SavedContent = {
          id: `saved-${Date.now()}`,
          productId: activeProduct.id,
          type: 'copywriting',
          title: `Caption ${copyChannel} (${copyTone})`,
          data: data,
          createdAt: new Date().toLocaleDateString('id-ID')
        };
        setSavedContents(prev => [newSaved, ...prev]);
      }
    } catch (err) {
      setErrorNotice('Gagal generate naskah pemasaran. Silakan coba sesaat lagi.');
    } finally {
      setLoading(false);
    }
  };

  // 3. (B) Photographer AI Studio Trigger (Costs 20 Credits)
  const triggerPhotographer = async () => {
    if (!activeProduct) return;
    const cost = 20;
    const desc = `Studio Foto AI (${photoStyle}) - ${activeProduct.title}`;
    
    setLoading(true);
    setErrorNotice(null);
    
    try {
      const res = await fetch('/api/gemini/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeProduct.title,
          description: activeProduct.description,
          category: activeProduct.category,
          style: photoStyle
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      if (deductCredits(cost, desc)) {
        setActivePhotoConcept(data);
        const newSaved: SavedContent = {
          id: `saved-${Date.now()}`,
          productId: activeProduct.id,
          type: 'photo',
          title: `Frame Foto - Tema ${photoStyle}`,
          data: { ...data, stylePreset: photoStyle },
          createdAt: new Date().toLocaleDateString('id-ID')
        };
        setSavedContents(prev => [newSaved, ...prev]);
      }
    } catch (err) {
      setErrorNotice('Gagal merancang ide studio foto. Coba ganti preset tema.');
    } finally {
      setLoading(false);
    }
  };

  // Render Beautiful Image Placard on Canvas (Allows immediate customer download!)
  useEffect(() => {
    if (activeTab === 'content' && contentSubTab === 'photographer' && activePhotoConcept) {
      drawInteractivePlacard();
    }
  }, [activePhotoConcept, photoStyle, activeTab, contentSubTab]);

  const drawInteractivePlacard = () => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size
    canvas.width = 600;
    canvas.height = 600;

    // Apply Style Themes via Gradients
    let grad = ctx.createLinearGradient(0, 0, 600, 600);
    if (photoStyle === 'Studio Minimalist') {
      grad.addColorStop(0, '#f5f5f4'); // warm gray
      grad.addColorStop(1, '#e7e5e4');
    } else if (photoStyle === 'Tropical Oasis') {
      grad.addColorStop(0, '#022c22'); // jungle dark green
      grad.addColorStop(1, '#064e3b');
    } else if (photoStyle === 'Retro Vintage') {
      grad.addColorStop(0, '#fef3c7'); // warm yellow paper
      grad.addColorStop(1, '#fde68a');
    } else { // Cyberpunk Neon
      grad.addColorStop(0, '#0f051d'); // deep purple-violet
      grad.addColorStop(1, '#2e0854');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);

    // Dynamic Leaf Shadow/Texture overlay
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    // Simulate natural shadows of organic branch leaves
    for (let i = 0; i < 6; i++) {
      ctx.ellipse(100 + i * 80, 80 + i * 40, 120, 45, Math.PI / 4 + i, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Drawing modern background framing border
    ctx.strokeStyle = photoStyle.includes('Neon') ? '#ec4899' : '#10b981';
    ctx.lineWidth = 12;
    ctx.strokeRect(20, 20, 560, 560);

    // Banner Accent Circle
    const circleColor = photoStyle === 'Studio Minimalist' ? '#10b981' : 
                        photoStyle === 'Tropical Oasis' ? '#fbbf24' : 
                        photoStyle === 'Retro Vintage' ? '#dc2626' : '#a855f7';
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = circleColor;
    ctx.beginPath();
    ctx.arc(300, 230, 160, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw uploaded image OR aesthetic placeholder icon central
    if (activeProduct?.imageBlob) {
      const img = new Image();
      img.onload = () => {
        // Draw circular cropped product image or scaled fit
        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 220, 120, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 180, 100, 240, 240);
        ctx.restore();
        drawOverlayTexts(ctx, circleColor);
      };
      img.src = activeProduct.imageBlob;
    } else {
      // Draw aesthetic placeholder shape for the product category
      ctx.fillStyle = circleColor;
      ctx.beginPath();
      ctx.arc(300, 220, 110, 0, Math.PI * 2);
      ctx.fill();

      // category drawing icon helper
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 80px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const categoryGlyph = activeProduct?.category === 'Kuliner' ? '🍲' :
                            activeProduct?.category === 'Fashion' ? '👕' :
                            activeProduct?.category === 'Kriya' ? '🏺' : '📦';
      ctx.fillText(categoryGlyph, 300, 220);
      drawOverlayTexts(ctx, circleColor);
    }
  };

  const drawOverlayTexts = (ctx: CanvasRenderingContext2D, accentColor: string) => {
    const textColor = (photoStyle === 'Studio Minimalist' || photoStyle === 'Retro Vintage') ? '#0f172a' : '#ffffff';

    // Draw Title Text
    ctx.fillStyle = textColor;
    ctx.font = '800 32px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((activeProduct?.title || 'Produk UMKM').toUpperCase(), 300, 390);

    // Category Badge box
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    const badgeText = `${activeProduct?.category || 'PRODUK LOKAL'}`;
    const fontMetrics = ctx.measureText(badgeText);
    const badgeWidth = Math.max(140, fontMetrics.width + 40);
    ctx.roundRect(300 - badgeWidth / 2, 415, badgeWidth, 34, 17);
    ctx.fill();

    ctx.fillStyle = (accentColor === '#fbbf24' || accentColor === '#fef3c7') ? '#1e293b' : '#ffffff';
    ctx.font = '700 16px "Inter", sans-serif';
    ctx.fillText(badgeText.toUpperCase(), 300, 437);

    // Beautiful Indonesian Heritage Badging sticker left bottom
    ctx.save();
    ctx.translate(110, 500);
    ctx.rotate(-Math.PI / 12);
    ctx.fillStyle = '#b91c1c'; // Red
    ctx.fillRect(-70, -18, 140, 36);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 11px sans-serif';
    ctx.fillText('100% INDONESIA', 0, 4);
    ctx.restore();

    // Price tag right bottom
    const priceText = activeProduct?.price > 0 ? `Rp ${activeProduct.price.toLocaleString('id-ID')}` : 'Hubungi Kontak';
    ctx.fillStyle = textColor;
    ctx.font = '800 28px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(priceText, 520, 510);

    ctx.fillStyle = photoStyle.includes('Neon') ? '#f472b6' : '#64748b';
    ctx.font = '700 12px sans-serif';
    ctx.fillText('EST. HARGA UMKM', 520, 480);
  };

  const handleDownloadPlacard = () => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `SocioAgen_${activeProduct?.title.replace(/ /g, '_') || 'produk'}_feed.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };


  // 3. (C) Video Maker Script AI Trigger (Costs 50 Credits)
  const triggerVideographer = async () => {
    if (!activeProduct) return;
    const cost = 50;
    const desc = `Buat Naskah Video AI (${videoObjective}) - ${activeProduct.title}`;
    
    setLoading(true);
    setErrorNotice(null);
    
    try {
      const res = await fetch('/api/gemini/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeProduct.title,
          description: activeProduct.description,
          category: activeProduct.category,
          objective: videoObjective
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      if (deductCredits(cost, desc)) {
        setActiveVideoScript(data);
        const newSaved: SavedContent = {
          id: `saved-${Date.now()}`,
          productId: activeProduct.id,
          type: 'video',
          title: `Script Video - ${videoObjective}`,
          data: data,
          createdAt: new Date().toLocaleDateString('id-ID')
        };
        setSavedContents(prev => [newSaved, ...prev]);
      }
    } catch (err) {
      setErrorNotice('Gagal merancang skrip video TikTok/Reels. Silakan coba kembali.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Simulasi Posting Social Media
  const handleSimulatePost = (content: SavedContent, platform: 'Instagram' | 'TikTok' | 'WhatsApp') => {
    let captionText = '';
    let imageSrc = undefined;

    if (content.type === 'copywriting') {
      const cData = content.data as CopywritingResult;
      captionText = `${cData.hooks?.[0] || ''}\n\n${cData.bodyText || ''}\n\n${cData.hashtags?.slice(0,4).join(' ') || ''}\n${cData.callToAction || ''}`;
    } else if (content.type === 'photo') {
      const pData = content.data as PhotoConceptResult;
      captionText = `📸 Foto Konsep Estetik: ${pData.visualDescription}\n\nBagian latar belakang: ${pData.backgroundSetting}\nSaran Properti: ${pData.props}`;
    } else {
      const vData = content.data as VideoScriptResult;
      captionText = `🎬 Storyboard Video: ${content.title}\n\nSaran Musik: ${vData.backsoundSuggestion}\nScene 1: ${vData.scenes?.[0]?.audio || ''}`;
    }

    // Try to tie to canvas drawing if photo exists
    if (content.type === 'photo') {
      const canvas = cardCanvasRef.current;
      imageSrc = canvas ? canvas.toDataURL('image/png') : undefined;
    } else if (activeProduct.imageBlob) {
      imageSrc = activeProduct.imageBlob;
    }

    const newPost: SimulatedPost = {
      id: `post-${Date.now()}`,
      productId: activeProduct.id,
      productName: activeProduct.title,
      contentId: content.id,
      platform,
      caption: captionText,
      imageUrl: imageSrc,
      views: Math.floor(Math.random() * 50) + 15,
      likes: Math.floor(Math.random() * 10) + 2,
      shares: 0,
      sales: 0,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setSimulatedPosts(prev => [newPost, ...prev]);
    setActiveTab('posts'); // Redirect user to see real-time metrics rolling!
    alert(`Berhasil disimulasikan! Posting Anda telah terbit di galeri feed digital DEMELO. Pantau perkembangannya!`);
  };

  const handleClearSimulationHistory = () => {
    if (confirm('Bersihkan semua riwayat simulasi postingan dari feed?')) {
      setSimulatedPosts([]);
    }
  };

  // 5. Payment simulation processes
  const handleBuyClick = (pkg: { id: string; name: string; price: number; credits: number }) => {
    setSelectedPackage(pkg);
    setPayingStep('qris');
    setShowTopupModal(true);
  };

  const handleSimulatePaymentSuccess = () => {
    if (!selectedPackage) return;
    
    // Gain credits
    const addAmt = selectedPackage.credits;
    const newBal = credits + addAmt;
    setCredits(newBal);
    
    // Add transaction ledger
    setTransactions(prev => [
      {
        id: `tx-${Date.now()}`,
        type: 'gain',
        amount: addAmt,
        description: `Top-up Saldo Kredit Paket ${selectedPackage.name}`,
        date: new Date().toLocaleDateString('id-ID')
      },
      ...prev
    ]);

    setPayingStep('success');
  };

  const closePaymentFlow = () => {
    setShowTopupModal(false);
    setSelectedPackage(null);
    setPayingStep('none');
  };


  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white elya-shadow sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/30">D</div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-800">DEMELO</span>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded-full">AI Agent</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
            className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold text-xs px-3 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>🪙 {credits}</span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-500 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Sidebar (Desktop persistent, Mobile sliding drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-100 p-5 flex flex-col justify-between transition-transform duration-300 transform
        md:relative md:tranzinc-x-0 elya-shadow-active
        ${mobileMenuOpen ? 'tranzinc-x-0' : '-tranzinc-x-full md:tranzinc-x-0'}
      `}>
        <div className="flex flex-col gap-6">
          {/* Logo Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/40 text-lg">D</div>
              <div>
                <span className="text-2xl font-black tracking-tight text-zinc-800 block">DEMELO</span>
                <span className="text-[10px] text-indigo-500 font-semibold tracking-wider uppercase block">Growth Companion</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button className="md:hidden p-1 text-zinc-400 hover:text-zinc-800" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Product Widget */}
          {activeProduct && (
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-bold">Produk Terpilih:</span>
              <span className="text-sm font-semibold text-indigo-600 block truncate">{activeProduct.title}</span>
              <span className="text-xs text-zinc-500 font-mono">Rp {activeProduct.price.toLocaleString('id-ID')}</span>
            </div>
          )}

          {/* Sidebar Menu Items organized logically following the flow */}
          <nav className="flex flex-col gap-1">
            <p className="text-[10px] uppercase font-bold text-zinc-400 px-3 pt-2 pb-1.5 tracking-widest">ALUR AGENT UMKM</p>
            
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-500 text-white elya-shadow' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span className="truncate">Ringkasan Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between px-4 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'products' ? 'bg-indigo-500 text-white elya-shadow' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Package className="w-5 h-5 shrink-0" />
                <span className="truncate">1. Unggah Produk</span>
              </div>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-400'}`}>Input</span>
            </button>

            <button
              onClick={() => { setActiveTab('analysis'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between px-4 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'analysis' ? 'bg-indigo-500 text-white elya-shadow' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Brain className="w-5 h-5 shrink-0" />
                <span className="truncate">2. Analisa AI Agent</span>
              </div>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'analysis' ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>Gratis</span>
            </button>

            <button
              onClick={() => { setActiveTab('content'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between px-4 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'content' ? 'bg-indigo-500 text-white elya-shadow' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Sparkles className="w-5 h-5 shrink-0" />
                <span className="truncate">3. Buat Konten</span>
              </div>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'content' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-500'}`}>Kredit</span>
            </button>

            <button
              onClick={() => { setActiveTab('posts'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-between px-4 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'posts' ? 'bg-indigo-500 text-white elya-shadow' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Send className="w-5 h-5 shrink-0" />
                <span className="truncate">4. Posting Sosmed</span>
              </div>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-mono font-bold ${activeTab === 'posts' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-500'}`}>Hasil</span>
            </button>

            <p className="text-[10px] uppercase font-bold text-zinc-400 px-3 pt-6 pb-1.5 tracking-widest">KEUANGAN</p>

            <button
              onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === 'wallet' ? 'bg-indigo-500 text-white elya-shadow' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800'
              }`}
            >
              <Coins className="w-5 h-5 text-amber-500" />
              <span>Sisa Kredit: <b className="font-black">{credits}</b></span>
            </button>
          </nav>
        </div>

        {/* Footer info containing PWA tag */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs bg-zinc-50 p-2 rounded-xl border border-zinc-100 text-zinc-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>Aplikasi Tersemat PWA</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono text-center block font-medium">DEMELO v1.0 • Buatan Indonesia</span>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 flex flex-col gap-6 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* Error notification banner */}
        {errorNotice && (
          <div className="bg-amber-950/80 border border-amber-500/30 text-amber-200 p-4 rounded-xl flex items-start gap-3 shadow-lg max-w-3xl">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-white">Perhatian AI Agent</h4>
              <p className="text-xs text-amber-300/90 mt-1">{errorNotice}</p>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => { setActiveTab('wallet'); setErrorNotice(null); }}
                  className="bg-amber-500 text-zinc-950 font-bold text-xs px-3 py-1.5 rounded hover:bg-amber-400 transition-colors"
                >
                  Isi Ulang Kredit
                </button>
                <button onClick={() => setErrorNotice(null)} className="text-xs text-amber-400 hover:underline px-2 py-1">
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay for background AI generations */}
        {loading && (
          <div className="bg-zinc-900 border border-emerald-500/20 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-4 max-w-md mx-auto shadow-2xl mt-12 py-12 ai-glow">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
            <div>
              <h3 className="font-bold text-white text-lg">AI Agent Sedang Bekerja...</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">Menganalisis karakteristik brand dan menerjemahkannya ke dalam konten pemasaran berkonversi tinggi.</p>
            </div>
            <div className="bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 text-[10px] text-emerald-400 font-mono animate-pulse">
              SEDANG MENGHUBUNGI MESIN AI GEMINI
            </div>
          </div>
        )}

        {/* Dynamic Screens Controller */}
        {!loading && (
          <>
            {/* SCREEN 1: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800">Salam Sukses, UMKM Indonesia! 🇮🇩</h1>
                  <p className="text-zinc-500 text-sm mt-1">Socio-PWA AI DEMELO siap menjadi asisten digital Anda untuk menciptakan konten pemasaran modern yang langsung mendongkrak penjualan.</p>
                </div>

                {/* Dashboard Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl flex items-center justify-between elya-shadow-hover transition-all duration-300">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-bold leading-tight">Total Produk Terdaftar</span>
                      <span className="text-3xl font-black text-zinc-800 mt-2 block leading-none">{products.length}</span>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl flex items-center justify-between elya-shadow-hover transition-all duration-300">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-bold leading-tight">Kredit Tersedia</span>
                      <span className="text-3xl font-black text-zinc-800 mt-2 block leading-none flex items-center gap-1.5">
                        <span className="text-amber-500 text-xl">🪙</span> {credits}
                      </span>
                    </div>
                    <button 
                      onClick={() => setActiveTab('wallet')}
                      className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center hover:bg-amber-100 transition-colors cursor-pointer shrink-0 shadow-sm"
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="bg-white p-6 rounded-3xl flex items-center justify-between elya-shadow-hover transition-all duration-300">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-bold leading-tight">Hasil Simulasikan Post</span>
                      <span className="text-3xl font-black text-zinc-800 mt-2 block leading-none">{simulatedPosts.length}</span>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Send className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl flex items-center justify-between elya-shadow-hover transition-all duration-300">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-wide block font-bold leading-tight">Estimasi Keuntungan Sosmed</span>
                      <span className="text-2xl font-black text-zinc-800 mt-2 block leading-none">
                        Rp {(simulatedPosts.reduce((acc, p) => acc + (p.sales * (activeProduct?.price || 20000)), 0)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-sm">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Quick Guide Step-by-Step workflow */}
                    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-zinc-100 lg:col-span-2 space-y-6 elya-shadow relative overflow-hidden">
                      <h2 className="text-2xl font-extrabold text-zinc-800 flex items-center gap-3">
                        <Sparkles className="w-7 h-7 text-indigo-500" />
                        Langkah Alur Kerja AI Agent DEMELO
                      </h2>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">Aplikasi ini dirancang berurutan sesuai proses pemasaran awal hingga akhir. Ikuti langkah mudah berikut:</p>

                      <div className="space-y-4 pt-2">
                        <div onClick={() => setActiveTab('products')} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 hover:border-indigo-300 hover:bg-white elya-shadow-hover transition-all duration-300 cursor-pointer flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                            <span className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-110 transition-transform">1</span>
                            <div>
                              <p className="font-extrabold text-base text-zinc-800 group-hover:text-indigo-600">Unggah Produk Anda</p>
                              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Iklan yang bagus berawal dari detail deskripsi produk yang lengkap.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-indigo-500" />
                        </div>

                        <div onClick={() => setActiveTab('analysis')} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 hover:border-indigo-300 hover:bg-white elya-shadow-hover transition-all duration-300 cursor-pointer flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                            <span className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-110 transition-transform">2</span>
                            <div>
                              <p className="font-extrabold text-base text-zinc-800 group-hover:text-indigo-600">Analisa AI Agent Gratis</p>
                              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Minta AI menganalisis SWOT, keunggulan USP, dan menentukan target sasaran pembeli.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-indigo-500" />
                        </div>

                        <div onClick={() => { setActiveTab('content'); setContentSubTab('copywriter'); }} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 hover:border-indigo-300 hover:bg-white elya-shadow-hover transition-all duration-300 cursor-pointer flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                            <span className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-110 transition-transform">3</span>
                            <div>
                              <p className="font-extrabold text-base text-zinc-800 group-hover:text-indigo-600">Pabrikasi Konten Pemasaran AI</p>
                              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Gunakan sisa kredit Anda untuk generate Copywriting, Desain Foto, hingga Naskah Video pendek.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-indigo-500" />
                        </div>

                        <div onClick={() => setActiveTab('posts')} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 hover:border-indigo-300 hover:bg-white elya-shadow-hover transition-all duration-300 cursor-pointer flex items-center justify-between group">
                          <div className="flex items-center gap-5">
                            <span className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-110 transition-transform">4</span>
                            <div>
                              <p className="font-extrabold text-base text-zinc-800 group-hover:text-indigo-600">Terbitkan Posting & Simulasi Hasil</p>
                              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Lihat pratinjau tampilan di Instagram Feed dan hitung perkembangan engagement pembeli.</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-zinc-300 group-hover:text-indigo-500" />
                        </div>
                      </div>
                    </div>

                  {/* Sidebar Widget: Active Social posts live results */}
                  {/* Sidebar Widget: Active Social posts live results */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 space-y-4 elya-shadow">
                    <h3 className="text-sm font-extrabold text-zinc-800 uppercase tracking-wider">Metrik Ticker Promosi</h3>
                    <p className="text-xs text-zinc-500">Live simulasi pertumbuhan interaksi konten yang sudah Anda terbitkan lewat AI.</p>
                    
                    {simulatedPosts.length === 0 ? (
                      <div className="bg-zinc-50 p-6 rounded-3xl text-center text-zinc-400 border border-zinc-100 py-10 space-y-3">
                        <Send className="w-10 h-10 mx-auto text-zinc-300 block" />
                        <span className="text-sm font-bold block text-zinc-600">Belum ada tayangan</span>
                        <p className="text-[11px] text-zinc-500">Ciptakan konten di menu Buat Konten lalu klik Simulasikan Posting!</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {simulatedPosts.slice(0, 3).map(p => (
                          <div key={p.id} className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100 text-xs hover:border-indigo-300 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-indigo-600 truncate max-w-[120px]">{p.productName}</span>
                              <span className="bg-white text-[10px] px-2 py-0.5 rounded-full border border-zinc-200 text-zinc-500">{p.platform}</span>
                            </div>
                            <p className="text-zinc-500 text-[11px] line-clamp-1 mb-3">"{p.caption}"</p>
                            <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px] bg-white p-2 rounded-2xl text-zinc-400 border border-zinc-100">
                              <div>
                                <span className="block text-zinc-400 text-[8px] uppercase">Views</span>
                                <span className="font-black text-zinc-800">{p.views}</span>
                              </div>
                              <div>
                                <span className="block text-zinc-400 text-[8px] uppercase">Likes</span>
                                <span className="font-black text-rose-500">{p.likes}</span>
                              </div>
                              <div>
                                <span className="block text-zinc-400 text-[8px] uppercase">Shares</span>
                                <span className="font-black text-indigo-500">{p.shares}</span>
                              </div>
                              <div>
                                <span className="block text-zinc-400 text-[8px] uppercase">Sales</span>
                                <span className="font-black text-amber-500">+{p.sales}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {simulatedPosts.length > 3 && (
                          <button onClick={() => setActiveTab('posts')} className="w-full text-center text-xs font-bold text-indigo-500 hover:underline">
                            Lihat semua ({simulatedPosts.length}) postingan...
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 2: STEP 1 - PRODUCT INPUT */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-500 font-bold text-sm flex items-center justify-center text-white mb-0.5 shadow-md shadow-indigo-500/30">1</span>
                    Registrasi & Unggah Produk UMKM
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Daftarkan semua produk lokal dagangan Anda agar AI Agent DEMELO dapat merumuskan program marketing yang efektif.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column: Register Form */}
                  <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 space-y-5 elya-shadow">
                    <h2 className="text-lg font-bold text-zinc-800 pb-3 border-b border-zinc-100">Form Produk Baru</h2>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono block font-bold">Nama Produk *</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Kripik Singkong Balado Renyah"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono block font-bold">Kategori</label>
                        <CustomSelect 
                          value={newCategory}
                          onChange={setNewCategory}
                          options={[
                            { value: 'Kuliner', label: 'Kuliner', icon: '🍲' },
                            { value: 'Fashion', label: 'Fashion', icon: '👕' },
                            { value: 'Kriya', label: 'Kriya & Craft', icon: '🏺' },
                            { value: 'Agribisnis', label: 'Agribisnis', icon: '🌱' },
                            { value: 'Jasa', label: 'Jasa / Servis', icon: '🛠️' },
                            { value: 'Lainnya', label: 'Lainnya', icon: '📦' }
                          ]}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono block font-bold">Harga Jual (Rp)</label>
                        <input 
                          type="number" 
                          placeholder="25000"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-zinc-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono block font-bold">Deskripsi Singkat Keunikan Produk</label>
                      <textarea 
                        rows={3}
                        placeholder="Tulis bahan alami, khasiat murni, rasa orisinil, atau kisah pembuatan agar hasil copywriting promosi AI melesat tajam..."
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-xl px-4 py-3.5 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    {/* Drag-and-drop / File upload container */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono block font-bold">Foto Produk (Opsional)</label>
                      <div className="border border-dashed border-zinc-300 bg-zinc-50 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageFileChange}
                          id="file-upload" 
                          className="hidden" 
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {newImg ? (
                            <div className="space-y-2 flex flex-col items-center">
                              <img src={newImg} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-zinc-200 shadow-sm" />
                              <span className="text-[11px] text-indigo-600 font-bold block">Foto Berhasil Dimuat</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5 flex flex-col items-center">
                              <Camera className="w-8 h-8 text-zinc-400 mx-auto" />
                              <span className="text-xs text-zinc-600 font-bold block mt-1">Pilih berkas / Tarik foto ke sini</span>
                              <span className="text-[10px] text-zinc-500 block leading-tight">Mendukung format PNG, JPG hingga 2MB</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <button 
                      onClick={handleCreateProduct}
                      className="w-full bg-indigo-500 text-white font-bold text-sm py-3.5 rounded-full hover:bg-indigo-400 shadow-lg shadow-indigo-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Daftarkan Produk Baru</span>
                    </button>
                  </div>

                  {/* Right Column: Registered List */}
                  <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 lg:col-span-2 space-y-5 elya-shadow">
                    <h2 className="text-lg font-bold text-zinc-800 pb-3 border-b border-zinc-100">Daftar Produk UMKM Terdaftar ({products.length})</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {products.map(p => {
                        const isSelected = p.id === selectedProductId;
                        return (
                          <div 
                            key={p.id}
                            onClick={() => setSelectedProductId(p.id)}
                            className={`p-5 rounded-[1.5rem] transition-all duration-300 cursor-pointer border flex flex-col justify-between h-[165px] ${
                              isSelected ? 'border-indigo-500 bg-indigo-50 elya-shadow-active' : 'border-zinc-100 bg-zinc-50 hover:border-indigo-300 hover:bg-white elya-shadow-hover'
                            }`}
                          >
                            <div>
                              <div className="flex items-start justify-between">
                                <span className="bg-white text-[10px] px-2.5 py-1 rounded-full text-zinc-500 border border-zinc-200 font-bold leading-none">{p.category}</span>
                                <button 
                                  onClick={(e) => handleDeleteProduct(p.id, e)}
                                  className="text-zinc-400 hover:text-rose-500 p-0.5 transition-colors rounded-full"
                                  title="Hapus Produk"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <h3 className="font-extrabold text-zinc-800 mt-4 text-sm line-clamp-1 leading-snug">{p.title}</h3>
                              <p className="text-zinc-500 text-xs mt-1.5 leading-relaxed line-clamp-2 h-[36px]">{p.description || 'Tanpa deskripsi produk.'}</p>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-zinc-200/60">
                              <span className="font-mono text-indigo-600 font-bold text-xs">
                                {p.price > 0 ? `Rp ${p.price.toLocaleString('id-ID')}` : 'Harga Khusus'}
                              </span>
                              {isSelected ? (
                                <span className="text-[10px] bg-indigo-500 text-white px-2.5 py-0.5 rounded-full font-bold shadow-md shadow-indigo-500/30">AKTIF</span>
                              ) : (
                                <span className="text-[10px] text-zinc-400 font-bold">Klik Pilih</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: STEP 2 - AI ANALYSIS */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-500 font-bold text-sm flex items-center justify-center text-white mb-0.5 shadow-md shadow-indigo-500/30">2</span>
                    Analisa Pemasaran Mendalam AI Agent
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Gunakan kemampuan analisis canggih dari AI Agent untuk meriset brand positioning, SWOT, keunggulan USP, dan perbandingan pasar.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 space-y-6 elya-shadow">
                  {/* Active selector header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50 p-6 rounded-[1.5rem] border border-zinc-100 hover:border-indigo-300 transition-colors elya-shadow-hover">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-zinc-400 font-mono font-bold block">Melakukan Analisis Pada Produk:</span>
                      <h4 className="text-lg font-extrabold text-indigo-600 mt-0.5">{activeProduct?.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1 italic mt-1 font-mono">"{activeProduct?.description}"</p>
                    </div>
                    <button 
                      onClick={triggerAnalyzeProduct}
                      className="bg-indigo-500 hover:bg-indigo-400 transition-all font-bold text-xs py-3 px-6 rounded-full flex items-center gap-2 self-start sm:self-center cursor-pointer text-white shadow-md shadow-indigo-500/30 active:scale-95"
                    >
                      <Brain className="w-5 h-5" />
                      <span>{activeAnalysis ? 'Analisa Ulang Gratis' : 'Mulai Analisa AI Agent'}</span>
                    </button>
                  </div>

                  {activeAnalysis ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: USP & Segments */}
                      <div className="space-y-6 lg:col-span-1">
                        {/* USP */}
                        <div className="bg-white p-5 rounded-3xl border border-zinc-100 space-y-3 elya-shadow-sm">
                          <h4 className="text-sm font-extrabold text-indigo-600 flex items-center gap-2 border-b border-zinc-100 pb-3">
                            <Sparkles className="w-4 h-4" />
                            Nilai Jual Unik (USP)
                          </h4>
                          <ul className="space-y-2 text-xs text-zinc-600">
                            {activeAnalysis.usp.map((u, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-indigo-500 font-bold">•</span>
                                <span>{u}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Target Audience */}
                        <div className="bg-white p-5 rounded-3xl border border-zinc-100 space-y-3 elya-shadow-sm">
                          <h4 className="text-sm font-extrabold text-zinc-800 flex items-center gap-2 border-b border-zinc-100 pb-3">
                            Target Sasaran Pembeli
                          </h4>
                          <ol className="space-y-2 text-xs text-zinc-600">
                            {activeAnalysis.targetAudience.map((t, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="font-mono text-indigo-500 font-bold">{i+1}.</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Brand Voice */}
                        <div className="bg-white p-5 rounded-3xl border border-zinc-100 space-y-2 elya-shadow-sm">
                          <h4 className="text-sm font-extrabold text-zinc-800">Gaya Bahasa (Brand Voice)</h4>
                          <p className="text-xs text-indigo-700 italic bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
                            "{activeAnalysis.brandVoice}"
                          </p>
                        </div>
                      </div>

                      {/* Right: SWOT & Competitor */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* SWOT Matrix Grid */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-extrabold text-zinc-800 uppercase tracking-wider font-mono">Matriks Analisis SWOT</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 elya-shadow-sm">
                              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block font-mono">Strengths (Kekuatan)</span>
                              <ul className="mt-3 space-y-2 text-xs text-zinc-700">
                                {activeAnalysis.swot.strengths.map((s, idx) => <li key={idx}>✅ {s}</li>)}
                              </ul>
                            </div>

                            <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 elya-shadow-sm">
                              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block font-mono">Weaknesses (Kelemahan)</span>
                              <ul className="mt-3 space-y-2 text-xs text-zinc-700">
                                {activeAnalysis.swot.weaknesses.map((w, idx) => <li key={idx}>⚠️ {w}</li>)}
                              </ul>
                            </div>

                            <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 elya-shadow-sm">
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block font-mono">Opportunities (Peluang)</span>
                              <ul className="mt-3 space-y-2 text-xs text-zinc-700">
                                {activeAnalysis.swot.opportunities.map((o, idx) => <li key={idx}>🚀 {o}</li>)}
                              </ul>
                            </div>

                            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100 elya-shadow-sm">
                              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block font-mono">Threats (Ancaman)</span>
                              <ul className="mt-3 space-y-2 text-xs text-zinc-700">
                                {activeAnalysis.swot.threats.map((t, idx) => <li key={idx}>🚨 {t}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Competitor Analysis */}
                        <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-3 elya-shadow-sm">
                          <h4 className="text-sm font-extrabold text-zinc-800">Analisis Kompetitor & Peluang Unggul</h4>
                          <p className="text-xs text-zinc-600 leading-relaxed">{activeAnalysis.competitorAnalysis}</p>
                        </div>

                        {/* Content Recommendations */}
                        <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 space-y-4 elya-shadow-sm">
                          <h4 className="text-sm font-extrabold text-indigo-600">Rekomendasi Ide Konten Media Sosial</h4>
                          <div className="space-y-3">
                            {activeAnalysis.contentStrategy.map((cs, i) => (
                              <div key={i} className="flex gap-3 text-xs bg-white p-3 rounded-2xl border border-zinc-100 text-zinc-600 elya-shadow-sm">
                                <span className="text-indigo-500 font-bold font-mono bg-indigo-50 px-2 py-1 rounded-lg">Ide {i+1}</span>
                                <span className="pt-1">{cs}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-2 text-right">
                            <button 
                              onClick={() => setActiveTab('content')}
                              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-500 hover:underline"
                            >
                              <span>Gunakan Ide Ini Untuk Buat Konten Sekarang</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="bg-zinc-50 p-12 rounded-[2.5rem] text-center border border-zinc-100 py-20 space-y-6">
                      <Brain className="w-20 h-20 text-indigo-200 mx-auto" />
                      <div>
                        <h4 className="font-extrabold text-zinc-800 text-xl">Riset & Analisis Brand Kosong</h4>
                        <p className="text-zinc-500 text-sm max-w-sm mx-auto mt-3 leading-relaxed">Ketuk tombol di atas untuk memerintahkan AI menganalisis SWOT produk lokal Anda secara mendalam. Gratis dan tanpa kredit.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCREEN 4: STEP 3 - AI CONTENT FACTORY */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-500 font-bold text-sm flex items-center justify-center text-white mb-0.5 shadow-md shadow-indigo-500/30">3</span>
                    Studio Konten Pemasaran AI Agent
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Pilih salah satu fungsionalitas AI generator untuk merakit copywriting, placard foto produk bermutu, dan skrip video berkonversi tinggi.</p>
                </div>

                {/* Sub Tab Navigation Selection */}
                <div className="flex bg-zinc-50 p-2 rounded-2xl border border-zinc-200 max-w-2xl elya-shadow-sm">
                  <button 
                    onClick={() => setContentSubTab('copywriter')}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                      contentSubTab === 'copywriter' ? 'bg-white text-indigo-600 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Copywriter (10 Kred)</span>
                  </button>

                  <button 
                    onClick={() => setContentSubTab('photographer')}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                      contentSubTab === 'photographer' ? 'bg-white text-indigo-600 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Foto Studio (20 Kred)</span>
                  </button>

                  <button 
                    onClick={() => setContentSubTab('videographer')}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 ${
                      contentSubTab === 'videographer' ? 'bg-white text-indigo-600 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Script Video (50 Kred)</span>
                  </button>
                </div>

                {/* Active Selector Block */}
                <div className="bg-white p-5 rounded-[1.5rem] border border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 elya-shadow-sm">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold block">Produk Sasaran Pembuatan Konten:</span>
                    <h4 className="font-extrabold text-sm text-indigo-600 mt-0.5">{activeProduct?.title}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500 font-mono bg-zinc-50 px-3 py-1.5 rounded-xl border border-zinc-200">Kredit Anda: 🪙 <b>{credits}</b></span>
                    <button 
                      onClick={() => setActiveTab('products')} 
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-bold font-mono ml-2 underline"
                    >
                      (Ganti Produk)
                    </button>
                  </div>
                </div>

                {/* SUB-SECTION 1: COPYWRITER */}
                {contentSubTab === 'copywriter' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Settings Form */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-5 elya-shadow-sm">
                      <h3 className="font-extrabold text-sm text-zinc-800 pb-2 border-b border-zinc-100">Pengaturan Copywriting</h3>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] text-zinc-400 block font-mono uppercase font-bold tracking-widest">Kanal Publikasi</label>
                        <CustomSelect 
                          value={copyChannel}
                          onChange={setCopyChannel}
                          options={[
                            { value: 'Instagram', label: 'Instagram Caption', icon: '📸' },
                            { value: 'WhatsApp', label: 'WhatsApp Group Broadcast', icon: '💬' },
                            { value: 'TikTok', label: 'TikTok Hook Script', icon: '🎵' },
                            { value: 'Facebook Ad', label: 'Facebook Ads Copy', icon: '🔥' }
                          ]}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] text-zinc-400 block font-mono uppercase font-bold tracking-widest">Gaya Nada Bicara (Tone)</label>
                        <CustomSelect 
                          value={copyTone}
                          onChange={setCopyTone}
                          options={[
                            { value: 'Ramah Bersahabat', label: 'Ramah Bersahabat (Casual)', icon: '😊' },
                            { value: 'Diskon Heboh', label: 'Promosi/Diskon Menggelegar (Hard Sell)', icon: '💥' },
                            { value: 'Professional Edukatif', label: 'Edukatif / Storytelling (Soft Sell)', icon: '🧠' },
                            { value: 'Humor Lokal', label: 'Lucu / Menggunakan Logat Gaul Lokal', icon: '🤣' }
                          ]}
                        />
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                        <span className="text-amber-700 flex items-center gap-1.5 font-bold">
                          <Coins className="w-4 h-4 text-amber-500" />
                          Tarif Generator:
                        </span>
                        <span className="font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg shadow-sm">10 Kredit</span>
                      </div>

                      <button 
                        onClick={triggerCopywriting}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 font-bold text-xs py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-md shadow-indigo-500/30 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Copywriting</span>
                      </button>
                    </div>

                    {/* Result Board */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 lg:col-span-2 space-y-5 elya-shadow">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <h3 className="font-extrabold text-sm text-zinc-800">Hasil Copywriting AI Agent</h3>
                        {activeCopywriting && (
                          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-3 py-1 rounded-full font-mono shadow-sm">DISIMPAN</span>
                        )}
                      </div>

                      {activeCopywriting ? (
                        <div className="space-y-5">
                          {/* Hooks array list */}
                          <div className="space-y-2.5">
                            <span className="text-xs uppercase font-bold text-indigo-600 font-mono tracking-wider block">Kalimat Pembuka Menarik (Hooks):</span>
                            <div className="grid grid-cols-1 gap-2.5">
                              {activeCopywriting.hooks.map((h, i) => (
                                <div key={i} className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-xs italic text-zinc-700">
                                  "{h}"
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Body Text */}
                          <div className="space-y-2">
                            <span className="text-xs uppercase font-bold text-zinc-500 font-mono tracking-wider block">Konten Caption Utama:</span>
                            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-xs text-zinc-800 whitespace-pre-line leading-relaxed select-all">
                              {activeCopywriting.bodyText}
                            </div>
                          </div>

                          {/* Hashtags and CTA */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                            <div className="space-y-2">
                              <span className="text-xs uppercase font-semibold text-zinc-500 font-mono block">Rekomendasi Tag (Hashtags):</span>
                              <div className="bg-white p-3 rounded-xl border border-zinc-200 text-xs font-mono text-indigo-600 flex flex-wrap gap-2 elya-shadow-sm">
                                {activeCopywriting.hashtags.map((h, i) => <span key={i} className="hover:underline">{h}</span>)}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <span className="text-xs uppercase font-semibold text-zinc-500 font-mono block">Call To Action (CTA):</span>
                              <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs font-bold text-indigo-800 elya-shadow-sm">
                                {activeCopywriting.callToAction}
                              </div>
                            </div>
                          </div>

                          {/* Direct simulator CTA */}
                          <div className="pt-5 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <span className="text-[11px] text-zinc-500 text-center sm:text-left">Copywriting ini otomatis masuk ke basis data konten.</span>
                            
                            <button 
                              onClick={() => {
                                const matched = savedContents.find(c => c.productId === activeProduct.id && c.type === 'copywriting');
                                if (matched) handleSimulatePost(matched, 'Instagram');
                              }}
                              className="bg-purple-500 hover:bg-purple-400 font-bold text-xs py-2.5 px-5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer text-white shadow-md shadow-purple-500/30 w-full sm:w-auto"
                            >
                              <Send className="w-4 h-4" />
                              <span>Langsung Simulasikan Posting</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-zinc-50 p-12 rounded-[2.5rem] text-center border border-zinc-100 py-20 space-y-4">
                          <FileText className="w-16 h-16 text-zinc-300 mx-auto" />
                          <div>
                            <span className="font-extrabold text-zinc-600 text-lg block">Belum ada copywriting</span>
                            <p className="text-sm text-zinc-500 mt-2">Konfigurasi materi promosi di bilah kiri lalu buat naskah lewat AI.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB-SECTION 2: PHOTOGRAPHER CANVA PLACARD */}
                {contentSubTab === 'photographer' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Style Preset Column */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-5 lg:col-span-4 elya-shadow-sm">
                      <h3 className="font-extrabold text-sm text-zinc-800 pb-2 border-b border-zinc-100">Studio Foto AI Preset</h3>

                      <div className="space-y-2">
                        <label className="text-[11px] text-zinc-400 block font-mono uppercase font-bold">Gaya Tema Latar Belakang</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'Studio Minimalist', name: 'Minimalis', color: 'bg-zinc-100 text-zinc-800' },
                            { id: 'Tropical Oasis', name: 'Hutan Tropis', color: 'bg-indigo-100 text-indigo-800' },
                            { id: 'Retro Vintage', name: 'Kertas Klasik', color: 'bg-amber-100 text-amber-800' },
                            { id: 'Cyberpunk Neon', name: 'Ungu Neon', color: 'bg-fuchsia-100 text-fuchsia-800' }
                          ].map(preset => (
                            <button
                              key={preset.id}
                              onClick={() => setPhotoStyle(preset.id as any)}
                              className={`p-3 rounded-2xl text-xs font-bold text-center border cursor-pointer transition-all ${
                                photoStyle === preset.id ? 'border-indigo-500 ring-2 ring-indigo-500/20 ' + preset.color : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:border-indigo-300'
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                        <span className="text-amber-700 flex items-center gap-1.5 font-bold">
                          <Coins className="w-4 h-4 text-amber-500" />
                          Tarif Generator:
                        </span>
                        <span className="font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg shadow-sm">20 Kredit</span>
                      </div>

                      <button 
                        onClick={triggerPhotographer}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 font-bold text-xs py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-md shadow-indigo-500/30 active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Rancang & Render Foto AI</span>
                      </button>

                      {/* Manual Photo Hint */}
                      {!activeProduct?.imageBlob && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-800 shadow-sm">
                          💡 <b>Tips UMKM:</b> Daftarkan foto produk asli di menu <b>Unggah Produk</b> agar AI secara otomatis melakukan penempelan produk (overlay) dalam bingkai kartu marketing ini!
                        </div>
                      )}
                    </div>

                    {/* Interactive Canvas Output Column */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 elya-shadow">
                      
                      {/* Left Block: Rendered Placard Canvas */}
                      <div className="flex flex-col items-center gap-5">
                        <div className="w-full max-w-[320px] bg-zinc-50 rounded-[2rem] p-3 border border-zinc-200 shadow-md overflow-hidden aspect-square">
                          <canvas 
                            ref={cardCanvasRef} 
                            style={{ width: '100%', height: '100%', display: activePhotoConcept ? 'block' : 'none' }}
                            className="rounded-xl shadow"
                          />
                          
                          {!activePhotoConcept && (
                            <div className="h-full w-full flex flex-col items-center justify-center text-center gap-4 p-6 py-20 text-zinc-400 bg-zinc-50 rounded-xl border border-dashed border-zinc-300">
                              <Camera className="w-12 h-12 text-zinc-300" />
                              <span className="text-xs font-bold text-zinc-500">Tampilan Foto Placard Kosong</span>
                              <p className="text-[11px] text-zinc-400 px-4">Klik tombol generate di sebelah kiri untuk merender foto studio secara instan!</p>
                            </div>
                          )}
                        </div>

                        {activePhotoConcept && (
                          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">
                            <button 
                              onClick={handleDownloadPlacard}
                              className="flex-1 bg-white border border-zinc-200 text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
                            >
                              <Download className="w-4 h-4 text-indigo-500" />
                              <span>Unduh Gambar</span>
                            </button>

                            <button 
                              onClick={() => {
                                const matched = savedContents.find(c => c.productId === activeProduct.id && c.type === 'photo');
                                if (matched) handleSimulatePost(matched, 'Instagram');
                              }}
                              className="flex-1 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-500/30 active:scale-95"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Posting Feed</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right Block: Content breakdown directives */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-extrabold text-zinc-800 border-b border-zinc-100 pb-3">Konsep & Riset Foto AI</h4>
                        
                        {activePhotoConcept ? (
                          <div className="space-y-4 text-xs">
                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 elya-shadow-sm">
                              <span className="text-[10px] text-indigo-600 font-bold block uppercase tracking-wider">Deskripsi Visual:</span>
                              <p className="text-zinc-700 mt-1.5 leading-relaxed">{activePhotoConcept.visualDescription}</p>
                            </div>

                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 elya-shadow-sm">
                              <span className="text-[10px] text-amber-500 font-bold block uppercase tracking-wider">Penataan & Arah Cahaya:</span>
                              <p className="text-zinc-700 mt-1.5 leading-relaxed">{activePhotoConcept.composition}</p>
                            </div>

                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 elya-shadow-sm">
                              <span className="text-[10px] text-blue-500 font-bold block uppercase tracking-wider">Rekomendasi Properti:</span>
                              <p className="text-zinc-700 mt-1.5 leading-relaxed">{activePhotoConcept.props}</p>
                            </div>

                            <div className="bg-zinc-50 p-3 rounded-xl text-[10px] font-mono text-zinc-500 select-all border border-zinc-200 border-dashed">
                              <b className="text-zinc-700">Prompt Inggris:</b> <span className="text-zinc-400">{activePhotoConcept.promptForGenerative}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-zinc-400 text-xs italic bg-zinc-50 p-4 rounded-2xl border border-zinc-100 text-center mt-6">Isi data studio di sebelah kiri untuk mengalirkan rekomendasi orisinalitas brand foto Anda.</p>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* SUB-SECTION 3: VIDEOGRAPHER STORYBOARD */}
                {contentSubTab === 'videographer' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Settings */}
                    <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-5 elya-shadow-sm">
                      <h3 className="font-extrabold text-sm text-zinc-800 pb-2 border-b border-zinc-100">Kreator Video Reels/TikTok AI</h3>
                      
                      <div className="space-y-2">
                        <label className="text-[11px] text-zinc-400 block font-mono uppercase font-bold tracking-widest">Tujuan Kampanye Video</label>
                        <CustomSelect 
                          value={videoObjective}
                          onChange={setVideoObjective}
                          options={[
                            { value: 'Pengenalan Produk (Unboxing)', label: 'Pengenalan Produk & Unboxing', icon: '📦' },
                            { value: 'Review Testimoni', label: 'Review & Testimoni Pelanggan', icon: '🌟' },
                            { value: 'Edukasi Solusi & Manfaat', label: 'Edukasi & Penyelesai Masalah', icon: '💡' }
                          ]}
                        />
                      </div>

                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-center justify-between text-xs">
                        <span className="text-amber-700 flex items-center gap-1.5 font-bold">
                          <Coins className="w-4 h-4 text-amber-500" />
                          Tarif Storyboard:
                        </span>
                        <span className="font-extrabold text-amber-600 bg-white px-2 py-1 rounded-lg shadow-sm">50 Kredit</span>
                      </div>

                      <button 
                        onClick={triggerVideographer}
                        className="w-full bg-indigo-500 hover:bg-indigo-400 font-bold text-xs py-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer text-white shadow-md shadow-indigo-500/30 active:scale-95"
                      >
                        <Video className="w-4 h-4" />
                        <span>Susun Naskah Video 30s</span>
                      </button>
                    </div>

                    {/* Right Storyboard scene outputs */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 lg:col-span-2 space-y-5 elya-shadow">
                      <h3 className="font-extrabold text-sm text-zinc-800 border-b border-zinc-100 pb-4">Storyboard Video Pendek 30 Detik</h3>

                      {activeVideoScript ? (
                        <div className="space-y-5">
                          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-xs shadow-sm">
                            <span className="text-[10px] text-indigo-600 font-bold block uppercase tracking-wider font-mono">Saran Musik Backsound:</span>
                            <p className="text-indigo-800 mt-1 font-semibold text-sm">🎵 {activeVideoScript.backsoundSuggestion}</p>
                          </div>

                          <div className="space-y-4">
                            <span className="text-xs font-bold text-zinc-500 block font-mono">Rencana Adegan (Scene by Scene):</span>
                            
                            {activeVideoScript.scenes.map((scene) => (
                              <div key={scene.sceneId} className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-3 hover:border-indigo-300 transition-colors elya-shadow-hover">
                                <div className="flex items-center justify-between">
                                  <span className="bg-white text-indigo-600 border border-zinc-200 text-[10px] px-3 py-1 rounded-full font-bold shadow-sm">
                                    Adegan {scene.sceneId}
                                  </span>
                                  <span className="text-xs text-zinc-400 font-mono italic">{scene.time}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-zinc-200">
                                  <div>
                                    <span className="text-zinc-400 font-bold text-[10px] uppercase block tracking-wider">Visual / Rekaman HP:</span>
                                    <p className="text-zinc-700 mt-1.5 leading-relaxed">{scene.visual}</p>
                                  </div>
                                  <div>
                                    <span className="text-zinc-400 font-bold text-[10px] uppercase block tracking-wider">Suara / Voiceover (VO):</span>
                                    <p className="text-indigo-600 mt-1.5 leading-relaxed italic font-medium">"{scene.audio}"</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-zinc-50 p-12 rounded-[2.5rem] text-center border border-zinc-100 py-20 space-y-6">
                          <Video className="w-20 h-20 text-indigo-200 mx-auto" />
                          <div>
                            <span className="font-extrabold text-zinc-800 text-xl block">Belum ada Storyboard Video</span>
                            <p className="text-sm text-zinc-500 mt-3 leading-relaxed max-w-xs mx-auto">Minta AI menjabarkan naskah video TikTok berdurasi 30 detik untuk di-shoot mandiri.</p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* SCREEN 5: SIMULASI POSTING DAN FEED SOSIAL MEDIA */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-indigo-500 font-bold text-sm flex items-center justify-center text-white mb-0.5 shadow-md shadow-indigo-500/30">4</span>
                    Simulasi Penerbitan & Post Facebook / IG / TikTok
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Uji pratinjau tampilan feed media sosial Anda secara digital dan saksikan grafik tayangannya melesat secara organik.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left list: Saved Content Generator database to select for posting */}
                  <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-5 elya-shadow-sm">
                    <h3 className="font-extrabold text-sm text-zinc-800 pb-2 border-b border-zinc-100">Materi Siap Posting</h3>
                    <p className="text-[11px] text-zinc-500">Materi di bawah bersumber dari hasil cetak copywriting atau foto AI Anda pada Step 3.</p>

                    {savedContents.length === 0 ? (
                      <div className="bg-zinc-50 p-6 rounded-2xl text-center text-zinc-500 border border-zinc-200 border-dashed py-10 space-y-4">
                        <FileText className="w-10 h-10 mx-auto text-zinc-300" />
                        <span className="text-sm font-bold block text-zinc-700">Koleksi konten kosong</span>
                        <p className="text-xs text-zinc-500 px-4 leading-relaxed">Kembali ke tab <b>Buat Konten</b> dan generate copywriting atau foto pertama Anda.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {savedContents.map(content => {
                          const associatedProd = products.find(p => p.id === content.productId);
                          return (
                            <div key={content.id} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 space-y-3 hover:border-indigo-300 transition-colors elya-shadow-hover">
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="text-[8px] bg-white border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded font-mono block shadow-sm">
                                    PROD: {associatedProd?.title || 'Umum'}
                                  </span>
                                  <h4 className="font-extrabold text-xs text-zinc-800 mt-1.5">{content.title}</h4>
                                </div>
                                <span className={`text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full shadow-sm ${
                                  content.type === 'copywriting' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                }`}>
                                  {content.type}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-200">
                                <button 
                                  onClick={() => handleSimulatePost(content, 'Instagram')}
                                  className="bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 font-bold text-[10px] py-1.5 px-2 rounded-full text-center cursor-pointer transition-colors shadow-sm"
                                >
                                  IG Feed
                                </button>
                                <button 
                                  onClick={() => handleSimulatePost(content, 'WhatsApp')}
                                  className="bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 font-bold text-[10px] py-1.5 px-2 rounded-full text-center cursor-pointer transition-colors shadow-sm"
                                >
                                  WhatsApp
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right feed: Simulated feed stream */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 space-y-6 elya-shadow">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                        <div>
                          <h3 className="font-extrabold text-sm text-zinc-800">Galeri Promosi & Metrik Ticker</h3>
                          <p className="text-[11px] text-zinc-500 mt-0.5">Hitung seberapa banyak likes dan simulated sales yang dihasilkan dari taktik marketing AI Anda.</p>
                        </div>
                        {simulatedPosts.length > 0 && (
                          <button 
                            onClick={handleClearSimulationHistory}
                            className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1.5 font-mono bg-rose-50 px-3 py-1.5 rounded-full"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Bersihkan Feed
                          </button>
                        )}
                      </div>

                      {simulatedPosts.length === 0 ? (
                        <div className="p-16 text-center text-zinc-400 bg-zinc-50 rounded-[2rem] border border-zinc-200 border-dashed py-24 space-y-6 shadow-sm">
                          <Send className="w-20 h-20 text-indigo-200 mx-auto" />
                          <div>
                            <span className="font-extrabold text-zinc-800 text-xl block">Belum ada Simulasi Posting</span>
                            <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-3 leading-relaxed">Gunakan berkas konten siap pakai di sebelah kiri, lalu mulailah simulasikan penerbitan perdana Anda.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {simulatedPosts.map(post => (
                            <div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-zinc-200 grid grid-cols-1 md:grid-cols-12 elya-shadow-sm">
                              
                              {/* Post preview left image */}
                              <div className="md:col-span-4 bg-zinc-50 p-4 border-b md:border-b-0 md:border-r border-zinc-200 flex items-center justify-center">
                                {post.imageUrl ? (
                                  <img src={post.imageUrl} alt="Post content" className="max-h-[160px] object-contain rounded-xl border border-zinc-200 shadow-sm" />
                                ) : (
                                  <div className="w-[120px] h-[120px] rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-center p-3 gap-2 shadow-sm border border-indigo-100">
                                    <ShoppingBag className="w-10 h-10 text-indigo-400" />
                                    <span className="text-[9px] uppercase font-bold text-indigo-600 font-mono">{post.platform}</span>
                                  </div>
                                )}
                              </div>

                              {/* Post data right */}
                              <div className="md:col-span-8 p-5 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">M</div>
                                      <span className="text-xs font-extrabold text-zinc-800">UMKM {post.productName}</span>
                                    </div>
                                    <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold font-mono px-2.5 py-1 rounded-full shadow-sm">
                                      {post.platform.toUpperCase()}
                                    </span>
                                  </div>
                                  
                                  <p className="text-[11px] text-zinc-600 font-sans whitespace-pre-line leading-relaxed max-h-[110px] overflow-y-auto bg-zinc-50 p-3 rounded-xl border border-zinc-200 select-all">
                                    {post.caption}
                                  </p>
                                </div>

                                {/* Simulated organic live metrics and revenue counter */}
                                <div className="mt-5 pt-4 border-t border-zinc-100">
                                  <div className="grid grid-cols-4 gap-3 text-center">
                                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 shadow-sm">
                                      <span className="text-[9px] text-zinc-500 uppercase font-mono block font-bold">Tayangan (Views)</span>
                                      <span className="text-sm font-black text-zinc-800 mt-1 block flex items-center justify-center gap-1 font-mono">
                                        <Eye className="w-3.5 h-3.5 text-zinc-400" /> {post.views}
                                      </span>
                                    </div>

                                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 shadow-sm">
                                      <span className="text-[9px] text-zinc-500 uppercase font-mono block font-bold">Saran Suka (Likes)</span>
                                      <span className="text-sm font-black text-rose-500 mt-1 block flex items-center justify-center gap-1 font-mono">
                                        <Heart className="w-3.5 h-3.5 text-rose-500" /> {post.likes}
                                      </span>
                                    </div>

                                    <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 shadow-sm">
                                      <span className="text-[9px] text-zinc-500 uppercase font-mono block font-bold">Simulasi Checkout</span>
                                      <span className="text-sm font-black text-indigo-600 mt-1 block font-mono">
                                        🛒 {post.sales}
                                      </span>
                                    </div>

                                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-sm">
                                      <span className="text-[9px] text-amber-700 uppercase font-mono block font-bold">Kas Masuk</span>
                                      <span className="text-sm font-black text-amber-600 mt-1 block font-mono">
                                        +{post.sales * (activeProduct?.price || 25000) > 0 ? `Rp ${(post.sales * (activeProduct?.price || 25000)).toLocaleString('id-ID')}` : 'Rp 0'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="mt-3 flex justify-between items-center text-[10px] text-zinc-500 font-bold">
                                    <span>Penerbitan Terjadwal {post.createdAt}</span>
                                    <span className="flex items-center gap-1 text-indigo-500 font-black font-mono">
                                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                                      DIPANTAU AKTIF
                                    </span>
                                  </div>
                                </div>

                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* SCREEN 6: CREDIT WALLET AND TOP-UP TRANS */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-800">Dompet Debit Kredit AI Agent</h1>
                  <p className="text-zinc-500 text-sm mt-1">Setiap penugasan generator AI (Copywriter, Foto, Video) memakan biaya server internal. Kelola saldo Anda demi kelancaran promosi.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  
                  {/* Left block: Current Credit display & Top Up purchase list */}
                  <div className="bg-white p-6 rounded-3xl border border-zinc-100 space-y-6 lg:col-span-1 elya-shadow-sm">
                    
                    {/* Golden card */}
                    <div className="bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 p-5 rounded-xl text-zinc-950 font-sans shadow-xl border border-amber-300/20 relative overflow-hidden">
                      {/* background coin decor */}
                      <div className="absolute right-0 bottom-0 tranzinc-x-5 tranzinc-y-5 opacity-10">
                        <Coins className="w-40 h-40" />
                      </div>
                      
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#451a03]">DEMELO CREDIT CARD</span>
                      <h3 className="text-4xl font-black mt-2 tracking-tight flex items-center gap-2">
                        🪙 {credits}
                      </h3>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block font-bold text-[#4c1d0f]/80">ID MEMBER</span>
                          <span className="font-mono text-xs font-bold text-black/80">DM-UMKM-{activeProduct ? activeProduct.id.slice(5, 10).toUpperCase() : 'MAIN'}</span>
                        </div>
                        <span className="bg-neutral-900 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded border border-amber-400 tracking-widest uppercase shadow">
                          PREMIUM
                        </span>
                      </div>
                    </div>

                    {/* Packages Top-Up list */}
                    <div className="space-y-4">
                      <h3 className="font-extrabold text-sm text-zinc-800">Isi Ulang Paket Kredit</h3>
                      <p className="text-[11px] text-zinc-500">Makin besar paket top up, makin besar bonus kredit bonus yang Anda kantongi selaku mitra vendor.</p>

                      <div className="space-y-3">
                        {[
                          { id: 'pkg-1', name: 'UMKM Pemula', price: 50000, credits: 300, desc: 'Ideal untuk copywriting dasar 30x generate' },
                          { id: 'pkg-2', name: 'UMKM Berkembang', price: 100000, credits: 700, desc: 'Terlaris! Cocok untuk unboxing klip & desain layout' },
                          { id: 'pkg-3', name: 'UMKM Sukses', price: 500000, credits: 3500, desc: 'Rekomendasi vendor UMKM dengan 3500 kredit lancar jaya!' }
                        ].map(pkg => (
                          <div 
                            key={pkg.id}
                            className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all flex items-center justify-between gap-4 elya-shadow-sm"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-zinc-800">{pkg.name}</span>
                                {pkg.price === 500000 && <span className="bg-amber-100 text-amber-700 text-[9px] px-2 rounded-full py-0.5 font-bold font-mono">MITRA MAKMUR</span>}
                              </div>
                              <p className="text-[10px] text-zinc-500">{pkg.desc}</p>
                              <span className="text-xs font-black text-amber-600 block pt-1.5">Rp {pkg.price.toLocaleString('id-ID')}</span>
                            </div>

                            <button 
                              onClick={() => handleBuyClick(pkg)}
                              className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl active:scale-95 transition-transform shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/30"
                            >
                              <span>Beli ({pkg.credits} Kred)</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right block: Transaction LEDGERS ledger */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 lg:col-span-2 space-y-5 elya-shadow">
                    <h3 className="font-extrabold text-sm text-zinc-800 border-b border-zinc-100 pb-4">Riwayat Transaksi Dompet</h3>

                    <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
                      {transactions.map(tx => (
                        <div key={tx.id} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex items-center justify-between text-xs hover:border-indigo-200 transition-colors">
                          <div className="space-y-1">
                            <span className="font-bold text-zinc-800 block">{tx.description}</span>
                            <span className="text-[10px] text-zinc-400 block font-mono">{tx.date}</span>
                          </div>
                          
                          <div className="text-right">
                            {tx.type === 'gain' ? (
                              <span className="text-indigo-600 font-black text-sm">+{tx.amount} Kredit</span>
                            ) : (
                              <span className="text-rose-500 font-black text-sm">-{tx.amount} Kredit</span>
                            )}
                            <span className="text-[9px] text-zinc-400 block uppercase font-mono mt-0.5">TERENKRIPSI</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* INDONESIAN PREMIUM TOPUP SIMULATOR MODAL */}
      {showTopupModal && selectedPackage && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-zinc-200 max-w-md w-full p-8 space-y-6 relative elya-shadow">
            <button onClick={closePaymentFlow} className="absolute right-5 top-5 p-2 hover:bg-zinc-100 rounded-full text-zinc-400 transition-colors">
              <X className="w-5 h-5" />
            </button>

            {payingStep === 'qris' && (
              <div className="text-center space-y-5">
                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase font-mono">
                  SocioAgen payment Gateway Simulator
                </span>
                
                <div>
                  <h3 className="font-extrabold text-xl text-zinc-800">Metode Pembayaran QRIS / Instan</h3>
                  <p className="text-xs text-zinc-500 mt-2">Selesaikan transfer untuk Paket <b className="text-zinc-700">{selectedPackage.name}</b> senilai <b className="text-zinc-700">Rp {selectedPackage.price.toLocaleString('id-ID')}</b></p>
                </div>

                {/* Simulated QRIS QR block */}
                <div className="bg-white p-5 rounded-2xl inline-block shadow-lg mx-auto border-2 border-indigo-500/35">
                  <div className="w-44 h-44 bg-zinc-50 rounded-xl flex items-center justify-center relative flex-col gap-2 mx-auto">
                    {/* Simulated visual QRIS image */}
                    <div className="bg-rose-500 text-white font-bold text-[10px] px-2.5 py-0.5 uppercase tracking-widest rounded absolute top-2 shadow-sm">
                      QRIS
                    </div>
                    {/* Icon mockup */}
                    <div className="w-20 h-20 rounded-xl border-2 border-zinc-300 border-dashed flex items-center justify-center font-mono font-bold text-zinc-400 text-xs mt-3">
                      [MOCK QR]
                    </div>
                    <span className="text-[9px] text-zinc-400 font-bold block pt-1 uppercase">GPN INDONESIA BANANA</span>
                  </div>
                </div>

                <p className="text-xs text-amber-600 max-w-xs mx-auto">Tersedia bank transfer Mandiri Virtual Account, BCA, BRI, Gopay, OVO secara otomatis terverifikasi sistem.</p>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    onClick={handleSimulatePaymentSuccess}
                    className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs py-3.5 rounded-full shadow-md shadow-indigo-500/30 active:scale-95 transition-transform cursor-pointer uppercase tracking-wider"
                  >
                    Simulasikan Pembayaran Berhasil ✅
                  </button>
                  <button onClick={closePaymentFlow} className="text-xs font-bold text-zinc-400 hover:text-zinc-600">
                    Batalkan Top Up
                  </button>
                </div>
              </div>
            )}

            {payingStep === 'success' && (
              <div className="text-center space-y-5 py-8">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-100 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle className="w-10 h-10 text-indigo-500" />
                </div>

                <div>
                  <h3 className="font-extrabold text-2xl text-zinc-800">Pembayaran Sukses! 🎉</h3>
                  <p className="text-sm text-zinc-500 mt-2">Server telah mendeteksi dana masuk. Kredit Anda berhasil ditambahkan.</p>
                </div>

                <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 elya-shadow-sm">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-bold">Tambahan Kredit</span>
                    <span className="font-extrabold text-indigo-600 text-sm">+{selectedPackage.credits} Kredit</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-zinc-200">
                    <span className="text-zinc-500 font-bold">Total Saldo Baru</span>
                    <span className="font-extrabold text-zinc-800 text-sm">🪙 {credits} Kredit</span>
                  </div>
                </div>

                <button 
                  onClick={closePaymentFlow}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm py-3.5 rounded-full transition-transform active:scale-95 cursor-pointer shadow-md shadow-indigo-500/30"
                >
                  Kembali ke Dompet / Generator
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 px-1 py-1.5 z-40 flex justify-around items-center h-16 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] transition-shadow">
        <button
          onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center flex-1 h-12 text-center transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mx-auto" />
          <span className="text-[9px] mt-1 font-semibold leading-none">Beranda</span>
        </button>
        
        <button
          onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center flex-1 h-12 text-center transition-colors cursor-pointer ${
            activeTab === 'products' ? 'text-indigo-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Package className="w-5 h-5 mx-auto" />
          <span className="text-[9px] mt-1 font-semibold leading-none">Produk</span>
        </button>

        <button
          onClick={() => { setActiveTab('analysis'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center flex-1 h-12 text-center transition-colors cursor-pointer ${
            activeTab === 'analysis' ? 'text-indigo-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Brain className="w-5 h-5 mx-auto" />
          <span className="text-[9px] mt-1 font-semibold leading-none">Analisa</span>
        </button>

        <button
          onClick={() => { setActiveTab('content'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center flex-1 h-12 text-center transition-colors cursor-pointer ${
            activeTab === 'content' ? 'text-indigo-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Sparkles className="w-5 h-5 mx-auto" />
          <span className="text-[9px] mt-1 font-semibold leading-none">Buat Konten</span>
        </button>

        <button
          onClick={() => { setActiveTab('posts'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center flex-1 h-12 text-center transition-colors cursor-pointer ${
            activeTab === 'posts' ? 'text-indigo-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Send className="w-5 h-5 mx-auto" />
          <span className="text-[9px] mt-1 font-semibold leading-none">Posting</span>
        </button>

        <button
          onClick={() => { setActiveTab('wallet'); setMobileMenuOpen(false); }}
          className={`flex flex-col items-center justify-center flex-1 h-12 text-center transition-colors cursor-pointer ${
            activeTab === 'wallet' ? 'text-indigo-600 font-extrabold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Coins className={`w-5 h-5 mx-auto ${activeTab === 'wallet' ? 'text-amber-500' : 'text-zinc-400'}`} />
          <span className="text-[9px] mt-1 font-semibold leading-none">Dompet</span>
        </button>
      </div>

    </div>
  );
}
