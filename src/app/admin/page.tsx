"use client";

import { useState } from "react";
import { products, type Product } from "@/lib/mock-data";
import {
  getRestockingSuggestions,
  type GetRestockingSuggestionsOutput,
} from "@/ai/flows/restocking-suggestions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb } from "lucide-react";

export default function AdminPage() {
  const [stockData] = useState<Product[]>(products);
  const [suggestions, setSuggestions] =
    useState<GetRestockingSuggestionsOutput>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
      const lowStockItems = stockData
        .filter((p) => p.stock < 10)
        .map(({ id, aiHint, ...rest }) => rest);

      if (lowStockItems.length === 0) {
        setError("No low-stock items to generate suggestions for.");
        return;
      }

      const result = await getRestockingSuggestions(lowStockItems);
      setSuggestions(result);
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">
          Inventory Intelligence
        </h1>
        <p className="text-muted-foreground">
          Real-time stock levels and AI-powered restocking suggestions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Stock Levels</CardTitle>
            <CardDescription>
              Live overview of all product stock. Items with less than 10 units
              are marked.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      {product.stock < 10 ? (
                        <Badge variant="destructive">{product.stock}</Badge>
                      ) : (
                        <Badge variant="secondary">{product.stock}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Restocking</CardTitle>
              <CardDescription>
                Use Gemini AI to analyze sales trends and suggest optimal
                restocking quantities for low-stock items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Restocking Suggestions"
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>AI Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <Alert
                    key={`suggestion-${index}-${suggestion.productName?.slice(0, 10) || index}`}
                  >
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>{suggestion.productName}</AlertTitle>
                    <AlertDescription>{suggestion.suggestion}</AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
