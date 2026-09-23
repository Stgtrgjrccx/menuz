import React, { useState } from 'react';
import { useRestaurantStore } from '../store/restaurantStore';
import { Download, ExternalLink, QrCode, Smartphone, Globe } from 'lucide-react';

export const QrCodesPage: React.FC = () => {
  const tables = useRestaurantStore((state) => state.tables);
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || 'tbl-01');
  const [targetMode, setTargetMode] = useState<'local' | 'render'>('local');

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const origin = window.location.origin;

  const targetUrl = targetMode === 'local'
    ? `${origin}/r/saffron-house/menu?t=${selectedTable.public_token}`
    : `https://menuz.onrender.com/r/saffron-house/menu?t=${selectedTable.public_token}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(targetUrl)}&color=1C1917&bgcolor=FFFFFF`;

  return (
    <div className="min-h-screen bg-ivory-50 p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="text-center max-w-md mx-auto">
        <span className="text-xs uppercase font-bold text-saffron-700 tracking-wider">Instant QR Scanner</span>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900 mt-1">Scan Your Table Code</h1>
        <p className="text-xs text-charcoal-700/70 mt-1">
          Point your phone's camera at the QR code below to launch the diner mobile menu.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="bg-ivory-200/60 p-1 rounded-2xl flex space-x-1">
          <button
            onClick={() => setTargetMode('local')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              targetMode === 'local'
                ? 'bg-white text-charcoal-900 shadow-subtle'
                : 'text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-saffron-600" />
            <span>This Computer / Local Wi-Fi</span>
          </button>

          <button
            onClick={() => setTargetMode('render')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              targetMode === 'render'
                ? 'bg-white text-charcoal-900 shadow-subtle'
                : 'text-charcoal-700 hover:text-charcoal-900'
            }`}
          >
            <Globe className="w-4 h-4 text-saffron-600" />
            <span>Render Production</span>
          </button>
        </div>
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

      {/* Big QR Display Card */}
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-float border border-ivory-200 text-center">
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-700">Saffron House</span>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">{selectedTable.label}</h2>
          <span className="text-xs text-charcoal-700/60 block mt-0.5">Contemporary Indian Dining</span>
        </div>

        {/* The QR Image */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 mx-auto bg-white rounded-2xl p-4 border-2 border-dashed border-saffron-300 flex items-center justify-center shadow-subtle">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${selectedTable.label}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* URL Display */}
        <div className="mt-4 p-2.5 bg-ivory-50 rounded-xl border border-ivory-200 text-[11px] text-charcoal-800 break-all">
          <span className="font-mono text-saffron-800 font-semibold">{targetUrl}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex space-x-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-3 rounded-xl text-xs shadow-subtle flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Link Directly</span>
          </a>

          <a
            href={qrImageUrl}
            download={`SaffronHouse_${selectedTable.label}_QR.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 bg-ivory-100 hover:bg-ivory-200 text-charcoal-900 font-semibold py-3 rounded-xl text-xs border border-ivory-200 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Save Image</span>
          </a>
        </div>
      </div>
    </div>
  );
};
