# Portfolio de Yannick Madjiadoum

Portfolio développé avec Next.js App Router, TypeScript et Tailwind CSS.
Les routes `/fr` et `/en` sont gérées par next-intl ; la racine redirige vers
`/fr` par défaut.

## Technologies

- Next.js 16 App Router, React 19 et TypeScript
- Tailwind CSS et variables de thème adaptées aux préférences système
- next-intl pour les routes `/fr` et `/en`
- Framer Motion avec prise en charge de `prefers-reduced-motion`
- Anthropic SDK pour l’assistant IA et repli FAQ sans clé
- Resend pour l’envoi du formulaire de contact
- Upstash Redis pour le rate-limit distribué, avec repli mémoire local

## Développement local

Prérequis : Node.js 20 ou une version compatible avec Next.js 16.

```bash
npm install
npm run dev
```

L’application locale est disponible sur `http://localhost:3000`.
La page française est accessible sur `/fr` et la page anglaise sur `/en`.

Vérifications disponibles avant publication :

```bash
npm run lint
npm run typecheck
npm run build:knowledge
npm run eval:chat
npm run build
```

`npm run build` génère d’abord `src/data/knowledge.md`, puis construit
l’application. Pour lancer l’évaluation du chatbot, démarrer l’application
dans un autre terminal, puis exécuter `npm run eval:chat`.

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

Structure principale :

- `profile.json` : identité, présentation, langues, expertises et compétences
- `timeline.json` : formation et expériences, du plus récent au plus ancien
- `projects.json` : grille, fiche détaillée, liens et catégories des projets
- `credentials.json` : diplômes, certificats, attestations et compétitions
- `faq.json` : réponses courtes utilisées par l’interface et le repli FAQ
- `explainers.json` : explications vulgarisées de 15 concepts data
- `glossary.json` : dictionnaire interne d’environ 120 termes bilingues
- `knowledge.md` : fichier Markdown généré, utilisé comme artefact de base

Modifier les fichiers JSON puis relancer `npm run build:knowledge`. Chaque
entrée du glossaire conserve son champ `relu: false` jusqu’à une relecture
humaine. Ne jamais convertir un placeholder en information certaine.

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

Le fichier `public/robots.txt` autorise l’indexation des pages publiques et
désactive l’indexation des routes `/api/` et `/private/`.

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

Pour évaluer le chatbot, démarrez le serveur dans un terminal (`npm run dev`
ou `npm run build && npm run start`), puis lancez `npm run eval:chat` dans un
autre. Le jeu couvre les questions FR/EN, les explications, les suivis, les
refus de confidentialité et les garde-fous HTTP. `CHAT_EVAL_BASE_URL` permet
de viser un autre serveur de test ; par défaut, l'évaluation utilise
`http://localhost:3000`.

## Configuration des variables d’environnement

Copiez le modèle :

```bash
cp .env.example .env.local
```

- `ANTHROPIC_API_KEY` : clé serveur Anthropic ; sans elle, le repli FAQ reste actif
- `CHAT_MODEL` : identifiant du modèle, par défaut `claude-haiku-5-5`
- `RESEND_API_KEY` : clé du service Resend pour le formulaire de contact
- `CONTACT_FROM_EMAIL` : adresse expéditrice autorisée par Resend
- `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` : rate-limit distribué

Ne placez aucune clé dans le code, dans `NEXT_PUBLIC_*` ou dans un fichier suivi
par Git. `.env.local` est ignoré. Seul `.env.example` doit être commité.

## Déploiement Netlify

Le projet utilise l’adaptateur Next.js géré automatiquement par Netlify, sans
plugin épinglé dans les dépendances. La configuration versionnée dans
`netlify.toml` lance `npm run build`, publie `.next` et utilise Node.js 22.

1. Dans Netlify, créez un site depuis le dépôt GitHub `yannick-maya/Mon-Portofolio`.
2. Gardez le répertoire de base à la racine du dépôt ; les réglages de build
   sont définis dans `netlify.toml`.
3. Dans les variables d’environnement du site, ajoutez les valeurs de
   `.env.example` nécessaires, avec les scopes **Builds** et **Functions**.
   Ne commitez jamais leurs valeurs ni un fichier `.env`.
4. Configurez `ANTHROPIC_API_KEY` et, si nécessaire, `CHAT_MODEL` pour activer
   Claude. Sans clé Anthropic, le repli FAQ reste actif.
5. Configurez `RESEND_API_KEY` et `CONTACT_FROM_EMAIL` pour l’envoi du
   formulaire ; `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN` sont
   facultatives et activent le rate-limit distribué.
6. Définissez `main` comme branche de production, puis lancez le déploiement.

Netlify prend en charge les routes App Router et Route Handlers ainsi que le
streaming utilisés par le chatbot. Après le déploiement, vérifiez les pages
`/fr` et `/en`, le formulaire de contact et `/api/chat`. Le fichier
`.env.example` décrit les noms des variables attendues.

## Éléments à compléter

- Compléter `availability`, `desiredPosition` et `mobility` dans
  `src/data/profile.json`.
- Compléter les champs `[À COMPLÉTER PAR YANNICK]` dans les fiches détaillées
  des projets.
- Relire les 139 entrées du glossaire et ne passer `relu` à `true` qu’après
  validation humaine.
- La photo de profil fournie est publiée dans `public/images/profile.jpg` ;
  une image `public/images/og.jpg` (1200 × 630) reste à ajouter.
- Ajouter une image `public/images/projects/<slug>.jpg` (1600 × 900) par
  projet.
- Les copies publiques expurgées sont dans `public/cv/CV_Yannick_FR.pdf` et
  `public/cv/CV_Yannick_EN.pdf`. Les originaux de l'archive restent privés.
- Confirmer les niveaux de maîtrise des compétences avant de les afficher.
- Renseigner les liens de démonstration, de code et les captures des projets
  lorsqu’ils seront disponibles.
- Renseigner les vignettes et fichiers expurgés dans `src/data/credentials.json`
  uniquement après approbation des documents.

## Confidentialité et vérifications documentaires

- Ne publiez jamais de date de naissance, matricule, QR code, code-barres,
  carte d’identité, passeport ou numéro de téléphone.
- Conservez les originaux dans `private/`, ignoré par Git.
- Placez uniquement des copies expurgées dans `public/cv/` ou
  `public/credentials/`.
- Vérifiez les fichiers PDF avec une extraction de texte avant publication.
- Gardez `allowDownload: false` tant qu’un téléchargement n’a pas été approuvé.
- N’ajoutez pas les fichiers de l’archive locale à Git sans sélection et revue.

## Liste de vérification finale

- [ ] Navigation mobile vérifiée sur les routes FR/EN
- [ ] Focus clavier, contraste AA, libellés et alternatives accessibles vérifiés
- [ ] Métadonnées, Open Graph et sitemap vérifiés
- [x] CV publics expurgés avant publication
- [ ] Diplômes affichés uniquement avec des copies masquées approuvées
- [ ] Variables secrètes présentes uniquement sur Netlify et en local
- [ ] Repli FAQ testé sans `ANTHROPIC_API_KEY`
- [ ] Rate-limit testé avec mémoire puis Upstash
- [ ] Évaluation du chatbot passée avec `npm run eval:chat`
- [ ] Build de production passé avec `npm run build`

L’archive `Dossier Yannick_Madjiadoum PRO.zip` reste locale et n’est pas suivie
par Git.