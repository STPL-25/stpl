import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppState } from "@/globalState/hooks/useAppState";
import useFetch from "@/hooks/useFetchHook";

type IconComponent = React.ComponentType<{ className?: string }>;

interface Screen {
  screen_id: number;
  screen_name: string;
  screen_comp: string | null;
  screen_img: string | null;
  permissions?: any[];
}

interface PermissionData {
  screens: Screen[];
  // other fields omitted
}

const getIcon = (name: string | null): IconComponent => {
  if (!name) return (LucideIcons.File as unknown) as IconComponent;
  const Icon = (LucideIcons as any)[name];
  return Icon ? (Icon as IconComponent) : ((LucideIcons.File as unknown) as IconComponent);
};

const Sidebar: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeItem,
    setActiveItem,
    activeComponent,
    setActiveComponent,
    sidebarWidth,
    setSidebarWidth,
    isCollapsed,
    toggleCollapse,
    setHeaderComponentRender,
    userData,
    expandedItems,
    setExpandedItems,
  } = useAppState() as any;
  const ecno = userData[0]?.ecno || "";

  const { data, loading, error } = useFetch<PermissionData>(
    `${import.meta.env.VITE_API_URL}/api/user_approval/get_user_screens_and_permisssions/${ecno}`
  );

  const [menu, setMenu] = useState<
    {
      id: string;
      key: string; // unique key (screen_<id>)
      label: string;
      icon: IconComponent;
      screenId: number;
    }[]
  >([]);

  useEffect(() => {
    if (!data?.data?.screens) {
      setMenu([]);
      return;
    }

    const list = data.data.screens.map((s: Screen) => {
      const id = s.screen_comp;
      return {
        id,
        key: `${s.screen_comp}`,
        label: s.screen_name,
        icon: getIcon(s.screen_img),
        screenId: s.screen_id,
      };
    });

    setMenu(list);
  }, [data]);

  // click sets activeComponent to numeric screen_id
  const handleClick = (item: { key: string; label: string; screenId: number }) => {
    console.log("Clicked item:", item);
    setActiveItem?.(item.key);
    setActiveComponent?.(item.screenId); // numeric screen_id
    setHeaderComponentRender?.(item.label);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen?.(false);
    }
  };

  // Resize logic left intact (optional)
  const [isResizing, setIsResizing] = React.useState(false);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.preventDefault();
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (typeof setSidebarWidth === "function" && newWidth >= 280 && newWidth <= 450) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <TooltipProvider>
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:translate-x-0 lg:inset-0 z-50 bg-background/95 backdrop-blur-md border-r border-border/50 transform transition-all duration-300 ease-in-out h-screen flex flex-col shadow-xl lg:shadow-sm`}
          style={{ width: isCollapsed ? "80px" : `${sidebarWidth}px` }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleCollapse}
                      className="hidden lg:flex h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
                    >
                      <LucideIcons.Menu className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</TooltipContent>
                </Tooltip>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen?.(false)}
                  className="lg:hidden h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
                >
                  <LucideIcons.X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {loading && <div className="p-2 text-sm">Loading...</div>}
              {error && <div className="p-2 text-sm text-destructive">Failed to load menu</div>}
              {menu.map((item) => (
                <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeItem === item.key ? "secondary" : "ghost"}
                      className={`w-full h-12 transition-all duration-200 hover:bg-muted/50 ${
                        isCollapsed ? "px-0 justify-center" : "justify-start px-3"
                      } ${activeItem === item.key ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50" : ""}`}
                      onClick={() => handleClick(item)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            activeItem === item.key ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md" : "bg-muted/70 hover:bg-muted"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                        {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </nav>
          </ScrollArea>

          {/* Resize Handle */}
          {!isCollapsed && (
            <div
              className="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors duration-200 group"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-l-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm" />
            </div>
          )}
        </div>
      </TooltipProvider>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
