"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContactModalContextType {
  isOpen: boolean;
  openInternal: () => void;
  closeInternal: () => void;
  openBooking: (planId?: string) => void;
  openMessage: () => void;
  initialTab: "message" | "booking";
  preselectedPlan: string | null;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export const ContactModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<"message" | "booking">("message");
  const [preselectedPlan, setPreselectedPlan] = useState<string | null>(null);

  const openInternal = () => {
    setIsOpen(true);
  };

  const closeInternal = () => {
    setIsOpen(false);
    setPreselectedPlan(null);
  };
  
  const openBooking = (planId?: string) => {
    setInitialTab("booking");
    setPreselectedPlan(planId || null);
    setIsOpen(true);
  };

  const openMessage = () => {
    setInitialTab("message");
    setPreselectedPlan(null);
    setIsOpen(true);
  };

  return (
    <ContactModalContext.Provider value={{ isOpen, openInternal, closeInternal, openBooking, openMessage, initialTab, preselectedPlan }}>
      {children}
    </ContactModalContext.Provider>
  );
};

export const useContactModal = () => {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error('useContactModal must be used within a ContactModalProvider');
  }
  return context;
};
