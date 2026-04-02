/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, 
  FileText, 
  Globe, 
  Package, 
  ShieldCheck, 
  Ship, 
  Truck, 
  ArrowRight,
  Mail,
  Building2,
  Scale,
  Zap,
  Image as ImageIcon,
  Video as VideoIcon,
  Plus,
  Trash2,
  Settings,
  X,
  Play,
  LayoutDashboard,
  Eye,
  Phone,
  ArrowUp,
  Lock,
  Info,
  ShoppingCart,
  Search,
  Users
} from "lucide-react";
import { useState, useEffect, FormEvent, ReactNode } from "react";
import Lightbox from "yet-another-react-lightbox";
import VideoPlugin from "yet-another-react-lightbox/plugins/video";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { INITIAL_PHOTOS, INITIAL_VIDEOS } from "./constants";
import { Photo, Video, Lead } from "./types";
import { translations, Language } from "./translations";

const HERO_BANNER_IMAGES = [
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster6.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/tonghop.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/hatdieu.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/chanh.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/cafe.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster7.jpg",
];

const PROMO_POSTERS = [
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster6.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/tonghop.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/hatdieu.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/chanh.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/cafe.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster7.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster1.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster3.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster4.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster5.jpg" },
  { src: "https://ducphuongmedical.com/hinhanh/XuatKhau/poster8.jpg" },
];

const ABOUT_BANNER_IMAGES = [
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster1.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster3.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster4.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster5.jpg",
];

const LOGISTICS_BANNER_IMAGES = [
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster3.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster4.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster5.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster6.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster7.jpg",
  "https://ducphuongmedical.com/hinhanh/XuatKhau/poster8.jpg",
];

// --- Design Recipe: Professional B2B Export ---
// Combining Recipe 11 (Split Layout Hero) and Recipe 1 (Technical Data Grids)

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [heroLightboxIndex, setHeroLightboxIndex] = useState(-1);
  const [aboutLightboxIndex, setAboutLightboxIndex] = useState(-1);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [aboutSlideIndex, setAboutSlideIndex] = useState(0);
  const [logisticsSlideIndex, setLogisticsSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"photos" | "videos" | "leads" | "products">("photos");
  const [productImages, setProductImages] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tajermy-product-images");
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [selectedSection, setSelectedSection] = useState<{ title: string; content: ReactNode } | null>(null);
  const [theme, setTheme] = useState<"green" | "red" | "orange">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tajermy-theme");
      return (saved as "green" | "red" | "orange") || "green";
    }
    return "green";
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tajermy-lang");
      return (saved as Language) || "en";
    }
    return "en";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [promoLightboxIndex, setPromoLightboxIndex] = useState(-1);
  const [showBottomLeftPopup, setShowBottomLeftPopup] = useState(false);
  const [hasShownScrollPopup, setHasShownScrollPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem("tajermy-theme", theme);
    document.documentElement.classList.remove("theme-red", "theme-orange");
    if (theme === "red") {
      document.documentElement.classList.add("theme-red");
    } else if (theme === "orange") {
      document.documentElement.classList.add("theme-orange");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tajermy-lang", language);
  }, [language]);

  useEffect(() => {
    const savedLeads = localStorage.getItem("tajermy-leads");
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tajermy-leads", JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem("tajermy-product-images", JSON.stringify(productImages));
  }, [productImages]);

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_BANNER_IMAGES.length);
    }, 5000);
    const aboutInterval = setInterval(() => {
      setAboutSlideIndex((prev) => (prev + 1) % ABOUT_BANNER_IMAGES.length);
    }, 5000);
    const logisticsInterval = setInterval(() => {
      setLogisticsSlideIndex((prev) => (prev + 1) % LOGISTICS_BANNER_IMAGES.length);
    }, 5000);
    return () => {
      clearInterval(heroInterval);
      clearInterval(aboutInterval);
      clearInterval(logisticsInterval);
    };
  }, []);

  const t = translations[language];

  const PRODUCTS = [
    {
      id: "p1",
      name: language === "vi" ? "Chanh Không Hạt" : language === "en" ? "Seedless Lime" : "Citron sans pépins",
      image: productImages["p1"] || "https://ducphuongmedical.com/hinhanh/XuatKhau/chanh.jpg",
      description: language === "vi" ? "Chanh không hạt vỏ mỏng, mọng nước, đạt tiêu chuẩn xuất khẩu GlobalG.A.P." : language === "en" ? "Thin-skinned, juicy seedless limes, meeting GlobalG.A.P. export standards." : "Citrons sans pépins à peau fine, juteux, répondant aux normes d'exportation GlobalG.A.P.",
      specs: [
        { label: language === "vi" ? "Kích cỡ (Size)" : language === "en" ? "Size" : "Taille", value: "10-12-14-16 quả/kg" },
        { label: language === "vi" ? "Đóng gói" : language === "en" ? "Packaging" : "Emballage", value: "Thùng carton 4kg/8kg/10kg" },
        { label: language === "vi" ? "Nhiệt độ bảo quản" : language === "en" ? "Storage Temp" : "Température de stockage", value: "5°C - 8°C" },
        { label: language === "vi" ? "Dư lượng thuốc BVTV" : language === "en" ? "Pesticide Residue" : "Résidus de pesticides", value: "Đạt chuẩn MRLs của EU/Mỹ" }
      ]
    },
    {
      id: "p2",
      name: language === "vi" ? "Thanh Long (Ruột Trắng/Đỏ)" : language === "en" ? "Dragon Fruit (White/Red)" : "Fruit du Dragon (Blanc/Rouge)",
      image: productImages["p2"] || "https://ducphuongmedical.com/hinhanh/XuatKhau/tonghop.jpg",
      description: language === "vi" ? "Thanh long Bình Thuận tươi ngon, vỏ đỏ bóng, tai xanh, vị ngọt thanh." : language === "en" ? "Fresh Binh Thuan dragon fruit, shiny red skin, green ears, sweet taste." : "Fruit du dragon frais de Binh Thuan, peau rouge brillante, oreilles vertes, goût sucré.",
      specs: [
        { label: language === "vi" ? "Kích cỡ (Size)" : language === "en" ? "Size" : "Taille", value: "350g - 450g | 450g - 600g" },
        { label: language === "vi" ? "Đóng gói" : language === "en" ? "Packaging" : "Emballage", value: "Thùng carton 5kg/10kg" },
        { label: language === "vi" ? "Nhiệt độ bảo quản" : language === "en" ? "Storage Temp" : "Température de stockage", value: "3°C - 5°C" },
        { label: language === "vi" ? "Thời hạn bảo quản" : language === "en" ? "Shelf Life" : "Durée de conservation", value: "4-6 tuần trong kho lạnh" }
      ]
    },
    {
      id: "p3",
      name: language === "vi" ? "Hạt Điều Nhân" : language === "en" ? "Cashew Kernels" : "Noix de Cajou",
      image: productImages["p3"] || "https://ducphuongmedical.com/hinhanh/XuatKhau/hatdieu.jpg",
      description: language === "vi" ? "Hạt điều Bình Phước loại 1, giòn béo, đạt tiêu chuẩn AFI." : language === "en" ? "Grade 1 Binh Phuoc cashews, crunchy and fatty, meeting AFI standards." : "Noix de cajou de Binh Phuoc de grade 1, croquantes et grasses, répondant aux normes AFI.",
      specs: [
        { label: language === "vi" ? "Phân loại" : language === "en" ? "Grade" : "Grade", value: "W240, W320, W450" },
        { label: language === "vi" ? "Độ ẩm" : language === "en" ? "Moisture" : "Humidité", value: "Dưới 5%" },
        { label: language === "vi" ? "Tỷ lệ hạt lỗi" : language === "en" ? "Defect Rate" : "Taux de défauts", value: "Dưới 1%" },
        { label: language === "vi" ? "Đóng gói" : language === "en" ? "Packaging" : "Emballage", value: "Túi hút chân không 25lb/50lb" }
      ]
    },
    {
      id: "p4",
      name: language === "vi" ? "Cà Phê Nhân Xanh" : language === "en" ? "Green Coffee Beans" : "Grains de Café Vert",
      image: productImages["p4"] || "https://ducphuongmedical.com/hinhanh/XuatKhau/cafe.jpg",
      description: language === "vi" ? "Robusta & Arabica từ Tây Nguyên, sàng 18, chế biến ướt/khô." : language === "en" ? "Robusta & Arabica from Central Highlands, screen 18, wet/dry processed." : "Robusta & Arabica des hauts plateaux du centre, crible 18, traité par voie humide/sèche.",
      specs: [
        { label: language === "vi" ? "Độ ẩm" : language === "en" ? "Moisture" : "Humidité", value: "Tối đa 12.5%" },
        { label: language === "vi" ? "Tỷ lệ tạp chất" : language === "en" ? "Impurities" : "Impuretés", value: "Tối đa 0.5%" },
        { label: language === "vi" ? "Tỷ lệ hạt đen/vỡ" : language === "en" ? "Black/Broken" : "Noir/Cassé", value: "Tối đa 1%" },
        { label: language === "vi" ? "Đóng gói" : language === "en" ? "Packaging" : "Emballage", value: "Bao đay 60kg" }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (window.scrollY / scrollHeight) * 100;
      
      if (scrollPercentage >= 40 && !hasShownScrollPopup) {
        setShowBottomLeftPopup(true);
        setHasShownScrollPopup(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasShownScrollPopup]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    product: language === "vi" ? "Chanh không hạt" : language === "en" ? "Seedless Lime" : "Citron sans pépins",
    volume: "",
    message: ""
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      product: language === "vi" ? "Chanh không hạt" : language === "en" ? "Seedless Lime" : "Citron sans pépins"
    }));
  }, [language]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setLeads([newLead, ...leads]);
    
    // Call the server API to send email
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error("Failed to send quote request to server:", error);
    }

    setShowSuccessPopup(true);
    setFormData({ 
      name: "", 
      email: "", 
      product: language === "vi" ? "Chanh không hạt" : language === "en" ? "Seedless Lime" : "Citron sans pépins", 
      volume: "", 
      message: "" 
    });
  };

  const updateLeadStatus = (id: string, status: Lead['status']) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const deleteLead = (id: string) => {
    if (confirm(t.admin.confirmDelete)) {
      setLeads(leads.filter(l => l.id !== id));
    }
  };

  // Admin Handlers
  const addPhoto = () => {
    const url = prompt(t.admin.promptPhoto);
    if (url) {
      setPhotos([...photos, { id: Date.now().toString(), url, title: t.admin.newPhoto }]);
    }
  };

  const deletePhoto = (id: string) => {
    if (confirm(t.admin.confirmDelete)) {
      setPhotos(photos.filter(p => p.id !== id));
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const addVideo = () => {
    const url = prompt(t.admin.promptVideo);
    if (url) {
      const videoId = getYouTubeId(url);
      if (videoId) {
        setVideos([...videos, { 
          id: Date.now().toString(), 
          url, 
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, 
          title: t.admin.newVideo 
        }]);
      } else {
        alert(t.admin.invalidVideo);
      }
    }
  };

  const deleteVideo = (id: string) => {
    if (confirm(t.admin.confirmDelete)) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const slides = [
    ...photos.map(p => ({ src: p.url, title: p.title })),
    ...videos.map(v => {
      const videoId = getYouTubeId(v.url);
      return {
        type: "youtube",
        title: v.title,
        poster: v.thumbnail,
        src: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
      };
    })
  ];

  if (isAdmin) {
    return (
      <div className={`min-h-screen bg-brand-bg font-sans ${theme === "red" ? "theme-red" : theme === "orange" ? "theme-orange" : ""}`}>
        {/* Admin Header */}
        <nav className="bg-white border-b border-brand-border px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-brand-primary" />
            <span className="font-bold text-lg tracking-tight">{t.admin.dashboard}</span>
          </div>
          <button 
            onClick={() => setIsAdmin(false)}
            className="flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-ink transition-colors"
          >
            <Eye size={18} /> {t.admin.viewHome}
          </button>
        </nav>

        <main className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{t.admin.manageLibrary}</h1>
              <p className="text-brand-muted">{t.admin.manageLibraryDesc}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-brand-border">
            <button 
              onClick={() => setActiveTab("photos")}
              className={`pb-4 px-2 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "photos" ? "text-brand-primary border-b-2 border-brand-primary" : "text-brand-faint"}`}
            >
              <ImageIcon size={18} />
              {t.gallery.photos} ({photos.length})
            </button>
            <button 
              onClick={() => setActiveTab("videos")}
              className={`pb-4 px-2 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "videos" ? "text-brand-primary border-b-2 border-brand-primary" : "text-brand-faint"}`}
            >
              <VideoIcon size={18} />
              {t.gallery.videos} ({videos.length})
            </button>
            <button 
              onClick={() => setActiveTab("leads")}
              className={`pb-4 px-2 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "leads" ? "text-brand-primary border-b-2 border-brand-primary" : "text-brand-faint"}`}
            >
              <Users size={18} />
              {t.admin.leads} ({leads.length})
            </button>
            <button 
              onClick={() => setActiveTab("products")}
              className={`pb-4 px-2 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "products" ? "text-brand-primary border-b-2 border-brand-primary" : "text-brand-faint"}`}
            >
              <Package size={18} />
              {t.admin.products} ({PRODUCTS.length})
            </button>
          </div>

          {activeTab === "photos" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <button 
                onClick={addPhoto}
                className="aspect-square border-2 border-dashed border-brand-border rounded-2xl flex flex-col items-center justify-center gap-2 text-brand-faint hover:border-brand-primary hover:text-brand-primary transition-all bg-white"
              >
                <Plus size={32} />
                <span className="text-xs font-bold uppercase">{t.admin.addPhoto}</span>
              </button>
              {photos.map(photo => (
                <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-brand-border shadow-sm">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => deletePhoto(photo.id)}
                      className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "videos" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={addVideo}
                className="aspect-video border-2 border-dashed border-brand-border rounded-2xl flex flex-col items-center justify-center gap-2 text-brand-faint hover:border-brand-primary hover:text-brand-primary transition-all bg-white"
              >
                <Plus size={32} />
                <span className="text-xs font-bold uppercase">{t.admin.addVideo}</span>
              </button>
              {videos.map(video => (
                <div key={video.id} className="group relative aspect-video rounded-2xl overflow-hidden bg-white border border-brand-border shadow-sm">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => deleteVideo(video.id)}
                      className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-bold truncate">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === "products" ? (
            <div className="bg-white rounded-[2rem] border border-brand-border overflow-hidden shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PRODUCTS.map(product => (
                  <div key={product.id} className="flex gap-6 p-6 rounded-2xl border border-brand-border hover:border-brand-primary transition-all group">
                    <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 border border-brand-border">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h4 className="font-bold text-brand-ink">{product.name}</h4>
                        <p className="text-xs text-brand-muted line-clamp-2">{product.description}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-faint">{t.admin.productImage}</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            defaultValue={product.image}
                            onBlur={(e) => {
                              if (e.target.value !== product.image) {
                                setProductImages(prev => ({ ...prev, [product.id]: e.target.value }));
                              }
                            }}
                            className="flex-1 bg-brand-light/50 border border-brand-border rounded-lg px-3 py-2 text-xs outline-none focus:border-brand-primary transition-all"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-brand-border overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-light/30 border-b border-brand-border">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">{t.admin.leadDate}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">{t.admin.leadName}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">{t.admin.leadProduct}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">{t.admin.leadVolume}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">{t.admin.leadMessage}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted">{t.admin.leadStatus}</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-brand-muted text-right">{t.admin.leadStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {leads.length > 0 ? (
                      leads.map(lead => (
                        <tr key={lead.id} className="hover:bg-brand-light/10 transition-colors">
                          <td className="px-6 py-4 text-sm text-brand-muted whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-brand-ink">{lead.name}</div>
                            <div className="text-xs text-brand-muted">{lead.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-brand-ink">{lead.product}</td>
                          <td className="px-6 py-4 text-sm text-brand-ink">{lead.volume}</td>
                          <td className="px-6 py-4 text-sm text-brand-muted max-w-xs truncate" title={lead.message}>
                            {lead.message}
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                              className={`text-xs font-bold px-3 py-1 rounded-full border outline-none transition-all ${
                                lead.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                lead.status === 'contacted' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                'bg-green-50 text-green-600 border-green-200'
                              }`}
                            >
                              <option value="new">{t.admin.statusNew}</option>
                              <option value="contacted">{t.admin.statusContacted}</option>
                              <option value="closed">{t.admin.statusClosed}</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => deleteLead(lead.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center text-brand-muted italic">
                          {t.admin.noLeads}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-brand-light selection:text-brand-primary ${theme === "red" ? "theme-red" : theme === "orange" ? "theme-orange" : ""} bg-brand-bg text-brand-ink`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-brand-primary backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
          <img 
            src="https://ducphuongmedical.com/hinhanh/Chanh/Hinh/logo_tajermy.png" 
            alt="TAJERMY Logo" 
            className="h-10 w-auto object-contain" 
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col leading-none hidden sm:flex">
            <div className="text-2xl font-bold tracking-tighter text-white">
              TAJERMY<span className="text-brand-accent">.</span>
            </div>
            <div className="text-[10px] font-medium tracking-widest text-white/70 uppercase">
              B2B Agricultural Export
            </div>
          </div>
        </div>
        <div className="hidden md:flex gap-2 text-sm font-medium uppercase tracking-wider text-white/80">
          <a href="#about" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all">{t.nav.about}</a>
          <a href="#products" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all">{t.nav.products}</a>
          <a href="#gallery" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all">{t.nav.gallery}</a>
          <a href="#logistics" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all">{t.nav.logistics}</a>
          <a href="#docs" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all">{t.nav.docs}</a>
          <a href="#quote" className="px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-all">{t.nav.contact}</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/10">
            {(["vi", "en", "fr"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${language === lang ? "bg-white text-brand-primary shadow-sm" : "text-white/60 hover:text-white"}`}
              >
                {lang}
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              const themes: ("green" | "red" | "orange")[] = ["green", "red", "orange"];
              const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
              setTheme(themes[nextIndex]);
            }}
            className="p-1.5 rounded-full border border-white/20 hover:bg-white/10 text-white transition-all flex items-center justify-center"
            title={t.nav.changeTheme}
          >
            <Zap size={16} className={theme !== "green" ? "fill-white" : ""} />
          </button>
          <a 
            href="#quote" 
            className="bg-white text-brand-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-light transition-all shadow-md"
          >
            {t.nav.getQuote}
          </a>
        </div>
      </nav>

      {/* Section 1: Hero Section (Split Layout) */}
      <header className="pt-32 pb-20 px-6 md:px-12 lg:px-24 grid md:grid-cols-2 gap-12 items-center min-h-[90vh]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={14} /> {t.hero.badge}
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
            {language === "vi" ? (
              <>Giải Pháp <span className="text-brand-primary">Nông Sản Việt</span> Cho Chuỗi Cung Ứng Toàn Cầu</>
            ) : language === "en" ? (
              <><span className="text-brand-primary">Vietnamese Agri-Solutions</span> For Global Supply Chains</>
            ) : (
              <><span className="text-brand-primary">Solutions Agricoles Vietnamiennes</span> Pour Les Chaînes Mondiales</>
            )}
          </h1>
          <button 
            onClick={() => setSelectedSection({
              title: t.hero.title,
              content: (
                <div className="space-y-6">
                  <p>{t.hero.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-light/50 rounded-xl">
                      <h5 className="font-bold text-brand-primary mb-2">{t.hero.farmingControl}</h5>
                      <p className="text-xs text-brand-muted">{t.hero.farmingControlDesc}</p>
                    </div>
                    <div className="p-4 bg-brand-light/50 rounded-xl">
                      <h5 className="font-bold text-brand-primary mb-2">{t.hero.preservationTech}</h5>
                      <p className="text-xs text-brand-muted">{t.hero.preservationTechDesc}</p>
                    </div>
                    <div className="p-4 bg-brand-light/50 rounded-xl">
                      <h5 className="font-bold text-brand-primary mb-2">{t.hero.competitivePricing}</h5>
                      <p className="text-xs text-brand-muted">{t.hero.competitivePricingDesc}</p>
                    </div>
                    <div className="p-4 bg-brand-light/50 rounded-xl">
                      <h5 className="font-bold text-brand-primary mb-2">{t.hero.globalMarkets}</h5>
                      <p className="text-xs text-brand-muted">{t.hero.globalMarketsDesc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            className="mb-8 flex items-center gap-2 text-brand-primary font-bold hover:underline"
          >
            <Info size={18} /> {t.hero.viewDetails}
          </button>
          <p className="text-xl text-brand-muted leading-relaxed mb-10 max-w-xl">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#quote" 
              className="flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-secondary hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20"
            >
              {t.hero.ctaQuote} <ArrowRight size={20} />
            </a>
            <a 
              href="#quote" 
              className="flex items-center justify-center gap-2 border-2 border-[#E5E5E5] px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-light hover:border-brand-primary hover:text-brand-primary transition-all"
            >
              {t.hero.ctaSample}
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl mb-4 group cursor-zoom-in" onClick={() => setHeroLightboxIndex(heroSlideIndex)}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={heroSlideIndex}
                src={HERO_BANNER_IMAGES[heroSlideIndex]} 
                alt={`Hero Banner ${heroSlideIndex + 1}`} 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                <Plus size={32} />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur p-6 rounded-2xl border border-white/20 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold">99%</div>
                <div>
                  <div className="font-bold text-brand-ink">{t.hero.deliveryRate}</div>
                  <div className="text-sm text-brand-muted">{t.hero.deliveryCommit}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {HERO_BANNER_IMAGES.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setHeroSlideIndex(idx);
                  setHeroLightboxIndex(idx);
                }}
                className={`relative shrink-0 w-24 h-18 rounded-xl overflow-hidden border-2 transition-all ${heroSlideIndex === idx ? "border-brand-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </motion.div>
      </header>

      {/* Section: Giới Thiệu (About Us) */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl mb-4 group cursor-zoom-in" onClick={() => setAboutLightboxIndex(aboutSlideIndex)}>
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={aboutSlideIndex}
                    src={ABOUT_BANNER_IMAGES[aboutSlideIndex]} 
                    alt={`About Banner ${aboutSlideIndex + 5}`} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8 }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                    <Plus size={32} />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl border border-[#F3F4F6] hidden lg:block max-w-[280px]">
                  <div className="text-brand-primary font-bold text-4xl mb-2">15+</div>
                  <div className="text-sm font-bold text-brand-muted uppercase tracking-wider leading-tight">{t.about.yearsExp}</div>
                </div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {ABOUT_BANNER_IMAGES.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setAboutSlideIndex(idx);
                      setAboutLightboxIndex(idx);
                    }}
                    className={`relative shrink-0 w-24 h-18 rounded-xl overflow-hidden border-2 transition-all ${aboutSlideIndex === idx ? "border-brand-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 5}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="https://ducphuongmedical.com/hinhanh/Chanh/Hinh/logo_tajermy.png" 
                alt="TAJERMY" 
                className="h-12 w-auto"
                referrerPolicy="no-referrer"
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-widest">
                {t.about.badge}
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-tight">
              {language === "vi" ? (
                <>Đối Tác Cung Ứng <span className="text-brand-primary">Nông Sản Nhiệt Đới</span> Bền Vững</>
              ) : language === "en" ? (
                <>Sustainable <span className="text-brand-primary">Tropical Agriculture</span> Supply Partner</>
              ) : (
                <>Partenaire d'Approvisionnement <span className="text-brand-primary">Agricole Tropical</span> Durable</>
              )}
            </h2>
            <div className="space-y-6 text-brand-muted leading-relaxed">
              <p>
                <span className="font-bold text-brand-ink">TAJERMY</span> {t.about.description1}
              </p>
              <button 
                onClick={() => setSelectedSection({
                  title: t.about.viewSustainability,
                  content: (
                    <div className="space-y-6">
                      <p>{t.about.sustainabilityDesc}</p>
                      <ul className="space-y-4">
                        <li className="flex gap-3">
                          <CheckCircle2 className="text-brand-primary shrink-0" size={20} />
                          <div>
                            <span className="font-bold block">{t.about.sustainableFarming}</span>
                            <span className="text-sm text-brand-muted">{t.about.sustainableFarmingDesc}</span>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="text-brand-primary shrink-0" size={20} />
                          <div>
                            <span className="font-bold block">{t.about.fairTrade}</span>
                            <span className="text-sm text-brand-muted">{t.about.fairTradeDesc}</span>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="text-brand-primary shrink-0" size={20} />
                          <div>
                            <span className="font-bold block">{t.about.socialResponsibility}</span>
                            <span className="text-sm text-brand-muted">{t.about.socialResponsibilityDesc}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  )
                })}
                className="flex items-center gap-2 text-brand-primary font-bold hover:underline"
              >
                <Info size={18} /> {t.about.viewSustainability}
              </button>
              <p>
                {t.about.description2}
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-4 bg-brand-light/50 rounded-2xl border border-brand-border">
                  <div className="font-bold text-brand-primary text-2xl mb-1">50+</div>
                  <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">{t.about.statsMarkets}</div>
                </div>
                <div className="p-4 bg-brand-light/50 rounded-2xl border border-brand-border">
                  <div className="font-bold text-brand-primary text-2xl mb-1">100%</div>
                  <div className="text-xs text-brand-muted uppercase font-bold tracking-wider">{t.about.statsQuality}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Trust Signals */}
      <section className="py-16 bg-brand-light/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-brand-muted mb-10">
            {t.trust.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="text-2xl font-black tracking-tighter">GlobalG.A.P.</div>
            <div className="text-2xl font-black tracking-tighter">ISO 22000</div>
            <div className="text-2xl font-black tracking-tighter">HACCP</div>
            <div className="text-2xl font-black tracking-tighter">FDA</div>
            <div className="text-2xl font-black tracking-tighter">Phytosanitary</div>
          </div>
        </div>
      </section>

      {/* Section 3: Product Catalog */}
      <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold tracking-tight mb-4">{t.products.title}</h2>
            <p className="text-brand-muted max-w-2xl">{t.products.subtitle}</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
            <input 
              type="text"
              placeholder={t.products.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-brand-border rounded-2xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
            PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
              <div key={product.id} className="bg-white border border-brand-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-brand-ink">{product.name}</h3>
                  <p className="text-sm text-brand-muted mb-6 line-clamp-2 flex-grow">{product.description}</p>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-light/50 text-brand-primary font-bold text-sm rounded-xl border border-brand-border hover:bg-brand-secondary hover:text-white hover:border-brand-secondary transition-all"
                  >
                    <Info size={16} /> {t.products.viewInfo}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-light/50 text-brand-muted mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.products.noResults}</h3>
              <p className="text-brand-muted">{t.products.noResultsDesc} "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 text-brand-primary font-bold hover:underline"
              >
                {t.products.clearSearch}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl grid md:grid-cols-2"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-white transition-colors shadow-lg"
              >
                <X size={20} />
              </button>
              
              <div className="aspect-square md:aspect-auto h-full">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="p-8 md:p-12 flex flex-col">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-6 w-fit">
                  {t.products.specs}
                </div>
                <h3 className="text-3xl font-bold mb-4 text-brand-ink">{selectedProduct.name}</h3>
                <p className="text-brand-muted mb-8 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="space-y-3 mb-10">
                  {selectedProduct.specs.map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-[#F3F4F6]">
                      <span className="text-xs font-bold text-brand-faint uppercase tracking-wider">{spec.label}</span>
                      <span className="text-sm font-semibold text-brand-ink">{spec.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#quote" 
                    onClick={() => setSelectedProduct(null)}
                    className="flex-grow flex items-center justify-center gap-2 bg-brand-primary text-white py-4 rounded-2xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
                  >
                    <ShoppingCart size={20} /> {t.products.contactOrder}
                  </a>
                  <a 
                    href="https://zalo.me/0938.062.808"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#E5E5E5] rounded-2xl font-bold hover:bg-[#F9FAFB] transition-colors"
                  >
                    {t.products.chatZalo}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section: Photo - Video Gallery */}
      <section id="gallery" className="py-24 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold tracking-tight mb-4">{t.gallery.title}</h2>
              <p className="text-brand-muted max-w-2xl">{t.gallery.subtitle}</p>
            </div>
            <div className="flex bg-white p-1 rounded-xl border border-brand-border shadow-sm">
              <button 
                onClick={() => setActiveTab("photos")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "photos" ? "bg-brand-primary text-white shadow-lg" : "text-brand-faint hover:text-brand-ink"}`}
              >
                <ImageIcon size={18} /> {t.gallery.photos}
              </button>
              <button 
                onClick={() => setActiveTab("videos")}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === "videos" ? "bg-brand-primary text-white shadow-lg" : "text-brand-faint hover:text-brand-ink"}`}
              >
                <VideoIcon size={18} /> {t.gallery.videos}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "photos" ? (
              <motion.div 
                key="photos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {photos.map((photo, idx) => (
                  <div 
                    key={photo.id}
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative aspect-square rounded-2xl overflow-hidden cursor-zoom-in border border-[#E5E5E5] shadow-sm"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-brand-primary shadow-lg">
                        <Plus size={20} />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {videos.map((video, idx) => (
                  <div 
                    key={video.id}
                    onClick={() => setLightboxIndex(photos.length + idx)}
                    className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer border border-[#E5E5E5] shadow-sm"
                  >
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-brand-primary shadow-2xl group-hover:scale-110 transition-transform">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-bold text-sm">{video.title}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Hero Lightbox */}
      <Lightbox
        index={heroLightboxIndex}
        open={heroLightboxIndex >= 0}
        close={() => setHeroLightboxIndex(-1)}
        slides={HERO_BANNER_IMAGES.map(src => ({ src }))}
        plugins={[Thumbnails]}
      />

      {/* About Lightbox */}
      <Lightbox
        index={aboutLightboxIndex}
        open={aboutLightboxIndex >= 0}
        close={() => setAboutLightboxIndex(-1)}
        slides={ABOUT_BANNER_IMAGES.map(src => ({ src }))}
        plugins={[Thumbnails]}
      />

      {/* Main Lightbox */}
      <Lightbox
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[VideoPlugin, Thumbnails]}
        render={{
          slide: ({ slide }) => {
            if ((slide as any).type === "youtube") {
              const src = (slide as any).src;
              return (
                <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
                  <iframe
                    className="w-full max-w-5xl aspect-video rounded-xl shadow-2xl"
                    src={src}
                    title={(slide as any).title || "YouTube Video"}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              );
            }
            return undefined;
          },
        }}
        video={{
          autoPlay: true,
          controls: true,
          playsInline: true,
        }}
      />

      {/* Section 4: Logistics & Operations */}
      <section id="logistics" className="py-24 bg-brand-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">{t.logistics.title}</h2>
            <button 
              onClick={() => setSelectedSection({
                title: t.logistics.title,
                content: (
                  <div className="space-y-6">
                    <p>{language === "vi" ? "Hệ thống vận hành của TAJERMY được thiết kế để giảm thiểu rủi ro và tối ưu hóa thời gian giao hàng." : language === "en" ? "TAJERMY's operating system is designed to minimize risks and optimize delivery time." : "Le système d'exploitation de TAJERMY est conçu pour minimiser les risques et optimiser les délais de livraison."}</p>
                    <div className="space-y-4">
                      <div className="p-4 bg-brand-light/50 border border-brand-border rounded-xl">
                        <h5 className="font-bold text-brand-primary mb-1">{t.logistics.coldChain}</h5>
                        <p className="text-sm text-brand-muted">{t.logistics.coldChainDesc}</p>
                      </div>
                      <div className="p-4 bg-brand-light/50 border border-brand-border rounded-xl">
                        <h5 className="font-bold text-brand-primary mb-1">{t.logistics.partners}</h5>
                        <p className="text-sm text-brand-muted">{t.logistics.partnersDesc}</p>
                      </div>
                      <div className="p-4 bg-brand-light/50 border border-brand-border rounded-xl">
                        <h5 className="font-bold text-brand-primary mb-1">{t.logistics.tracking}</h5>
                        <p className="text-sm text-brand-muted">{t.logistics.trackingDesc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
              className="mb-8 flex items-center gap-2 text-brand-accent font-bold hover:underline"
            >
              <Info size={18} /> {t.logistics.viewDetails}
            </button>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center">
                  <Truck className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{t.logistics.bulkOrders}</h4>
                  <p className="text-white/70 text-sm">{t.logistics.bulkOrdersDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center">
                  <Package className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{t.logistics.packaging}</h4>
                  <p className="text-white/70 text-sm">{t.logistics.packagingDesc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 bg-white/10 rounded-xl flex items-center justify-center">
                  <Ship className="text-brand-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{t.logistics.network}</h4>
                  <p className="text-white/70 text-sm">{t.logistics.networkDesc}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <AnimatePresence mode="wait">
              <motion.img
                key={logisticsSlideIndex}
                src={LOGISTICS_BANNER_IMAGES[logisticsSlideIndex]}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            <div className="absolute -bottom-6 -left-6 bg-brand-accent text-brand-primary p-6 rounded-2xl font-bold shadow-xl z-10">
              <div className="text-3xl">24/7</div>
              <div className="text-xs uppercase tracking-wider">{t.logistics.monitoring}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Export Documentation */}
      <section id="docs" className="py-24 px-6 bg-[#FDFDFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <img 
              src="https://ducphuongmedical.com/hinhanh/Chanh/Hinh/logo_tajermy.png" 
              alt="TAJERMY Docs" 
              className="h-16 w-auto mx-auto mb-6 opacity-80"
              referrerPolicy="no-referrer"
            />
            <h2 className="text-4xl font-bold mb-4">{t.docs.title}</h2>
            <button 
              onClick={() => setSelectedSection({
                title: t.docs.title,
                content: (
                  <div className="space-y-6">
                    <p>{t.docs.docsDesc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                      <div className="p-4 bg-brand-light/50 rounded-xl border border-brand-border">
                        <h5 className="font-bold text-brand-primary mb-1 text-sm">{t.docs.inspection}</h5>
                        <p className="text-[11px] text-brand-muted">{t.docs.inspectionDesc}</p>
                      </div>
                      <div className="p-4 bg-brand-light/50 rounded-xl border border-brand-border">
                        <h5 className="font-bold text-brand-primary mb-1 text-sm">{t.docs.legal}</h5>
                        <p className="text-[11px] text-brand-muted">{t.docs.legalDesc}</p>
                      </div>
                      <div className="p-4 bg-brand-light/50 rounded-xl border border-brand-border">
                        <h5 className="font-bold text-brand-primary mb-1 text-sm">{t.docs.customs}</h5>
                        <p className="text-[11px] text-brand-muted">{t.docs.customsDesc}</p>
                      </div>
                      <div className="p-4 bg-brand-light/50 rounded-xl border border-brand-border">
                        <h5 className="font-bold text-brand-primary mb-1 text-sm">{t.docs.digital}</h5>
                        <p className="text-[11px] text-brand-muted">{t.docs.digitalDesc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
              className="mb-8 flex items-center gap-2 text-brand-primary font-bold hover:underline mx-auto"
            >
              <Info size={18} /> {t.docs.viewDetails}
            </button>
            <p className="text-brand-muted">{t.docs.subtitle}</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: t.docs.salesContract, desc: t.docs.salesContractDesc },
              { title: t.docs.invoice, desc: t.docs.invoiceDesc },
              { title: t.docs.packingList, desc: t.docs.packingListDesc },
              { title: t.docs.billOfLading, desc: t.docs.billOfLadingDesc },
              { title: t.docs.co, desc: t.docs.coDesc },
              { title: t.docs.phytosanitary, desc: t.docs.phytosanitaryDesc },
              { title: t.docs.fumigation, desc: t.docs.fumigationDesc },
              { title: t.docs.insurance, desc: t.docs.insuranceDesc },
            ].map((doc, idx) => (
              <div key={idx} className="p-6 border border-brand-border rounded-2xl hover:border-brand-primary hover:bg-brand-light/10 transition-all group bg-white">
                <FileText className="mb-4 text-brand-faint group-hover:text-brand-primary transition-colors" size={24} />
                <h4 className="font-bold text-sm mb-1 text-brand-ink">{doc.title}</h4>
                <p className="text-xs text-brand-muted">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Lead Generation Form */}
      <section id="quote" className="py-24 px-6 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-brand-primary/5 border border-brand-border overflow-hidden grid md:grid-cols-5">
          <div className="md:col-span-2 bg-brand-primary p-10 text-white flex flex-col justify-between">
            <div>
              <div className="mb-8 p-3 bg-white rounded-2xl w-fit">
                <img 
                  src="https://ducphuongmedical.com/hinhanh/Chanh/Hinh/logo_tajermy.png" 
                  alt="TAJERMY Logo" 
                  className="h-12 w-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">TAJERMY EXPORT</h3>
              <div className="space-y-4 mb-8">
                <div className="text-sm leading-relaxed">
                  <span className="font-bold block text-white/60 text-[10px] uppercase tracking-widest mb-1">{t.footer.addressLabel}</span>
                  <p className="text-white font-medium">{t.footer.address}</p>
                </div>
                <div className="text-sm leading-relaxed">
                  <span className="font-bold block text-white/60 text-[10px] uppercase tracking-widest mb-1">{t.footer.showroomLabel}</span>
                  <p className="text-white font-medium">{t.footer.showroom}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Mail size={18}/></div>
                  <span className="text-sm">tajermyglobal@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Globe size={18}/></div>
                  <span className="text-sm">tajermy.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.82 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                  </div>
                  <span className="text-sm">0938.062.808 - 0937.043.808</span>
                </div>
              </div>
            </div>
            
            <div className="pt-10 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-brand-accent" size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{t.quote.privacyBadge}</span>
              </div>
              <p className="text-[10px] text-white/50 italic">{t.quote.privacyDesc}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-3 p-10 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">{t.quote.name}</label>
                <input 
                  required
                  type="text" 
                  placeholder={t.quote.namePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm placeholder:text-brand-faint"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">{t.quote.email}</label>
                <input 
                  required
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm placeholder:text-brand-faint"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">{t.quote.product}</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm bg-white"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              >
                {PRODUCTS.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">{t.quote.volume}</label>
              <input 
                required
                type="text" 
                placeholder={t.quote.volumePlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm placeholder:text-brand-faint"
                value={formData.volume}
                onChange={(e) => setFormData({...formData, volume: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-muted">{language === "vi" ? "Lời nhắn" : language === "en" ? "Message" : "Message"}</label>
              <textarea 
                rows={4}
                placeholder={language === "vi" ? "Bạn cần tư vấn thêm điều gì?" : language === "en" ? "Anything else we should know?" : "Autre chose que nous devrions savoir ?"}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none transition-all text-sm placeholder:text-brand-faint resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-primary text-white font-bold py-4 rounded-xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
            >
              {t.quote.submit} <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-brand-border bg-brand-light">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="https://ducphuongmedical.com/hinhanh/Chanh/Hinh/logo_tajermy.png" 
                  alt="TAJERMY Logo" 
                  className="h-12 w-auto"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col leading-none">
                  <div className="text-2xl font-bold tracking-tighter text-brand-primary">
                    TAJERMY<span className="text-brand-accent">.</span>
                  </div>
                  <div className="text-[10px] font-medium tracking-widest text-brand-muted uppercase">
                    B2B Agricultural Export
                  </div>
                </div>
              </div>
              <p className="text-sm text-brand-muted mb-4 font-bold">{t.footer.companyName}</p>
              <p className="text-sm text-brand-muted mb-2"><span className="font-bold text-brand-ink">{t.footer.addressLabel}:</span> {t.footer.address}</p>
              <p className="text-sm text-brand-muted mb-2"><span className="font-bold text-brand-ink">{t.footer.showroomLabel}:</span> {t.footer.showroom}</p>
              <p className="text-sm text-brand-muted"><span className="font-bold text-brand-ink">{t.footer.hotlineLabel}:</span> {t.footer.hotline}</p>
            </div>
            
            <div>
              <div className="mb-8">
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-brand-ink">{t.footer.quickLinks}</h4>
                <ul className="space-y-3 text-sm text-brand-muted">
                  <li><a href="#products" className="hover:text-brand-primary">{t.nav.products}</a></li>
                  <li><a href="#gallery" className="hover:text-brand-primary">{t.nav.gallery}</a></li>
                  <li><a href="#logistics" className="hover:text-brand-primary">{t.nav.logistics}</a></li>
                  <li><a href="#docs" className="hover:text-brand-primary">{t.nav.docs}</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-brand-ink">{t.footer.connect}</h4>
                <div className="flex flex-wrap gap-4">
                  <a href="https://www.facebook.com/ducphuongnguyenphuoctay" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/50 border border-brand-border flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.youtube.com/@ducphuongmedical" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/50 border border-brand-border flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://zalo.me/0938.062.808" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/50 border border-brand-border flex items-center justify-center hover:bg-[#0068FF] hover:text-white transition-all">
                    <span className="font-black text-[10px]">Zalo</span>
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-brand-ink">{language === "vi" ? "Vị trí" : language === "en" ? "Location" : "Emplacement"}</h4>
              <div className="rounded-2xl overflow-hidden border border-brand-border h-48 shadow-sm bg-white p-1">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15676.348826926755!2d106.61927998715817!3d10.804632699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175295a8c874dbb%3A0x7b68df38040fcba6!2zQ8O0bmcgVHkgVE5ISCBUaGnhur90IELhu4sgxJDhu6ljIFBoxrDGoW5n!5e0!3m2!1svi!2s!4v1774950325045!5m2!1svi!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#F3F4F6] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-faint">
              © 2026 {t.footer.companyName}. {t.footer.rights}
            </div>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-brand-faint items-center">
              <a href="#" className="hover:text-brand-ink">{t.footer.privacy}</a>
              <a href="#" className="hover:text-brand-ink">{t.footer.terms}</a>
              <button 
                onClick={() => setShowAdminAuth(true)}
                className="hover:text-brand-primary transition-colors flex items-center gap-1"
                title={t.admin.dashboard}
              >
                <LayoutDashboard size={12} />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-10 text-center"
            >
              <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-brand-primary" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-brand-ink mb-4">
                {language === "vi" ? "Cảm ơn đã liên hệ!" : language === "en" ? "Thank you for contacting us!" : "Merci de nous avoir contactés !"}
              </h3>
              <p className="text-brand-muted mb-8">
                {language === "vi" 
                  ? "Chúng tôi sẽ liên hệ lại bạn sớm nhất!" 
                  : language === "en" 
                    ? "We will get back to you as soon as possible!" 
                    : "Nous reviendrons vers vous dès que possible !"}
              </p>
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
              >
                {t.common.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom-left floating popup */}
      <AnimatePresence>
        {showBottomLeftPopup && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.8 }}
            className="fixed bottom-6 left-6 z-[100] w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-border"
          >
            <div className="relative aspect-[4/5]">
              <img 
                src={PROMO_POSTERS[0].src} 
                alt="Promotion" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setShowBottomLeftPopup(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-brand-ink text-sm mb-1">
                {language === "vi" ? "Ưu đãi đặc biệt" : language === "en" ? "Special Offers" : "Offres Spéciales"}
              </h4>
              <p className="text-xs text-brand-muted mb-3">
                {language === "vi" ? "Khám phá các sản phẩm nông sản chất lượng cao." : language === "en" ? "Discover high-quality agricultural products." : "Découvrez des sản phẩm nông sản de haute qualité."}
              </p>
              <button 
                onClick={() => {
                  setPromoLightboxIndex(0);
                  setShowBottomLeftPopup(false);
                }}
                className="w-full bg-brand-primary text-white py-2 rounded-lg text-xs font-bold hover:bg-brand-secondary transition-all"
              >
                {language === "vi" ? "Xem chi tiết" : language === "en" ? "View Details" : "Voir les Détails"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll-triggered Lightbox */}
      <Lightbox
        index={promoLightboxIndex}
        open={promoLightboxIndex >= 0}
        close={() => setPromoLightboxIndex(-1)}
        slides={PROMO_POSTERS}
        plugins={[Thumbnails]}
      />

      {/* Admin Auth Modal */}
      <AnimatePresence>
        {showAdminAuth && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminAuth(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden shadow-2xl p-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-brand-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-brand-ink">Admin Access</h3>
                <p className="text-sm text-brand-muted mt-2">Vui lòng nhập mật khẩu để tiếp tục</p>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="password"
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (adminPasswordInput === "123456") {
                        setIsAdmin(true);
                        setShowAdminAuth(false);
                        setAdminPasswordInput("");
                      } else {
                        alert("Mật khẩu không chính xác!");
                      }
                    }
                  }}
                  placeholder="Mật khẩu"
                  className="w-full bg-brand-light border border-brand-border rounded-xl px-4 py-3 outline-none focus:border-brand-primary transition-all text-center font-bold tracking-widest"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    if (adminPasswordInput === "123456") {
                      setIsAdmin(true);
                      setShowAdminAuth(false);
                      setAdminPasswordInput("");
                    } else {
                      alert("Mật khẩu không chính xác!");
                    }
                  }}
                  className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => {
                    setShowAdminAuth(false);
                    setAdminPasswordInput("");
                  }}
                  className="w-full text-brand-faint text-xs font-bold uppercase tracking-widest hover:text-brand-muted transition-colors"
                >
                  Hủy bỏ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Section Modal */}
      <AnimatePresence>
        {selectedSection && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSection(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <img 
                      src="https://ducphuongmedical.com/hinhanh/Chanh/Hinh/logo_tajermy.png" 
                      alt="TAJERMY" 
                      className="h-10 w-auto"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="text-2xl font-bold text-[#1A1A1A] leading-tight">{selectedSection.title}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedSection(null)}
                    className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="text-brand-muted">
                  {selectedSection.content}
                </div>
                
                <div className="mt-12 pt-8 border-t border-brand-border flex justify-end">
                  <button 
                    onClick={() => setSelectedSection(null)}
                    className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-secondary transition-all"
                  >
                    {t.common.close}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4">
        {/* Zalo Button */}
        <a 
          href="https://zalo.me/0938.062.808" 
          target="_blank" 
          rel="noreferrer"
          className="w-14 h-14 bg-[#0068FF] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group relative"
        >
          <span className="font-black text-[10px]">Zalo</span>
          <span className="absolute right-full mr-3 px-3 py-1 bg-white text-brand-ink text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-border">
            {t.common.chatZalo}
          </span>
        </a>

        {/* Phone Button */}
        <a 
          href="tel:0938062808" 
          className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-secondary hover:scale-110 transition-all group relative"
        >
          <Phone size={24} />
          <span className="absolute right-full mr-3 px-3 py-1 bg-white text-brand-ink text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-brand-border">
            {t.common.callHotline}: 0938.062.808
          </span>
        </a>

        {/* Go To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToTop}
              className="w-14 h-14 bg-white text-[#1A1A1A] border border-[#E5E5E5] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#F9FAFB] transition-colors"
            >
              <ArrowUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-First Floating CTA */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <a 
          href="#quote" 
          className="w-full bg-brand-primary text-white font-bold py-4 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all"
        >
          {t.common.getQuoteNow} <ArrowRight size={18} />
        </a>
      </div>

    </div>
  );
}
