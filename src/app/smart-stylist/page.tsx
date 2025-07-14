"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/mock-data";
import {
  Upload,
  Wand2,
  Loader2,
  Palette,
  Sparkles,
  Camera,
  Type,
  Shirt,
  Gem,
  Crown,
} from "lucide-react";

interface StyleAnalysis {
  mainItem: {
    name: string;
    color: string;
    category: string;
    style: string;
    fabric?: string;
  };
  complementary: Array<{
    item: string;
    reason: string;
    category: string;
  }>;
  colorPalette: string[];
  styleNotes: string;
  confidence: number;
}

export default function SmartStylistPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === "image" && !selectedFile) {
      setError("Please select an image first.");
      return;
    }

    if (activeTab === "text" && !textDescription.trim()) {
      setError("Please enter a description first.");
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const requestData =
        activeTab === "image"
          ? { photoDataUri: previewUrl, type: "image" }
          : { description: textDescription.trim(), type: "text" };

      const response = await fetch("/api/smart-stylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseClone = response.clone();

      if (!response.ok) {
        let errorMessage = "Failed to analyze item";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          try {
            const errorText = await responseClone.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Use default message
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchingProducts = () => {
    if (!analysis) return [];

    const complementaryItems = analysis.complementary.map((c) =>
      c.item.toLowerCase(),
    );
    const mainCategory = analysis.mainItem.category.toLowerCase();
    const style = analysis.mainItem.style.toLowerCase();

    return products
      .filter((product) => {
        const productName = product.name.toLowerCase();
        const productTags = product.tags.map((tag) => tag.toLowerCase());

        // Check if product matches complementary items
        const matchesComplementary = complementaryItems.some(
          (item) =>
            productName.includes(item) ||
            item.includes(productName.split(" ")[0]),
        );

        // Check if product matches style
        const matchesStyle =
          productTags.includes(style) ||
          productTags.includes("accessories") ||
          productTags.includes("unisex");

        // Avoid suggesting the same category as main item
        const isDifferentCategory = !productTags.includes(mainCategory);

        return (matchesComplementary || matchesStyle) && isDifferentCategory;
      })
      .slice(0, 6);
  };

  const matchingProducts = getMatchingProducts();

  return (
    <div className="container mx-auto space-y-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <Wand2 className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold font-headline bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Smart Stylist AI
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Upload a photo of your clothing item or describe it, and get
          AI-powered styling suggestions with matching accessories and outfit
          combinations.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Style Analysis Input
            </CardTitle>
            <CardDescription>
              Choose how you want to analyze your fashion item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Upload Image
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Text Description
                </TabsTrigger>
              </TabsList>

              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fashion-upload">
                    Upload Fashion Item Photo
                  </Label>
                  <Input
                    id="fashion-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>

                <AnimatePresence>
                  {previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative aspect-square w-full max-w-sm mx-auto"
                    >
                      <Image
                        src={previewUrl}
                        alt="Fashion item preview"
                        fill
                        className="object-cover rounded-lg border-2 border-muted"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Describe Your Fashion Item
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Maroon cotton kurti with embroidered sleeves, casual ethnic wear..."
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleAnalyze}
              disabled={
                isLoading ||
                (activeTab === "image" && !selectedFile) ||
                (activeTab === "text" && !textDescription.trim())
              }
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Style...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Style Suggestions
                </>
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center h-96 glass-card rounded-lg p-8"
            >
              <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">
                Analyzing your fashion item...
              </p>
              <p className="text-muted-foreground">
                This may take a few moments
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Main Item Analysis */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shirt className="h-5 w-5" />
                      Item Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Item</p>
                        <p className="font-semibold">
                          {analysis.mainItem.name}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Color</p>
                        <p className="font-semibold">
                          {analysis.mainItem.color}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Category
                        </p>
                        <p className="font-semibold">
                          {analysis.mainItem.category}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">Style</p>
                        <p className="font-semibold">
                          {analysis.mainItem.style}
                        </p>
                      </div>
                    </div>

                    {analysis.colorPalette &&
                      analysis.colorPalette.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Color Palette:
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {analysis.colorPalette.map((color, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-background"
                              >
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                </Card>

                {/* Style Suggestions */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Style Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {analysis.styleNotes}
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold">
                        Recommended Complementary Items:
                      </h4>
                      {analysis.complementary.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <Gem className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{item.item}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.reason}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Matching Products */}
                {matchingProducts.length > 0 && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Matching Products
                      </CardTitle>
                      <CardDescription>
                        Products from our collection that match your style
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matchingProducts.map((product) => (
                          <ProductCard
                            key={`stylist-${product.id}`}
                            product={product}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
