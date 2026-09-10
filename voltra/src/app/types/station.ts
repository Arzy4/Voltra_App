export type chargingTypes = {
    type: "Normal" | "Fast" | "Ultra";
    power: number;
    total: number;
    available: number;
    pricePerKwh: number;
};

export type station = {
  id: number;
  name: string;
  location: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
  chargingTypes: chargingTypes[];
  status: string;
};

export type ChargingSlot = {
  id: number;
  slotCode: string;
  stationId: number;
  chargerType: "NORMAL" | "FAST" | "ULTRA";
  powerKw: number;
  pricePerKwh: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
};