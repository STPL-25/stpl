import React from "react";
import {
  ChevronDown,
  Menu,
  Search,
  Bell,
  X,
  Minimize2,
  Maximize2,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/globalState/hooks/useAppState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  // let the hook infer types; protect uses with optional chaining
  const {
    sidebarOpen,
    setSidebarOpen,
    headerComponentRender,
    isFullscreen,
    setIsFullscreen,
    userData,
    setUserData,
  } = useAppState() as any; // if your useAppState exports types, replace `any` with the proper type

  const navigate = useNavigate();
  console.log(userData)
  const handleFullscreenToggle = async (): Promise<void> => {
    try {
      const el = document.documentElement as any;

      if (!isFullscreen) {
        // Enter fullscreen
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          await el.webkitRequestFullscreen();
        } else if (el.msRequestFullscreen) {
          await el.msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        const doc: any = document;
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }

      setIsFullscreen?.(!isFullscreen);
    } catch (err) {
      // optional: log or show toast
      console.error("Fullscreen toggle error:", err);
      toast.error("Unable to toggle fullscreen");
    }
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = (): void => {
    setSidebarOpen?.(!sidebarOpen);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      // Clear user data from state
      setUserData?.(null);

      // Clear localStorage
      localStorage.removeItem("userToken");

      // Navigate to login page
      navigate("/");

      // Optional: Show success message
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  // safe reads
  const displayName: string = (userData?.[0]?.ename as string) ?? "User";
  const avatarLetter = displayName?.charAt(0) ?? "U";

  return (
    <header
      className={`bg-background/50 backdrop-blur-md shadow-sm border-b border-border/50 px-5 lg:px-8 py-3 transition-all duration-300 ${
        isFullscreen ? "fixed top-0 left-0 right-0 z-50 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMobileMenuToggle}
              className="h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
            <h1 className="text-md lg:text-md font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-8 flex items-center">
              {(headerComponentRender as string)?.toUpperCase?.() || "DASHBOARD"}
            </h1>
            <div className="hidden lg:block w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
          </div>
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">{/* reserved for search/logo */}</div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-2">
          {/* Search Button (Mobile) */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreenToggle}
            className="h-9 px-3 hover:bg-muted/50 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="ml-2 hidden xl:inline text-sm">{isFullscreen ? "Exit" : "Fullscreen"}</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
              3
            </Badge>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50 transition-colors">
            <Settings className="w-4 h-4" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 px-2 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-7 w-7 ring-2 ring-border/50">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      {avatarLetter}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium">{displayName}</span>
                  <ChevronDown className="hidden lg:block w-3 h-3 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-border/50">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
