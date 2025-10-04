import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, MapPin, Users, Heart } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">reharvest</span>
        </div>
        <div className="flex gap-4">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth?signup=true">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Connecting surplus food
          <br />
          <span className="text-primary">with those who need it</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join Vancouver's movement to reduce food waste and support our community.
          Businesses share excess food, neighbors get fresh meals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth?signup=true&role=consumer">
            <Button size="lg" className="w-full sm:w-auto">
              Find Food Near Me
            </Button>
          </Link>
          <Link to="/auth?signup=true&role=provider">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              List Surplus Food
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <MapPin className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Location-Based</h3>
            <p className="text-muted-foreground">
              Find available food near you with our interactive map. See what's available in your neighborhood in real-time.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Community Driven</h3>
            <p className="text-muted-foreground">
              Connect local businesses with community members. Build stronger neighborhoods through food sharing.
            </p>
          </div>
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
            <Heart className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Impact Tracking</h3>
            <p className="text-muted-foreground">
              See the difference you're making. Track meals saved, waste prevented, and community impact.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-20">
        <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-primary">For Businesses</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h4 className="font-semibold mb-1">Create Your Account</h4>
                  <p className="text-muted-foreground">Sign up as a food provider and get verified</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h4 className="font-semibold mb-1">List Surplus Food</h4>
                  <p className="text-muted-foreground">Post what you have available with pickup details</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h4 className="font-semibold mb-1">Connect & Share</h4>
                  <p className="text-muted-foreground">Community members claim and pick up your donations</p>
                </div>
              </li>
            </ol>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-primary">For Community Members</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                <div>
                  <h4 className="font-semibold mb-1">Sign Up Free</h4>
                  <p className="text-muted-foreground">Create your account with privacy options</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                <div>
                  <h4 className="font-semibold mb-1">Browse Available Food</h4>
                  <p className="text-muted-foreground">View map or list of food near you</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                <div>
                  <h4 className="font-semibold mb-1">Claim & Collect</h4>
                  <p className="text-muted-foreground">Reserve food and pick it up at the designated time</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to make a difference?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our community today and help reduce food waste in Vancouver
        </p>
        <Link to="/auth?signup=true">
          <Button size="lg">Join Reharvest</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Reharvest. Fighting food waste, one meal at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;