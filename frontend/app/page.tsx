"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import type { LatLngBounds } from "leaflet";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

function formatResult(text: string) {
  const lines = text.split('\n');

  return lines.map((line, i) => {
    // Heading: line starts with '###'
    if (line.startsWith('###')) {
      const headingText = line.replace(/^###\s*/, '');
      return (
        <h2 key={i} className="text-yellow-600 text-3xl font-bold my-4">
          {headingText}
        </h2>
      );
    }

    // Regular line: check for **bold** segments
    const parts = line.split(/(\*\*.*?\*\*)/g); // split by **...**
    return (
      <p key={i} className="text-white text-lg mb-2">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return (
              <span key={j} className="font-bold text-yellow-200">
                {content}
              </span>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

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
      <div className="p-4 px-24 justify-center">
  {loading ? (
    <p className="text-white animate-pulse">Loading...</p>
  ) : (
    <div>{formatResult(result)}</div>
  )}
</div>

    </main>
  );
}
