const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill="#0A5F3E" />
    <path d="M8 26H32" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 14C14.48 14 10 18.48 10 24H30C30 18.48 25.52 14 20 14Z" fill="#A7F3D0" opacity=".25" />
    <path d="M14 24C14 20.69 16.69 18 20 18C23.31 18 26 20.69 26 24" stroke="#A7F3D0" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="20" y1="10" x2="20" y2="13" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
    <line x1="27" y1="13" x2="25.5" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="13" x2="14.5" y2="15" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default Logo
