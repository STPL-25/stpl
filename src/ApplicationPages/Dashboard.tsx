import { useState, useEffect, Suspense, ComponentType } from "react";
import Header from "@/DashboardComponents/Header";
import Sidebar from "@/DashboardComponents/SideBar";
import { sectionComponents } from "@/ComponentsDatas/ComponentDatas";
import { useAppState } from "@/globalState/hooks/useAppState";
import ErrorMessage from "@/CustomComponent/ErrorMessage/ErrorMessage";
import Loading from "@/CustomComponent/LoadingComponents/Loading";
const Dashboard: React.FC = () => {
  const { 
    sidebarOpen,
    setSidebarOpen,
    activeItem,
    sidebarWidth,
    isCollapsed,
    isFullscreen 
  } = useAppState();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Handle window resize and detect mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Type-safe dynamic component
  const ActiveComponent: ComponentType | undefined = sectionComponents[activeItem];

  const getMainContentStyle = (): React.CSSProperties => {
    if (isMobile) {
      return {
        marginLeft: "0px",
        width: "100%",
      };
    }

    return {
      marginLeft: `${sidebarWidth}px`,
      transition: "margin-left 300ms ease-in-out",
      width: `calc(100% - ${sidebarWidth}px)`,
    };
  };

  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-h-screen overflow-hidden"
        style={getMainContentStyle()}
      >
        <Header />

        <main className="flex-1 bg-gray-50 px-2">
          <div className="h-full max-w-full">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[50vh] p-4">
                  <Loading variant="spinner" fullScreen={false} size="lg" />
                </div>
              }
            >
              {ActiveComponent ? (
                <div className={`w-full ${isFullscreen ? "mt-20" : ""}`}>
                  <ActiveComponent />
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[50vh] p-4 sm:p-6 md:p-10">
                  <div className="w-full max-w-md">
                    <ErrorMessage
                      message="Failed to load data"
                      description="We couldn't fetch the requested information. Please check your connection and try again."
                    />
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
