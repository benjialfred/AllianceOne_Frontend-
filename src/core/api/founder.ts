import { apiClient } from './client';

export interface FounderCV {
  title: string;
  version: string;
  file_url: string;
  updated_at: string;
}

export interface ActivityEventData {
  event_type: 'PROFILE_CLICK' | 'PROFILE_VIEW' | 'CV_CLICK' | 'CV_VIEW' | 'CV_DOWNLOAD';
  session_id?: string;
  metadata?: any;
}

export interface FounderAnalytics {
  overview: {
    profile_views: number;
    unique_visitors: number;
    cv_views: number;
    unique_cv_viewers: number;
    downloads: number;
    conversion_rate: number;
  };
  recent_activity: any[];
}

export const founderApi = {
  /**
   * Fetch the currently active CV details.
   */
  getActiveCV: async (): Promise<FounderCV> => {
    return apiClient.get('/founder/cv/active/');
  },

  /**
   * Track an interaction event.
   */
  trackEvent: async (data: ActivityEventData): Promise<void> => {
    // Generate a simple session ID if none exists
    if (!data.session_id) {
      let sid = localStorage.getItem('founder_session_id');
      if (!sid) {
        sid = Math.random().toString(36).substring(2, 15);
        localStorage.setItem('founder_session_id', sid);
      }
      data.session_id = sid;
    }
    
    return apiClient.post('/founder/events/', data);
  },

  /**
   * Get founder analytics (Admin/Founder only).
   */
  getAnalytics: async (): Promise<FounderAnalytics> => {
    return apiClient.get('/founder/analytics/');
  }
};
