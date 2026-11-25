import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurantStore } from '../store/restaurantStore';
import { isWorkingWithMenuz } from '../types';
import { Download, ExternalLink, QrCode, Smartphone, Globe, Copy, Check, Edit3, UtensilsCrossed, ShieldCheck, ArrowLeft } from 'lucide-react';

export const QrCodesPage: React.FC = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const setCurrentRestaurant = useRestaurantStore((state) => state.setCurrentRestaurant);
  const tables = useRestaurantStore((state) => state.tables);

  const activeWorkingRestaurants = restaurants.filter((r) => isWorkingWithMenuz(r));
  const currentTables = tables.filter((t) => t.restaurant_id === restaurant?.id);
  const effectiveTables = currentTables.length > 0 ? currentTables : tables;

  const [selectedTableId, setSelectedTableId] = useState(effectiveTables[0]?.id || 'tbl-01');
  const [renderBaseUrl, setRenderBaseUrl] = useState('https://stgtrgjrccx.github.io/menuz');
  const [copied, setCopied] = useState(false);

  // Sync selected table if restaurant changes
  useEffect(() => {
    if (effectiveTables.length > 0 && !effectiveTables.some((t) => t.id === selectedTableId)) {
      setSelectedTableId(effectiveTables[0].id);
    }
  }, [effectiveTables, selectedTableId]);

  // Auto-detect if currently running on a custom domain or deployed URL
  useEffect(() => {
    if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      setRenderBaseUrl(window.location.origin + window.location.pathname.replace(/\/+$/, ''));
    }
  }, []);

  const selectedTable = effectiveTables.find((t) => t.id === selectedTableId) || effectiveTables[0];

  // Clean trailing slashes
  const cleanBase = renderBaseUrl.replace(/\/+$/, '');
  const deployedMenuUrl = `${cleanBase}/#/r/${restaurant?.slug || 'saffron-house'}/menu?t=${selectedTable?.public_token || 'table-token-01'}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(deployedMenuUrl)}&color=1C1917&bgcolor=FFFFFF`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deployedMenuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#141414] p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Bar with Admin HQ button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.08]">
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#4A4A4A] hover:text-[#141414] transition-colors bg-[#FFFFFF]/[0.04] hover:bg-black/[0.04] px-3.5 py-2 rounded-xl border border-black/[0.08] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2D4A3E]" />
          <span>Explore Demos</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            to={`/manage/${restaurant.slug || 'saffron-house'}`}
            className="px-3.5 py-2 rounded-xl bg-[#F4511E]/15 hover:bg-[#F4511E]/25 text-[#2D4A3E] border border-[#F4511E]/30 hover:border-[#F4511E]/60 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
          >
            <span>Floor Ops Hub</span>
          </Link>
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto">
        <span className="text-[11px] uppercase font-mono font-bold text-[#2D4A3E] tracking-wider bg-[#F4511E]/10 px-3 py-1 rounded-full border border-[#F4511E]/20">
          Table QR Code Connector
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#141414] mt-2">Live Table QR Hub</h1>
        <p className="text-xs text-[#6E6E6E] mt-1.5 leading-relaxed">
          Dynamic table tokens with zero app download and multiplayer diner cart sync.
        </p>
      </div>

      {/* URL Configuration Card */}
      <div className="max-w-xl mx-auto bg-[#F5F1E8] p-5 rounded-2xl border border-black/[0.08] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#141414] flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-[#2D4A3E]" />
            <span>Deployed Domain / Origin</span>
          </label>
          <span className="text-[11px] text-[#2D4A3E]/90 font-mono font-medium">Auto-synced</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={renderBaseUrl}
            onChange={(e) => setRenderBaseUrl(e.target.value)}
            placeholder="https://your-domain.com"
            className="flex-1 bg-[#FFFFFF]/[0.04] border border-black/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#141414] font-mono focus:outline-none focus:border-[#F4511E]"
          />
          <button
            onClick={copyToClipboard}
            className="px-3.5 py-2.5 bg-[#FFFFFF]/[0.08] hover:bg-black/[0.04] text-[#3A3A3A] rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-black/[0.08] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#2F7A4F]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Restaurant Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xs font-bold text-[#4A4A4A] flex items-center space-x-1.5">
          <UtensilsCrossed className="w-3.5 h-3.5 text-[#2D4A3E]" />
          <span>Select Restaurant:</span>
        </span>
        <div className="flex space-x-2">
          {activeWorkingRestaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => setCurrentRestaurant(r.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                restaurant?.id === r.id
                  ? 'bg-[#F4511E] text-[#FFFFFF] shadow-sm'
                  : 'bg-black/[0.04] text-[#4A4A4A] border border-black/[0.08] hover:bg-black/[0.04]'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Table Selector */}
      <div className="flex justify-center space-x-2 flex-wrap gap-y-2">
        {effectiveTables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTableId(table.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTableId === table.id
                ? 'bg-[#F4511E] text-[#FFFFFF] font-black shadow-sm'
                : 'bg-black/[0.04] text-[#4A4A4A] border border-black/[0.08] hover:bg-black/[0.04]'
            }`}
          >
            {table.label}
          </button>
        ))}
      </div>

      {/* Live Connected QR Display Card */}
      <div className="max-w-md mx-auto bg-[#F5F1E8] rounded-2xl p-6 sm:p-8 shadow-2xl border border-black/[0.08] text-center">
        <div className="mb-4">
          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#2D4A3E]">
            {restaurant?.name || 'Saffron House'}
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#141414]">{selectedTable?.label}</h2>
          <span className="text-xs text-[#6E6E6E] block mt-0.5">
            {restaurant?.cuisine || 'Contemporary Indian Dining'}
          </span>
        </div>

        {/* The Live QR Image */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto bg-[#F5F1E8] rounded-2xl p-4 border border-black/[0.2] flex items-center justify-center shadow-xl">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${selectedTable?.label}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Live Target Destination Link */}
        <div className="mt-4 p-3 bg-[#FFFFFF]/[0.03] rounded-xl border border-black/[0.08] text-left">
          <span className="text-[10px] uppercase font-mono font-bold text-[#6E6E6E] block mb-0.5">Destination URL:</span>
          <span className="font-mono text-xs text-[#2D4A3E] font-semibold break-all leading-relaxed block">
            {deployedMenuUrl}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex space-x-2">
          <a
            href={deployedMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-[#F4511E] to-[#F4511E] hover:brightness-110 active:scale-95 text-[#FFFFFF] font-bold py-3 rounded-xl text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Table Menu</span>
          </a>

          <a
            href={qrImageUrl}
            download={`${restaurant?.name || 'Restaurant'}_${selectedTable?.label}_QR.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 bg-[#FFFFFF]/[0.06] hover:bg-black/[0.04] text-[#141414] font-semibold py-3 rounded-xl text-xs border border-black/[0.08] flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-[#4A4A4A]" />
            <span>PNG</span>
          </a>
        </div>
      </div>
    </div>
  );
};
