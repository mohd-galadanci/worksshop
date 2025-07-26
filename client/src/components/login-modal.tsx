import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBasket } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ippisNumber, setIppisNumber] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="text-center mb-6">
            <ShoppingBasket className="text-[hsl(135,100%,26%)] text-3xl mx-auto mb-2" />
            <DialogTitle className="text-2xl font-bold text-[hsl(90,69%,13%)] mb-2">
              Welcome Back
            </DialogTitle>
            <p className="text-gray-600">Sign in to your Workersshop account</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+234</span>
              </div>
              <Input
                id="phone"
                type="tel"
                className="pl-12"
                placeholder="803 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ippis" className="block text-sm font-medium text-gray-700 mb-1">
              IPPIS Number
            </Label>
            <Input
              id="ippis"
              type="text"
              placeholder="Enter your IPPIS number"
              value={ippisNumber}
              onChange={(e) => setIppisNumber(e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[hsl(135,100%,26%)] text-white hover:bg-[hsl(90,69%,13%)]"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? 
            <Button variant="link" className="p-0 ml-1 text-[hsl(135,100%,26%)]">
              Register here
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
