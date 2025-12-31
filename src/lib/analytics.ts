import { sendGAEvent } from '@next/third-parties/google';

type EventName =
    | 'view_project'
    | 'click_social_link'
    | 'download_resume'
    | 'open_contact'
    | 'submit_contact_form'
    | 'section_view'
    | 'click_cta'
    | 'select_plan'
    | 'subscribe_newsletter';

type EventParams = Record<string, string | number | boolean>;

export const trackEvent = (eventName: EventName, params?: EventParams) => {
    try {
        sendGAEvent('event', eventName, params || {});
        // Optional: Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Analytics] ${eventName}`, params);
        }
    } catch (error) {
        console.error('[Analytics] Failed to send event:', error);
    }
};
