import React, { useState, useEffect } from 'react';
import { useRestaurantStore } from '../store/restaurantStore';
import { Download, ExternalLink, QrCode, Smartphone, Globe, Copy, Check, Edit3 } from 'lucide-react';

export const QrCodesPage: React.FC = () => {
  const tables = useRestaurantStore((state) => state.tables);
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || 'tbl-01');
  const [renderBaseUrl, setRenderBaseUrl] = useState('https://stgtrgjrccx.github.io/menuz');
  const [copied, setCopied] = useState(false);

  // Auto-detect if currently running on a custom domain or deployed URL
  useEffect(() => {
    if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
      setRenderBaseUrl(window.location.origin + window.location.pathname.replace(/\/+$/, ''));
    }
  }, []);

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  // Clean trailing slashes
  const cleanBase = renderBaseUrl.replace(/\/+$/, '');
  const deployedMenuUrl = `${cleanBase}/#/r/saffron-house/menu?t=${selectedTable.public_token}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(deployedMenuUrl)}&color=1C1917&bgcolor=FFFFFF`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deployedMenuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-ivory-50 p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-20">
      <div className="text-center max-w-lg mx-auto">
        <span className="text-xs uppercase font-bold text-saffron-700 tracking-wider">Render Production Ready</span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">Table QR Code Connector</h1>
        <p className="text-xs text-charcoal-700/70 mt-1.5 leading-relaxed">
          This QR code is directly connected to your live Render deployment URL.
        </p>
      </div>

      {/* Render URL Configuration Card */}
      <div className="max-w-xl mx-auto bg-white p-5 rounded-3xl border border-ivory-200 shadow-subtle space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-charcoal-900 flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-saffron-600" />
            <span>Render Deployed Domain</span>
          </label>
          <span className="text-[11px] text-saffron-700 font-medium">Auto-synced with QR</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={renderBaseUrl}
            onChange={(e) => setRenderBaseUrl(e.target.value)}
            placeholder="https://menuz-xyz.onrender.com"
            className="flex-1 bg-ivory-50 border border-ivory-200 rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 font-mono focus:outline-none focus:border-saffron-600"
          />
          <button
            onClick={copyToClipboard}
            className="px-3.5 py-2.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors border border-ivory-200"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-[11px] text-charcoal-700/60">
          Paste the domain assigned to you by Render above. The QR code below will update immediately.
        </p>
      </div>

      {/* Table Selector */}
      <div className="flex justify-center space-x-2">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTableId(table.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTableId === table.id
                ? 'bg-saffron-600 text-white shadow-subtle'
                : 'bg-white text-charcoal-800 border border-ivory-200 hover:bg-ivory-100'
            }`}
          >
            {table.label}
          </button>
        ))}
      </div>

      {/* Live Connected QR Display Card */}
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-float border border-ivory-200 text-center">
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700">Saffron House</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">{selectedTable.label}</h2>
          <span className="text-xs text-charcoal-700/60 block mt-0.5">Contemporary Indian Dining</span>
        </div>

        {/* The Live QR Image */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto bg-white rounded-2xl p-4 border-2 border-dashed border-saffron-300 flex items-center justify-center shadow-subtle">
          <img
            src={qrImageUrl}
            alt={`Render QR Code for ${selectedTable.label}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Live Target Destination Link */}
        <div className="mt-4 p-3 bg-ivory-50 rounded-xl border border-ivory-200 text-left">
          <span className="text-[10px] uppercase font-bold text-charcoal-700/60 block mb-0.5">Connected URL:</span>
          <span className="font-mono text-xs text-saffron-800 font-semibold break-all leading-relaxed block">
            {deployedMenuUrl}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex space-x-2">
          <a
            href={deployedMenuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-3 rounded-xl text-xs shadow-subtle flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Test Deployed Link</span>
          </a>

          <a
            href={qrImageUrl}
            download={`SaffronHouse_${selectedTable.label}_Render_QR.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 font-semibold py-3 rounded-xl text-xs border border-ivory-200 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </a>
        </div>
      </div>
    </div>
  );
};
