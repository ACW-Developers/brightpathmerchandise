import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  return "Other";
}

let sessionId = "";
function getSessionId() {
  if (!sessionId) {
    sessionId = localStorage.getItem("bp-session") || crypto.randomUUID();
    localStorage.setItem("bp-session", sessionId);
  }
  return sessionId;
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      try {
        await (supabase.from("page_visits") as any).insert({
          page_path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          device_type: getDeviceType(),
          browser: getBrowser(),
          session_id: getSessionId(),
        });
      } catch {}
    };
    track();
  }, [location.pathname]);
}
