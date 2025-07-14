"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/mock-data";
import { products } from "@/lib/mock-data";
import { ShoppingCart, Heart, Star, Eye, Zap, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { DynamicProductImage } from "./dynamic-product-image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Add to cart animation
    toast({
      title: "✨ Added to Cart!",
      description: `${product.name} is now in your cart.`,
      className: "bg-white/95 backdrop-blur-xl border-white/20",
    });

    // Show smart bundle suggestions
    if (product.relatedItems && product.relatedItems.length > 0) {
      const relatedProduct = products.find(
        (p) => p.id === product.relatedItems![0],
      );
      if (relatedProduct) {
        setTimeout(() => {
          toast({
            title: "🤖 Smart Suggestion",
            description: `People who bought ${product.name} also bought ${relatedProduct.name}.`,
            action: (
              <ToastAction altText={`Add ${relatedProduct.name} to cart`}>
                Add to Cart
              </ToastAction>
            ),
            className: "bg-white/95 backdrop-blur-xl border-white/20",
          });
        }, 1000);
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);

    toast({
      title: isLiked ? "💔 Removed from Wishlist" : "💖 Added to Wishlist",
      description: `${product.name} ${isLiked ? "removed from" : "added to"} your wishlist.`,
      className: "bg-white/95 backdrop-blur-xl border-white/20",
    });
  };

  // Generate consistent values based on product ID to avoid hydration mismatches
  const generateConsistentValue = (
    id: string,
    seed: number,
    max: number,
    min: number = 0,
  ) => {
    const hash = id.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, seed);
    return (Math.abs(hash) % (max - min)) + min;
  };

  const stockLevel = generateConsistentValue(product.id, 1, 50, 10);
  const rating = (generateConsistentValue(product.id, 2, 20, 30) / 10).toFixed(
    1,
  );
  const reviews = generateConsistentValue(product.id, 3, 500, 50);

  return (
    <motion.div
      className="group cursor-pointer perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        className="relative h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Front Side */}
        <Card
          className={cn(
            "flex flex-col h-full overflow-hidden backface-hidden",
            "bg-white/80 backdrop-blur-sm border-white/20",
            "shadow-lg hover:shadow-2xl transition-all duration-500",
            "group-hover:scale-105 group-hover:shadow-primary/20",
          )}
        >
          <CardHeader className="p-0 relative overflow-hidden">
            <motion.div
              className="relative group/image"
              onHoverStart={() => setTimeout(() => setIsFlipped(true), 300)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <DynamicProductImage
                  query={product.aiHint}
                  alt={product.name}
                  className="object-cover w-full aspect-square transition-all duration-700 group-hover/image:brightness-110"
                />
              </motion.div>

              {/* Overlay with Quick Actions */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <Button
                        size="sm"
                        onClick={handleAddToCart}
                        className="rounded-full h-12 w-12 bg-white/90 text-primary hover:bg-white hover:text-primary-hover shadow-xl backdrop-blur-sm"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLike}
                        className={cn(
                          "rounded-full h-12 w-12 backdrop-blur-sm shadow-xl",
                          isLiked
                            ? "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
                            : "bg-white/90 text-muted-foreground hover:bg-white",
                        )}
                      >
                        <Heart
                          className={cn("h-5 w-5", isLiked && "fill-current")}
                        />
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full h-12 w-12 bg-white/90 text-muted-foreground hover:bg-white backdrop-blur-sm shadow-xl"
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <AnimatePresence>
                  {product.deal && (
                    <motion.div
                      key={`${product.id}-deal-badge`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <Badge
                        variant="destructive"
                        className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse"
                      >
                        {product.deal}
                      </Badge>
                    </motion.div>
                  )}
                  {product.tags.includes("new") && (
                    <motion.div
                      key={`${product.id}-new-badge`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: 0.1,
                      }}
                    >
                      <Badge className="bg-gradient-to-r from-accent to-primary text-white shadow-lg">
                        <Zap className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    </motion.div>
                  )}
                  {product.tags.includes("trending") && (
                    <motion.div
                      key={`${product.id}-trending-badge`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        delay: 0.2,
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="p-6 flex-grow">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <CardTitle className="text-xl font-headline mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mb-3">
                {product.category}
              </CardDescription>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({reviews})
                  </span>
                </div>
              </div>

              <motion.p
                className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                ₹{product.price.toFixed(2)}
              </motion.p>
            </motion.div>
          </CardContent>

          <CardFooter className="p-6 pt-0">
            <motion.div
              className="w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleAddToCart}
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </motion.div>
              </Button>
            </motion.div>
          </CardFooter>
        </Card>

        {/* Back Side */}
        <Card
          className={cn(
            "absolute inset-0 flex flex-col h-full overflow-hidden backface-hidden rotate-y-180",
            "bg-gradient-to-br from-primary/10 via-background to-accent/10 backdrop-blur-sm border-white/20",
            "shadow-lg",
          )}
        >
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isFlipped ? 1 : 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <CardTitle className="text-lg font-headline mb-2">
                {product.name}
              </CardTitle>
              <CardDescription>Product Details</CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="flex-grow p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rating:</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`${product.id}-star-${i}`}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(parseFloat(rating))
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="ml-1 text-sm">{rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stock:</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    stockLevel > 20
                      ? "text-green-600"
                      : stockLevel > 5
                        ? "text-yellow-600"
                        : "text-red-600",
                  )}
                >
                  {stockLevel} units left
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reviews:</span>
                <span className="text-sm">{reviews} reviews</span>
              </div>

              <div className="pt-2">
                <span className="text-sm font-medium block mb-2">
                  Key Features:
                </span>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Premium quality materials</li>
                  <li>• Fast shipping available</li>
                  <li>• 30-day return policy</li>
                  <li>• Customer satisfaction guaranteed</li>
                </ul>
              </div>
            </motion.div>
          </CardContent>

          <CardFooter className="p-6">
            <motion.div
              className="w-full space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isFlipped ? 1 : 0, y: isFlipped ? 0 : 20 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button
                className="w-full h-10 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                className="w-full h-10 bg-white/80 backdrop-blur-sm border-white/20"
                onClick={() => setIsFlipped(false)}
              >
                Back to Product
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
