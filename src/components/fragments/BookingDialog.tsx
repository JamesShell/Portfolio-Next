"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useBookingModal } from "@/context/BookingModalContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { X, Calendar, CheckCircle } from "@phosphor-icons/react";
import { nyght } from "@/assets/font";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendGAEvent } from "@next/third-parties/google";

const BookingDialog = () => {
  const { isOpen, close } = useBookingModal();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState({ date: "", time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Track dialog open
      sendGAEvent('event', 'booking_dialog_open', { value: 1 });
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleClose = () => {
    close();
    // Reset form after close
    setTimeout(() => {
      setName("");
      setSelectedDateTime({ date: "", time: "" });
      setSubmitStatus(null);
      setNameError("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate name
    if (!name.trim() || name.trim().length < 2) {
      setNameError("Please enter your name (at least 2 characters)");
      return;
    }
    setNameError("");

    // Validate date/time
    if (!selectedDateTime.date || !selectedDateTime.time) {
      setSubmitStatus({ type: 'error', message: 'Please select a date and time' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, "bookings"), {
        name: name.trim(),
        date: selectedDateTime.date,
        time: selectedDateTime.time,
        createdAt: serverTimestamp(),
      });

      // Track successful booking
      sendGAEvent('event', 'booking_submitted', { 
        name: name.trim(),
        date: selectedDateTime.date,
        time: selectedDateTime.time 
      });

      setSubmitStatus({ type: 'success', message: 'Call booked successfully! I\'ll confirm within 24 hours.' });
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2500);

    } catch (error) {
      console.error('Error saving booking:', error);
      setSubmitStatus({ type: 'error', message: 'Failed to book call. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors z-20 group"
            >
              <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" weight="bold" />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-primary" weight="duotone" />
                <Badge className="text-xs font-medium bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" variant="outline">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
                  Next slots available
                </Badge>
              </div>

              <h2 className={`text-2xl font-bold mb-1 text-zinc-900 dark:text-zinc-100 ${nyght.className}`}>
                Book a 15-min call
              </h2>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Quick intro call to discuss your project. I'll confirm within 24 hours.
              </p>

              {/* Success State */}
              {submitStatus?.type === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" weight="fill" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Call Booked!
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {submitStatus.message}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      placeholder="John Doe"
                      className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent"
                    />
                    {nameError && (
                      <p className="text-xs mt-1.5 text-red-600 dark:text-red-400">{nameError}</p>
                    )}
                  </div>

                  {/* Date/Time Picker */}
                  <DateTimePicker
                    value={selectedDateTime}
                    onChange={setSelectedDateTime}
                  />

                  {/* Error Message */}
                  {submitStatus?.type === 'error' && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
                      {submitStatus.message}
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedDateTime.date || !selectedDateTime.time}
                    className="w-full h-12 font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Booking...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Book Call
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default BookingDialog;
