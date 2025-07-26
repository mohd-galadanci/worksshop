import { ShoppingBasket, Check, Users, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLearnMore = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-[hsl(135,100%,26%)] via-[hsl(135,80%,35%)] to-[hsl(90,69%,13%)] text-white py-20 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20"></div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-[hsl(45,100%,50%)] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-white rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-[hsl(45,100%,50%)] rounded-full opacity-15"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">Shop Smart,</span><br/>
                <span className="text-[hsl(45,100%,50%)] drop-shadow-lg">Pay Later!</span>
              </h1>
              <p className="text-2xl md:text-3xl mb-4 font-medium text-[hsl(45,100%,50%)]">
                
              </p>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-95 leading-relaxed">
                Fresh potatoes, macaroni, rice, and all your favorite Nigerian groceries delivered to your door in Abuja. 
                Shop now with ₦300,000 credit - pay as salary enters!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-[hsl(45,100%,50%)] text-[hsl(90,69%,13%)] hover:bg-yellow-400 px-10 py-4 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={handleLogin}
              >
                🛒 Start Shopping Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-3 border-[hsl(45,100%,50%)] text-[hsl(45,100%,50%)] hover:bg-[hsl(45,100%,50%)] hover:text-[hsl(90,69%,13%)] px-10 py-4 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={handleLearnMore}
              >
                See How it Works
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
              <p className="text-lg font-semibold mb-2">🏛️ Serving Abuja FCT</p>
              <p className="text-base opacity-90">Wuse • Garki • Utako • Gwarinpa • Maitama</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(90,69%,13%)] mb-4">
              Why Workersshop is The Best Choice?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Over 50,000 Nigerian workers trust us for their grocery needs across Abuja and beyond
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-[hsl(135,30%,91%)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-[hsl(135,100%,26%)]" />
              </div>
              <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-3">IPPIS Verified Workers</h3>
              <p className="text-gray-600">
                We verify all government workers through IPPIS integration. Your job security is our guarantee for credit approval.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[hsl(135,30%,91%)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-[hsl(135,100%,26%)]" />
              </div>
              <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-3">₦300,000 Shopping Credit</h3>
              <p className="text-gray-600">
                Shop for Sphagetti, rice, macaroni, and more! Pay later when salary enters - no wahala, no stress.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-[hsl(135,30%,91%)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-[hsl(135,100%,26%)]" />
              </div>
              <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-3">Fast Delivery in Abuja</h3>
              <p className="text-gray-600">
                Same-day delivery to Wuse, Garki, Utako, Gwarinpa, and all major areas in FCT. Fresh groceries, delivered fast!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[hsl(90,69%,13%)] mb-4">How it Works - Simple Pass!</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three easy steps to start shopping with credit for all Nigerian workers in Abuja</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[hsl(135,100%,26%)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-3">Register & Verify with IPPIS</h3>
              <p className="text-gray-600">Enter your phone number and IPPIS number. We go verify am instantly and approve your ₦300,000 credit.</p>
            </div>

            <div className="text-center">
              <div className="bg-[hsl(135,100%,26%)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-3">Shop Sphagetti & More</h3>
              <p className="text-gray-600">Choose from Sphagetti, macaroni, rice, maggi, peak milk, and all your favorites. Add to cart and use your credit!</p>
            </div>

            <div className="text-center">
              <div className="bg-[hsl(135,100%,26%)] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-[hsl(90,69%,13%)] mb-3">Delivery to Your Door</h3>
              <p className="text-gray-600">We deliver to your house in Abuja. Pay back small small when salary enters - no pressure, no stress!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[hsl(135,100%,26%)] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Shopping Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join over 50,000 Nigerian workers in Abuja and across Nigeria who trust Workersshop for their grocery needs. 
            Make we start this shopping journey together!
          </p>
          <Button 
            size="lg"
            className="bg-[hsl(45,100%,50%)] text-[hsl(90,69%,13%)] hover:bg-yellow-400 px-8 py-3 text-lg font-semibold"
            onClick={handleLogin}
          >
            <ShoppingBasket className="mr-2 h-5 w-5" />
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(90,69%,13%)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBasket className="text-[hsl(45,100%,50%)] text-xl mr-2" />
                <span className="font-bold text-xl">Workersshop</span>
              </div>
              <p className="text-gray-300 mb-4">Making grocery shopping accessible for Nigerian workers in Abuja through flexible credit options. Shop Indomie, rice, and more!</p>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">Home</a></li>
                <li><a href="#shop" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">Shop</a></li>
                <li><a href="#how-it-works" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[hsl(45,100%,50%)] transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p><span className="text-[hsl(45,100%,50%)]">📞</span> +234 700 WORKERS</p>
                <p><span className="text-[hsl(45,100%,50%)]">✉️</span> support@workersshop.ng</p>
                <p><span className="text-[hsl(45,100%,50%)]">📍</span> Abuja FCT, Nigeria</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Workersshop. All rights reserved. Made for Nigerian workers in Abuja</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
