export function UniversityLogo({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} aria-label="Logo de INNOVA TEC">
      {/* Fondo circular */}
      <circle cx="50" cy="50" r="45" fill="#0047AB" />

      {/* Chip de computadora */}
      <rect x="30" y="30" width="40" height="40" fill="#FFFFFF" rx="3" />
      <rect x="35" y="35" width="30" height="30" fill="#0047AB" rx="2" />

      {/* Pines del chip */}
      <rect x="25" y="38" width="5" height="3" fill="#FFFFFF" />
      <rect x="25" y="45" width="5" height="3" fill="#FFFFFF" />
      <rect x="25" y="52" width="5" height="3" fill="#FFFFFF" />
      <rect x="25" y="59" width="5" height="3" fill="#FFFFFF" />

      <rect x="70" y="38" width="5" height="3" fill="#FFFFFF" />
      <rect x="70" y="45" width="5" height="3" fill="#FFFFFF" />
      <rect x="70" y="52" width="5" height="3" fill="#FFFFFF" />
      <rect x="70" y="59" width="5" height="3" fill="#FFFFFF" />

      <rect x="38" y="25" width="3" height="5" fill="#FFFFFF" />
      <rect x="45" y="25" width="3" height="5" fill="#FFFFFF" />
      <rect x="52" y="25" width="3" height="5" fill="#FFFFFF" />
      <rect x="59" y="25" width="3" height="5" fill="#FFFFFF" />

      <rect x="38" y="70" width="3" height="5" fill="#FFFFFF" />
      <rect x="45" y="70" width="3" height="5" fill="#FFFFFF" />
      <rect x="52" y="70" width="3" height="5" fill="#FFFFFF" />
      <rect x="59" y="70" width="3" height="5" fill="#FFFFFF" />

      {/* Iniciales IT en el centro */}
      <text x="50" y="53" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
        IT
      </text>

      {/* Circuitos */}
      <path d="M30 45 L25 45" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M30 52 L25 52" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M70 45 L75 45" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M70 52 L75 52" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M45 30 L45 25" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M52 30 L52 25" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M45 70 L45 75" stroke="#FFFFFF" strokeWidth="1" />
      <path d="M52 70 L52 75" stroke="#FFFFFF" strokeWidth="1" />
    </svg>
  )
}

