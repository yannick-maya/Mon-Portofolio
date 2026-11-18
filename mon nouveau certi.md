Ajoute à mon portfolio mon nouveau certificat en Data Engineering du programme Force-N. Travaille en une seule étape et publie-la sur GitHub (lint, typecheck et build d'abord ; si tout passe : git add, commit, git push origin main ; aucun force push). Message de commit : feat(credentials): ajoute le certificat Force-N Data Engineering

DONNÉES
- Intitulé FR : Certificat en Data Engineering (attestation de réussite)
- Intitulé EN : Data Engineering Certificate (certificate of achievement)
- Organisme : Programme Force-N, en partenariat avec l'Université Numérique Cheikh Hamidou Kane (UN-CHK) et la Mastercard Foundation
- Formation : de mai à septembre 2026. Attestation délivrée en novembre 2026.
- Catégorie : Certificat
- Description FR : Formation sur toute la chaîne de la donnée : conception de pipelines, orchestration, architecture lakehouse, qualité et gouvernance des données. Elle inclut aussi la construction d'un projet de carrière structuré autour du métier d'Ingénieur Big Data.
- Description EN : Training covering the whole data chain: pipeline design, orchestration, lakehouse architecture, data quality and governance. It also includes building a structured career plan around the Big Data Engineer profession.
- Fichier : public/credentials/force-n-data-engineering.jpg (copie masquée que je fournis ; vignette générée ou espace réservé tant que le fichier est absent)
- lienVerification : null pour l'instant (je le renseignerai ; le badge "Vérifié" ne s'affiche que s'il existe)
- allowDownload : false

À FAIRE
1. credentials.json : ajoute l'entrée (id force-n-data-engineering, textes FR et EN). Sur la page Diplômes, elle apparaît en premier dans la catégorie Certificats (tri par date décroissante).
2. timeline.json : ajoute deux repères, "Mai à sept. 2026 : formation Data Engineering, programme Force-N" et "Nov. 2026 : certificat Force-N obtenu", dans le Parcours, au-dessus du Master 1.
3. Profil : ajoute ce certificat à la liste des certifications mises en avant.
4. Chatbot : ajoute dans faq.json au moins 4 questions-réponses sur ce certificat (qu'est-ce que Force-N, quand, quelles compétences, partenaires), en FR et EN. Régénère knowledge.md avec `npm run build:knowledge`. Ajoute 3 questions à /tests/chatbot.eval.json (par exemple "Quelles formations en data engineering a-t-il suivies ?") et lance `npm run eval:chat`.
5. Lien avec le projet AfriShop : [À CONFIRMER PAR YANNICK : AfriShop est-il le projet de cette formation ?]. N'affirme ce lien nulle part (site, FAQ, chatbot) tant que je ne l'ai pas confirmé.
6. N'invente aucune information (note, mention, durée en heures, nom d'un formateur).
7. Ne commite aucun document non masqué. Donne-moi un récapitulatif de 3 lignes à la fin.