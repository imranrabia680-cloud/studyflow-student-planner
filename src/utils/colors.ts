export interface SubjectColor {
  name: string;
  hex: string;
  bgLight: string;
  borderLight: string;
  bgDark: string;
  borderDark: string;
}

export const SUBJECT_COLORS: SubjectColor[] = [
  {
    name: 'Indigo',
    hex: '#4F46E5',
    bgLight: 'rgba(79, 70, 229, 0.10)',
    borderLight: 'rgba(79, 70, 229, 0.25)',
    bgDark: 'rgba(99, 102, 241, 0.20)',
    borderDark: 'rgba(99, 102, 241, 0.40)',
  },
  {
    name: 'Emerald',
    hex: '#059669',
    bgLight: 'rgba(5, 150, 105, 0.10)',
    borderLight: 'rgba(5, 150, 105, 0.25)',
    bgDark: 'rgba(16, 185, 129, 0.20)',
    borderDark: 'rgba(16, 185, 129, 0.40)',
  },
  {
    name: 'Amber',
    hex: '#D97706',
    bgLight: 'rgba(217, 119, 6, 0.10)',
    borderLight: 'rgba(217, 119, 6, 0.25)',
    bgDark: 'rgba(245, 158, 11, 0.20)',
    borderDark: 'rgba(245, 158, 11, 0.40)',
  },
  {
    name: 'Rose',
    hex: '#E11D48',
    bgLight: 'rgba(225, 29, 72, 0.10)',
    borderLight: 'rgba(225, 29, 72, 0.25)',
    bgDark: 'rgba(244, 63, 94, 0.20)',
    borderDark: 'rgba(244, 63, 94, 0.40)',
  },
  {
    name: 'Sky Blue',
    hex: '#0284C7',
    bgLight: 'rgba(2, 132, 199, 0.10)',
    borderLight: 'rgba(2, 132, 199, 0.25)',
    bgDark: 'rgba(14, 165, 233, 0.20)',
    borderDark: 'rgba(14, 165, 233, 0.40)',
  },
  {
    name: 'Violet',
    hex: '#7C3AED',
    bgLight: 'rgba(124, 58, 237, 0.10)',
    borderLight: 'rgba(124, 58, 237, 0.25)',
    bgDark: 'rgba(139, 92, 246, 0.20)',
    borderDark: 'rgba(139, 92, 246, 0.40)',
  },
  {
    name: 'Teal',
    hex: '#0D9488',
    bgLight: 'rgba(13, 148, 136, 0.10)',
    borderLight: 'rgba(13, 148, 136, 0.25)',
    bgDark: 'rgba(20, 184, 166, 0.20)',
    borderDark: 'rgba(20, 184, 166, 0.40)',
  },
  {
    name: 'Coral Orange',
    hex: '#EA580C',
    bgLight: 'rgba(234, 88, 12, 0.10)',
    borderLight: 'rgba(234, 88, 12, 0.25)',
    bgDark: 'rgba(249, 115, 22, 0.20)',
    borderDark: 'rgba(249, 115, 22, 0.40)',
  },
];

export const DEFAULT_COLOR = SUBJECT_COLORS[0].hex;

export function getSubjectColorStyles(colorHex: string = DEFAULT_COLOR) {
  const matched = SUBJECT_COLORS.find(c => c.hex.toLowerCase() === colorHex.toLowerCase());
  if (matched) {
    return {
      color: matched.hex,
      bgStyle: { backgroundColor: matched.bgLight },
      borderStyle: { borderColor: matched.borderLight },
      solidStyle: { backgroundColor: matched.hex },
    };
  }
  return {
    color: colorHex,
    bgStyle: { backgroundColor: `${colorHex}1A` },
    borderStyle: { borderColor: `${colorHex}40` },
    solidStyle: { backgroundColor: colorHex },
  };
}
