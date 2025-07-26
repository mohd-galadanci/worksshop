import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Package, Clock, CheckCircle } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    retry: false,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[hsl(135,100%,26%)]"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { color: "bg-blue-100 text-blue-800", icon: Package },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const creditUsagePercentage = user ? 
    (parseFloat(user.usedCredit || '0') / parseFloat(user.creditLimit || '300000')) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-[hsl(135,30%,91%)]">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user?.profileImageUrl} alt="Profile" />
                    <AvatarFallback className="text-2xl bg-[hsl(135,100%,26%)] text-white">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-2">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-gray-600 mb-1">{user?.email}</p>
                  <p className="text-gray-600 mb-1">{user?.phoneNumber}</p>
                  <p className="text-gray-600">IPPIS: {user?.ippisNumber}</p>
                </div>
              </CardContent>
            </Card>

            {/* Credit Information */}
            <Card className="mt-6 bg-[hsl(135,100%,26%)] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Credit Limit:</span>
                    <span className="font-bold text-[hsl(45,100%,50%)]">
                      {formatCurrency(user?.creditLimit || '300000')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Credit:</span>
                    <span className="font-bold">
                      {formatCurrency(user?.availableCredit || '300000')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used Credit:</span>
                    <span>{formatCurrency(user?.usedCredit || '0')}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-4">
                    <div 
                      className="bg-[hsl(45,100%,50%)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(creditUsagePercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm opacity-90">
                    {creditUsagePercentage.toFixed(1)}% of credit limit used
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-[hsl(90,69%,13%)]">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Orders:</span>
                    <span className="font-semibold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month:</span>
                    <span className="font-semibold">
                      {orders.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        const now = new Date();
                        return orderDate.getMonth() === now.getMonth() && 
                               orderDate.getFullYear() === now.getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Status:</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-[hsl(90,69%,13%)]">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Start shopping to see your order history here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-[hsl(90,69%,13%)]">
                              Order #{order.id}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-[hsl(135,100%,26%)] mb-1">
                              {formatCurrency(order.totalAmount)}
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        {order.deliveryAddress && (
                          <p className="text-sm text-gray-600">
                            <strong>Delivery to:</strong> {order.deliveryAddress}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
