const routes = [
  "M42 350h106v-70h112v84h105V226h111v-78h104",
  "M58 145h119v66h104v-66h123V87h126",
  "M148 280v-69m112 153V211m105 15v-81m111 3V87",
  "M178 145v-52h100V57h115",
  "M365 226h66v96h124",
];

const nodes = [
  { x: 148, y: 280, label: "01" },
  { x: 260, y: 364, label: "02" },
  { x: 365, y: 226, label: "03" },
  { x: 476, y: 148, label: "04" },
  { x: 177, y: 145, label: "05" },
  { x: 405, y: 87, label: "06" },
];

export function HeroContours() {
  return (
    <svg
      aria-hidden="true"
      className="landing__art"
      fill="none"
      viewBox="0 0 620 430"
    >
      <path className="landing__network-grid" d="M0 80h620M0 160h620M0 240h620M0 320h620M80 0v430M160 0v430M240 0v430M320 0v430M400 0v430M480 0v430M560 0v430" />
      {routes.map((path, index) => (
        <path
          className={index === 0 ? "landing__contour landing__contour--river" : "landing__contour"}
          d={path}
          key={path}
          pathLength="1"
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
      {nodes.map((node, index) => (
        <g className="landing__network-node" key={node.label} style={{ animationDelay: `${index * 180}ms` }}>
          <circle cx={node.x} cy={node.y} r="11" />
          <circle className="landing__network-node-core" cx={node.x} cy={node.y} r="3" />
          <text x={node.x + 15} y={node.y - 13}>{node.label}</text>
        </g>
      ))}
      <text className="landing__map-label" x="40" y="405">INGEST → MODEL → INSIGHT</text>
      <text className="landing__map-label" x="444" y="31">DATA / 06°08′ N</text>
    </svg>
  );
}
