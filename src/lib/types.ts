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
  ticket_price_min?: number;
  ticket_price_max?: number;
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

// Parse YYYY-MM-DD or ISO date into local midnight without UTC off-by-one shift
export function parseLocalDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim());
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);
    const local = new Date(year, month, day);
    return Number.isNaN(local.getTime()) ? null : local;
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

// Utility function to determine activity status based on date
export function getAutoStatus(activityDate: string): 'upcoming' | 'ongoing' | 'completed' {
  const activityDateObj = parseLocalDate(activityDate);
  if (!activityDateObj) return 'upcoming';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
  if (!Array.isArray(activities)) return [];
  return activities.map((activity) => ({
    ...activity,
    status: getAutoStatus(activity.date),
  }));
}

// Sort activities so ongoing comes first, then nearest upcoming, then most recent completed
export function sortActivitiesByPriority(activities: Activity[]): Activity[] {
  if (!Array.isArray(activities)) return [];
  const statusRank: Record<Activity['status'], number> = {
    ongoing: 0,
    upcoming: 1,
    completed: 2,
  };

  return [...activities].sort((a, b) => {
    const rankDiff = (statusRank[a.status] ?? 3) - (statusRank[b.status] ?? 3);
    if (rankDiff !== 0) return rankDiff;

    const timeA = parseLocalDate(a.date)?.getTime() ?? 0;
    const timeB = parseLocalDate(b.date)?.getTime() ?? 0;

    // For upcoming, soonest first; for ongoing/completed, newest first
    if (a.status === 'upcoming') {
      return timeA - timeB;
    }
    return timeB - timeA;
  });
}
