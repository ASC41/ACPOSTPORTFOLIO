import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Device detection utilities
function detectMobileDevice(): boolean {
  // Multi-signal mobile detection
  const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const touchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const smallScreen = window.innerWidth < 768;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  
  return userAgentMobile || (touchDevice && (smallScreen || coarsePointer));
}

function AppBootstrap() {
  // Detect device type immediately and cache it
  const getDeviceType = (): boolean => {
    const cachedDeviceType = sessionStorage.getItem('deviceType');
    if (cachedDeviceType) {
      return cachedDeviceType === 'mobile';
    }
    
    const mobile = detectMobileDevice();
    sessionStorage.setItem('deviceType', mobile ? 'mobile' : 'desktop');
    return mobile;
  };

  const [AppComponent, setAppComponent] = useState<React.ComponentType | null>(null);
  const [isMobile] = useState(getDeviceType());

  useEffect(() => {
    // Load app component immediately without any loading UI
    const loadApp = async () => {
      if (isMobile) {
        const { default: AppMobile } = await import('./AppMobile');
        setAppComponent(() => AppMobile);
      } else {
        const { default: AppDesktop } = await import('./AppDesktop');
        setAppComponent(() => AppDesktop);
      }
    };
    loadApp();
  }, [isMobile]);

  // Return nothing until component loads - no loading screen
  return AppComponent ? <AppComponent /> : null;
}

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppBootstrap />
  </QueryClientProvider>
);