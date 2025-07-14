"use client";

import { useState, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { mockCartItems, type Product } from "@/lib/mock-data";
import { Separator } from "@/components/ui/separator";
import { DynamicProductImage } from "./dynamic-product-image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CartSheetProps {
  children?: ReactNode;
}

export function CartSheet({ children }: CartSheetProps) {
  const [items, setItems] = useState(mockCartItems);

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItems(items.filter((item) => item.product.id !== productId));
    } else {
      setItems(
        items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item,
        ),
      );
    }
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((item) => item.product.id !== productId));
  };

  const triggerButton = children || (
    <Button
      variant="outline"
      size="icon"
      className="relative h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-white/20"
    >
      <ShoppingCart className="h-5 w-5" />
      <AnimatePresence>
        {items.length > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-accent to-primary text-white text-xs font-bold"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            key={`cart-badge-${itemCount}`}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-white/95 backdrop-blur-xl border-white/20">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-headline flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Your Cart
            {items.length > 0 && (
              <motion.span
                className="text-sm font-normal text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </motion.span>
            )}
          </SheetTitle>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {items.length > 0 ? (
            <motion.div
              className="flex h-full flex-col justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      className="group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      layout
                    >
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 hover:bg-white/80 transition-all duration-300">
                        <div className="relative">
                          <DynamicProductImage
                            query={item.product.aiHint}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover shadow-sm"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm leading-tight">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.product.category}
                          </p>
                          <p className="font-bold text-primary mt-1">
                            ₹{item.product.price.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.product.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>

                          <div className="flex items-center gap-2 bg-white/80 rounded-lg p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>

                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="p-1 hover:bg-primary/10 rounded transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Separator className="my-6" />
                <SheetFooter>
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Subtotal</span>
                      <motion.span
                        className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                        key={`cart-subtotal-${subtotal}`}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        ₹{subtotal.toFixed(2)}
                      </motion.span>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                      >
                        Proceed to Checkout
                      </Button>
                    </motion.div>
                  </div>
                </SheetFooter>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center mb-6">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
              </motion.div>

              <motion.h3
                className="text-xl font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your cart is empty
              </motion.h3>

              <motion.p
                className="text-muted-foreground mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Add some amazing products to get started!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80"
                >
                  Continue Shopping
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
