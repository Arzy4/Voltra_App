"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { useEffect } from "react";

const markerIcon = L.icon({
      iconUrl: "/leaflet/marker-icon.png",
      iconRetinaUrl: "/leaflet/marker-icon-2x.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

type Station = {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
};

type StationMapProps = {
  selectedStationId: number | null;
  stations: Station[];
};

function MapController({
  position,
}: {
  position: LatLngExpression | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, 16, {
      duration: 1.5,
    });
  }, [position, map]);

  return null;
}

export default function StationMap({
  selectedStationId,
  stations,
}: StationMapProps) {
  const surabayaCenter: LatLngExpression = [-7.2575, 112.7521];

  const selectedStation = stations.find(
    (station) => station.id === selectedStationId
  );

  const selectedPosition: LatLngExpression | null = selectedStation
    ? [selectedStation.latitude, selectedStation.longitude]
    : null;

  return (
    <MapContainer
      center={surabayaCenter}
      zoom={12}
      scrollWheelZoom={true}
      className="h-full w-full"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController position={selectedPosition} />

      {selectedStation && (
        <Marker
          position={[
            selectedStation.latitude,
            selectedStation.longitude,
          ]}
          icon={markerIcon}
        >
          <Popup>
            <div>
              <h2 className="font-bold">
                {selectedStation.name}
              </h2>

              <p>{selectedStation.address}</p>

              <p>
                Status: {selectedStation.status}
              </p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}