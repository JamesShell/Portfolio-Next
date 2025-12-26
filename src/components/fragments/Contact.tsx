import React from "react";
import { SectionWrapper } from "@/hoc";
import { motion } from "framer-motion";
import { slideIn, textVariant } from "@/utils/motion";
import { sendGAEvent } from "@next/third-parties/google";
import { MoonCanvas } from "@/components/canvas";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { object, string, z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "../ui/badge";

// Define Zod schema for contact form data validation
const contactSchema = object({
  fullName: string().min(2).max(50),
  body: string().min(10).max(500),
});

const Contact = () => {
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      body: "",
    },
  });

  const { handleSubmit } = form;

  const handleClick = (data: any) => {
    const { fullName, body } = data;
    const subject = "Contact Form Submission";
    const emailBody = `Full Name: ${fullName}\n\nMessage: ${body}`;
    const mailtoLink = `mailto:jelth.com@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(emailBody)}`;
    
    sendGAEvent('event', 'contact_message_sent', { value: fullName });

    // Open default email client with pre-filled data
    window.location.href = mailtoLink;
  };
  const renderForm = (
    <Form {...form}>
          <form onSubmit={handleSubmit(handleClick)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-foreground font-medium mb-3 block">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      className="bg-background/30 backdrop-blur-md border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <div>
                  <FormLabel className="text-foreground font-medium mb-3 block">Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell me about your project..." 
                      className="bg-background/30 backdrop-blur-md border-border/50 rounded-xl py-3 px-4 text-foreground placeholder:text-foreground/50 focus:bg-background/50 focus:border-border transition-all duration-300 min-h-[120px] resize-none" 
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
                className="w-full group relative py-3 px-6 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-xl text-primary font-medium hover:bg-primary/30 hover:border-primary/50 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Send Message</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full transform transition-transform duration-700"></div>
              </Button>
            </motion.div>
          </form>
        </Form>
  );

  return (
    <div className="container">
      {/* Enhanced Section Header */}
      <motion.div 
        variants={textVariant({ delay: 0 })}
        className="text-center mb-12"
      >
        <motion.div 
          className="inline-block px-4 py-2 bg-background/20 backdrop-blur-md border border-border/30 rounded-full mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <h3 className="text-sm font-medium text-foreground/80 mb-0">Get In Touch</h3>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact</h2>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
        </p>
      </motion.div>

      <div className="flex xl:flex-row flex-col-reverse gap-12 overflow-hidden max-w-7xl mx-auto">
        <motion.div
          variants={slideIn({direction: "up", type: "tween", delay: 0.2, duration: 1})}
          className="flex-[0.75] p-0 rounded-xl">
          <div className="relative bg-background/30 backdrop-blur-xl border border-border/30 rounded-3xl shadow-2xl shadow-background/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl"></div>
            
            <div className="relative p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Let's Work Together</h3>
                <p className="text-foreground/60">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </div>
              
              <div className="relative bg-background/20 backdrop-blur-sm rounded-2xl p-6 border border-border/20">
                {renderForm}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
