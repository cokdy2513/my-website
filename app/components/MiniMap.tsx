"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);

type Props = { center: LatLngExpression; mode?: "필기" | "실기" };

export function MiniMap({ center, mode }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="mini-map glass" />;
  const color = mode === "실기" ? "#f97316" : "#66a6ff";
  return (
    <div className="mini-map">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        dragging={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CircleMarker center={center as [number, number]} radius={7} color={color} weight={3} />
      </MapContainer>
    </div>
  );
}
