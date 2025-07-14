"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search, User, Mic, X, ShoppingBag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CartSheet } from "../cart-sheet";
import { SidebarTrigger } from "../ui/sidebar";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import { mockCartItems } from "@/lib/mock-data";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBackdrop = useTransform(scrollY, [0, 100], [0.8, 0.95]);

  const {
    text,
    startListening,
    stopListening,
    isListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (text) {
      setSearchQuery(text);
    }
  }, [text]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const cartItemCount = mockCartItems.length;

  return (
    <>
      <motion.header
        className={cn(
          "sticky top-0 z-50 flex h-20 items-center gap-4 px-4 md:px-8 transition-all duration-300",
          "backdrop-blur-xl border-b border-white/20",
          isScrolled ? "bg-white/95 shadow-xl shadow-black/5" : "bg-white/80",
        )}
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(20px) saturate(180%)`,
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="md:hidden">
          <SidebarTrigger />
        </div>

        <motion.div
          className="hidden md:block font-bold text-2xl font-headline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          RetailGeniusAI
        </motion.div>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-6">
          <motion.form
            className="ml-auto flex-1 sm:flex-initial max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                type="search"
                placeholder="Search for amazing products..."
                className={cn(
                  "pl-10 pr-12 h-12 border-0 shadow-lg shadow-black/5",
                  "bg-white/90 backdrop-blur-sm",
                  "focus:bg-white focus:shadow-xl focus:shadow-primary/20",
                  "transition-all duration-300 ease-out",
                  "sm:w-[320px] md:w-[280px] lg:w-[320px]",
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isClient && hasRecognitionSupport && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8",
                      isListening &&
                        "text-red-500 hover:text-red-600 animate-pulse",
                    )}
                    onClick={handleMicClick}
                  >
                    {isListening ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Mic className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isListening ? "Stop listening" : "Voice search"}
                    </span>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <CartSheet />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://placehold.co/40x40"
                        alt="User"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white/95 backdrop-blur-xl border-white/20"
              >
                <DropdownMenuLabel className="font-semibold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-primary/10 transition-colors">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10 transition-colors">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-destructive/10 transition-colors">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </motion.header>

      {/* Floating Cart Button - Mobile */}
      {cartItemCount > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 z-40 md:hidden"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <CartSheet>
            <Button
              size="lg"
              className="rounded-full h-16 w-16 shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary to-accent hover:shadow-3xl hover:shadow-primary/40 transition-all duration-300"
            >
              <div className="relative">
                <ShoppingBag className="h-6 w-6" />
                <motion.span
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary text-xs font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={`header-cart-${cartItemCount}`}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {cartItemCount}
                </motion.span>
              </div>
            </Button>
          </CartSheet>
        </motion.div>
      )}
    </>
  );
}
