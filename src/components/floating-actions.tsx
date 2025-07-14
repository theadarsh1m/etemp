"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle, Phone, Mail, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const floatingButtons = [
    {
      icon: MessageCircle,
      label: "Chat Support",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    { icon: Phone, label: "Call Us", color: "bg-green-500 hover:bg-green-600" },
    { icon: Mail, label: "Email", color: "bg-purple-500 hover:bg-purple-600" },
    { icon: Heart, label: "Wishlist", color: "bg-red-500 hover:bg-red-600" },
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3">
      {/* Floating Action Buttons */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {floatingButtons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3"
                >
                  <motion.span
                    className="px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-sm font-medium shadow-lg border border-white/20"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {button.label}
                  </motion.span>
                  <Button
                    size="icon"
                    className={cn(
                      "h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-xl text-white transition-all duration-300",
                      button.color,
                    )}
                  >
                    <button.icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Action Button */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-2xl transition-all duration-300",
            "bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90",
            "text-white border-2 sm:border-4 border-white/20",
            isExpanded && "rotate-45",
          )}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageCircle className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            key="scroll-to-top-button"
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="icon"
              onClick={scrollToTop}
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/90 backdrop-blur-sm text-primary hover:bg-white hover:text-primary-hover shadow-xl border border-white/20 transition-all duration-300"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
