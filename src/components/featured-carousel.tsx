"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deals, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface FeaturedCarouselProps {
  title?: string;
  products?: Product[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function FeaturedCarousel({
  title = "Featured Products",
  products = deals.slice(0, 8),
  autoPlay = true,
  autoPlayInterval = 5000,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    if (window.innerWidth < 1024) return 3;
    return 4;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (products.length === 0) return null;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h2>

        {/* Navigation */}
        <motion.div
          className="hidden md:flex items-center gap-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-lg transition-all duration-300"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white hover:shadow-lg transition-all duration-300"
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(autoPlay)}
      >
        <motion.div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            width: `${(products.length * 100) / itemsPerView}%`,
          }}
        >
          {products.map((product, index) => (
            <motion.div
              key={`carousel-${product.id}-${index}`}
              className="flex-shrink-0 px-2 md:px-4"
              style={{ width: `${100 / products.length}%` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile Navigation Buttons */}
        <div className="md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-white/20 shadow-lg z-10"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-white/20 shadow-lg z-10"
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Auto-play indicator */}
        <AnimatePresence>
          {isAutoPlaying && (
            <motion.div
              key={`${title}-autoplay-indicator`}
              className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 text-xs font-medium text-primary shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              Auto-playing
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dots Navigation */}
      <motion.div
        className="flex justify-center items-center gap-2 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {Array.from({ length: maxIndex + 1 }, (_, index) => (
          <motion.button
            key={`${title}-dot-${index}`}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              currentIndex === index
                ? "bg-gradient-to-r from-primary to-accent shadow-lg scale-125"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
            )}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex justify-center items-center gap-6 mt-6 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span>Curated Selection</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI Recommended</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
        <span>{products.length} Products</span>
      </motion.div>
    </motion.div>
  );
}
