import React, { useState } from "react";
import { motion } from "framer-motion";
import { slideIn, textVariant, fadeIn } from "@/utils/motion";
import { MoonCanvas, StarsCanvas } from "@/components/canvas";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { object, string } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, Send, Calendar, MessageSquare, Clock } from "lucide-react";
import { nyght } from "@/assets/font";
import SEOHead from '@/components/SEO/Head';
import { organizationStructuredData } from '@/utils/structuredData';
import Navbar from '@/components/fragments/Navbar';
import CTAFooter from "@/components/fragments/cta-footer";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spotlight } from "@/components/ui/spotlight-new";

// Define Zod schemas for validation
const contactSchema = object({
  fullName: string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: string().trim().email("Please enter a valid email address"),
  subject: string().trim().min(5, "Subject must be at least 5 characters").max(100),
  body: string().trim().min(10, "Message must be at least 10 characters").max(500),
});

const bookingSchema = object({
  fullName: string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: string().trim().email("Please enter a valid email address"),
  company: string().trim().optional().or(string().length(0)),
  projectType: string().min(1, "Please select a project type"),
  date: string().min(1, "Please select a date"),
  time: string().min(1, "Please select a time"),
  notes: string().trim().optional().or(string().length(0)),
});

const Contact = () => {
  const [activeTab, setActiveTab] = useState<"message" | "booking">("message");
  const [selectedDateTime, setSelectedDateTime] = useState({ date: "", time: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      body: "",
    },
  });

  const bookingForm = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      projectType: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  const tabOptions = [
    { value: "message", label: "Send Message", icon: <MessageSquare className="w-4 h-4" /> },
    { value: "booking", label: "Book a Call", icon: <Calendar className="w-4 h-4" /> },
  ];

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
      // Ensure date and time are included from selectedDateTime state
      const formData = {
        ...data,
        date: selectedDateTime.date,
        time: selectedDateTime.time,
      };

      console.log('Form data being validated:', formData); // Debug log
      
      // Manual validation
      const validationResult = bookingSchema.safeParse(formData);
      
      if (!validationResult.success) {
        console.log('Validation errors:', validationResult.error.errors); // Debug log
        // Set form errors manually
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

  const callInfo = [
    {
      icon: Clock,
      label: "30 min call",
      description: "Perfect time to discuss your project needs"
    },
    {
      icon: Calendar,
      label: "Mon - Fri",
      description: "9:00 AM to 6:00 PM (UTC)"
    },
    {
      icon: Phone,
      label: "Video Call",
      description: "Google Meet link will be provided"
    },
  ];

  const messageInfo = [
    {
      icon: Mail,
      label: "< 24 hours",
      description: "Usually within 2-4 hours during business days"
    },
    {
      icon: MessageSquare,
      label: "100% response",
      description: "I personally read and respond to every message"
    },
    {
      icon: Send,
      label: "ettozany@gmail.com",
      description: "Feel free to email me directly anytime"
    },
  ];

  return (
    <>
      <SEOHead 
        title="Contact - Ettouzany Portfolio"
        description="Get in touch with Ettouzany for web development projects, collaborations, and consulting opportunities. Available for React, Next.js, and full-stack development work."
        keywords="contact, web development, collaboration, consulting, hire developer, react developer, next.js, full stack, freelance"
        ogType="profile"
        structuredData={organizationStructuredData}
      />

      <div className="relative z-0 min-h-screen">
        <Navbar variant="contact" />
        {/* Hero Section */}
        <Spotlight className="sticky" />
        <div className="mx-4 sm:container sm:mx-auto px-4 sm:px-6 pt-20 sm:pt-32 pb-16">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={textVariant({ delay: 0 })}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Badge className="flex items-center gap-2 text-muted-foreground uppercase" size={'xl'} variant={'default'}>
                <Send className="w-3 h-3 text-foreground/60" />
                Get in touch
              </Badge>
            </motion.div>
            
            <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-6 ${nyght.className}`}>
              Let's <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>Connect</span>
            </h1>
            
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
            </p>
          </motion.div>

          {/* Tab Selector */}
          <motion.div 
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SegmentedControl
              options={tabOptions}
              value={activeTab}
              onChange={(value) => {
                setActiveTab(value as "message" | "booking");
                setSubmitStatus(null); // Clear any existing status messages
                // Clear form errors when switching tabs
                if (value === "message") {
                  contactForm.clearErrors();
                } else {
                  bookingForm.clearErrors();
                }
              }}
              size="lg"
            />
          </motion.div>

          {/* Main Content */}
          <div className="flex xl:flex-row flex-col-reverse gap-6 sm:gap-12 max-w-7xl mx-auto">
            {/* Forms Container */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={slideIn({direction: "left", type: "tween", delay: 0.2, duration: 1})}
              className="flex-[0.6]"
            >
              <div className="relative bg-background/50 backdrop-blur-md border border-border/30 rounded-3xl shadow-lg p-4 sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-3xl"></div>
                
                <div className="relative">
                  {/* Status Messages */}
                  {submitStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 p-4 rounded-xl border ${
                        submitStatus.type === 'success'
                          ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
                          : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {submitStatus.message}
                    </motion.div>
                  )}

                  {activeTab === "message" && (
                    <motion.div 
                      key="message-form-container"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h2 className="text-2xl font-bold text-foreground mb-2">Send a Message</h2>
                        <p className="text-foreground/60">
                          Fill out the form below and I'll get back to you as soon as possible.
                        </p>
                      </motion.div>
                      
                      <Form {...contactForm}>
                        <motion.form 
                          onSubmit={contactForm.handleSubmit(handleContactSubmit)} 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={contactForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <div>
                                  <FormLabel className="text-foreground font-medium mb-3 block">Full Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="John Doe" 
                                      className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                            <FormField
                              control={contactForm.control}
                              name="email"
                              render={({ field }) => (
                                <div>
                                  <FormLabel className="text-foreground font-medium mb-3 block">Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="john@example.com" 
                                      type="email"
                                      className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={contactForm.control}
                            name="subject"
                            render={({ field }) => (
                              <div>
                                <FormLabel className="text-foreground font-medium mb-3 block">Subject</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Project inquiry, collaboration, etc." 
                                    className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            )}
                          />
                          
                          <FormField
                            control={contactForm.control}
                            name="body"
                            render={({ field }) => (
                              <div>
                                <FormLabel className="text-foreground font-medium mb-3 block">Message</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell me about your project, timeline, and goals..." 
                                    className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300 min-h-[120px] resize-none" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            )}
                          />
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="w-full group relative py-3 px-6 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/30 hover:border-primary/50 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full transform transition-transform duration-700"></div>
                            </Button>
                          </motion.div>
                        </motion.form>
                      </Form>
                    </motion.div>
                  )}

                  {activeTab === "booking" && (
                    <motion.div 
                      key="booking-form-container"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h2 className="text-2xl font-bold text-foreground mb-2">Book a Call</h2>
                        <p className="text-foreground/60">
                          Schedule a consultation to discuss your project in detail.
                        </p>
                      </motion.div>
                      
                      <Form {...bookingForm}>
                        <motion.form 
                          onSubmit={bookingForm.handleSubmit(handleBookingSubmit)} 
                          className="space-y-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={bookingForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <div>
                                  <FormLabel className="text-foreground font-medium mb-3 block">Full Name</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="John Doe" 
                                      className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                            <FormField
                              control={bookingForm.control}
                              name="email"
                              render={({ field }) => (
                                <div>
                                  <FormLabel className="text-foreground font-medium mb-3 block">Email</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="john@example.com" 
                                      type="email"
                                      className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={bookingForm.control}
                              name="company"
                              render={({ field }) => (
                                <div>
                                  <FormLabel className="text-foreground font-medium mb-3 block">Company (Optional)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="Your Company" 
                                      className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                            <FormField
                              control={bookingForm.control}
                              name="projectType"
                              render={({ field }) => (
                                <div>
                                  <FormLabel className="text-foreground font-medium mb-3 block">Project Type</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <div className="absolute inset-x-0 h-px w-1/2 mx-auto -top-px shadow-xl bg-gradient-to-r from-transparent via-primary to-transparent" />
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300 h-auto">
                                          <SelectValue placeholder="Select project type" />
                                        </SelectTrigger>
                                      <SelectContent className="rounded-xl border-border/50 bg-background/95 backdrop-blur-md">
                                        <SelectItem value="web-development">Web Development</SelectItem>
                                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                                        <SelectItem value="fullstack">Full-Stack Application</SelectItem>
                                        <SelectItem value="consulting">Technical Consulting</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                      </SelectContent>
                                      </Select>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                          </div>

                          <DateTimePicker
                            value={selectedDateTime}
                            onChange={(dateTime) => {
                              setSelectedDateTime(dateTime);
                              // Set values without triggering validation
                              bookingForm.setValue("date", dateTime.date, { shouldValidate: false });
                              bookingForm.setValue("time", dateTime.time, { shouldValidate: false });
                              // Clear any existing errors
                              bookingForm.clearErrors();
                            }}
                          />

                          <FormField
                            control={bookingForm.control}
                            name="notes"
                            render={({ field }) => (
                              <div>
                                <FormLabel className="text-foreground font-medium mb-3 block">Additional Notes (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Any specific topics you'd like to discuss..." 
                                    className="bg-background/30 backdrop-blur-sm border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300 min-h-[100px] resize-none" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            )}
                          />

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button 
                              type="submit" 
                              disabled={isSubmitting || !selectedDateTime.date || !selectedDateTime.time}
                              className="w-full group relative py-3 px-6 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/30 hover:border-primary/50 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Calendar className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                                {isSubmitting ? 'Booking...' : 'Book Call'}
                              </span>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full transform transition-transform duration-700"></div>
                            </Button>
                          </motion.div>
                        </motion.form>
                      </Form>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Side - Dynamic Info & 3D */}
            <div className="flex-[0.4] space-y-8">
              {/* Dynamic Information Card */}
              <motion.div
                key={`info-${activeTab}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-background/50 backdrop-blur-md border border-border/30 rounded-3xl shadow-lg p-4 sm:p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full flex items-center justify-center">
                      {activeTab === "booking" ? (
                        <Calendar className="w-4 h-4 text-primary" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {activeTab === "booking" ? "Call Details" : "Message Info"}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {(activeTab === "booking" ? callInfo : messageInfo).map((info, index) => (
                      <motion.div
                        key={`${activeTab}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-background/20 backdrop-blur-sm border border-border/20 hover:bg-background/30 transition-all duration-300"
                        whileHover={{ x: 4 }}
                      >
                        <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground mb-1">{info.label}</p>
                          <p className="text-xs text-foreground/60 leading-relaxed">{info.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Simple Call to Action */}
                  <motion.div 
                    className="mt-6 p-4 rounded-xl bg-primary/5 backdrop-blur-sm border border-primary/20 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-foreground">
                        {activeTab === "booking" ? "Available Now" : "Quick Response"}
                      </p>
                    </div>
                    <p className="text-xs text-foreground/60">
                      {activeTab === "booking" 
                        ? "Choose a convenient time and let's discuss your project"
                        : "I'll get back to you within 24 hours with next steps"
                      }
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* CTA and Footer */}
              <div className="relative z-0">
                <CTAFooter />
                <StarsCanvas />
              </div>
      </div>
    </>
  );
};

export default Contact;