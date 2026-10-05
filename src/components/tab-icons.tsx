import React from 'react';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}
interface BuildingIconProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
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
export default function BuildingIcon({
  width = 512,
  height = 512,
  fill = "#000000",
  ...props
}: BuildingIconProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 512 512"
      fill={fill}
      {...props}
    >
      <Path d="M407.788,190.202h-92.16V82.62c-0.01-45.642-36.978-82.61-82.62-82.62H104.212 C58.57,0.01,21.602,36.978,21.591,82.62V512H58.6V82.62c0.01-12.65,5.08-23.936,13.363-32.249 c8.314-8.284,19.599-13.353,32.249-13.364h128.796c12.65,0.01,23.936,5.08,32.249,13.364c8.283,8.313,13.353,19.599,13.363,32.249 V512h37.008V227.21h92.16c12.65,0.01,23.936,5.08,32.249,13.364c8.284,8.313,13.353,19.599,13.364,32.249V512h37.008V272.822 C490.398,227.18,453.43,190.212,407.788,190.202z" />
      <Rect x="111.321" y="131.597" width="31.808" height="53.976" />
      <Rect x="189.975" y="131.597" width="31.808" height="53.976" />
      <Rect x="111.321" y="254.971" width="31.808" height="53.976" />
      <Rect x="189.975" y="254.971" width="31.808" height="53.976" />
      <Rect x="111.321" y="378.345" width="31.808" height="53.976" />
      <Rect x="189.975" y="378.345" width="31.808" height="53.976" />
      <Rect x="363.47" y="289.67" width="31.808" height="53.976" />
      <Rect x="363.47" y="407.903" width="31.808" height="53.976" />
    </Svg>
  );
}

// Bookmark / Favorite Icon (Branding)
export function BookmarkIcon({
  size = 22,
  color = "#426AB2",
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path
        d="M30.051 45.6071L17.851 54.7401C17.2728 55.1729 16.5856 55.4363 15.8662 55.5008C15.1468 55.5652 14.4237 55.4282 13.7778 55.1049C13.1319 54.7817 12.5887 54.2851 12.209 53.6707C11.8293 53.0563 11.6281 52.3483 11.628 51.626V15.306C11.628 13.2423 12.4477 11.2631 13.9069 9.8037C15.3661 8.34432 17.3452 7.52431 19.409 7.52405H45.35C47.4137 7.52431 49.3929 8.34432 50.8521 9.8037C52.3112 11.2631 53.131 13.2423 53.131 15.306V51.625C53.1309 52.3473 52.9297 53.0553 52.55 53.6697C52.1703 54.2841 51.6271 54.7807 50.9812 55.1039C50.3353 55.4272 49.6122 55.5642 48.8928 55.4998C48.1734 55.4353 47.4862 55.1719 46.908 54.739L34.715 45.6071C34.0419 45.1031 33.2238 44.8308 32.383 44.8308C31.5422 44.8308 30.724 45.1031 30.051 45.6071V45.6071Z"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </Svg>
  );
}

// Share Icon (Branding)
export function ShareIcon({
  size = 22,
  color = "#000000",
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="-0.5 0 25 25" fill="none">
      <Path
        d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Map Location Pin Icon (Branding)
export function MapLocationIcon({
  size = 24,
  color = "#1C274C",
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.1433C4 5.64588 7.58172 2 12 2C16.4183 2 20 5.64588 20 10.1433C20 14.6055 17.4467 19.8124 13.4629 21.6744C12.5343 22.1085 11.4657 22.1085 10.5371 21.6744C6.55332 19.8124 4 14.6055 4 10.1433Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <Circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

// Chat / Interaction with Host Icon
export function InteractChatIcon({
  size = 20,
  color = "#475569",
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 18L10.29 20.29C10.514 20.5156 10.7804 20.6946 11.0739 20.8168C11.3674 20.9389 11.6821 21.0018 12 21.0018C12.3179 21.0018 12.6326 20.9389 12.9261 20.8168C13.2196 20.6946 13.486 20.5156 13.71 20.29L16 18H18C19.0609 18 20.0783 17.5786 20.8284 16.8285C21.5786 16.0783 22 15.0609 22 14V7C22 5.93913 21.5786 4.92178 20.8284 4.17163C20.0783 3.42149 19.0609 3 18 3H6C4.93913 3 3.92172 3.42149 3.17157 4.17163C2.42142 4.92178 2 5.93913 2 7V14C2 15.0609 2.42142 16.0783 3.17157 16.8285C3.92172 17.5786 4.93913 18 6 18H8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 9H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 12H7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}


