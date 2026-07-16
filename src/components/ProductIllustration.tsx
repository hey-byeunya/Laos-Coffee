import { ProductArt } from "@/data/product-art";

function Motif({ art }: { art: ProductArt }) {
  const [land1, land2] = art.land;

  switch (art.motif) {
    case "sunrise-mountain":
      return (
        <>
          <circle cx="150" cy="185" r="42" fill={art.accent} opacity="0.85" />
          <polygon
            points="0,230 55,165 115,215 175,150 240,210 300,175 300,300 0,300"
            fill={land1}
            opacity="0.55"
          />
          <polygon
            points="0,265 70,205 150,255 230,195 300,240 300,300 0,300"
            fill={land2}
          />
        </>
      );
    case "ridge-sunset":
      return (
        <>
          <circle cx="150" cy="170" r="46" fill={art.accent} opacity="0.5" />
          <polygon
            points="0,225 60,175 130,215 190,160 260,205 300,180 300,300 0,300"
            fill={land1}
            opacity="0.5"
          />
          <polygon
            points="0,250 80,200 160,240 240,190 300,220 300,300 0,300"
            fill={land1}
            opacity="0.75"
          />
          <polygon
            points="0,275 90,235 180,265 270,230 300,250 300,300 0,300"
            fill={land2}
          />
        </>
      );
    case "river-wave":
      return (
        <>
          {[210, 235, 258].map((y, i) => (
            <path
              key={y}
              d={`M0,${y} Q75,${y - 14} 150,${y} T300,${y}`}
              fill="none"
              stroke={i % 2 === 0 ? land1 : land2}
              strokeWidth="4"
              opacity={0.55 - i * 0.12}
            />
          ))}
          <circle cx="70" cy="90" r="16" fill={art.accent} opacity="0.35" />
          <circle cx="220" cy="70" r="10" fill={art.accent} opacity="0.3" />
        </>
      );
    case "waterfall":
      return (
        <>
          {[128, 138, 148, 158, 168, 178].map((x, i) => (
            <rect
              key={x}
              x={x}
              y={70 + (i % 3) * 8}
              width="6"
              height={150 - (i % 3) * 14}
              rx="3"
              fill={i % 2 === 0 ? land1 : land2}
              opacity="0.8"
            />
          ))}
          <ellipse cx="150" cy="235" rx="70" ry="20" fill={land1} opacity="0.7" />
        </>
      );
    case "forest-fog":
      return (
        <>
          <polygon
            points="0,240 45,175 90,225 140,160 190,220 245,170 300,230 300,300 0,300"
            fill={land1}
          />
          <polygon
            points="0,270 60,225 130,260 200,215 260,255 300,225 300,300 0,300"
            fill={land2}
          />
          <rect x="0" y="150" width="300" height="26" fill="#FFFFFF" opacity="0.12" />
          <rect x="0" y="205" width="300" height="20" fill="#FFFFFF" opacity="0.1" />
        </>
      );
    case "karst-peaks":
      return (
        <>
          <polygon
            points="0,240 30,170 55,215 85,150 110,225 140,180 165,230 195,160 220,220 250,175 280,235 300,205 300,300 0,300"
            fill={land1}
            opacity="0.6"
          />
          <polygon
            points="0,265 40,210 75,250 120,195 160,255 210,205 260,250 300,225 300,300 0,300"
            fill={land2}
          />
        </>
      );
    case "lagoon-ripple":
      return (
        <>
          {[30, 55, 80, 105].map((r, i) => (
            <circle
              key={r}
              cx="150"
              cy="230"
              r={r}
              fill="none"
              stroke={art.accent}
              strokeWidth="3"
              opacity={0.5 - i * 0.1}
            />
          ))}
          <circle cx="95" cy="95" r="7" fill={art.accent} opacity="0.5" />
          <circle cx="205" cy="115" r="4" fill={art.accent} opacity="0.4" />
        </>
      );
    default:
      return null;
  }
}

function Container({ art, gradId }: { art: ProductArt; gradId: string }) {
  const [, bodyDark] = art.body;

  if (art.container === "dripbox") {
    return (
      <>
        <ellipse cx="150" cy="238" rx="72" ry="10" fill="#000000" opacity="0.15" />
        <rect x="85" y="108" width="130" height="122" rx="10" fill={`url(#${gradId})`} />
        <line x1="85" y1="140" x2="215" y2="140" stroke={bodyDark} strokeWidth="3" opacity="0.6" />
        <circle cx="195" cy="124" r="19" fill="#FFFFFF" opacity="0.15" />
        <polygon points="187,117 203,117 195,134" fill="#FFFFFF" opacity="0.85" />
        <line x1="187" y1="117" x2="203" y2="117" stroke={bodyDark} strokeWidth="2" />
      </>
    );
  }

  if (art.container === "stickbox") {
    return (
      <>
        <ellipse cx="150" cy="232" rx="90" ry="11" fill="#000000" opacity="0.15" />
        <rect x="62" y="112" width="176" height="112" rx="14" fill={`url(#${gradId})`} />
        <rect x="62" y="112" width="176" height="28" rx="14" fill={bodyDark} opacity="0.8" />
        {[1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={62 + 35.2 * i}
            y1="150"
            x2={62 + 35.2 * i}
            y2="222"
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity="0.25"
          />
        ))}
      </>
    );
  }

  // bag
  return (
    <>
      <ellipse cx="150" cy="258" rx="68" ry="9" fill="#000000" opacity="0.15" />
      <rect x="76" y="98" width="148" height="152" rx="18" fill={`url(#${gradId})`} />
      <rect x="76" y="82" width="148" height="32" rx="11" fill={bodyDark} />
      <circle cx="150" cy="140" r="10" fill="none" stroke={art.accent} strokeWidth="3" opacity="0.9" />
      <circle cx="150" cy="140" r="3.5" fill={art.accent} />
      <rect
        x="107"
        y="168"
        width="86"
        height="58"
        rx="8"
        fill="#FFFFFF"
        opacity="0.14"
        stroke="#FFFFFF"
        strokeOpacity="0.3"
      />
      <g transform="rotate(20 150 197)">
        <ellipse cx="150" cy="197" rx="13" ry="19" fill="#FFFFFF" opacity="0.9" />
        <line x1="150" y1="181" x2="150" y2="213" stroke={bodyDark} strokeWidth="2" />
      </g>
    </>
  );
}

interface ProductIllustrationProps {
  art: ProductArt;
  gradId: string;
}

export function ProductIllustration({ art, gradId }: ProductIllustrationProps) {
  const bodyGradId = `${gradId}-body`;

  return (
    <svg viewBox="0 0 300 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.sky[0]} />
          <stop offset="100%" stopColor={art.sky[1]} />
        </linearGradient>
        <linearGradient id={bodyGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.body[0]} />
          <stop offset="100%" stopColor={art.body[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill={`url(#${gradId})`} />
      <Motif art={art} />
      <Container art={art} gradId={bodyGradId} />
    </svg>
  );
}
