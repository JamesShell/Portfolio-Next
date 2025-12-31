"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { object, string } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Send, Calendar, MessageSquare, X, Check } from "lucide-react";
import { nyght } from "@/assets/font";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendGAEvent } from "@next/third-parties/google";

// Define Zod schemas for validation
const contactSchema = object({
  fullName: string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: string().trim().email("Please enter a valid email address"),
  subject: string().trim().min(5, "Subject must be at least 5 characters").max(100),
  body: string().trim().min(10, "Message must be at least 10 characters").max(500),
  plan: string().optional().or(string().length(0)).nullable(),
});

const bookingSchema = object({
  fullName: string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: string().trim().email("Please enter a valid email address"),
  company: string().trim().optional().or(string().length(0)),
  date: string().min(1, "Please select a date"),
  time: string().min(1, "Please select a time"),
  notes: string().trim().optional().or(string().length(0)),
  plan: string().min(1, "Please select a plan"),
});

const ContactDialog = () => {
  const { isOpen, closeInternal, initialTab, preselectedPlan } = useContactModal();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"message" | "booking">("message");
  const [selectedDateTime, setSelectedDateTime] = useState({ date: "", time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveTab(initialTab);
      // Set preselected plan if provided
      if (preselectedPlan) {
        if (initialTab === "booking") {
          bookingForm.setValue("plan", preselectedPlan, { shouldValidate: false });
        } else if (initialTab === "message") {
          contactForm.setValue("plan", preselectedPlan, { shouldValidate: false });
        }
      }
    } else {
      document.body.style.overflow = "unset";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTab, preselectedPlan]);

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      body: "",
      plan: "",
    },
  });

  const bookingForm = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      date: "",
      time: "",
      notes: "",
      plan: "",
    },
  });


  const handleContactSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'message', ...data }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        contactForm.reset();
        sendGAEvent('event', 'contact_message_sent', { value: data.fullName });
        setSubmitStatus({ type: 'success', message: result.message });
      } else {
        setSubmitStatus({ type: 'error', message: result.message || 'Failed to send message' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const formData = {
        ...data,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
      };

      const validationResult = bookingSchema.safeParse(formData);
      
      if (!validationResult.success) {
        validationResult.error.errors.forEach((error) => {
          if (error.path[0]) {
            bookingForm.setError(error.path[0] as any, {
              type: 'manual',
              message: error.message,
            });
          }
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'booking', ...formData }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        bookingForm.reset();
        setSelectedDateTime({ date: "", time: "" });
        sendGAEvent('event', 'calendar_booking', { value: formData.plan });
        setSubmitStatus({ type: 'success', message: result.message });
      } else {
        setSubmitStatus({ type: 'error', message: result.message || 'Failed to book call' });
      }
    } catch (error) {
      console.error('Error submitting booking form:', error);
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
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
            onClick={closeInternal}
            className="absolute inset-0 bg-black/40"
            style={{ willChange: 'opacity' }}
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
            style={{ 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={closeInternal}
              className="absolute top-4 right-4 p-2 rounded-lgtransition-colors z-20 group"
            >
              <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
            </button>

            {/* Scrollable Content Area - Optimized for performance */}
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden"
              style={{ 
                scrollBehavior: 'auto',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                contain: 'layout style paint',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            >
               <div className="relative rounded-[1.5rem] p-8 border bg-white border-zinc-200 shadow-[0_0_0_3px_#fafafa,0_0_0_4px_rgba(0,0,0,0.2)] dark:bg-zinc-900 dark:border-zinc-700 dark:shadow-[0_0_0_3px_#27272a,0_0_0_4px_rgba(255,255,255,0.3)] overflow-hidden mx-8 mt-8">
                {/* Purple gradient at top */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-purple-100/50 dark:from-purple-900/10 via-pink-50/30 dark:via-pink-900/5 to-transparent dark:to-zinc-900/0 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Badge className="flex items-center gap-2 text-xs font-medium bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 px-3 py-1 rounded-full" variant={'outline'}>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Available for work
                    </Badge>
                  </div>
                  
                  <h2 className={`text-3xl font-bold mb-2 text-zinc-900 dark:text-zinc-100 ${nyght.className}`}>
                    Let's start a project together
                  </h2>
                  
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-12">
                    Fill out the form below and I'll get back to you within 24 hours.
                  </p>

                  {/* Tabs - Custom design matching reference */}
                  <div className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                    <button
                      onClick={() => {
                        // Preserve plan value when switching tabs
                        const currentPlan = activeTab === "booking" 
                          ? bookingForm.getValues("plan") 
                          : contactForm.getValues("plan");
                        
                        setActiveTab("message");
                        setSubmitStatus(null);
                        contactForm.clearErrors();
                        
                        // Set plan value if it exists
                        if (currentPlan) {
                          contactForm.setValue("plan", currentPlan, { shouldValidate: false });
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium text-sm ${
                        activeTab === "message"
                          ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                          : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                      style={{ transition: 'background-color 0.2s, color 0.2s' }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      onClick={() => {
                        // Preserve plan value when switching tabs
                        const currentPlan = activeTab === "message" 
                          ? contactForm.getValues("plan") 
                          : bookingForm.getValues("plan");
                        
                        setActiveTab("booking");
                        setSubmitStatus(null);
                        bookingForm.clearErrors();
                        
                        // Set plan value if it exists
                        if (currentPlan) {
                          bookingForm.setValue("plan", currentPlan, { shouldValidate: false });
                        }
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-medium text-sm ${
                        activeTab === "booking"
                          ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                          : "bg-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                      }`}
                      style={{ transition: 'background-color 0.2s, color 0.2s' }}
                    >
                      <Calendar className="w-4 h-4" />
                      Book a Call
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8" style={{ transform: 'translateZ(0)' }}>
                {/* Status Messages */}
                {submitStatus && (
                  <div
                    className={`mb-6 p-4 rounded-lg border ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                {activeTab === "message" ? (
                  <Form key="message" {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                      <FormField
                        control={contactForm.control}
                        name="fullName"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Full Name</FormLabel>
                            <FormControl>
                              <input 
                                placeholder="John Doe" 
                                className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent" 
                                style={{ transition: 'none' }}
                                {...field} 
                              />
                            </FormControl>
                            {fieldState.error && (fieldState.isTouched || contactForm.formState.isSubmitted) && (
                              <p className="text-xs mt-1 text-red-600 dark:text-red-400">{fieldState.error.message}</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Email</FormLabel>
                            <FormControl>
                              <input 
                                placeholder="john@example.com" 
                                type="email" 
                                className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent" 
                                style={{ transition: 'none' }}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Subject</FormLabel>
                            <FormControl>
                              <input 
                                placeholder="Project inquiry..." 
                                className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent" 
                                style={{ transition: 'none' }}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      {/* Hidden plan field - data is collected but not displayed */}
                      <FormField
                        control={contactForm.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <input type="hidden" {...field} value={field.value || ""} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactForm.control}
                        name="body"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Message</FormLabel>
                            <FormControl>
                              <textarea 
                                placeholder="Tell me about your project..." 
                                className="w-full min-h-[120px] px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent resize-none" 
                                style={{ transition: 'none' }}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 rounded-full animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Send Message <Send className="w-4 h-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <Form key="booking" {...bookingForm}>
                    <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} className="space-y-6">
                      <FormField
                        control={bookingForm.control}
                        name="fullName"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Full Name</FormLabel>
                            <FormControl>
                              <input 
                                placeholder="John Doe" 
                                className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent" 
                                style={{ transition: 'none' }}
                                {...field} 
                              />
                            </FormControl>
                            {fieldState.error && (fieldState.isTouched || bookingForm.formState.isSubmitted) && (
                              <p className="text-xs mt-1 text-red-600 dark:text-red-400">{fieldState.error.message}</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={bookingForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Email</FormLabel>
                              <FormControl>
                                <input 
                                  placeholder="john@example.com" 
                                  type="email" 
                                  className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent" 
                                  style={{ transition: 'none' }}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-xs mt-1" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={bookingForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Company</FormLabel>
                              <FormControl>
                                <input 
                                  placeholder="Optional" 
                                  className="w-full h-12 px-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent"
                                  style={{ transition: 'none' }} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-xs mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={bookingForm.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 block">Project Plan</FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {[
                                  { value: 'landing-page', label: 'Landing Page', desc: '$1,999 fixed', price: '$1,999' },
                                  { value: 'premium-page', label: 'Premium Page', desc: '$2,999 fixed', price: '$2,999' },
                                  { value: 'product-partnership', label: 'Product Partnership', desc: '$1,499 / month', price: '$1,499/mo' },
                                ].map((plan) => (
                                  <button
                                    key={plan.value}
                                    type="button"
                                    onClick={() => field.onChange(plan.value)}
                                    className={`relative h-28 px-4 rounded-xl border-2 text-left ${
                                      field.value === plan.value
                                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                                        : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-600'
                                    }`}
                                    style={{ transition: 'background-color 0.15s, border-color 0.15s' }}
                                  >
                                    {field.value === plan.value && (
                                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white dark:text-zinc-900" />
                                      </div>
                                    )}
                                    <div className="font-semibold text-base text-zinc-900 dark:text-zinc-100 mb-1">{plan.label}</div>
                                    <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{plan.desc}</div>
                                  </button>
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Preferred Time</FormLabel>
                        <DateTimePicker
                          value={selectedDateTime}
                          onChange={(dateTime) => {
                            setSelectedDateTime(dateTime);
                            bookingForm.setValue("date", dateTime.date, { shouldValidate: false });
                            bookingForm.setValue("time", dateTime.time, { shouldValidate: false });
                            bookingForm.clearErrors();
                          }}
                        />
                      </div>

                      <FormField
                        control={bookingForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">Notes</FormLabel>
                            <FormControl>
                              <textarea 
                                placeholder="Any specific requirements?" 
                                className="w-full min-h-[80px] px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600 focus:border-transparent resize-none" 
                                style={{ transition: 'none' }}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !selectedDateTime.date || !selectedDateTime.time} 
                        className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                      >
                        {isSubmitting ? 'Booking...' : 'Schedule Call'}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ContactDialog;
