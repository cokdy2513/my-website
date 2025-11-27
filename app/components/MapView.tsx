/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMapEvents } from "react-leaflet";
import type { Course } from "@/lib/types";
import { haversine } from "@/lib/distance";
import "leaflet/dist/leaflet.css";

type Props = {
  courses: Course[];
  home: { lat: number; lng: number };
  selectedId?: string;
  onSelect: (id: string) => void;
  onHomeChange: (lat: number, lng: number) => void;
};

function ClickHandler({ onHomeChange }: { onHomeChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onHomeChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function MapView({ courses, home, selectedId, onSelect, onHomeChange }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [zoom] = useState(11);

  const homeWithDist = useMemo(
    () =>
      courses
        .map((c) => ({
          ...c,
          dist: haversine(home.lat, home.lng, c.lat, c.lng),
        }))
        .sort((a, b) => a.dist - b.dist),
    [courses, home]
  );

  if (!mounted) return <div className="h-[520px] glass rounded-2xl" />;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <MapContainer center={[home.lat, home.lng]} zoom={zoom} style={{ height: 520 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker center={[home.lat, home.lng]} radius={10} color="#5be2b0" weight={4}>
          <Tooltip direction="top">기준 위치</Tooltip>
        </CircleMarker>
        {homeWithDist.map((c) => {
          const baseColor = c.mode === "필기" ? "#66a6ff" : "#f97316";
          const activeColor = c.mode === "필기" ? "#8ec5ff" : "#fb923c";
          return (
            <CircleMarker
              key={c.id}
              center={[c.lat, c.lng]}
              radius={selectedId === c.id ? 11 : 8}
              color={selectedId === c.id ? activeColor : baseColor}
              weight={3}
              eventHandlers={{ click: () => onSelect(c.id) }}
            >
              <Tooltip direction="top">
                {c.title} · {c.dist.toFixed(1)} km
              </Tooltip>
            </CircleMarker>
          );
        })}
        <ClickHandler onHomeChange={onHomeChange} />
      </MapContainer>
    </div>
  );
}
