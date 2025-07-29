"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

export default function Map() {
  function SaveMapInstance() {
    const map = useMap();
    useEffect(() => {
      const updateBounds = () => {
        (window as any)._leafletBounds = map.getBounds();
      };
      updateBounds();
      map.on("moveend", updateBounds);
    }, [map]);
    return null;
  }

  return (
    <MapContainer
      className="border-2 rounded-xl border-white shadow-[0_0_15px_rgba(255,255,255,0.8)]" 
      center={[20, 0]}
      zoom={2}
      style={{ width: "50%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <SaveMapInstance />
    </MapContainer>
  );
}
