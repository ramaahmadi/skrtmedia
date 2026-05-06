// Standardized Activity/Event Schema for SKRT MEDIA
// This interface is used across both public and panitia pages

export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  locations: string[];
  mapEmbed?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  featured?: boolean;
  contact_person?: string;
  contact_phone?: string;
  max_participants?: number;
  registration_link?: string;
  ticket_price?: number;
  category?: string;
  // UI customization fields (Trust Islam style)
  hero_title?: string;
  hero_subtitle?: string;
  hero_quote?: string;
  about_section?: {
    background?: string;
    goals?: string[];
  };
  sponsors?: Array<{ logo: string; name: string }>;
  media_partners?: Array<{ logo: string; name: string }>;
}

// Data storage key for localStorage
export const ACTIVITIES_STORAGE_KEY = 'skrt_activities';

// Utility function to determine activity status based on date
export function getAutoStatus(activityDate: string): 'upcoming' | 'ongoing' | 'completed' {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day
  
  const activityDateObj = new Date(activityDate);
  activityDateObj.setHours(0, 0, 0, 0); // Reset to start of day
  
  if (activityDateObj.getTime() === today.getTime()) {
    return 'ongoing';
  } else if (activityDateObj.getTime() < today.getTime()) {
    return 'completed';
  } else {
    return 'upcoming';
  }
}

// Function to auto-update activity status based on date
export function autoUpdateActivityStatus(activities: Activity[]): Activity[] {
  return activities.map(activity => ({
    ...activity,
    status: getAutoStatus(activity.date)
  }));
}
