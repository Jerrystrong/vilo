import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

// Fire Icon (Icon 1 - User Normal) — SVG fourni par l'utilisateur
export function FireIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.926 20.574a7.26 7.26 0 0 0 3.039 1.511c.107.035.179-.105.107-.175-2.395-2.285-1.079-4.758-.107-5.873.693-.796 1.68-2.107 1.608-3.865 0-.176.18-.317.322-.211 1.359.703 2.288 2.25 2.538 3.515.394-.386.537-.984.537-1.511 0-.176.214-.317.393-.176 1.287 1.16 3.503 5.097-.072 8.19-.071.071 0 .212.072.177a8.761 8.761 0 0 0 3.003-1.442c5.827-4.5 2.037-12.48-.43-15.116-.321-.317-.893-.106-.893.351-.036.95-.322 2.004-1.072 2.707-.572-2.39-2.478-5.105-5.195-6.441-.357-.176-.786.105-.75.492.07 3.27-2.063 5.352-3.922 8.059-1.645 2.425-2.717 6.89.822 9.808z"
        fill={color}
      />
    </Svg>
  );
}

// Search / Explorer (Icon 2 - User Normal)
export function SearchIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="11"
        cy="11"
        r="7"
        stroke={color}
        strokeWidth="2.4"
      />
      <Path
        d="M16.5 16.5L21 21"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Map Pin Center Icon (Icon 3 - User Normal - Featured Center)
export function MapPinCenterIcon({ size = 45, active = true }: { size?: number; active?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/*
        Open arc ring — 260° of teal stroke, top 100° is intentionally left OPEN
        so the map pin icon "emerges" through the gap at the top.

        Circle center: (28, 28), radius: 25
        Arc start (right side of gap, at 320° clockwise from right): (47.15, 11.93)
        Arc end   (left  side of gap, at 220° clockwise from right): (8.85,  11.93)
        large-arc-flag=1 (take the long 260° path going through the bottom)
        sweep-flag=1     (clockwise direction)
      */}
      <Path
        d="M 47.15 11.93 A 25 25 0 1 1 8.85 11.93"
        stroke="#007B7B"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/*
        White location pin — evenodd so the inner circle is cut out transparent.
        Positioned so the pin's rounded top emerges through the open arc gap.
      */}
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M28 10
          C21.37 10 15 16.37 15 23
          C15 31.28 28 45 28 45
          C28 45 41 31.28 41 23
          C41 16.37 34.63 10 28 10 Z
          M28 29
          C24.69 29 22 26.31 22 23
          C22 19.69 24.69 17 28 17
          C31.31 17 34 19.69 34 23
          C34 26.31 31.31 29 28 29 Z
        "
        fill="#FFFFFF"
      />
    </Svg>
  );
}

// Heart Icon with optional badge
export function HeartIcon({
  size = 26,
  color = '#FFFFFF',
  badgeCount,
}: IconProps & { badgeCount?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path
        d="M13 22.5L11.5 21.1C6.2 16.3 2.7 13.1 2.7 9.1C2.7 5.8 5.3 3.2 8.6 3.2C10.5 3.2 12.3 4.1 13 5.4C13.7 4.1 15.5 3.2 17.4 3.2C20.7 3.2 23.3 5.8 23.3 9.1C23.3 13.1 19.8 16.3 14.5 21.1L13 22.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Profile / User Icon (Icon 5 - Both Roles)
export function ProfileIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Head */}
      <Circle
        cx="12"
        cy="7.5"
        r="4"
        stroke={color}
        strokeWidth="2.2"
      />
      {/* Shoulders */}
      <Path
        d="M4.5 20.5C4.5 16.5 8 14.5 12 14.5C16 14.5 19.5 16.5 19.5 20.5"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Stats / Dashboard (Icon 1 - Etab)
export function StatsIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Left bar (medium) */}
      <Rect
        x="3.5"
        y="10"
        width="2.6"
        height="10"
        rx="1.3"
        fill={color}
      />
      {/* Center bar (tall) */}
      <Rect
        x="10.7"
        y="4"
        width="2.6"
        height="16"
        rx="1.3"
        fill={color}
      />
      {/* Right bar (short) */}
      <Rect
        x="17.9"
        y="12"
        width="2.6"
        height="8"
        rx="1.3"
        fill={color}
      />
    </Svg>
  );
}

// Calendar / Agenda with checkmark (Icon 2 - Etab)
export function CalendarCheckIcon({ size = 26, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M19.8572 15L13.6573 21.1999L11.0001 18.5428M15 2.5V6.5M9 2.5V6.5M9 11.5H3.51733M3.51733 11.5C3.50563 11.8208 3.5 12.154 3.5 12.5C3.5 17.4094 4.64094 19.7517 8 20.6041M3.51733 11.5C3.7256 5.79277 5.84596 4 12 4C17.3679 4 19.6668 5.36399 20.3048 9.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Plus Center Icon (Icon 3 - Etab - Featured Center)
// Cercle COMPLET teal rempli (pas d'arc ouvert) + croix blanche centrée.
export function PlusCenterIcon({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      {/* Cercle plein teal — pas de découpe en haut */}
      <Path
        d="M 28 3 A 25 25 0 1 1 27.999 3 Z"
        fill="#007B7B"
      />
      {/* Plus blanc — horizontal */}
      <Line
        x1="16"
        y1="28"
        x2="40"
        y2="28"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Plus blanc — vertical */}
      <Line
        x1="28"
        y1="16"
        x2="28"
        y2="40"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
