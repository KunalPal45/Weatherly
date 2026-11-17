// Small line-icon set (stroke icons, inherit currentColor) used across the dashboard
const PATHS = {
  droplet: <path d="M12 3c3.5 4.2 6 7.2 6 10.5a6 6 0 0 1-12 0C6 10.2 8.5 7.2 12 3z" />,
  wind: <path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7a2.5 2.5 0 1 1-2.5 2.5" />,
  compass: (<><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>),
  cloud: <path d="M7 18a4 4 0 0 1-.5-7.970A5.5 5.5 0 0 1 17 9a4.5 4.5 0 0 1 .5 9z" />,
  gauge: (<><path d="M4.5 17a8.5 8.5 0 1 1 15 0" /><path d="m12 13 4-4" /><circle cx="12" cy="13" r="1" /></>),
  eye: (<><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
  thermometer: <path d="M14 14.800V5a2 2 0 0 0-4 0v9.800a4 4 0 1 0 4 0z" />,
  sunrise: <path d="M12 3v5M5.6 9.600l1.4 1.400M2 17h2M20 17h2M18.4 9.6 17 11M7 17a5 5 0 0 1 10 0M3 21h18M9 6l3-3 3 3" />,
  sunset: <path d="M12 8V3M5.6 9.600l1.4 1.400M2 17h2M20 17h2M18.4 9.6 17 11M7 17a5 5 0 0 1 10 0M3 21h18M9 5l3 3 3-3" />,
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.900l1.4 1.400M17.7 17.700l1.4 1.400M2 12h2M20 12h2M4.9 19.100l1.4-1.400M17.7 6.300l1.4-1.4" /></>),
  shirt: <path d="M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z" />,
  umbrella: <path d="M12 3a9 9 0 0 0-9 9h18a9 9 0 0 0-9-9zM12 12v6a2 2 0 0 0 4 0" />,
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  bulb: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.900c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />,
  sparkle: <path d="M12 3l1.8 5.200L19 10l-5.2 1.800L12 17l-1.8-5.200L5 10l5.2-1.800zM19 16l.8 2.200L22 19l-2.2.8L19 22l-.8-2.200L16 19l2.2-.8z" />,
  cloudSun: (<><path d="M12 3v1.500M4.5 6.500l1 1M20 10h1.500M17.5 6.500l-1 1" /><path d="M7.5 14a3.5 3.5 0 1 1 6.2-2.2" /><path d="M8 20a3.5 3.5 0 0 1-.3-7A5 5 0 0 1 17 14.5 3 3 0 0 1 16.5 20z" /></>),
}

function Icon({ name, size = 22, className = '' }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}

export default Icon