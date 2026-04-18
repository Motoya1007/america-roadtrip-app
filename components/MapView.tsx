'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import type { Destination } from '@/types';
import 'leaflet/dist/leaflet.css';

interface Props {
  destinations: Destination[];
}

export default function MapView({ destinations }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // cancelled flag prevents async race in React strict-mode double-invoke
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

      const points: [number, number][] = [];

      for (const d of destinations) {
        if (d.lat == null || d.lng == null) continue;

        // DivIcon avoids webpack asset-path issues with default marker images
        const icon = L.divIcon({
          html: '<span style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))">📍</span>',
          className: '',
          iconSize: [24, 28],
          iconAnchor: [12, 28],
          popupAnchor: [0, -28],
        });

        const popup = `
          <div style="min-width:155px;font-family:system-ui,sans-serif;line-height:1.5">
            <div style="font-weight:700;font-size:14px">${d.name}</div>
            <div style="color:#6b7280;font-size:12px">${d.state} · ${d.category}</div>
            <div style="font-size:12px">Priority: <b>${d.priority}</b></div>
            ${d.note ? `<div style="font-size:12px;color:#374151;margin-top:3px;font-style:italic">${d.note}</div>` : ''}
          </div>`;

        L.marker([d.lat, d.lng], { icon }).addTo(map).bindPopup(popup, {
          maxWidth: 240,
        });

        points.push([d.lat, d.lng]);
      }

      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points).pad(0.12));
      } else if (points.length === 1) {
        map.setView(points[0], 9);
      }
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // destinations is stable at mount time — map page waits for data before rendering

  return <div ref={containerRef} className="w-full h-full" />;
}
