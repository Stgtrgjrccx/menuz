import React from 'react';

/**
 * The official Menuz logo. Use this everywhere a logo is needed so every screen
 * shows the same artwork (files live in /public/brand).
 *  - mark:     the "M" with the orange pointer, no text
 *  - wordmark: "Menuz" lettering
 *  - tagline:  "Menuz" with "EAT AUTHÈNTIK" underneath
 * tone "cream" is for dark/green backgrounds, "green" for light backgrounds.
 */
type Props = {
  variant?: 'mark' | 'wordmark' | 'tagline';
  tone?: 'green' | 'cream';
  /** height in px */
  height?: number;
  className?: string;
};

const BASE = (import.meta as any).env?.BASE_URL ?? './';

export const Logo: React.FC<Props> = ({ variant = 'wordmark', tone = 'green', height = 28, className = '' }) => {
  const file =
    variant === 'mark'
      ? tone === 'cream' ? 'menuz-mark-cream.png' : 'menuz-mark.png'
      : `menuz-wordmark${variant === 'tagline' ? '-tagline' : ''}-${tone}.png`;
  return (
    <img
      src={`${BASE}brand/${file}`.replace('//', '/')}
      alt="Menuz"
      draggable={false}
      style={{ height, width: 'auto' }}
      className={`select-none ${className}`}
    />
  );
};
