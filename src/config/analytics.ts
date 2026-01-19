/**
 * Analytics Service Singleton
 *
 * Uses the DI Firebase service for analytics tracking.
 * Call directly from anywhere - no hooks, no context.
 *
 * Usage: analyticsService.trackEvent('button_click', { button_name: 'submit' })
 */

import { getFirebaseService } from '@sudobility/di';

export interface AnalyticsEventParams {
  [key: string]: unknown;
}

/**
 * Analytics service singleton - call directly from anywhere
 */
export const analyticsService = {
  /**
   * Track a custom event
   */
  trackEvent(eventName: string, params?: AnalyticsEventParams): void {
    try {
      const service = getFirebaseService();
      if (service.analytics.isSupported()) {
        service.analytics.logEvent(eventName, {
          ...params,
          timestamp: Date.now(),
        });
      }
    } catch {
      // Firebase service not initialized
    }
  },

  /**
   * Track a page view
   */
  trackPageView(pagePath: string, pageTitle?: string): void {
    this.trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  },

  /**
   * Track a button click
   */
  trackButtonClick(buttonName: string, params?: AnalyticsEventParams): void {
    this.trackEvent('button_click', {
      button_name: buttonName,
      ...params,
    });
  },

  /**
   * Track a link click
   */
  trackLinkClick(linkUrl: string, linkText?: string, params?: AnalyticsEventParams): void {
    this.trackEvent('link_click', {
      link_url: linkUrl,
      link_text: linkText,
      ...params,
    });
  },

  /**
   * Track an error
   */
  trackError(errorMessage: string, errorCode?: string): void {
    this.trackEvent('error_occurred', {
      error_message: errorMessage,
      error_code: errorCode,
    });
  },

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    try {
      const service = getFirebaseService();
      return service.analytics.isSupported();
    } catch {
      return false;
    }
  },
};
