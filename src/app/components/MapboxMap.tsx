"use client";

import { useEffect, useRef, useState } from "react";
import ReactMapGl, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getErrorMessage } from "../constants/errors";
import { Yurbo } from "@/types/types";
import Link from "next/link";

interface MapboxMapProps {
  mapboxToken: string;
  yurbos: Yurbo[];
}

export default function MapboxMap({ mapboxToken, yurbos }: MapboxMapProps) {
  const [initialViewport, setInitialViewport] = useState({
    // dummy lat and long info before finding location
    latitude: -999,
    longitude: -999,
    zoom: 11,
    width: "100%",
    height: "100%",
  });

  const markers = yurbos.map((y) => ({
    latitude: y.lat,
    longitude: y.long,
    name: y.name,
  }));

  // const [yurbos, setYurbos] = useState<Yurbo[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setInitialViewport({
        ...initialViewport,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        zoom: 11,
        width: "100%",
        height: "100%",
      });
    });
  }, []);

  return (
    <>
      {initialViewport.latitude != -999 &&
        initialViewport.longitude != -999 && (
          <ReactMapGl
            mapStyle="mapbox://styles/david-ham/clr6mfjmg010z01qu02xbhf0w"
            mapboxAccessToken={mapboxToken}
            initialViewState={initialViewport}
          >
            {markers.map((m) => (
              <Marker
                key={"m_" + m.latitude.toString() + m.latitude.toString()}
                longitude={m.longitude}
                latitude={m.latitude}
              ></Marker>
            ))}
          </ReactMapGl>
        )}
    </>
  );
}
