# Portfolio de Yannick Madjiadoum

Portfolio développé avec Next.js App Router, TypeScript et Tailwind CSS.
Les routes `/fr` et `/en` sont gérées par next-intl ; la racine redirige vers
`/fr` par défaut.

## Développement local

```bash
npm install
npm run dev
```

Vérifications disponibles avant publication :

```bash
npm run lint
npm run typecheck
npm run build
```

## Système visuel

Les couleurs de marque sont définies comme variables CSS sémantiques dans
`src/app/globals.css` : bleu profond pour la structure, safran comme accent
principal, rouge pour les repères ponctuels, et encre/blanc froid pour les
surfaces. Le thème suit la préférence système et accepte une surcharge avec
`data-theme="light"` ou `data-theme="dark"` sur l’élément racine.

Les titres utilisent Bricolage Grotesque et le texte Public Sans, chargées et
optimisées avec `next/font`. Les composants communs (boutons, conteneur,
étiquettes et titres de section) se trouvent dans `src/components/ui`.

## Éléments à compléter

- Ajouter `public/images/profile.jpg` (1200 × 1500) et
  `public/images/og.jpg` (1200 × 630).
- Ajouter une image `public/images/projects/<slug>.jpg` (1600 × 900) par
  projet.
- Ajouter `public/cv/CV_Yannick_FR.pdf` et `public/cv/CV_Yannick_EN.pdf`.
- Confirmer la disponibilité, le poste recherché et les préférences de mobilité.
- Renseigner les liens de démonstration, de code et les captures des projets
  lorsqu’ils seront disponibles.

L’archive `Dossier Yannick_Madjiadoum PRO.zip` reste locale et n’est pas suivie
par Git.
