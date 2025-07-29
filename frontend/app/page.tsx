"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLngBounds } from "leaflet";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async (bounds: LatLngBounds) => {
    setLoading(true);       // start loading
    setResult("");          // clear old result

    const body = {
      bounds: {
        southWest: {
          lat: bounds.getSouthWest().lat,
          lng: bounds.getSouthWest().lng,
        },
        northEast: {
          lat: bounds.getNorthEast().lat,
          lng: bounds.getNorthEast().lng,
        },
      },
      startYear: Number(startYear),
      endYear: Number(endYear),
    };

    try {
      const res = await fetch("http://localhost:5000/desc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setResult(data.history);
    } catch (err) {
      console.error(err);
      setResult("Failed to fetch history.");
    } finally {
      setLoading(false);  // stop loading
    }
  };

  return (
    <main className=" h-screen bg-black font-serif">
      <div className="justify-items-center text-7xl my-12 font-serif">
        <h1>World History</h1>
      </div>

      {/* Top bar */}
      <div className="p-4 flex gap-4 justify-center">
        <input
          type="number"
          placeholder="Start Year"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="border border-gray-300 bg-white text-black rounded-lg px-3 py-1 w-28 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
        <input
          type="number"
          placeholder="End Year"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="border border-gray-300 bg-white text-black rounded-lg px-3 py-1 w-28 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        />
      </div>

      {/* Map */}
      <div className="flex-1 justify-items-center h-128">
        <Map />
      </div>

      <div className="flex my-4 justify-center">
        <button
          className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg
                     hover:bg-yellow-500
                     shadow-[0_0_15px_rgba(255,215,0,0.6)]
                     hover:shadow-[0_0_25px_rgba(255,215,0,0.9)]
                     transition-all duration-300"
          onClick={() => {
            // @ts-ignore
            const bounds = window._leafletBounds as LatLngBounds;
            if (bounds) handleFetch(bounds);
          }}
        >
          Explore
        </button>
      </div>

      {/* Results */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-yellow-400">Result</h3>
        {loading ? (
          <p className="text-white animate-pulse">Loading...</p>
        ) : (
          <p className="text-white">{result}</p>
        )}
      </div>
    </main>
  );
}
