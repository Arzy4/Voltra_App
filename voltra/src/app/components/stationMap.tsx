"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import { ChargingStationsData } from "../data/chargingStationsData";

const surabayaCenter: LatLngExpression = [-7.2575, 112.7521];

export default function StationMap() {
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

      {ChargingStationsData.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude] as LatLngExpression}
        >
          <Popup>
            <div>
              <h2 className="font-bold">{station.name}</h2>
              <p>{station.address}</p>
              <p>Status: {station.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}