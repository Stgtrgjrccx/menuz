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
  FolderOpen
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

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          loadedImages.push(result);
        }
        processedCount++;

        if (processedCount === files.length) {
          addRestaurantPhotos(restaurant.id, loadedImages);
          setUploading(false);
          setUploadMessage(`✓ Successfully added ${loadedImages.length} restaurant photo${loadedImages.length > 1 ? 's' : ''}!`);
          setTimeout(() => setUploadMessage(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0D1322] border border-white/[0.1] rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 text-white max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <img
              src={restaurant.logo_url}
              alt={restaurant.name}
              className="w-12 h-12 rounded-2xl object-cover border border-white/[0.1]"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Restaurant Photo &amp; Ambiance Studio
              </span>
              <h3 className="font-serif text-lg font-bold text-white leading-tight">
                {restaurant.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload venue interior photos, dining ambiance, outdoor patio views, and cover banner.
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

          {/* Direct File Upload from Device Gallery Dropzone */}
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
                Upload Restaurant Photos from Device Gallery
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md mx-auto">
                Select venue photos directly from your phone gallery, camera roll, or computer (JPEG, PNG, WEBP).
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

          {/* Ambiance Photo Gallery Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Uploaded Restaurant Photos ({photos.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                ⭐ Star marks main banner cover
              </span>
            </div>

            {photos.length === 0 ? (
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/[0.06] text-center text-slate-400 text-xs">
                No ambiance photos uploaded yet. Use the gallery upload above to add dining room, bar, patio, and venue photos.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photoUrl, index) => {
                  const isCover = coverPhoto === photoUrl;

                  return (
                    <div
                      key={`rest-photo-${index}-${photoUrl.slice(-15)}`}
                      className={`group relative rounded-2xl overflow-hidden border transition-all bg-slate-900 ${
                        isCover
                          ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                          : 'border-white/[0.08] hover:border-slate-500'
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
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-slate-950 flex items-center space-x-1 shadow">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Cover Banner</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-black/70 text-slate-200 backdrop-blur-sm">
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
                              className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-[10px] rounded-lg transition-all flex items-center justify-center space-x-1"
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
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} in restaurant gallery
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
