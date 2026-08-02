import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('bgs_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('bgs_session_id', sessionId);
  }
  return sessionId;
};

export const trackEngagement = async (eventType, elementId = null, metadata = null) => {
  try {
    await axios.post(`${API_URL}/api/metrics/engagement`, {
      event_type: eventType,
      page_url: window.location.pathname,
      element_id: elementId,
      session_id: getSessionId(),
      metadata: metadata
    }, { timeout: 5000 });
  } catch (error) {
    // Silently fail - analytics shouldn't break user experience
  }
};

export const usePerformanceMonitoring = () => {
  const location = useLocation();
  const lastPath = useRef(null);

  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;

    trackEngagement('page_view');

    const trackPerformance = () => {
      if (!window.performance || !window.performance.timing) return;

      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;

      if (loadTime > 0 && loadTime < 60000) {
        axios.post(`${API_URL}/api/metrics/performance`, {
          page_url: location.pathname,
          load_time: loadTime,
          dom_content_loaded: domContentLoaded,
          user_agent: navigator.userAgent.substring(0, 200),
          session_id: getSessionId()
        }, { timeout: 5000 }).catch(() => {});
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(trackPerformance, 500);
    } else {
      window.addEventListener('load', () => setTimeout(trackPerformance, 500), { once: true });
    }
  }, [location.pathname]);
};

export default usePerformanceMonitoring;
