import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBasket, ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShoppingCartSidebar from "./shopping-cart";

export default function Navigation() {
  const [location] = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const NavLinks = ({ className = "", onClick = () => {} }) => (
    <div className={className}>
      <Link href="/">
        <span className={`text-gray-700 hover:text-[hsl(135,100%,26%)] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          location === "/" ? "text-[hsl(135,100%,26%)]" : ""
        }`} onClick={onClick}>
          Home
        </span>
      </Link>
      <Link href="/shop">
        <span className={`text-gray-700 hover:text-[hsl(135,100%,26%)] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
          location === "/shop" ? "text-[hsl(135,100%,26%)]" : ""
        }`} onClick={onClick}>
          Shop
        </span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span className="text-gray-700 hover:text-[hsl(135,100%,26%)] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
            Malls & States
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem>
            <span className="font-semibold text-[hsl(135,100%,26%)]">FCT Abuja</span>
          </DropdownMenuItem>
          <DropdownMenuItem>Wuse Market</DropdownMenuItem>
          <DropdownMenuItem>Garki Market</DropdownMenuItem>
          <DropdownMenuItem>Utako Market</DropdownMenuItem>
          <DropdownMenuItem>
            <span className="font-semibold text-[hsl(135,100%,26%)]">Lagos State</span>
          </DropdownMenuItem>
          <DropdownMenuItem>Alaba Market</DropdownMenuItem>
          <DropdownMenuItem>Computer Village</DropdownMenuItem>
          <DropdownMenuItem>
            <span className="font-semibold text-[hsl(135,100%,26%)]">Kano State</span>
          </DropdownMenuItem>
          <DropdownMenuItem>Kurmi Market</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isAuthenticated && (
        <Link href="/profile">
          <span className={`text-gray-700 hover:text-[hsl(135,100%,26%)] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            location === "/profile" ? "text-[hsl(135,100%,26%)]" : ""
          }`} onClick={onClick}>
            Profile
          </span>
        </Link>
      )}
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <ShoppingBasket className="text-[hsl(135,100%,26%)] text-xl mr-2" />
                <span className="font-bold text-xl text-[hsl(135,100%,26%)]">Workersshop</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavLinks className="hidden md:flex items-baseline space-x-4" />

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 text-gray-700 hover:text-[hsl(135,100%,26%)]"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-[hsl(45,100%,50%)] text-[hsl(90,69%,13%)] text-xs h-5 w-5 flex items-center justify-center p-0">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              )}

              {/* User Menu or Sign In */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profileImageUrl} alt="Profile" />
                        <AvatarFallback className="bg-[hsl(135,100%,26%)] text-white">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <div className="flex items-center w-full cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)]" 
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-4">
                    <NavLinks className="flex flex-col space-y-2" onClick={() => {}} />
                    {!isAuthenticated && (
                      <Button 
                        className="bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)]" 
                        onClick={handleLogin}
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
