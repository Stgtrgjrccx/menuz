import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PUNE_CENTER } from '../../data/partnerGeo';

export interface MapPartner {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Real Google rating, or undefined when none has been entered. */
  rating?: number;
}

interface Props {
  token: string;
  partners: MapPartner[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const PALETTE = {
  land: '#F5F1E8',
  water: '#CFE0DA',
  park: '#E4EADF',
  green: '#2D4A3E',
  orange: '#F4511E'
};

/** Repaint the stock Mapbox "light" style in the Menuz palette. */
function applyMenuzStyle(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers ?? [];
  for (const layer of layers) {
    const id = layer.id;
    try {
      if (layer.type === 'background') {
        map.setPaintProperty(id, 'background-color', PALETTE.land);
      } else if (layer.type === 'fill' && /water/.test(id)) {
        map.setPaintProperty(id, 'fill-color', PALETTE.water);
      } else if (layer.type === 'fill' && /(park|green|landuse|pitch|wood|grass)/.test(id)) {
        map.setPaintProperty(id, 'fill-color', PALETTE.park);
      } else if (layer.type === 'symbol' && /poi/.test(id)) {
        // Other businesses compete with our pins; keep only roads and neighbourhood names.
        map.setLayoutProperty(id, 'visibility', 'none');
      }
    } catch {
      /* a layer that rejects the property is simply left as-is */
    }
  }
}

function pinElement(partner: MapPartner, selected: boolean): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = 'cursor:pointer;display:flex;flex-direction:column;align-items:center;';
  const hasRating = typeof partner.rating === 'number';
  const bg = hasRating ? PALETTE.green : '#FFFFFF';
  const fg = hasRating ? '#FFFFFF' : PALETTE.green;
  const size = selected ? 16 : 14;
  const label = hasRating ? `★ ${partner.rating!.toFixed(1)}` : partner.name.split(' ')[0];

  const bubble = document.createElement('div');
  bubble.textContent = label;
  bubble.setAttribute('aria-label', `${partner.name}${hasRating ? `, Google rating ${partner.rating}` : ''}`);
  bubble.style.cssText =
    `background:${bg};color:${fg};font:600 ${size}px Rubik,system-ui,sans-serif;` +
    `padding:${selected ? 8 : 6}px ${selected ? 14 : 11}px;border-radius:14px;white-space:nowrap;` +
    `box-shadow:0 3px 10px rgba(0,0,0,.25);border:${hasRating ? 'none' : `1px solid #D7D2C8`};` +
    (selected ? `outline:3px solid ${PALETTE.orange};` : '');

  const tail = document.createElement('div');
  tail.style.cssText =
    'width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;' +
    `border-top:7px solid ${hasRating ? PALETTE.green : '#D7D2C8'};`;

  el.append(bubble, tail);
  return el;
}

export const PartnerMap: React.FC<Props> = ({ token, partners, selectedId, onSelect }) => {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Create the map once.
  useEffect(() => {
    if (!container.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: PUNE_CENTER,
      zoom: 13.2,
      attributionControl: false,
      cooperativeGestures: false
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
    map.on('style.load', () => applyMenuzStyle(map));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  // Redraw pins whenever partners or the selection change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markers.current.forEach((m) => m.remove());
    markers.current = partners.map((p) => {
      const el = pinElement(p, p.id === selectedId);
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect(p.id);
      });
      return new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(map);
    });
  }, [partners, selectedId, onSelect]);

  // Fit the map to all partners.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || partners.length === 0) return;
    if (partners.length === 1) {
      map.easeTo({ center: [partners[0].lng, partners[0].lat], zoom: 14.5, offset: [0, -110] });
      return;
    }
    const b = new mapboxgl.LngLatBounds();
    partners.forEach((p) => b.extend([p.lng, p.lat]));
    map.fitBounds(b, { padding: { top: 50, bottom: 300, left: 70, right: 70 }, maxZoom: 15, duration: 600 });
  }, [partners]);

  // Mapbox's own stylesheet forces the map element to position:relative, which collapses it
  // to zero height inside a flex layout. The outer box is positioned; the map fills it.
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={container} style={{ width: '100%', height: '100%' }} role="region" aria-label="Map of Menuz partner restaurants" />
    </div>
  );
};

export default PartnerMap;
