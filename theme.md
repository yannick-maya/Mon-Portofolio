Je veux changer le thème de mon portfolio. Ne modifie pas la version actuelle tant que je n'ai pas validé. Travaille sur une nouvelle branche theme-v2 (git checkout -b theme-v2) et pousse-la sur GitHub à chaque étape (lint, typecheck et build d'abord ; commits Conventional Commits ; aucun force push). Ne fusionne rien dans main avant mon accord.

OBJECTIF
- La page d'accueil reste sombre (noir ou bleu nuit profond), avec ses courbes de niveau animées et le nom en très grand.
- Toutes les autres pages (Profil, Parcours, Projets, Diplômes et certificats, CV, Contact) passent en thème clair : blanc, blanc cassé, ou une teinte claire vive proposée par toi.
- Le passage de l'accueil sombre aux pages claires doit être fluide : transition de la barre de navigation, du logo et des boutons, sans flash ni saut de couleur.

ÉTAPE 1 : PROPOSE 3 THÈMES
Crée trois thèmes complets, chacun défini par des variables CSS (design tokens) dans un fichier dédié, avec :
- Thème A, sobre : accueil bleu nuit, pages blanc cassé froid, accent safran.
- Thème B, vif : accueil noir, pages blanches, accent bleu électrique plus une couleur chaude (corail ou jaune).
- Thème C, de ton choix : une idée originale, cohérente avec la cartographie, les données et l'Afrique de l'Ouest et centrale, que tu justifies en deux phrases.
Pour chaque thème : couleurs de fond, de texte, de surface, de bordure, d'accent, d'état (survol, focus, succès, erreur), avec leurs codes hexadécimaux. Tous les contrastes texte/fond doivent respecter l'accessibilité AA ; vérifie-le et indique les rapports obtenus. Garde Bricolage Grotesque et Public Sans, sauf si tu justifies un changement. Pas de dégradés décoratifs.

ÉTAPE 2 : ROUTE D'APERÇU
Crée une route /theme-preview (visible seulement en développement et sur la branche theme-v2) qui permet de basculer entre A, B et C (?theme=A|B|C) et d'afficher : l'accueil, la page Projets, la page Diplômes et certificats (avec la visionneuse), la page CV, le chatbot ouvert, le formulaire de contact. Chaque composant doit s'adapter : cartes, filtres, frise, boutons, champs de formulaire, iframe de dashboard, filigrane de la visionneuse, bulles du chatbot, états de focus.

ÉTAPE 3 : RECOMMANDATION
Donne-moi un tableau comparatif des trois thèmes (lisibilité, impact visuel, professionnalisme, cohérence avec une page d'accueil sombre) et dis lequel tu recommandes, avec la raison. Arrête-toi là et attends mon choix.

ÉTAPE 4 : APPLICATION (seulement après mon choix)
- Applique le thème choisi : accueil sombre, autres pages claires, via des groupes de routes ou un attribut data-theme défini par page.
- Garde un bouton de bascule de thème uniquement pour les pages intérieures (clair par défaut). Respecte prefers-color-scheme sans casser l'accueil sombre.
- Supprime les thèmes non retenus et la route /theme-preview.
- Vérifie : contrastes AA, chatbot, visionneuse de diplômes, aperçu du CV, formulaire, images d'espace réservé, Lighthouse > 90, rendu mobile.
- Commits : feat(theme): ajoute les tokens et la route d'aperçu, puis feat(theme): applique le thème <nom>.
- Donne-moi l'adresse de l'aperçu de la branche pour que je la teste, puis attends mon accord avant de fusionner dans main.

À chaque étape, termine par un récapitulatif de 3 lignes (fait, à vérifier, suite).