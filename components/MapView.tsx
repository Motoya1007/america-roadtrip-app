'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { Destination } from '@/types';
import 'leaflet/dist/leaflet.css';

interface Props {
  destinations: Destination[];
}

function makeCircleIcon(bg: string, label: string) {
  return `<div style="
    width:30px;height:30px;
    background:${bg};
    border:2.5px solid white;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:10px;font-weight:700;
    box-shadow:0 1px 5px rgba(0,0,0,.45);
    font-family:system-ui,sans-serif;
    line-height:1;
  ">${label}</div>`;
}

const ROLE_ICON = {
  start: makeCircleIcon('#16a34a', 'START'),
  goal: makeCircleIcon('#dc2626', 'GOAL'),
} as const;

export default function MapView({ destinations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  // Stores the marker-update function once Leaflet is ready
  const updateMarkersRef = useRef<((dests: Destination[]) => void) | null>(null);
  // Keeps the latest destinations value accessible inside the async init closure
  const destinationsRef = useRef(destinations);
  destinationsRef.current = destinations;

  // Initialize the map once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    import('leaflet').then(({ default: L }) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [39.5, -98.35],
        zoom: 4,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      let markers: Marker[] = [];
      let fitted = false; // fitBounds runs only on the first render

      function renderMarkers(dests: Destination[]) {
        // Remove all existing markers
        markers.forEach((m) => m.remove());
        markers = [];

        const points: [number, number][] = [];

        for (const d of dests) {
          let iconHtml: string;
          let iconSize: [number, number];
          let iconAnchor: [number, number];

          if (d.type === 'start' || d.type === 'goal') {
            iconHtml = ROLE_ICON[d.type];
            iconSize = [30, 30];
            iconAnchor = [15, 30];
          } else {
            iconHtml =
              '<span style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))">📍</span>';
            iconSize = [24, 28];
            iconAnchor = [12, 28];
          }

          const icon = L.divIcon({
            html: iconHtml,
            className: '',
            iconSize,
            iconAnchor,
            popupAnchor: [0, -(iconAnchor[1] + 4)],
          });

          let roleLabel = '';
          if (d.type === 'start') {
            roleLabel = `<div style="font-size:11px;font-weight:700;color:#16a34a;letter-spacing:.05em;margin-bottom:2px">🟢 START</div>`;
          } else if (d.type === 'goal') {
            roleLabel = `<div style="font-size:11px;font-weight:700;color:#dc2626;letter-spacing:.05em;margin-bottom:2px">🏁 GOAL</div>`;
          }

          const travelersHtml =
            d.travelers.length > 0
              ? `<div style="font-size:12px;margin-top:4px;color:#374151">
                  <span style="color:#9ca3af">Going:</span>
                  <b>${d.travelers.join(', ')}</b>
                 </div>`
              : '';

          const popup = `
            <div style="min-width:160px;font-family:system-ui,sans-serif;line-height:1.5">
              ${roleLabel}
              <div style="font-weight:700;font-size:14px">${d.name}</div>
              <div style="color:#6b7280;font-size:12px">${d.state} · ${d.category}</div>
              <div style="font-size:12px">Priority: <b>${d.priority}</b></div>
              ${travelersHtml}
              ${d.note ? `<div style="font-size:12px;color:#374151;margin-top:4px;font-style:italic">${d.note}</div>` : ''}
            </div>`;

          const marker = L.marker([d.latitude, d.longitude], { icon })
            .addTo(map)
            .bindPopup(popup, { maxWidth: 260 });
          markers.push(marker);
          points.push([d.latitude, d.longitude]);
        }

        // Fit bounds only on the very first render — never on polling updates
        if (!fitted) {
          if (points.length > 1) {
            map.fitBounds(L.latLngBounds(points).pad(0.12));
          } else if (points.length === 1) {
            map.setView(points[0], 9);
          }
          fitted = true;
        }
      }

      // Expose renderMarkers so the destinations effect can call it
      updateMarkersRef.current = renderMarkers;
      // Render with the latest destinations (may have updated while Leaflet was loading)
      renderMarkers(destinationsRef.current);
    });

    return () => {
      cancelled = true;
      updateMarkersRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render markers whenever destinations prop changes (polling updates)
  useEffect(() => {
    destinationsRef.current = destinations;
    updateMarkersRef.current?.(destinations);
  }, [destinations]);

  return <div ref={containerRef} className="w-full h-full" />;
}
