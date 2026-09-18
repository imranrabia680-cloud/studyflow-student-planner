export function getTodayIsoString(): string {
  const now = new Date();
  return formatToIsoDate(now);
}

export function formatToIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(isoString: string): Date {
  const [year, month, day] = isoString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatNiceDate(isoString: string, options?: Intl.DateTimeFormatOptions): string {
  if (!isoString) return '';
  const date = parseIsoDate(isoString);
  return date.toLocaleDateString('en-US', options ?? {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullTodayDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatGreeting(userName: string): { greeting: string; quote: string } {
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17) {
    greeting = 'Good evening';
  }

  const quotes = [
    "Small daily habits lead to monumental academic breakthroughs.",
    "Focus on progress, not perfection. You're doing great!",
    "One study session at a time turns goals into achievements.",
    "Stay curious, stay consistent, and take breaks when needed.",
  ];
  // pick deterministic quote by day of month
  const quoteIndex = new Date().getDate() % quotes.length;

  return {
    greeting: `${greeting}, ${userName}!`,
    quote: quotes[quoteIndex],
  };
}

export function getRelativeDayDescription(targetIso: string): { text: string; isPast: boolean; daysRemaining: number } {
  const todayIso = getTodayIsoString();
  const today = parseIsoDate(todayIso);
  const target = parseIsoDate(targetIso);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    return {
      text: abs === 1 ? 'Yesterday' : `${abs} days ago`,
      isPast: true,
      daysRemaining: diffDays,
    };
  }

  if (diffDays === 0) {
    return { text: 'Today', isPast: false, daysRemaining: 0 };
  }
  if (diffDays === 1) {
    return { text: 'Tomorrow', isPast: false, daysRemaining: 1 };
  }

  return {
    text: `In ${diffDays} days`,
    isPast: false,
    daysRemaining: diffDays,
  };
}

export function formatMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

export interface WeekDayInfo {
  date: Date;
  isoDate: string;
  dayName: string; // "Mon", "Tue"
  fullDayName: string; // "Monday"
  dayNumber: number; // 18
  isToday: boolean;
  isPast: boolean;
}

export function getWeekDays(weekOffset: number = 0): {
  days: WeekDayInfo[];
  weekLabel: string;
  startIso: string;
  endIso: string;
} {
  const now = new Date();
  // Adjust to start of current week (Monday)
  const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);

  const todayIso = getTodayIsoString();
  const days: WeekDayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const isoDate = formatToIsoDate(dayDate);

    days.push({
      date: dayDate,
      isoDate,
      dayName: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDayName: dayDate.toLocaleDateString('en-US', { weekday: 'long' }),
      dayNumber: dayDate.getDate(),
      isToday: isoDate === todayIso,
      isPast: isoDate < todayIso,
    });
  }

  const startIso = days[0].isoDate;
  const endIso = days[6].isoDate;

  const startMonth = days[0].date.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = days[6].date.toLocaleDateString('en-US', { month: 'short' });
  const startYear = days[0].date.getFullYear();
  const endYear = days[6].date.getFullYear();

  let weekLabel = '';
  if (startMonth === endMonth) {
    weekLabel = `${startMonth} ${days[0].dayNumber} – ${days[6].dayNumber}, ${startYear}`;
  } else if (startYear === endYear) {
    weekLabel = `${startMonth} ${days[0].dayNumber} – ${endMonth} ${days[6].dayNumber}, ${startYear}`;
  } else {
    weekLabel = `${startMonth} ${days[0].dayNumber}, ${startYear} – ${endMonth} ${days[6].dayNumber}, ${endYear}`;
  }

  return { days, weekLabel, startIso, endIso };
}
