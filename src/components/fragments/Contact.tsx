import React from "react";
import { SectionWrapper } from "@/hoc";
import { motion } from "framer-motion";
import { slideIn, textVariant } from "@/utils/motion";
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

    // Open default email client with pre-filled data
    window.location.href = mailtoLink;
  };
  const renderForm = (
    <Form {...form}>
          <form onSubmit={handleSubmit(handleClick)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <div>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your message here" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
  );

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div
        variants={slideIn({direction: "down", type: "tween", delay: 0.2, duration: 1})}
        className="flex-[0.75] p-0 rounded-xl">
        <Card className="border border-foreground/20 bg-muted/50 main-card shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            {renderForm}
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        variants={slideIn({direction: "down", type: "tween", delay: 0.4, duration: 1})}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]">
        <MoonCanvas style={{ touchAction: "auto" }} />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
