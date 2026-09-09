"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type SelectedBooking = {
  stationId: number;
  stationName: string;
  slotId: number;
  slotCode: string;
  chargerType: string;
  powerKw: number;
  pricePerKwh: number;
};

type BookingContextType = {
  selectedBooking: SelectedBooking | null;
  selectBooking: (booking: SelectedBooking) => void;
  clearBooking: () => void;
};

const BookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function BookingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedBooking, setSelectedBooking] =
    useState<SelectedBooking | null>(null);

  const selectBooking = (booking: SelectedBooking) => {
    setSelectedBooking(booking);
  };

  const clearBooking = () => {
    setSelectedBooking(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedBooking,
        selectBooking,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error(
      "useBooking must be used inside BookingProvider"
    );
  }

  return context;
}