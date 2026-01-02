// import React from "react";
// import {
//   ChevronDown,
//   Menu,
//   Search,
//   Bell,
//   X,
//   Minimize2,
//   Maximize2,
//   Settings,
//   User,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { useAppState } from "@/globalState/hooks/useAppState";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const Header: React.FC = () => {
//   // let the hook infer types; protect uses with optional chaining
//   const {
//     sidebarOpen,
//     setSidebarOpen,
//     headerComponentRender,
//     isFullscreen,
//     setIsFullscreen,
//     userData,
//     setUserData,  setActiveItem,
//     activeComponent,
//     setActiveComponent,
//   } = useAppState() as any; // if your useAppState exports types, replace `any` with the proper type

//   const navigate = useNavigate();
//   console.log(userData)
//   const handleFullscreenToggle = async (): Promise<void> => {
//     try {
//       const el = document.documentElement as any;

//       if (!isFullscreen) {
//         // Enter fullscreen
//         if (el.requestFullscreen) {
//           await el.requestFullscreen();
//         } else if (el.webkitRequestFullscreen) {
//           await el.webkitRequestFullscreen();
//         } else if (el.msRequestFullscreen) {
//           await el.msRequestFullscreen();
//         }
//       } else {
//         // Exit fullscreen
//         const doc: any = document;
//         if (doc.exitFullscreen) {
//           await doc.exitFullscreen();
//         } else if (doc.webkitExitFullscreen) {
//           await doc.webkitExitFullscreen();
//         } else if (doc.msExitFullscreen) {
//           await doc.msExitFullscreen();
//         }
//       }

//       setIsFullscreen?.(!isFullscreen);
//     } catch (err) {
//       // optional: log or show toast
//       console.error("Fullscreen toggle error:", err);
//       toast.error("Unable to toggle fullscreen");
//     }
//   };

//   // Handle mobile menu toggle
//   const handleMobileMenuToggle = (): void => {
//     setSidebarOpen?.(!sidebarOpen);
//   };

//   const handleSignOut = async (): Promise<void> => {
//     try {
//       // Clear user data from state
//       setUserData?.(null);
//        setActiveItem("");
//       activeComponent("");
//       setActiveComponent("");
//       // Clear localStorage
//       localStorage.removeItem("userToken");
   
//       // Navigate to login page
//       navigate("/");

//       // Optional: Show success message
//       toast.success("Signed out successfully");
//     } catch (error) {
//       console.error("Sign out error:", error);
//       toast.error("Failed to sign out");
//     }
//   };

//   // safe reads
//   const displayName: string = (userData?.[0]?.ename as string) ?? "User";
//   const avatarLetter = displayName?.charAt(0) ?? "U";

//   return (
//     <header
//       className={`bg-background/50 backdrop-blur-md shadow-sm border-b border-border/50 px-5 lg:px-8 py-3 transition-all duration-300 ${
//         isFullscreen ? "fixed top-0 left-0 right-0 z-50 shadow-lg" : ""
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         {/* Left Section - Mobile Menu & Title */}
//         <div className="flex items-center space-x-4">
//           {/* Mobile Menu Button */}
//           <div className="lg:hidden">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleMobileMenuToggle}
//               className="h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
//             >
//               {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//             </Button>
//           </div>

//           {/* Title */}
//           <div className="flex items-center space-x-3">
//             <div className="hidden lg:block w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
//             <h1 className="text-md lg:text-md font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-8 flex items-center">
//               {(headerComponentRender as string)?.toUpperCase?.() || "DASHBOARD"}
//             </h1>
//             <div className="hidden lg:block w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
//           </div>
//         </div>

//         {/* Center Section - Search (Desktop) */}
//         <div className="hidden md:flex flex-1 max-w-md mx-8">{/* reserved for search/logo */}</div>

//         {/* Right Section - Actions & Profile */}
//         <div className="flex items-center space-x-2">
//           {/* Search Button (Mobile) */}
//           <Button
//             variant="ghost"
//             size="sm"
//             className="md:hidden h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
//           >
//             <Search className="w-4 h-4" />
//           </Button>

//           {/* Fullscreen Toggle */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleFullscreenToggle}
//             className="h-9 px-3 hover:bg-muted/50 transition-colors"
//           >
//             {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
//             <span className="ml-2 hidden xl:inline text-sm">{isFullscreen ? "Exit" : "Fullscreen"}</span>
//           </Button>

//           {/* Notifications */}
//           <Button
//             variant="ghost"
//             size="sm"
//             className="relative h-9 w-9 p-0 hover:bg-muted/50 transition-colors"
//           >
//             <Bell className="w-4 h-4" />
//             {/* <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0">
//               3
//             </Badge> */}
//           </Button>

//           {/* Settings */}
//           <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted/50 transition-colors">
//             <Settings className="w-4 h-4" />
//           </Button>

//           {/* Profile Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-9 px-2 hover:bg-muted/50 transition-colors">
//                 <div className="flex items-center space-x-2">
//                   <Avatar className="h-7 w-7 ring-2 ring-border/50">
//                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
//                       {avatarLetter}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="hidden lg:block text-sm font-medium">{displayName}</span>
//                   <ChevronDown className="hidden lg:block w-3 h-3 text-muted-foreground" />
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-border/50">
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">{displayName}</p>
//                 </div>
//               </DropdownMenuLabel>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem className="cursor-pointer">
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>

//               <DropdownMenuItem className="cursor-pointer">
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span>Settings</span>
//               </DropdownMenuItem>

//               <DropdownMenuSeparator />

//               <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
//                 <Button variant="ghost" onClick={handleSignOut}>
//                   Sign out
//                 </Button>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
// Header.tsx
// import React from "react";
// import {
//   ChevronDown,
//   Menu,
//   Search,
//   Bell,
//   X,
//   Minimize2,
//   Maximize2,
//   Settings,
//   User,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useAppState } from "@/globalState/hooks/useAppState";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";

// const Header: React.FC = () => {
//   const {
//     sidebarOpen,
//     setSidebarOpen,
//     headerComponentRender,
//     isFullscreen,
//     setIsFullscreen,
//     userData,
//     setUserData,
//     setActiveItem,
//     setActiveComponent,
//   } = useAppState() as any;

//   const navigate = useNavigate();

//   const handleFullscreenToggle = async (): Promise<void> => {
//     try {
//       const el = document.documentElement as any;

//       if (!isFullscreen) {
//         if (el.requestFullscreen) await el.requestFullscreen();
//         else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
//         else if (el.msRequestFullscreen) await el.msRequestFullscreen();
//       } else {
//         const doc: any = document;
//         if (doc.exitFullscreen) await doc.exitFullscreen();
//         else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
//         else if (doc.msExitFullscreen) await doc.msExitFullscreen();
//       }

//       setIsFullscreen?.(!isFullscreen);
//     } catch (err) {
//       console.error("Fullscreen toggle error:", err);
//       toast.error("Unable to toggle fullscreen");
//     }
//   };

//   const handleMobileMenuToggle = (): void => {
//     setSidebarOpen?.(!sidebarOpen);
//   };

//   const handleSignOut = async (): Promise<void> => {
//     try {
//       setUserData?.(null);
//       setActiveItem?.("");
//       setActiveComponent?.(null);
//       localStorage.removeItem("userToken");
//       navigate("/");
//       toast.success("Signed out successfully");
//     } catch (error) {
//       console.error("Sign out error:", error);
//       toast.error("Failed to sign out");
//     }
//   };

//   const displayName: string = (userData?.[0]?.ename as string) ?? "User";
//   const avatarLetter = displayName?.charAt(0) ?? "U";

//   return (
//     <header
//       className={`sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl transition-all ${
//         isFullscreen ? "shadow-lg" : "shadow-sm"
//       }`}
//     >
//       <div className="flex items-center justify-between px-4 py-2.5 lg:px-6">
//         {/* Left */}
//         <div className="flex items-center gap-3">
//           {/* Mobile menu */}
//           <div className="lg:hidden">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={handleMobileMenuToggle}
//               className="h-9 w-9"
//             >
//               {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//             </Button>
//           </div>

//           {/* Title */}
//           <div className="flex items-center gap-3">
//             <div className="hidden h-7 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 lg:block" />
//             <h1 className="text-sm font-semibold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               {(headerComponentRender as string)?.toUpperCase?.() || "DASHBOARD"}
//             </h1>
//             <div className="hidden h-7 w-1 rounded-full bg-gradient-to-b from-blue-500 to-purple-600 lg:block" />
//           </div>
//         </div>

//         {/* Center (reserved for search) */}
//         <div className="hidden flex-1 items-center justify-center md:flex">
//           {/* Add global search or breadcrumb later */}
//         </div>

//         {/* Right actions */}
//         <div className="flex items-center gap-1">
//           {/* Mobile search icon */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden h-9 w-9"
//           >
//             <Search className="h-4 w-4" />
//           </Button>

//           {/* Fullscreen toggle */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleFullscreenToggle}
//             className="h-9 px-3"
//           >
//             {isFullscreen ? (
//               <Minimize2 className="h-4 w-4" />
//             ) : (
//               <Maximize2 className="h-4 w-4" />
//             )}
//             <span className="ml-2 hidden text-xs font-medium xl:inline">
//               {isFullscreen ? "Exit" : "Fullscreen"}
//             </span>
//           </Button>

//           {/* Notifications */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="relative h-9 w-9"
//           >
//             <Bell className="h-4 w-4" />
//           </Button>

//           {/* Settings */}
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-9 w-9"
//           >
//             <Settings className="h-4 w-4" />
//           </Button>

//           {/* Profile */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="h-9 px-2"
//               >
//                 <div className="flex items-center gap-2">
//                   <Avatar className="h-7 w-7 ring-2 ring-border/60">
//                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs text-white">
//                       {avatarLetter}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="hidden text-sm font-medium lg:inline">
//                     {displayName}
//                   </span>
//                   <ChevronDown className="hidden h-3 w-3 text-muted-foreground lg:inline" />
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>

//             <DropdownMenuContent
//               align="end"
//               className="w-56 bg-background/95 backdrop-blur-md"
//             >
//               <DropdownMenuLabel>
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium">{displayName}</p>
                  
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="cursor-pointer">
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer">
//                 <Settings className="mr-2 h-4 w-4" />
//                 <span>Settings</span>
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer text-destructive focus:text-destructive"
//                 onClick={handleSignOut}
//               >
//                 Sign out
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



// Header.tsx
import React, { useState } from "react";
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
  Eye,
  EyeOff,
  Building2,
  Hash,
  Briefcase,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppState } from "@/globalState/hooks/useAppState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    headerComponentRender,
    isFullscreen,
    setIsFullscreen,
    userData,
    setUserData,
    setActiveItem,
    setActiveComponent,
  } = useAppState() as any;

  const navigate = useNavigate();
  const [showCugFull, setShowCugFull] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);

  const handleFullscreenToggle = async (): Promise<void> => {
    try {
      const el = document.documentElement as any;

      if (!isFullscreen) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
      } else {
        const doc: any = document;
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
        else if (doc.msExitFullscreen) await doc.msExitFullscreen();
      }

      setIsFullscreen?.(!isFullscreen);
    } catch (err) {
      console.error("Fullscreen toggle error:", err);
      toast.error("Unable to toggle fullscreen");
    }
  };

  const handleMobileMenuToggle = (): void => {
    setSidebarOpen?.(!sidebarOpen);
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      setUserData?.(null);
      setActiveItem?.("");
      setActiveComponent?.(null);
      localStorage.removeItem("userToken");
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const displayName: string = (userData?.[0]?.ename as string) ?? "User";
  const avatarLetter = displayName?.charAt(0) ?? "U";

  // Get user data
  const userInfo = userData?.[0] || {};
  const cugNumber = userInfo.sign_up_cug || "";
  
  // Mask CUG number - show only last 4 digits
  const maskedCugNumber = showCugFull 
    ? cugNumber 
    : cugNumber ? `******${cugNumber.slice(-4)}` : "N/A";

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-background/70 backdrop-blur-xl transition-all ${
        isFullscreen ? "shadow-lg" : "shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              className="h-9 w-9"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="hidden h-7 w-1 rounded-full bg-gradient-to-r from-blue-600/90 to-purple-200 lg:block" />
            <h1 className="text-sm font-semibold tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {(headerComponentRender as string)?.toUpperCase?.() || "DASHBOARD"}
            </h1>
            <div className="hidden h-7 w-1 rounded-full bg-gradient-to-r from-blue-600/90 to-purple-200 lg:block" />
          </div>
        </div>

        {/* Center (reserved for search) */}
        <div className="hidden flex-1 items-center justify-center md:flex">
          {/* Add global search or breadcrumb later */}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Mobile search icon */}
          <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
            <Search className="h-4 w-4" />
          </Button>

          {/* Fullscreen toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreenToggle}
            className="h-9 px-3"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
            <span className="ml-2 hidden text-xs font-medium xl:inline">
              {isFullscreen ? "Exit" : "Fullscreen"}
            </span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 ring-2 ring-border/60">
                    <AvatarFallback className="bg-gradient-to-r from-blue-600/90 to-purple-200 text-xs text-white">
                      {avatarLetter}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium lg:inline">
                    {displayName}
                  </span>
                  <ChevronDown className="hidden h-3 w-3 text-muted-foreground lg:inline" />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-background/95 backdrop-blur-md"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{displayName}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Profile Dialog Trigger */}
              <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Avatar className="h-10 w-10 ring-2 ring-border/60">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {avatarLetter}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-semibold">{displayName}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          Employee Profile
                        </p>
                      </div>
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Employee Code */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <Hash className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Employee Code</p>
                        <p className="text-sm font-semibold">{userInfo.ecno || "N/A"}</p>
                      </div>
                    </div>

                    {/* Branch */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
                        <Building2 className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Branch</p>
                        <p className="text-sm font-semibold">{userInfo.branch || "N/A"}</p>
                      </div>
                    </div>

                    {/* Department */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                        <Briefcase className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-semibold">{userInfo.dept || "N/A"}</p>
                      </div>
                    </div>

                    {/* CUG Number with Toggle */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
                        <Phone className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">CUG Number</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold font-mono">
                            {maskedCugNumber}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setShowCugFull(!showCugFull)}
                          >
                            {showCugFull ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setProfileDialogOpen(false)}
                    >
                      Close
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
