import React from 'react';

// Props type for all icons
interface IconProps {
  className?: string;
}

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-aluminum" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor: '#E0E0E0', stopOpacity: 1}} />
        <stop offset="50%" style={{stopColor: '#BDBDBD', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#E0E0E0', stopOpacity: 1}} />
      </linearGradient>
      <linearGradient id="grad-gold" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{stopColor: '#FFD700', stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: '#B8860B', stopOpacity: 1}} />
      </linearGradient>
    </defs>
    <path d="M 100 20 L 180 170 L 20 170 Z" fill="url(#grad-aluminum)" stroke="#424242" strokeWidth="2" />
    <text 
      x="100" 
      y="140" 
      fontFamily="Inter, sans-serif" 
      fontSize="40" 
      fontWeight="900" 
      fill="url(#grad-gold)" 
      textAnchor="middle" 
      stroke="#4a2c00" 
      strokeWidth="1.5">
      Diana App
    </text>
  </svg>
);