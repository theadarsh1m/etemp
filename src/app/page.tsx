"use client";

import { useState, useRef } from "react";
import { ProductCard } from "@/components/product-card";
import { FeaturedCarousel } from "@/components/featured-carousel";
import {
  deals,
  topCategories,
  inspiredByYourVisit,
  type Product,
  mockUser,
  moodSuggestions,
  products,
} from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  TrendingUp,
  Gift,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mood = "Chill" | "Gaming" | "Fitness";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as any,
    },
  },
};

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [mood, setMood] = useState<Mood>("Chill");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const personalPicks = products.filter((p) =>
    p.tags.includes(mockUser.interests[0]),
  );

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Smart recommendations just for you",
    },
    {
      icon: TrendingUp,
      title: "Trending Products",
      description: "Always stay ahead of the curve",
    },
    {
      icon: Gift,
      title: "Exclusive Deals",
      description: "Special offers you won't find elsewhere",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description: "Curated selection of top-rated items",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-12 pb-24"
        style={{ y, opacity }}
      >
        {/* Background Elements */}
        <div
          className={
            'absolute inset-0 bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-40'
          }
        />

        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] as any }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 text-sm font-medium text-primary mb-6 shadow-lg">
                <Zap className="h-4 w-4" />
                Powered by AI Intelligence
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-headline mb-6 md:mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                ease: [0.4, 0, 0.2, 1] as any,
                delay: 0.2,
              }}
            >
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300-percent animate-pulse">
                Welcome to
              </span>
              <br />
              <motion.span
                className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.4, 0, 0.2, 1] as any,
                  delay: 0.6,
                }}
              >
                RetailGeniusAI
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12 leading-relaxed px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1] as any,
                delay: 0.8,
              }}
            >
              Your personal AI shopping assistant that learns your style,
              <br className="hidden md:block" />
              predicts your needs, and discovers amazing products just for you.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 md:mb-16 px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1] as any,
                delay: 1,
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-lg bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 sm:px-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1] as any,
                delay: 1.2,
              }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="group p-4 sm:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ y: -5, scale: 1.02 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold text-sm mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto space-y-12 md:space-y-20 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        {/* Mood Selector */}
        <AnimatedSection>
          <motion.div variants={itemVariants}>
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  What's your mood today, {mockUser.name}?
                </CardTitle>
                <CardDescription className="text-lg">
                  Select a mood to get personalized AI-powered suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Select
                    onValueChange={(value: Mood) => setMood(value)}
                    defaultValue={mood}
                  >
                    <SelectTrigger className="w-64 h-12 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-white/20">
                      <SelectItem value="Chill" className="hover:bg-primary/10">
                        😎 Chill
                      </SelectItem>
                      <SelectItem
                        value="Gaming"
                        className="hover:bg-primary/10"
                      >
                        🎮 Gaming
                      </SelectItem>
                      <SelectItem
                        value="Fitness"
                        className="hover:bg-primary/10"
                      >
                        🏋️ Fitness
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatedSection>

        {/* Featured Products Carousel */}
        <AnimatedSection>
          <motion.div variants={itemVariants}>
            <FeaturedCarousel
              title="Today's Best Deals"
              products={deals}
              autoPlay={true}
              autoPlayInterval={4000}
            />
          </motion.div>
        </AnimatedSection>

        {/* Mood-based Products */}
        <AnimatedSection>
          <motion.h2
            className="text-4xl font-bold font-headline mb-8 text-center"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              For Your {mood} Mood
            </span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {(moodSuggestions[mood] || []).map((product, index) => (
              <motion.div key={`mood-${product.id}`} variants={itemVariants}>
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Personal Picks */}
        <AnimatedSection>
          <motion.h2
            className="text-4xl font-bold font-headline mb-8 text-center"
            variants={itemVariants}
          >
            Based on your interest in{" "}
            <span className="capitalize bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              {mockUser.interests[0]}
            </span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {personalPicks.map((product, index) => (
              <motion.div
                key={`personal-${product.id}`}
                variants={itemVariants}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Top Categories */}
        <AnimatedSection>
          <motion.h2
            className="text-4xl font-bold font-headline mb-8 text-center"
            variants={itemVariants}
          >
            Top Categories
          </motion.h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            variants={containerVariants}
          >
            {topCategories.map((category, index) => (
              <motion.div key={category.name} variants={itemVariants}>
                <Card className="overflow-hidden group text-center bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <CardContent className="p-0">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={300}
                        height={300}
                        className="w-full h-auto object-cover aspect-square transition-transform duration-500 group-hover:scale-110"
                        data-ai-hint={category.aiHint}
                      />
                    </motion.div>
                    <motion.h3
                      className="text-lg font-semibold p-6"
                      whileHover={{ scale: 1.05 }}
                    >
                      {category.name}
                    </motion.h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Deals Section */}
        <AnimatedSection>
          <motion.h2
            className="text-4xl font-bold font-headline mb-8 text-center flex items-center justify-center gap-3"
            variants={itemVariants}
          >
            <Gift className="h-8 w-8 text-accent" />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Deals for You
            </span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {deals.map((product, index) => (
              <motion.div key={`deals-${product.id}`} variants={itemVariants}>
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Inspired By Your Visit */}
        <AnimatedSection>
          <motion.h2
            className="text-4xl font-bold font-headline mb-8 text-center"
            variants={itemVariants}
          >
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Inspired By Your Last Visit
            </span>
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {inspiredByYourVisit.map((product, index) => (
              <motion.div
                key={`inspired-${product.id}`}
                variants={itemVariants}
              >
                <ProductCard product={product as Product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>
      </div>
    </div>
  );
}
