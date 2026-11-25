import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Sparkles,
  Layers,
  Star,
  Plus,
  Camera,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import { MenuItem, DishGalleryImage } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';

interface DishMultiImageManagerModalProps {
  isOpen: boolean;
  dish: MenuItem | null;
  onClose: () => void;
}

// Curated high-res culinary images for 1-click gallery inspiration
const CURATED_SUGGESTIONS = [
  { name: 'Artisan Gourmet Plating', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop' },
  { name: 'Sizzling Charred Tandoori', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop' },
  { name: 'Rich Handi Saffron Curry', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop' },
  { name: 'Fresh Woodfired Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop' },
  { name: 'Steaming Dim Sum Basket', url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop' },
  { name: 'Artisanal Crafted Mocktail', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop' },
  { name: 'Decadent Chocolate Lava Cake', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop' },
  { name: 'Crispy Samosa & Mint Chutney', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop' },
];

export const DishMultiImageManagerModal: React.FC<DishMultiImageManagerModalProps> = ({
  isOpen,
  dish: propDish,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const menuItems = useRestaurantStore((state) => state.menuItems);
  const addDishImages = useRestaurantStore((state) => state.addDishImages);
  const removeDishImage = useRestaurantStore((state) => state.removeDishImage);
  const setPrimaryDishImage = useRestaurantStore((state) => state.setPrimaryDishImage);

  if (!isOpen || !propDish) return null;

  // Retrieve the reactive dish from the store so all additions, deletions, and cover changes update live
  const dish = menuItems.find((m) => m.id === propDish.id) || propDish;

  // Compile all photos associated with this dish
  const allImages: DishGalleryImage[] = [];
  if (dish.gallery_images && dish.gallery_images.length > 0) {
    dish.gallery_images.forEach((img) => {
      if (img.src && !allImages.some((a) => a.src.trim() === img.src.trim())) {
        allImages.push(img);
      }
    });
  } else if (dish.image_url) {
    allImages.push({ src: dish.image_url, label: 'Main Presentation', code: '# 01' });
  }

  // Ensure current primary image is represented
  if (dish.image_url && !allImages.some((img) => img.src === dish.image_url)) {
    allImages.unshift({ src: dish.image_url, label: 'Main Cover Photo', code: '# 01' });
  }

  // Handle direct file uploads from Mac/phone photo gallery
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMessage(`Processing ${files.length} image${files.length > 1 ? 's' : ''}...`);

    const loadedImages: string[] = [];
    let processedCount = 0;
    const totalFiles = files.length;

    // Safety fallback: clear upload state within 2s maximum
    const safetyTimer = setTimeout(() => {
      if (loadedImages.length > 0) {
        addDishImages(dish.id, loadedImages);
        setUploadMessage(`✓ Added ${loadedImages.length} photo(s)!`);
      }
      setUploading(false);
      setTimeout(() => setUploadMessage(null), 2000);
    }, 2000);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          loadedImages.push(result);
        }
        processedCount++;

        if (processedCount === totalFiles) {
          clearTimeout(safetyTimer);
          addDishImages(dish.id, loadedImages);
          setUploading(false);
          setUploadMessage(`✓ Successfully added ${loadedImages.length} photo${loadedImages.length > 1 ? 's' : ''}!`);
          setTimeout(() => setUploadMessage(null), 2500);
        }
      };
      reader.onerror = () => {
        processedCount++;
        if (processedCount === totalFiles) {
          clearTimeout(safetyTimer);
          if (loadedImages.length > 0) addDishImages(dish.id, loadedImages);
          setUploading(false);
          setTimeout(() => setUploadMessage(null), 2500);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleApplyCurated = (url: string, name: string) => {
    addDishImages(dish.id, [{ src: url, label: name }]);
    setUploadMessage(`✓ Added "${name}" to gallery`);
    setTimeout(() => setUploadMessage(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-xl overflow-y-auto pt-[max(env(safe-area-inset-top,20px),24px)] pb-12 px-3 sm:px-5 flex justify-center items-start overscroll-contain">
      <div className="bg-[#F5F1E8] border border-black/[0.1] rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 text-[#141414] my-2 sm:my-6 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-black/[0.08]">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.04] text-[#3A3A3A] hover:text-[#141414] font-bold text-xs border border-black/[0.1] transition-all cursor-pointer mr-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#F4511E]/10 border border-[#F4511E]/20 flex items-center justify-center text-[#2D4A3E]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D4A3E] block">
                Dish Multi-Photo Studio
              </span>
              <h3 className="font-serif text-lg font-bold text-[#141414] leading-tight">
                {dish.name}
              </h3>
              <p className="text-xs text-[#6E6E6E] mt-0.5">
                Upload multiple photos from your device gallery, set main cover, and manage dish angles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6E6E] hover:text-[#141414] rounded-xl hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Status Message */}
          {uploadMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-[#2F7A4F] font-semibold flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-[#2F7A4F] flex-shrink-0" />
              <span>{uploadMessage}</span>
            </div>
          )}

          {/* 1. DIRECT DEVICE GALLERY UPLOAD DROPZONE */}
          <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F5F1E8] p-5 rounded-2xl border-2 border-dashed border-[#F4511E]/30 hover:border-[#F4511E]/60 transition-all text-center space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-full bg-[#F4511E]/10 border border-[#F4511E]/30 flex items-center justify-center text-[#2D4A3E]">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#141414]">
                Upload Dish Photos from Device Gallery
              </h4>
              <p className="text-xs text-[#6E6E6E] mt-0.5 max-w-md mx-auto">
                Select one or multiple photos directly from your phone gallery, camera roll, or Mac folders (JPEG, PNG, WEBP).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:from-[#F4511E] hover:to-[#F4511E] active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Choose Photos from Gallery</span>
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('capture', 'environment');
                    fileInputRef.current.click();
                  }
                }}
                className="px-4 py-2.5 bg-[#EFE9DD] hover:bg-[#E8DCC8] active:scale-95 text-[#3A3A3A] hover:text-[#141414] font-semibold text-xs rounded-xl border border-black/[0.08] flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#2D4A3E]" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>

          {/* 2. CURRENT ACTIVE DISH GALLERY (MULTI-PHOTO ROSTER) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-[#2D4A3E]" />
                <span>Attached Dish Photos ({allImages.length})</span>
              </h4>
              <span className="text-[11px] text-[#6E6E6E]">
                ⭐ Star indicates main cover photo
              </span>
            </div>

            {allImages.length === 0 ? (
              <div className="p-6 bg-[#F5F1E8]/50 rounded-2xl border border-black/[0.06] text-center text-[#6E6E6E] text-xs">
                No photos attached yet. Click "Choose Photos from Gallery" above to add pictures of this dish.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allImages.map((img, index) => {
                  const isPrimary = dish.image_url === img.src || (index === 0 && !dish.image_url);

                  return (
                    <div
                      key={`dish-img-${index}-${img.src.slice(-15)}`}
                      className={`group relative rounded-2xl overflow-hidden border transition-all bg-[#F5F1E8] ${
                        isPrimary
                          ? 'border-[#F4511E] shadow-md ring-1 ring-[#F4511E]/30'
                          : 'border-black/[0.08] hover:border-slate-500'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/40">
                        <img
                          src={img.src}
                          alt={img.label || `${dish.name} - Photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex items-center space-x-1">
                          {isPrimary && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F4511E] text-[#FFFFFF] flex items-center space-x-1 shadow">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Main Cover</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-black/70 text-[#F0F0F0] backdrop-blur-sm">
                            #{index + 1}
                          </span>
                        </div>

                        {/* Action buttons overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeDishImage(dish.id, img.src)}
                              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-90"
                              title="Delete this photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-1">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => setPrimaryDishImage(dish.id, img.src)}
                                className="w-full py-1.5 bg-[#F4511E] hover:bg-[#F4511E] active:scale-95 text-[#FFFFFF] font-bold text-[10px] rounded-lg transition-all flex items-center justify-center space-x-1"
                              >
                                <Star className="w-3 h-3 fill-slate-950" />
                                <span>Set as Cover</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Photo Label / Angle description */}
                      <div className="p-2 text-center bg-[#FFFFFF]/80">
                        <span className="text-[11px] font-medium text-[#4A4A4A] truncate block">
                          {img.label || `Angle View ${index + 1}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. QUICK 1-CLICK CURATED STUDIO VAULT */}
          <div className="space-y-2.5 pt-2 border-t border-black/[0.08]">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E]" />
              <h4 className="text-xs font-bold text-[#4A4A4A]">
                Or Add from Menuz Studio Inspiration Library
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CURATED_SUGGESTIONS.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => handleApplyCurated(item.url, item.name)}
                  className="group p-1.5 rounded-xl bg-[#F5F1E8] border border-black/[0.06] hover:border-[#F4511E]/40 text-left transition-all active:scale-95"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold">
                      + Add
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-[#4A4A4A] truncate block mt-1">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-black/[0.08] flex items-center justify-between">
          <span className="text-xs text-[#6E6E6E]">
            {allImages.length} photo{allImages.length !== 1 ? 's' : ''} saved for this dish
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#EFE9DD] hover:bg-[#E8DCC8] text-[#141414] font-bold text-xs rounded-xl border border-black/[0.08] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
