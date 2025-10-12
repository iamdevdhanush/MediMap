import { Link, useLocation } from "react-router-dom";
import { Heart, Home, PlusCircle, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-hero">
                <Heart className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                MediMap
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/">
                <Button 
                  variant={isActive("/") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/blood-banks">
                <Button 
                  variant={isActive("/blood-banks") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Blood Banks
                </Button>
              </Link>
              <Link to="/post">
                <Button 
                  variant={isActive("/post") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Post Resource
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button 
                  variant={isActive("/leaderboard") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Button>
              </Link>
              <Link to="/profile">
                <Button 
                  variant={isActive("/profile") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t shadow-soft">
        <div className="flex items-center justify-around h-16 px-2">
          <Link to="/" className="flex flex-col items-center gap-1 flex-1">
            <Home className={`h-5 w-5 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${isActive("/") ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Home
            </span>
          </Link>
          <Link to="/blood-banks" className="flex flex-col items-center gap-1 flex-1">
            <Heart className={`h-5 w-5 ${isActive("/blood-banks") ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${isActive("/blood-banks") ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Blood
            </span>
          </Link>
          <Link to="/post" className="flex flex-col items-center gap-1 flex-1">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full -mt-6 shadow-card ${isActive("/post") ? "bg-gradient-hero" : "bg-primary"}`}>
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
          </Link>
          <Link to="/leaderboard" className="flex flex-col items-center gap-1 flex-1">
            <Trophy className={`h-5 w-5 ${isActive("/leaderboard") ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${isActive("/leaderboard") ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Board
            </span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1 flex-1">
            <User className={`h-5 w-5 ${isActive("/profile") ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-xs ${isActive("/profile") ? "text-primary font-medium" : "text-muted-foreground"}`}>
              Profile
            </span>
          </Link>
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default Layout;
