import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  selectedCategory?: string;
}

export default function ProductGrid({ selectedCategory = "All Items" }: ProductGridProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (product: Product) => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item successfully added to your cart",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const filteredProducts = products.filter((product: Product) => {
    if (selectedCategory === "All Items") return true;
    return product.category === selectedCategory;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(135,100%,26%)]" />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">
          {selectedCategory === "All Items" 
            ? "No products available at the moment." 
            : `No products found in ${selectedCategory} category.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product: Product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
          <div className="relative">
            <img 
              src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'} 
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            />
            {product.category && (
              <Badge className="absolute top-2 left-2 bg-white/90 text-[hsl(135,100%,26%)]">
                {product.category}
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg text-[hsl(90,69%,13%)] mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-[hsl(135,100%,26%)]">
                {formatCurrency(product.price)}
              </span>
              {isAuthenticated ? (
                <Button 
                  className="bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)] transition-colors text-sm"
                  onClick={() => addToCartMutation.mutate(product)}
                  disabled={addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-1 h-4 w-4" />
                  )}
                  Add
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = "/api/login"}
                  className="text-sm border-[hsl(135,100%,26%)] text-[hsl(135,100%,26%)] hover:bg-[hsl(135,100%,26%)] hover:text-white"
                >
                  Sign in to buy
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
