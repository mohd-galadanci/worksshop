import { useState } from "react";
import Navigation from "@/components/navigation";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";

const categories = [
  "All Items",
  "Fruits & Vegetables", 
  "Rice & Grains",
  "Proteins",
  "Instant Foods",
  "Seasonings",
  "Dairy & Beverages",
  "Cooking Oils"
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("All Items");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Shop Header */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[hsl(90,69%,13%)] mb-4">
              Your Favorite Nigerian Groceries
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From Indomie to premium rice, macaroni to peak milk - all your kitchen needs delivered to your door in Abuja. 
              Use your ₦300,000 credit and pay back when salary enters!
            </p>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)]"
                    : "bg-white text-gray-700 border hover:border-[hsl(135,100%,26%)]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductGrid selectedCategory={selectedCategory} />
        </div>
      </section>
    </div>
  );
}
