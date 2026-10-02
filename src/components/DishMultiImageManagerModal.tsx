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
  FolderOpen
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

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          loadedImages.push(result);
        }
        processedCount++;

        if (processedCount === files.length) {
          addDishImages(dish.id, loadedImages);
          setUploading(false);
          setUploadMessage(`✓ Successfully added ${loadedImages.length} photo${loadedImages.length > 1 ? 's' : ''}!`);
          setTimeout(() => setUploadMessage(null), 3000);
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0D1322] border border-white/[0.1] rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 text-white max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Dish Multi-Photo Studio
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                {dish.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload multiple photos from your device gallery, set main cover, and manage dish angles.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Status Message */}
          {uploadMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 font-semibold flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{uploadMessage}</span>
            </div>
          )}

          {/* 1. DIRECT DEVICE GALLERY UPLOAD DROPZONE */}
          <div className="bg-gradient-to-br from-[#090D16] to-[#121A2D] p-5 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-500/60 transition-all text-center space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                Upload Dish Photos from Device Gallery
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md mx-auto">
                Select one or multiple photos directly from your phone gallery, camera roll, or Mac folders (JPEG, PNG, WEBP).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all cursor-pointer"
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
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-semibold text-xs rounded-xl border border-white/[0.08] flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>

          {/* 2. CURRENT ACTIVE DISH GALLERY (MULTI-PHOTO ROSTER) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Attached Dish Photos ({allImages.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                ⭐ Star indicates main cover photo
              </span>
            </div>

            {allImages.length === 0 ? (
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/[0.06] text-center text-slate-400 text-xs">
                No photos attached yet. Click "Choose Photos from Gallery" above to add pictures of this dish.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allImages.map((img, index) => {
                  const isPrimary = dish.image_url === img.src || (index === 0 && !dish.image_url);

                  return (
                    <div
                      key={`dish-img-${index}-${img.src.slice(-15)}`}
                      className={`group relative rounded-2xl overflow-hidden border transition-all bg-slate-900 ${
                        isPrimary
                          ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'border-white/[0.08] hover:border-slate-500'
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
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 flex items-center space-x-1 shadow">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Main Cover</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-black/70 text-slate-200 backdrop-blur-sm">
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
                                className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-[10px] rounded-lg transition-all flex items-center justify-center space-x-1"
                              >
                                <Star className="w-3 h-3 fill-slate-950" />
                                <span>Set as Cover</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Photo Label / Angle description */}
                      <div className="p-2 text-center bg-slate-950/80">
                        <span className="text-[11px] font-medium text-slate-300 truncate block">
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
          <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-300">
                Or Add from Menuz Studio Inspiration Library
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CURATED_SUGGESTIONS.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => handleApplyCurated(item.url, item.name)}
                  className="group p-1.5 rounded-xl bg-slate-900 border border-white/[0.06] hover:border-amber-500/40 text-left transition-all active:scale-95"
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
                  <span className="text-[10px] font-medium text-slate-300 truncate block mt-1">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {allImages.length} photo{allImages.length !== 1 ? 's' : ''} saved for this dish
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-white/[0.08] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
