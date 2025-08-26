import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/fragments";
import { Badge } from "@/components/ui/badge";
import MagneticButton from "@/components/ui/magnatic-button";
import { StarsCanvas } from "@/components/canvas";
import { sfPro, nyght } from "@/assets/font";
import { 
  ArrowLeft, 
  Home, 
  Search, 
  Clock, 
  Rocket,
  AlertTriangle,
  Construction
} from "lucide-react";
import SEOHead from '@/components/SEO/Head';
import { fadeIn, textVariant } from "@/utils/motion";

interface NotFoundPageProps {
  type?: "404" | "coming-soon";
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({
  type = "404",
  title,
  description,
  showBackButton = true
}) => {
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const pageConfig = {
    "404": {
      icon: AlertTriangle,
      badge: "PAGE NOT FOUND",
      title: title || "Oops! Page Not Found",
      description: description || "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
      primaryAction: "Back to Home",
    },
    "coming-soon": {
      icon: Construction,
      badge: "COMING SOON",
      title: title || "Something Amazing is Coming",
      description: description || "This page is currently under construction. We're working hard to bring you something incredible.",
      primaryAction: "Go Home",
    }
  };

  const config = pageConfig[type];
  const IconComponent = config.icon;

  return (
    <>
      <SEOHead 
        title={`${config.title} - Ettouzany Portfolio`}
        description={config.description}
        keywords="404, page not found, error page, ettouzany portfolio"
      />

      <div className={`relative z-0 min-h-screen ${sfPro.className}`}>
          <Navbar />
          
          <div className="min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.1
                    }
                  }
                }}
                className="max-w-2xl mx-auto"
              >
                {/* Icon */}
                <motion.div
                  variants={fadeIn({ direction: "up", delay: 0, duration: 0.6 })}
                  className="mb-8"
                >
                  <div className="w-24 h-24 mx-auto bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-6">
                    <IconComponent className="w-12 h-12 text-primary" />
                  </div>
                  
                  <motion.div 
                    className="inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge className="flex items-center gap-2" size={'xl'}>
                      <span className="text-muted-foreground text-base uppercase">
                        {config.badge}
                      </span>
                    </Badge>
                  </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div
                  variants={fadeIn({ direction: "up", delay: 0.2, duration: 0.6 })}
                  className="mb-6"
                >
                  <h1 className={`text-4xl lg:text-5xl xl:text-6xl font-semibold mb-4 ${nyght.className}`}>
                    {config.title.split(' ').map((word, index, array) => (
                      <React.Fragment key={index}>
                        {index === array.length - 1 ? (
                          <span className={`bg-gradient-to-b from-foreground to-slate-400 dark:to-zinc-900 bg-clip-text text-transparent ${nyght.className} font-medium italic`}>
                            {word}
                          </span>
                        ) : (
                          word
                        )}
                        {index < array.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.div
                  variants={fadeIn({ direction: "up", delay: 0.3, duration: 0.6 })}
                  className="mb-12"
                >
                  <p className="text-xl text-foreground/70 leading-relaxed max-w-xl mx-auto">
                    {config.description}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={fadeIn({ direction: "up", delay: 0.4, duration: 0.6 })}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  {showBackButton && (
                    <motion.div whileHover={{ x: -5 }}>
                      <MagneticButton href={"/"} className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        {config.primaryAction}
                      </MagneticButton>
                    </motion.div>
                  )}
                </motion.div>

                {/* Additional Info */}
                {type === "coming-soon" && (
                  <motion.div
                    variants={fadeIn({ direction: "up", delay: 0.6, duration: 0.6 })}
                    className="mt-12"
                  >
                    <div className="bg-background/50 backdrop-blur-md border border-border/30 rounded-2xl p-6 max-w-md mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 rounded-2xl"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <p className="text-foreground/80 font-medium">
                          Expected: Soon™
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          <StarsCanvas />
        </div>
    </>
  );
};

export default NotFoundPage;