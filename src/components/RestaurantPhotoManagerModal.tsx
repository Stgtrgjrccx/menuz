import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Check,
  Building2,
  Star,
  Camera,
  FolderOpen,
  ArrowLeft
} from 'lucide-react';
import { Restaurant } from '../types';
import { useRestaurantStore } from '../store/restaurantStore';

interface RestaurantPhotoManagerModalProps {
  isOpen: boolean;
  restaurant: Restaurant | null;
  onClose: () => void;
}

export const RestaurantPhotoManagerModal: React.FC<RestaurantPhotoManagerModalProps> = ({
  isOpen,
  restaurant: propRestaurant,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const restaurants = useRestaurantStore((state) => state.restaurants);
  const addRestaurantPhotos = useRestaurantStore((state) => state.addRestaurantPhotos);
  const removeRestaurantPhoto = useRestaurantStore((state) => state.removeRestaurantPhoto);
  const setRestaurantCoverPhoto = useRestaurantStore((state) => state.setRestaurantCoverPhoto);

  if (!isOpen || !propRestaurant) return null;

  // Retrieve reactive restaurant from store so photo uploads and deletions reflect live immediately
  const restaurant = restaurants.find((r) => r.id === propRestaurant.id) || propRestaurant;

  const photos = restaurant.ambiance_photos || [];
  const coverPhoto = restaurant.cover_image_url || restaurant.logo_url;

  // Handle files selected from phone gallery or Mac folders
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMessage(`Processing ${files.length} photo${files.length > 1 ? 's' : ''}...`);

    const loadedImages: string[] = [];
    let processedCount = 0;
    const totalFiles = files.length;

    // Safety fallback: clear upload state within 2s maximum
    const safetyTimer = setTimeout(() => {
      if (loadedImages.length > 0) {
        addRestaurantPhotos(restaurant.id, loadedImages);
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
          addRestaurantPhotos(restaurant.id, loadedImages);
          setUploading(false);
          setUploadMessage(`✓ Successfully added ${loadedImages.length} restaurant photo${loadedImages.length > 1 ? 's' : ''}!`);
          setTimeout(() => setUploadMessage(null), 2500);
        }
      };
      reader.onerror = () => {
        processedCount++;
        if (processedCount === totalFiles) {
          clearTimeout(safetyTimer);
          if (loadedImages.length > 0) addRestaurantPhotos(restaurant.id, loadedImages);
          setUploading(false);
          setTimeout(() => setUploadMessage(null), 2500);
        }
      };
      reader.readAsDataURL(file);
    });
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
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-12 h-12 rounded-2xl object-cover border border-black/[0.1]"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D4A3E] block">
                Restaurant Photo &amp; Ambiance Studio
              </span>
              <h3 className="font-serif text-lg font-bold text-[#141414] leading-tight">
                {restaurant.name}
              </h3>
              <p className="text-xs text-[#6E6E6E] mt-0.5">
                Upload venue interior photos, dining ambiance, outdoor patio views, and cover banner.
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

          {/* Direct File Upload from Device Gallery Dropzone */}
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
                Upload Restaurant Photos from Device Gallery
              </h4>
              <p className="text-xs text-[#6E6E6E] mt-0.5 max-w-md mx-auto">
                Select venue photos directly from your phone gallery, camera roll, or computer (JPEG, PNG, WEBP).
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

          {/* Ambiance Photo Gallery Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-[#2D4A3E]" />
                <span>Uploaded Restaurant Photos ({photos.length})</span>
              </h4>
              <span className="text-[11px] text-[#6E6E6E]">
                ⭐ Star marks main banner cover
              </span>
            </div>

            {photos.length === 0 ? (
              <div className="p-6 bg-[#F5F1E8]/50 rounded-2xl border border-black/[0.06] text-center text-[#6E6E6E] text-xs">
                No ambiance photos uploaded yet. Use the gallery upload above to add dining room, bar, patio, and venue photos.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photoUrl, index) => {
                  const isCover = coverPhoto === photoUrl;

                  return (
                    <div
                      key={`rest-photo-${index}-${photoUrl.slice(-15)}`}
                      className={`group relative rounded-2xl overflow-hidden border transition-all bg-[#F5F1E8] ${
                        isCover
                          ? 'border-[#F4511E] shadow-md ring-1 ring-[#F4511E]/30'
                          : 'border-black/[0.08] hover:border-slate-500'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/40">
                        <img
                          src={photoUrl}
                          alt={`${restaurant.name} photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex items-center space-x-1">
                          {isCover && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#F4511E] text-[#FFFFFF] flex items-center space-x-1 shadow">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Cover Banner</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-black/70 text-[#F0F0F0] backdrop-blur-sm">
                            #{index + 1}
                          </span>
                        </div>

                        {/* Actions overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeRestaurantPhoto(restaurant.id, photoUrl)}
                              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-90"
                              title="Delete this photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => setRestaurantCoverPhoto(restaurant.id, photoUrl)}
                              className="w-full py-1.5 bg-[#F4511E] hover:bg-[#F4511E] active:scale-95 text-[#FFFFFF] font-bold text-[10px] rounded-lg transition-all flex items-center justify-center space-x-1"
                            >
                              <Star className="w-3 h-3 fill-slate-950" />
                              <span>Set as Main Banner</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-black/[0.08] flex items-center justify-between">
          <span className="text-xs text-[#6E6E6E]">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} in restaurant gallery
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
