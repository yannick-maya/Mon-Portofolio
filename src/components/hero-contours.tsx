const paths = [
  "M239 25c118 0 214 96 214 215S357 455 239 455 25 359 25 240 121 25 239 25Z",
  "M239 57c101 0 183 82 183 183s-82 183-183 183S56 341 56 240 138 57 239 57Z",
  "M240 91c82 0 149 67 149 149s-67 149-149 149-149-67-149-149S158 91 240 91Z",
  "M240 126c63 0 114 51 114 114s-51 114-114 114-114-51-114-114 51-114 114-114Z",
  "M240 162c43 0 78 35 78 78s-35 78-78 78-78-35-78-78 35-78 78-78Z",
];

export function HeroContours() {
  return (
    <svg
      aria-hidden="true"
      className="landing__art"
      fill="none"
      viewBox="0 0 480 480"
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
      <circle
        className="landing__contour-point"
        cx="240"
        cy="240"
        fill="var(--home-accent)"
        r="8"
      />
      <circle
        className="landing__contour-point"
        cx="414"
        cy="240"
        fill="var(--home-accent)"
        r="5"
        style={{ animationDelay: "850ms" }}
      />
    </svg>
  );
}
