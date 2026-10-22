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

## Contenus bilingues

Les données FR/EN sont regroupées dans `src/data` : profil, parcours, projets,
diplômes et certificats, FAQ, glossaire et explications. Les champs de texte
utilisent les clés `fr` et `en`. Les niveaux de compétences et les informations
indiquées par `[À COMPLÉTER PAR YANNICK]` restent à confirmer ; les entrées du
glossaire portent `relu: false` jusqu'à leur relecture.

La base de connaissances compte 47 FAQ, 139 termes et 15 explications.
`npm run build:knowledge` vérifie les références croisées et génère
`src/data/knowledge.md` sans inclure les noms ou chemins des documents privés.
La route du chatbot injecte les mêmes données sources bilingues directement,
sans lecture de fichier au runtime.

Les fichiers des diplômes ne sont pas publiés sans copie masquée approuvée :
les champs `fichier` et `vignette` sont donc `null`, et `allowDownload` est
`false` par défaut. Conservez les originaux dans `private/`, ignoré par Git ;
seules les copies expurgées et approuvées doivent être placées dans `public/`.

## Pages du portfolio

- `/fr/profil` et `/en/profil` : résumé, expertises, compétences, expérience et intérêts.
- `/fr/parcours` et `/en/parcours` : frise chronologique dépliable.
- `/fr/projets` et `/en/projets` : projets filtrables, avec une page de détail par slug.
- `/fr/diplomes` et `/en/diplomes` : documents filtrables et visionneuse pour les copies expurgées approuvées.
- `/fr/cv` et `/en/cv` : CV bilingue avec onglets, aperçu et actions PDF lorsqu'une copie expurgée est disponible.
- `/fr/contact` et `/en/contact` : coordonnées publiques et formulaire.

Le formulaire envoie les messages avec Resend lorsque `RESEND_API_KEY` et
`CONTACT_FROM_EMAIL` sont configurées côté serveur. Sans service configuré ou
en cas d'échec d'envoi, il propose un lien `mailto` prérempli.

## Assistant du portfolio

Le widget appelle `/api/chat`, qui transmet les messages à Anthropic côté
serveur et injecte les données du portfolio avec prompt caching. Claude Haiku
5.5 (`claude-haiku-5-5`, [identifiant officiel](https://platform.claude.com/docs/en/models/haiku-5-5/overview))
est le modèle par défaut ; `CHAT_MODEL` peut le remplacer. Sans clé Anthropic
ou si le service est indisponible, une réponse FAQ locale est utilisée.

Copiez `.env.example` en `.env.local` et configurez les secrets côté serveur.
Le rate-limit autorise 15 messages par fenêtre de 10 minutes : Upstash Redis
est utilisé si ses deux variables sont configurées ; sinon, le serveur utilise
un repli mémoire local. Le repli mémoire n'est pas partagé entre plusieurs
instances. Les requêtes cross-origin sont refusées.

## Éléments à compléter

- Ajouter `public/images/profile.jpg` (1200 × 1500) et
  `public/images/og.jpg` (1200 × 630).
- Ajouter une image `public/images/projects/<slug>.jpg` (1600 × 900) par
  projet.
- Ajouter des copies publiques expurgées dans `public/cv/CV_Yannick_FR.pdf` et
  `public/cv/CV_Yannick_EN.pdf`. Les originaux de l'archive ne sont pas publiés.
- Confirmer la disponibilité, le poste recherché et les préférences de mobilité.
- Confirmer les niveaux de maîtrise des compétences avant de les afficher.
- Renseigner les liens de démonstration, de code et les captures des projets
  lorsqu’ils seront disponibles.

L’archive `Dossier Yannick_Madjiadoum PRO.zip` reste locale et n’est pas suivie
par Git.
