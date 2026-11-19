const paths = [
  "M338 25C435 7 538 67 573 154s13 150-44 223-163 101-253 80S99 424 57 340 47 170 101 105 242 44 338 25Z",
  "M340 57c83-16 168 35 193 109s9 130-40 190-140 83-215 65S132 383 96 312s-9-144 37-199S259 73 340 57Z",
  "M340 90c70-13 138 29 159 92s7 109-34 158-116 68-178 52-120-32-150-91-8-118 31-164 112-36 172-47Z",
  "M339 123c53-11 109 21 126 69s6 86-28 126-92 54-141 42-94-25-117-72-7-94 25-130 89-28 135-35Z",
  "M338 157c39-7 79 14 92 49s5 64-20 94-69 41-105 31-69-18-86-53-5-69 18-96 66-20 101-25Z",
  "M342 194c24-4 49 9 57 30s3 40-13 58-43 25-65 19-43-11-53-33-3-43 11-59 40-12 63-15Z",
];

export function HeroContours() {
  return (
    <svg
      aria-hidden="true"
      className="landing__art"
      fill="none"
      viewBox="0 0 620 500"
    >
      {paths.map((path, index) => (
        <path
          className="landing__contour"
          d={path}
          key={path}
          pathLength="1"
          style={{ animationDelay: `${index * 100}ms` }}
          stroke="var(--home-border)"
          strokeWidth="1"
        />
      ))}
      <path
        className="landing__contour landing__contour--river"
        d="M18 369C93 315 147 415 224 347s121-170 202-142 119 94 176 38"
        pathLength="1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        className="landing__contour landing__contour--river"
        d="M35 398c78-48 123 39 191-20s130-154 196-127 104 80 159 27"
        pathLength="1"
        stroke="currentColor"
        strokeWidth="1"
        style={{ animationDelay: "550ms" }}
      />
      <circle
        className="landing__contour-point"
        cx="224"
        cy="347"
        fill="var(--home-accent)"
        r="8"
      />
      <circle
        className="landing__contour-point"
        cx="426"
        cy="207"
        fill="#56c9bd"
        r="5"
        style={{ animationDelay: "850ms" }}
      />
      <circle
        className="landing__contour-point"
        cx="561"
        cy="243"
        fill="var(--home-accent)"
        r="4"
        style={{ animationDelay: "1.1s" }}
      />
      <text className="landing__map-label" x="363" y="145">LOMÉ · 06°08′ N</text>
      <text className="landing__map-label" x="363" y="161">1°13′ E / GULF OF GUINEA</text>
    </svg>
  );
}
