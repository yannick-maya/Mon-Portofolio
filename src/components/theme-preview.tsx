"use client";

import { useSearchParams } from "next/navigation";

const themes = {
  A: {
    name: "Nuit cartographique",
    descriptor: "Précis · éditorial · intemporel",
    story: "Une base bleu encre, des surfaces ivoire froid et un accent safran. Une présence posée qui laisse les projets et les données prendre la parole.",
    colors: ["#101C2C", "#F4F6F8", "#2864F0", "#F2A900"],
    scores: "Bleu nuit · blanc brume · électrique · safran",
    contrast: "Texte sur fond sombre 15,83:1 · texte sur fond clair 13,79:1 · texte sur accent 5,03:1 · accent chaud 8,01:1",
    states: ["Hover #174BC2", "Focus #F2A900 / #174BC2", "Succès #167348 / #E3F4EA", "Erreur #B42332 / #FFF0EF"],
  },
  B: {
    name: "Signal électrique",
    descriptor: "Vif · digital · affirmé",
    story: "Le noir profond rencontre le bleu électrique et un corail franc. Une identité à fort contraste, inspirée des interfaces produit et des outils développeur.",
    colors: ["#090B10", "#FFFFFF", "#315CFF", "#FF765E"],
    scores: "Noir carbone · blanc pur · électrique · corail",
    contrast: "Texte sur fond sombre 18,70:1 · texte sur fond clair 17,57:1 · texte sur accent 5,12:1 · accent chaud 6,83:1",
    states: ["Hover #2148D5", "Focus #FF765E / #2148D5", "Succès #167348 / #E3F4EA", "Erreur #B42332 / #FFF0EF"],
  },
  C: {
    name: "Delta vivant",
    descriptor: "Ancré · lumineux · singulier",
    story: "La profondeur indigo évoque la nuit sahélienne; le turquoise rappelle les grands cours d’eau et le safran, la lumière des villes. Les courbes topographiques relient le territoire à la donnée.",
    colors: ["#10233F", "#F5F8F2", "#007F78", "#E9A23B"],
    scores: "Indigo · sable clair · lagon · or solaire",
    contrast: "Texte sur fond sombre 14,68:1 · texte sur fond clair 13,49:1 · texte sur accent 4,88:1 · accent chaud 7,62:1",
    states: ["Hover #00645F", "Focus #E9A23B / #00645F", "Succès #146C43 / #DDF4E5", "Erreur #A52834 / #FCE8E6"],
  },
} as const;

type ThemeKey = keyof typeof themes;

export function ThemePreview() {
  const searchParams = useSearchParams();
  const requestedTheme = searchParams.get("theme");
  const theme: ThemeKey = requestedTheme === "A" || requestedTheme === "B" ? requestedTheme : "C";

  function selectTheme(next: ThemeKey) {
    const url = new URL(window.location.href);
    url.searchParams.set("theme", next);
    window.history.replaceState(null, "", url);
  }

  const selected = themes[theme];

  return (
    <main className="theme-preview" data-preview-theme={theme}>
      <div className="tp-topline">
        <a className="tp-wordmark" href="#top"><span>YM</span> / DESIGN SYSTEM</a>
        <span className="tp-status"><i /> PROPOSITION INTERACTIVE <b>01 — 03</b></span>
      </div>
      <section className="tp-hero" id="top">
        <div className="tp-hero-copy">
          <p className="tp-kicker"><span>PORTFOLIO 2026</span><span>THÈMES EN EXPLORATION</span></p>
          <h1>Une identité<br />qui <em>trace</em> sa voie.</h1>
          <p className="tp-lede">Trois directions visuelles pour raconter le code, la donnée et les territoires avec une présence singulière.</p>
          <div className="tp-hero-actions"><a className="tp-primary" href="#showcase">Explorer le thème <span>↘</span></a><a className="tp-text-link" href="#directions">Choisir une direction <span>↓</span></a></div>
        </div>
        <div className="tp-map" aria-hidden="true"><div className="tp-map-grid" /><svg viewBox="0 0 520 500" fill="none"><path d="M44 276C99 207 89 92 198 74c83-14 105 56 192 37 50-11 84-60 108-81M20 333c76-75 66-176 174-194 86-15 112 49 203 29 57-12 98-56 135-96M11 385c92-78 77-184 183-207 93-20 122 45 211 20 67-18 95-56 130-90M4 433c103-74 92-180 193-211 97-29 127 30 216 6 73-19 109-54 142-78M68 478c83-51 99-148 182-186 87-41 124-3 205-23 38-10 63-24 89-44"/><path d="M85 235c38-70 48-119 121-132 66-12 98 39 159 33 51-5 80-32 107-53M124 285c47-76 54-119 119-136 66-18 102 26 160 16 38-6 70-21 98-42M164 340c52-71 67-110 122-128 57-19 103 11 149-3 30-9 55-17 81-34"/><circle cx="335" cy="205" r="7"/><circle cx="335" cy="205" r="20"/><circle cx="335" cy="205" r="37"/></svg><span className="tp-map-label">6°08′ N<br />1°13′ E</span><span className="tp-map-caption">DATA, IN MOTION</span></div>
        <div className="tp-hero-foot"><span>YANNICK MADJIADOUM</span><span>DATA ENGINEERING · FRONTEND · GIS</span><span>LOMÉ, TOGO <b>✳</b></span></div>
      </section>

      <section className="tp-directions" id="directions">
        <div className="tp-section-head"><div><p className="tp-eyebrow">01 / DIRECTIONS VISUELLES</p><h2>Trois ambiances.<br /><span>Une même exigence.</span></h2></div><p>Sélectionne une piste pour parcourir son aperçu complet. Les couleurs, composants et animations se mettent à jour ensemble.</p></div>
        <div className="tp-theme-grid" role="group" aria-label="Choisir un thème">
          {(Object.keys(themes) as ThemeKey[]).map((key) => (
            <button aria-pressed={theme === key} className={`tp-theme-card${theme === key ? " is-selected" : ""}`} key={key} onClick={() => selectTheme(key)}>
              <span className={`tp-mini-art tp-mini-art--${key.toLowerCase()}`}><i /><i /><i /><b>{key}</b></span>
              <span className="tp-card-meta"><span><strong>{key} / {themes[key].name}</strong><small>{themes[key].descriptor}</small></span><span className="tp-select-mark">{theme === key ? "✓" : "↗"}</span></span>
              <span className="tp-swatches">{themes[key].colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="tp-showcase" id="showcase">
        <div className="tp-showcase-heading"><div><p className="tp-eyebrow">02 / APERÇU DU SYSTÈME</p><h2>{selected.name}<span className="tp-live-dot" /></h2></div><p>{selected.story}</p></div>
        <div className="tp-live-demo">
          <div className="tp-demo-nav"><a href="#top" className="tp-demo-brand"><b>YM</b> YANNICK MADJIADOUM</a><nav><a href="#showcase">Projets</a><a href="#showcase">Parcours</a><a href="#showcase">À propos</a></nav><button className="tp-demo-contact">Contact <span>↗</span></button></div>
          <div className="tp-demo-content">
            <div className="tp-demo-intro"><p className="tp-eyebrow"><i /> DATA ENGINEER & DÉVELOPPEUR</p><h3>Je transforme<br />la donnée en <em>impact.</em></h3><p>Des pipelines fiables, des interfaces utiles et des cartes qui racontent les territoires.</p><div className="tp-demo-links"><button className="tp-demo-cta">Voir mes projets <span>↗</span></button><a href="#directions">Télécharger mon CV ↓</a></div><div className="tp-demo-note">01 <span>DE L’IDÉE AU TERRAIN</span></div></div>
            <div className="tp-demo-visual"><div className="tp-orbit tp-orbit--one"/><div className="tp-orbit tp-orbit--two"/><div className="tp-visual-core"><span>DATA</span><b>↗</b></div><span className="tp-orbit-label tp-orbit-label--a">PIPELINES</span><span className="tp-orbit-label tp-orbit-label--b">TERRITOIRES</span><span className="tp-orbit-label tp-orbit-label--c">IMPACT</span><div className="tp-float-chip">◉ &nbsp; Data, en mouvement</div></div>
          </div>
          <div className="tp-demo-foot"><span>LOMÉ, TOGO</span><span>SCROLLER POUR EXPLORER <b>↓</b></span><span>DISPONIBLE POUR DE NOUVEAUX PROJETS <i /></span></div>
        </div>
        <div className="tp-components">
          <article className="tp-component tp-project"><div className="tp-component-label">PROJET À LA UNE <span>01 — 04</span></div><div className="tp-project-image"><div className="tp-chart"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div><b>AFRISHOP</b><small>COMMERCE · DATA</small></div><div className="tp-project-copy"><p>01 / DATA PLATFORM</p><h3>AfriShop</h3><p>Une plateforme pour mieux comprendre les usages du commerce local.</p><div className="tp-tags"><span>PYTHON</span><span>POSTGRESQL</span><span>POWER BI</span></div><a href="#showcase">Explorer le projet ↗</a></div></article>
          <article className="tp-component tp-ui-kit"><div className="tp-component-label">INTERACTIONS <span>02 — 04</span></div><h3>Un système<br />qui répond.</h3><p>États clairs. Contrastes maîtrisés. Micro-mouvements utiles.</p><div className="tp-button-row"><button className="tp-demo-cta">Action principale <span>↗</span></button><button className="tp-outline-btn">Secondaire</button></div><label className="tp-search-label">RECHERCHER UN PROJET<input placeholder="Ex. cartographie, data…" /><span>⌕</span></label><div className="tp-feedback"><span>● Projet chargé</span><span>! Vérifie ce champ</span></div></article>
          <article className="tp-component tp-timeline"><div className="tp-component-label">PARCOURS <span>03 — 04</span></div><h3>Tracer le chemin.</h3><div className="tp-timeline-line"><i/><i/><i/></div><div className="tp-timeline-items"><div><b>2026 — AUJOURD’HUI</b><strong>Data Engineering</strong><small>Force-N · UN-CHK</small></div><div><b>2024 — 2026</b><strong>Master Big Data</strong><small>Formation spécialisée</small></div><div><b>2021 — 2024</b><strong>Génie informatique</strong><small>Premiers systèmes</small></div></div></article>
          <article className="tp-component tp-chat"><div className="tp-component-label">ASSISTANT IA <span>04 — 04</span></div><div className="tp-chat-head"><span className="tp-chat-avatar">AI</span><span><b>Assistant Yannick</b><small><i/> En ligne</small></span><span className="tp-chat-menu">•••</span></div><div className="tp-chat-messages"><div className="tp-bubble tp-bubble--bot">Bonjour ! Que souhaites-tu savoir sur mes projets ?</div><div className="tp-bubble tp-bubble--user">Parle-moi de tes projets data.</div><div className="tp-bubble tp-bubble--bot">Je conçois des pipelines et des outils d’analyse adaptés aux réalités locales. <span>✓✓</span></div></div><div className="tp-chat-input">Poser une question…<b>↑</b></div></article>
          <article className="tp-component tp-certificate"><div className="tp-component-label">CERTIFICAT <span>05 — 07</span></div><div className="tp-cert-paper"><span className="tp-cert-seal">✳</span><small>PROGRAMME FORCE-N · UN-CHK</small><b>Certificat en<br />Data Engineering</b><i>Yannick Madjiadoum</i><span className="tp-cert-rule"/><small>RÉUSSITE · 2026</small><span className="tp-watermark">APERÇU</span></div><p>Visionneuse avec filigrane de protection et métadonnées lisibles.</p></article>
          <article className="tp-component tp-cv"><div className="tp-component-label">CV INTERACTIF <span>06 — 07</span></div><div className="tp-cv-tabs"><b>Français</b><span>English</span><a href="#showcase">PDF ↗</a></div><div className="tp-cv-paper"><small>YANNICK MADJIADOUM</small><b>Data Engineer<br />& développeur</b><i/><i/><i/><i/></div><p>Aperçu intégré, onglets bilingues et action PDF.</p></article>
          <article className="tp-component tp-contact"><div className="tp-component-label">CONTACT <span>07 — 07</span></div><h3>Parlons du<br />prochain projet.</h3><label>VOTRE NOM<input placeholder="Nom complet" /></label><label>VOTRE MESSAGE<textarea placeholder="Quelques mots sur votre idée…" /></label><button className="tp-demo-cta">Envoyer le message <span>↗</span></button></article>
        </div>
        <div className="tp-palette"><div><p className="tp-eyebrow">PALETTE SÉLECTIONNÉE</p><span>{selected.scores}</span></div>{selected.colors.map((color, index) => <div className="tp-color-chip" key={color}><i style={{ backgroundColor: color }} /><span>{["Fond profond", "Fond clair", "Accent principal", "Accent chaud"][index]}<b>{color}</b></span></div>)}<div className="tp-contrast"><b>CONTRASTES AA · TEXTE NORMAL</b><span>{selected.contrast}</span></div><div className="tp-state-list">{selected.states.map((state) => <span key={state}>{state}</span>)}</div></div>
      </section>
      <footer className="tp-footer"><span>PROPOSITION DE DIRECTION ARTISTIQUE · THEME-V3</span><a href="#top">RETOUR EN HAUT ↑</a></footer>
    </main>
  );
}
