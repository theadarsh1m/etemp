import { ProductCard } from "@/components/product-card";
import { products, type Product } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">All Products</h1>
        <p className="text-muted-foreground">
          Browse our entire collection of high-quality items.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product as Product} />
        ))}
      </div>
    </div>
  );
}
