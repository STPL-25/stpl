import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppState } from "@/globalState/hooks/useAppState";
import useFetch from "@/hooks/useFetchHook";
import { apiFetchSidebarData } from "@/Services/Api";
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
  const {sidebarOpen,setSidebarOpen, activeItem, setActiveItem, activeComponent,
    setActiveComponent, sidebarWidth, setSidebarWidth, isCollapsed, toggleCollapse,
    setHeaderComponentRender,userData,fetchSidebarData,sidebarData } = useAppState() as any;

  const ecno = userData[0]?.ecno || "";


  const { data, loading, error } = useFetch<PermissionData>(`${apiFetchSidebarData}${ecno}` );
useEffect(() => { 
  if (ecno) {
    fetchSidebarData(ecno);
    console.log("Fetching sidebar data for ecno:",  fetchSidebarData(ecno));
  }
}, [ecno]);


  // Uncomment to debug
// console.log(fetchSidebarData(ecno))
  const [menu, setMenu] = useState<
    {
      id: string;
      key: string; 
      label: string;
      icon: IconComponent;
      screenId: number;
    }[]
  >([]);

  // Auto-select first menu item when menu loads
useEffect(() => {
  if (menu.length > 0) {
    const firstItem = menu[0];
    
    // Only set if no component is currently selected
    if (!activeComponent || activeComponent === null) {
      setActiveItem?.(firstItem.key);
      setActiveComponent?.(firstItem.screenId);
      setHeaderComponentRender?.(firstItem.label);
    }
  }
}, [menu, activeComponent, setActiveItem, setActiveComponent, setHeaderComponentRender]);

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
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background/120 backdrop-blur-xl shadow-lg transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: isCollapsed ? "80px" : `${sidebarWidth}px` }}
      >
        {/* Brand / Collapse */}
        <div className="flex items-center justify-between px-4 py-3 border-b/60">
          <div className="flex items-center gap-3">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  ST
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Space Textiles
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    ERP Console
                  </span>
                </div>
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapse}
                  className="hidden lg:inline-flex h-8 w-8"
                >
                  <LucideIcons.PanelLeftOpen
                    className={`h-4 w-4 transition-transform ${
                      isCollapsed ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isCollapsed ? "Expand" : "Collapse"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Mobile close */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen?.(false)}
            className="lg:hidden h-8 w-8"
          >
            <LucideIcons.X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          {loading && (
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Loading menu…
            </div>
          )}
          {error && (
            <div className="px-2 py-1 text-xs text-destructive">
              Failed to load menu
            </div>
          )}

          <nav className="space-y-1">
            {menu.map((item) => (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleClick(item)}
                    className={`group flex w-full items-center rounded-xl px-2 py-2 text-sm transition-all
                    ${
                      activeItem === item.key
                        ? "bg-gradient-to-r from-blue-600/90 to-purple-600 text-white shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all
                      ${
                        activeItem === item.key
                          ? "border-white/20 bg-white/10"
                          : "border-border/60 bg-background"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 ${
                          activeItem === item.key
                            ? "text-white"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                    </div>

                    {!isCollapsed && (
                      <span className="ml-3 truncate text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </ScrollArea>

        {/* Resize handle */}
        {!isCollapsed && (
          <div
            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500/40"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute right-0 top-1/2 h-10 w-3 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100" />
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40  backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen?.(false)}
        />
      )}
    </TooltipProvider>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0  backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;
