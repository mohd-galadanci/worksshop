import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import ProductGrid from "@/components/product-grid";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, CreditCard, Package, TrendingUp } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const creditUsagePercentage = user ? 
    (parseFloat((user as any).usedCredit || '0') / parseFloat((user as any).creditLimit || '300000')) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-[hsl(135,100%,26%)] to-[hsl(90,69%,13%)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome back, {(user as any)?.firstName || 'Dear Worker'}!
            </h1>
            <p className="text-xl opacity-90">
              Ready to buy your Indomie, rice, and all your favorite groceries with credit? Make we shop together!
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Overview */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Credit Limit Card */}
            <Card className="bg-[hsl(135,100%,26%)] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Credit Limit</p>
                    <p className="text-2xl font-bold text-[hsl(45,100%,50%)]">
                      {formatCurrency((user as any)?.creditLimit || '300000')}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            {/* Available Credit Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Available Credit</p>
                    <p className="text-2xl font-bold text-[hsl(135,100%,26%)]">
                      {formatCurrency((user as any)?.availableCredit || '300000')}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[hsl(45,100%,50%)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(creditUsagePercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {creditUsagePercentage.toFixed(1)}% used
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Total Orders Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-[hsl(90,69%,13%)]">
                      {orders.length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Used Credit Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Used Credit</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(user?.usedCredit || '0')}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(90,69%,13%)] mb-4">
              Fresh Groceries Available
            </h2>
            <p className="text-lg text-gray-600">
              Shop from our wide selection of quality groceries
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>
    </div>
  );
}
