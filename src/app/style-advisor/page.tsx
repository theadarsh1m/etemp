"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
// Removed server action import - now using API route
type StyleAdvisorOutput = {
  facialAnalysis: {
    gender: string;
    age: string;
    faceShape: string;
    mood: string;
  };
  styleAdvice: string;
  recommendedProductTags: string[];
};
import { products, type Product } from "@/lib/mock-data";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProductCard } from "@/components/product-card";
import { Loader2, Wand2, User, Palette, Sparkles } from "lucide-react";

export default function StyleAdvisorPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StyleAdvisorOutput | null>(null);
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
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setError("Please select a photo first.");
      return;
    }

    // Prevent concurrent requests
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!previewUrl) {
        throw new Error("File could not be read.");
      }

      const response = await fetch("/api/style-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photoDataUri: previewUrl }),
      });

      // Clone response to safely read body multiple times if needed
      const responseClone = response.clone();

      if (!response.ok) {
        let errorMessage = "Failed to analyze photo";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await responseClone.text();
            errorMessage = errorText || errorMessage;
          } catch {
            // Use default message if all parsing fails
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the photo. Please try another one.");
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedProducts = result
    ? products.filter((p) =>
        result.recommendedProductTags.some((tag) => p.tags.includes(tag)),
      )
    : [];

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">AI Style Advisor</h1>
        <p className="text-muted-foreground">
          Upload a photo of yourself to get personalized fashion
          recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upload Your Photo</CardTitle>
            <CardDescription>
              We'll analyze it to suggest styles for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo-upload">Choose a file</Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
            {previewUrl && (
              <div className="relative aspect-square w-full">
                <Image
                  src={previewUrl}
                  alt="Selected photo preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
            <Button
              onClick={handleAnalyzeClick}
              disabled={isLoading || !selectedFile}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Get Style Advice
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

        <div className="lg:col-span-2 space-y-8">
          {isLoading && (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User /> Facial Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-bold text-lg">
                      {result.facialAnalysis.gender}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-bold text-lg">
                      {result.facialAnalysis.age}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Face Shape</p>
                    <p className="font-bold text-lg">
                      {result.facialAnalysis.faceShape}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Mood</p>
                    <p className="font-bold text-lg">
                      {result.facialAnalysis.mood}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette /> Your Style Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.styleAdvice}</p>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                  <Sparkles /> Recommended For You
                </h3>
                {recommendedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>No specific products found</AlertTitle>
                    <AlertDescription>
                      We couldn't find specific products matching your style
                      profile. Please try another photo!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
