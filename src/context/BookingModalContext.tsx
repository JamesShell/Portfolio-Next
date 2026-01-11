"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export const BookingModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <BookingModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </BookingModalContext.Provider>
  );
};

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (context === undefined) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
};
