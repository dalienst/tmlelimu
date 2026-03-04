import React from 'react';

export default function TmlElimuLogo({ className = "w-8 h-8", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      {...props}
      fill="none"
    >
      {/* Emerald Background */}
      <rect width="100" height="100" rx="22" fill="#004d40" />
      
      {/* Stylized 'T' */}
      <path
        d="M28 32h44v11H56.5v29H43.5V43H28V32z"
        fill="#ffffff"
      />
      
      {/* Amber Accent Dot (for 'E' / Elimu / Growth) */}
      <circle cx="67" cy="67" r="10" fill="#d97706" />
    </svg>
  );
}
