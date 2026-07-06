export type chargingTypes = {
    type: "Normal" | "Fast" | "Ultra";
    power: number;
    total: number;
    available: number;
};

export type station = {
  id: number;
  name: string;
  location: string;
  area: string;
  address: string;
  chargingTypes: chargingTypes[];
  status: string;
};