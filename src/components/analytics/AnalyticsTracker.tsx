"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";

// Helper functions for client details
const getDeviceType = (): "desktop" | "mobile" | "tablet" => {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
};

const getBrowser = (): string => {
  if (typeof window === "undefined") return "Others";
  const ua = navigator.userAgent;
  if (ua.indexOf("Chrome") > -1 && ua.indexOf("Safari") > -1 && ua.indexOf("Edge") === -1 && ua.indexOf("Edg") === -1) return "Chrome";
  if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) return "Safari";
  if (ua.indexOf("Firefox") > -1) return "Firefox";
  if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) return "Edge";
  return "Others";
};

const getOS = (): string => {
  if (typeof window === "undefined") return "Others";
  const ua = navigator.userAgent;
  if (ua.indexOf("Win") > -1) return "Windows";
  if (ua.indexOf("Mac") > -1) return "macOS";
  if (ua.indexOf("Linux") > -1) return "Linux";
  if (ua.indexOf("Android") > -1) return "Android";
  if (ua.indexOf("like Mac") > -1) return "iOS";
  return "Others";
};

const generateUUID = () => {
  return "ts_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

interface TrackerEvent {
  type: "pageview" | "click" | "scroll" | "section" | "heatmap";
  url: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

// Queue configuration
let eventQueue: TrackerEvent[] = [];
let batchTimeout: NodeJS.Timeout | null = null;
let currentSessionId = "";
let currentVisitorId = "";

const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  if (!currentSessionId) {
    let sid = sessionStorage.getItem("techysaumya_session_id");
    if (!sid) {
      sid = generateUUID();
      sessionStorage.setItem("techysaumya_session_id", sid);
    }
    currentSessionId = sid;
  }
  return currentSessionId;
};

const getVisitorId = (): string => {
  if (typeof window === "undefined") return "";
  if (!currentVisitorId) {
    let vid = localStorage.getItem("techysaumya_visitor_id");
    if (!vid) {
      vid = generateUUID();
      localStorage.setItem("techysaumya_visitor_id", vid);
    }
    currentVisitorId = vid;
  }
  return currentVisitorId;
};

const flushQueue = async () => {
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];

  const sid = getSessionId();
  const vid = getVisitorId();

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sid,
        events: batch,
        sessionData: {
          visitorId: vid,
          deviceType: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          referrer: typeof document !== "undefined" ? document.referrer : "",
        },
      }),
      keepalive: true,
    });
  } catch (err) {
    eventQueue = [...batch, ...eventQueue];
    console.error("Failed to flush analytics queue:", err);
  }
};

const queueEvent = (event: {
  type: "pageview" | "click" | "scroll" | "section" | "heatmap";
  url: string;
  metadata: Record<string, unknown>;
  timestamp?: Date;
}) => {
  eventQueue.push({
    ...event,
    timestamp: event.timestamp || new Date(),
  });

  if (typeof window !== "undefined") {
    if (batchTimeout) clearTimeout(batchTimeout);
    batchTimeout = setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => flushQueue());
      } else {
        setTimeout(() => flushQueue(), 50);
      }
    }, 2000);
  }
};

// Component that listens to page navigation inside Suspense to avoid static deoptimization
function PageViewObserver({ sessionId }: { sessionId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedUrl = useRef<string>("");

  useEffect(() => {
    // Avoid tracking admin or analytics pages themselves to keep traffic stats clean
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (lastTrackedUrl.current === url) return;
    lastTrackedUrl.current = url;

    queueEvent({
      type: "pageview",
      url,
      metadata: {
        title: document.title,
        referrer: document.referrer,
      },
    });
  }, [pathname, searchParams, sessionId]);

  return null;
}

export default function AnalyticsTracker() {
  const [sessionId, setSessionId] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    // Initialize sessions in client effect
    const sid = getSessionId();
    setTimeout(() => {
      setSessionId(sid);
    }, 0);

    // Initial session activation fetch to create session in db immediately
    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: sid,
        events: [], // empty event payload to initialize session metadata
        sessionData: {
          visitorId: getVisitorId(),
          deviceType: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          referrer: document.referrer,
        },
      }),
      keepalive: true,
    }).catch((err) => console.warn("Failed to initialize analytics session:", err));

    // Global Click & Heatmap Listener
    const handleGlobalClick = (e: MouseEvent) => {
      const url = window.location.pathname;
      if (url.startsWith("/admin") || url.startsWith("/api")) return;

      const target = e.target as HTMLElement;
      const clickable = target.closest("a, button, [role='button'], [data-analytics-click]");
      
      if (clickable) {
        const label = clickable.getAttribute("data-analytics-click") || 
                      clickable.textContent?.trim().substring(0, 50) || 
                      clickable.getAttribute("aria-label") || 
                      clickable.getAttribute("href") || 
                      "Unnamed Clickable";

        const href = clickable.getAttribute("href") || undefined;

        queueEvent({
          type: "click",
          url,
          metadata: {
            label,
            tagName: clickable.tagName.toLowerCase(),
            id: clickable.id || undefined,
            href,
          },
        });
      }

      // Heatmap tracking for ALL click coordinates (normalized)
      const docWidth = document.documentElement.scrollWidth || document.body.scrollWidth || 1;
      const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 1;

      const xPercent = parseFloat(((e.pageX / docWidth) * 100).toFixed(2));
      const yPercent = parseFloat(((e.pageY / docHeight) * 100).toFixed(2));

      queueEvent({
        type: "heatmap",
        url,
        metadata: {
          x: xPercent,
          y: yPercent,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
        },
      });
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });

    // Exit & Batch Flush on Unload
    const handleBeforeUnload = () => {
      if (eventQueue.length === 0) return;
      const payload = JSON.stringify({
        sessionId: getSessionId(),
        events: eventQueue,
        sessionData: {
          visitorId: getVisitorId(),
          deviceType: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          referrer: document.referrer,
        },
      });
      navigator.sendBeacon("/api/analytics", payload);
      eventQueue = [];
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Heartbeat ping (keep-alive every 20 seconds)
    const heartbeatInterval = setInterval(() => {
      fetch("/api/analytics/ping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: getSessionId() }),
        keepalive: true,
      }).catch((err) => console.warn("Failed to send analytics heartbeat:", err));
    }, 20000);

    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearInterval(heartbeatInterval);
    };
  }, []);

  // Section Visibility tracking
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const sectionTimes = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionName = entry.target.getAttribute("data-analytics-section");
          if (!sectionName) return;

          if (entry.isIntersecting) {
            sectionTimes.set(sectionName, Date.now());
          } else {
            const entryTime = sectionTimes.get(sectionName);
            if (entryTime) {
              const duration = Math.round((Date.now() - entryTime) / 1000);
              sectionTimes.delete(sectionName);

              if (duration > 0.5) {
                queueEvent({
                  type: "section",
                  url: window.location.pathname,
                  metadata: {
                    sectionName,
                    duration,
                  },
                });
              }
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll("[data-analytics-section]");
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
      sectionTimes.forEach((entryTime, sectionName) => {
        const duration = Math.round((Date.now() - entryTime) / 1000);
        if (duration > 0.5) {
          queueEvent({
            type: "section",
            url: window.location.pathname,
            metadata: {
              sectionName,
              duration,
            },
          });
        }
      });
    };
  }, [pathname]);

  // Scroll Milestone Depth tracking
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const milestones = new Set<number>();
    
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      const checkMilestones = [25, 50, 75, 90, 100];
      for (const m of checkMilestones) {
        if (percent >= m && !milestones.has(m)) {
          milestones.add(m);
          queueEvent({
            type: "scroll",
            url: window.location.pathname,
            metadata: {
              depth: m,
            },
          });
        }
      }
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [pathname]);

  if (!sessionId) return null;

  return (
    <Suspense fallback={null}>
      <PageViewObserver sessionId={sessionId} />
    </Suspense>
  );
}
