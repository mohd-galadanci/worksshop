import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { X, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";

interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCartSidebar({ isOpen, onClose }: ShoppingCartSidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { data: cartItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/cart"],
    enabled: isOpen,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
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
        description: "Failed to update quantity",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item removed from cart",
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
        description: "Failed to remove item",
        variant: "destructive",
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (deliveryAddress: string) => {
      await apiRequest("POST", "/api/orders", { deliveryAddress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Order placed successfully!",
        description: "Your groceries will be delivered soon.",
      });
      setDeliveryAddress("");
      setIsCheckingOut(false);
      onClose();
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
        description: error.message || "Failed to place order",
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

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }

    if (user && parseFloat((user as any).availableCredit || "0") < total) {
      toast({
        title: "Insufficient credit",
        description: "You don't have enough credit to complete this purchase",
        variant: "destructive",
      });
      return;
    }

    checkoutMutation.mutate(deliveryAddress);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(135,100%,26%)]" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your basket is empty o!</h3>
              <p className="text-gray-600">Add some Indomie, rice or your favorite groceries to start shopping!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3 pb-4 border-b">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-[hsl(90,69%,13%)]">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(item.product.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-6 h-6 p-0"
                        onClick={() => updateQuantityMutation.mutate({
                          id: item.id,
                          quantity: Math.max(1, item.quantity - 1)
                        })}
                        disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-6 h-6 p-0"
                        onClick={() => updateQuantityMutation.mutate({
                          id: item.id,
                          quantity: item.quantity + 1
                        })}
                        disabled={updateQuantityMutation.isPending}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0 text-red-500 hover:text-red-700"
                        onClick={() => removeItemMutation.mutate(item.id)}
                        disabled={removeItemMutation.isPending}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Section */}
            <div className="border-t pt-4">
              {!isCheckingOut ? (
                <>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery:</span>
                      <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg text-[hsl(90,69%,13%)]">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    {user && (
                      <div className="text-xs text-gray-600">
                        Available credit: {formatCurrency((user as any).availableCredit || "0")}
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)]"
                    onClick={() => setIsCheckingOut(true)}
                  >
                    Shop with Your Credit
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="delivery-address">Where Should We Deliver?</Label>
                    <Textarea
                      id="delivery-address"
                      placeholder="Enter your full delivery address in Abuja (e.g., No 5 Wuse District, Near GTBank, Abuja FCT)..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Total:</span>
                      <span className="font-semibold">{formatCurrency(total)}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      We go deduct this amount from your ₦300,000 credit. Pay back when salary enters!
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsCheckingOut(false)}
                    >
                      Back
                    </Button>
                    <Button 
                      className="flex-1 bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)]"
                      onClick={handleCheckout}
                      disabled={checkoutMutation.isPending}
                    >
                      {checkoutMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
