import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PUNE_CENTER } from '../../data/partnerGeo';

export interface MapPartner {
  id: string;
  name: string;
  lat: number;
  lng: number;
  /** Google rating, or undefined when none has been entered. */
  rating?: number;
  /** Tonight's discount, e.g. "25%". When set, the pin flips between it and the rating. */
  offer?: string;
}

interface Props {
  token: string;
  partners: MapPartner[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDeselect?: () => void;
  /** Called once the map tiles have loaded, so the page can drop its loading screen. */
  onReady?: () => void;
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

let flipStyleAdded = false;
/** One shared stylesheet for the 3-second rating <-> discount flip (6s cycle). */
function ensureFlipStyle() {
  if (flipStyleAdded || typeof document === 'undefined') return;
  flipStyleAdded = true;
  const st = document.createElement('style');
  st.textContent =
    '@keyframes mzOffer{0%,46%{opacity:1}54%,100%{opacity:0}}' +
    '@keyframes mzRate{0%,46%{opacity:0}54%,100%{opacity:1}}';
  document.head.appendChild(st);
}

function bubble(text: string, bg: string, selected: boolean): HTMLDivElement {
  const b = document.createElement('div');
  b.textContent = text;
  b.style.cssText =
    `background:${bg};color:#FFFFFF;font:600 ${selected ? 15 : 13}px Rubik,system-ui,sans-serif;` +
    `padding:${selected ? 7 : 5}px ${selected ? 12 : 9}px;border-radius:13px;white-space:nowrap;` +
    'box-shadow:0 3px 10px rgba(0,0,0,.25);text-align:center;' +
    (selected ? `outline:3px solid ${PALETTE.orange};` : '');
  return b;
}

/**
 * Pins never show the restaurant's name — that appears in the card when a pin is tapped.
 * A pin shows its rating, flips to tonight's discount when there is one, and is a plain dot
 * when a restaurant has no rating yet.
 */
function pinElement(partner: MapPartner, selected: boolean): HTMLDivElement {
  const el = document.createElement('div');
  el.style.cssText = 'cursor:pointer;display:flex;flex-direction:column;align-items:center;';
  const hasRating = typeof partner.rating === 'number';
  el.setAttribute('role', 'button');
  el.setAttribute(
    'aria-label',
    `${partner.name}${hasRating ? `, rating ${partner.rating!.toFixed(1)}` : ''}${partner.offer ? `, ${partner.offer} off` : ''}`
  );

  const tail = document.createElement('div');
  const tailColor = PALETTE.green;
  tail.style.cssText =
    'width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;' +
    `border-top:7px solid ${tailColor};`;

  if (!hasRating && !partner.offer) {
    const dot = document.createElement('div');
    const d = selected ? 22 : 18;
    dot.style.cssText =
      `width:${d}px;height:${d}px;border-radius:50%;background:${PALETTE.green};border:3px solid #fff;` +
      'box-shadow:0 2px 8px rgba(0,0,0,.3);' +
      (selected ? `outline:3px solid ${PALETTE.orange};` : '');
    el.append(dot);
    return el;
  }

  const rate = hasRating ? bubble(`★ ${partner.rating!.toFixed(1)}`, PALETTE.green, selected) : null;
  if (partner.offer && rate) {
    ensureFlipStyle();
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;display:grid;';
    const off = bubble(`${partner.offer} off`, PALETTE.orange, selected);
    for (const b of [off, rate]) b.style.gridArea = '1 / 1';
    off.style.animation = 'mzOffer 6s infinite';
    rate.style.animation = 'mzRate 6s infinite';
    wrap.append(off, rate);
    el.append(wrap, tail);
  } else {
    el.append(partner.offer ? bubble(`${partner.offer} off`, PALETTE.orange, selected) : rate!, tail);
  }
  return el;
}

export const PartnerMap: React.FC<Props> = ({ token, partners, selectedId, onSelect, onDeselect, onReady }) => {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const fullCount = useRef(0);
  const deselectRef = useRef<(() => void) | undefined>(onDeselect);
  deselectRef.current = onDeselect;

  // Create the map once.
  useEffect(() => {
    if (!container.current || mapRef.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: container.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: PUNE_CENTER,
      zoom: 13.2,
      minZoom: 12.4, // zoom-out is locked: pins are always shown one by one; swipe to explore
      maxBounds: [[73.72, 18.46], [73.98, 18.64]],
      attributionControl: false,
      cooperativeGestures: false
    });
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
    map.on('style.load', () => applyMenuzStyle(map));
    map.once('idle', () => onReady?.());
    map.on('click', () => deselectRef.current?.());
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  const rebuildRef = useRef<() => void>(() => undefined);

  // Pins that would overlap on screen merge into a numbered circle; zooming in splits them.
  rebuildRef.current = () => {
    const map = mapRef.current;
    if (!map) return;
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    // Every restaurant keeps its own pin. Where two would sit on top of each other on screen,
    // the later one slides sideways into the nearest free slot (never merged into a number).
    const W = 58, H = 30;
    const placed = partners
      .map((p) => ({ p, pt: map.project([p.lng, p.lat]), dx: 0 }))
      .sort((m, n) => m.pt.y - n.pt.y || m.pt.x - n.pt.x);
    const taken: { x: number; y: number }[] = [];
    const slots = [0, 1, -1, 2, -2, 3, -3, 4, -4];
    for (const q of placed) {
      for (const k of slots) {
        const x = q.pt.x + k * W;
        if (!taken.some((t) => Math.abs(t.x - x) < W && Math.abs(t.y - q.pt.y) < H)) {
          q.dx = k * W;
          taken.push({ x, y: q.pt.y });
          break;
        }
      }
    }
    const solo = placed.find((x) => x.p.id === selectedId) || null;

    const add = (el: HTMLElement, lng: number, lat: number, top = false, dx = 0) => {
      const m = new mapboxgl.Marker({ element: el, anchor: 'bottom', offset: [dx, 0] }).setLngLat([lng, lat]).addTo(map);
      if (top) m.getElement().style.zIndex = '5';
      markers.current.push(m);
    };

    for (const g of placed) {
      if (g === solo) continue;
      const q = g.p;
      const el = pinElement(q, false);
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect(q.id);
        map.easeTo({ center: [q.lng, q.lat], offset: [0, -110], duration: 450 });
      });
      add(el, q.lng, q.lat, false, g.dx);
    }
    if (solo) {
      const q = solo.p;
      const el = pinElement(q, true);
      el.addEventListener('click', (e) => e.stopPropagation());
      add(el, q.lng, q.lat, true, solo.dx);
    }
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const redraw = () => rebuildRef.current();
    map.on('zoomend', redraw);
    redraw();
    return () => {
      map.off('zoomend', redraw);
    };
  }, [partners, selectedId, onSelect]);

  // Opening view: the busy middle of Pune, not every pin squeezed into one screen.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || partners.length === 0) return;
    fullCount.current = Math.max(fullCount.current, partners.length);
    const isFullSet = partners.length >= fullCount.current;
    map.setMinZoom(isFullSet ? 12.4 : 11);
    if (isFullSet && partners.length > 4) {
      // Fit central Pune (Camp, Deccan, Koregaon Park, Yerawada) to whatever screen this is, keeping
      // the pins clear of the bottom card. Baner and Viman Nagar are a swipe away.
      map.fitBounds(
        [
          [73.832, 18.508],
          [73.902, 18.560]
        ],
        { padding: { top: 40, bottom: 310, left: 28, right: 28 }, maxZoom: 13.2, duration: 0 }
      );
      return;
    }
    if (partners.length === 1) {
      map.easeTo({ center: [partners[0].lng, partners[0].lat], zoom: 14.5, offset: [0, -110] });
      return;
    }
    const b = new mapboxgl.LngLatBounds();
    partners.forEach((p) => b.extend([p.lng, p.lat]));
    map.fitBounds(b, { padding: { top: 50, bottom: 300, left: 70, right: 70 }, maxZoom: 14.5, duration: 600 });
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
