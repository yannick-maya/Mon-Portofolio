import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

const messages = {
  fr: {
    languageSwitcher: {
      label: "Changer de langue",
      french: "Français",
      english: "Anglais",
    },
    navigation: {
      mainLabel: "Navigation principale",
      home: "Accueil",
      profile: "Profil",
      timeline: "Parcours",
      projects: "Projets",
      contact: "Contact",
      cv: "CV",
      openMenu: "Ouvrir le menu",
    },
    common: {
      viewProject: "Voir le projet",
      allProjects: "Tous les projets",
      backToProjects: "Retour aux projets",
      notSpecified: "Information à préciser.",
      placeholderImage: "Visuel à ajouter",
      technologies: "Technologies",
    },
    home: {
      status: "Portfolio en construction",
      projectsEyebrow: "Sélection",
      projectsTitle: "Des données au terrain",
      projectsDescription:
        "Quelques projets autour des pipelines, de l'analyse et de la cartographie.",
      viewProjects: "Voir mes projets",
      viewCv: "Voir mon CV",
      contact: "Me contacter",
      github: "Voir GitHub",
    },
    cvPage: {
      eyebrow: "CV",
      title: "Parcours et compétences",
      intro:
        "Consultez le CV de Yannick en français ou en anglais. Les versions PDF seront ajoutées après vérification des informations personnelles.",
      frenchTab: "Français",
      englishTab: "Anglais",
      previewLabel: "Aperçu du CV en {language}",
      previewFallback: "L’aperçu PDF n’est pas disponible dans ce navigateur.",
      download: "Télécharger le CV",
      open: "Ouvrir dans un nouvel onglet",
      unavailable:
        "La version PDF expurgée n’est pas encore disponible. En attendant, vous pouvez demander une copie à Yannick.",
      requestCopy: "Demander une copie par email",
    },
    profilePage: {
      eyebrow: "Profil",
      title: "Ingénierie, données et territoires",
      intro:
        "Un parcours entre développement, bases de données et analyse de données géographiques.",
      portraitLabel: "Portrait de Yannick",
      summary: "À propos",
      quickFacts: "En bref",
      location: "Lieu",
      languages: "Langues",
      availability: "Disponibilité",
      desiredPosition: "Poste recherché",
      mobility: "Mobilité",
      toConfirm: "À confirmer",
      expertise: "Expertises",
      skills: "Compétences",
      skillsNote:
        "Les niveaux de maîtrise restent à confirmer. Les compétences sont listées sans évaluation individuelle.",
      skillLevels: "Repères de niveau à renseigner",
      mastery: "Maîtrise",
      comfortable: "À l'aise",
      learning: "En apprentissage",
      experience: "Expérience",
      interests: "Centres d'intérêt",
    },
    timelinePage: {
      eyebrow: "Parcours",
      title: "Apprendre, construire, transmettre",
      intro:
        "Études, expériences et projets, du plus récent au plus ancien.",
      expand: "Afficher les détails",
      collapse: "Masquer les détails",
    },
    projectsPage: {
      eyebrow: "Projets",
      title: "Explorer les réalisations",
      intro:
        "Des projets de data engineering, de science des données, de dataviz, de développement et de SIG.",
      filterLabel: "Filtrer les projets",
      all: "Tous",
      dataEngineering: "Data engineering",
      dataScience: "Data science",
      dataviz: "Dataviz",
      development: "Développement",
      gis: "SIG",
      featured: "Projets phares",
      empty: "Aucun projet dans cette catégorie.",
      details: "Détails du projet",
      context: "Contexte",
      problem: "Problème",
      solution: "Solution",
      technicalChoices: "Choix techniques",
      challenges: "Difficultés",
      results: "Résultats",
      learnings: "Apprentissages",
      demo: "Voir la démo",
      code: "Voir le code",
      captures: "Captures",
    },
    projectDetail: {
      role: "Contribution",
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Parlons de votre projet",
      intro:
        "Pour une collaboration, une opportunité ou une question, vous pouvez écrire à Yannick.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      formTitle: "Envoyer un message",
      name: "Nom",
      emailLabel: "Adresse email",
      message: "Message",
      send: "Envoyer le message",
      sending: "Envoi en cours…",
      success: "Votre message a été envoyé. Merci.",
      fallback:
        "L'envoi direct n'est pas configuré. Vous pouvez ouvrir votre application email avec le message préparé.",
      fallbackLink: "Continuer par email",
      error:
        "Le message n'a pas pu être envoyé. Réessayez ou contactez Yannick par email.",
      validationError: "Vérifiez les champs et réessayez.",
    },
  },
  en: {
    languageSwitcher: {
      label: "Change language",
      french: "French",
      english: "English",
    },
    navigation: {
      mainLabel: "Main navigation",
      home: "Home",
      profile: "Profile",
      timeline: "Journey",
      projects: "Projects",
      contact: "Contact",
      cv: "CV",
      openMenu: "Open menu",
    },
    common: {
      viewProject: "View project",
      allProjects: "All projects",
      backToProjects: "Back to projects",
      notSpecified: "Information to be confirmed.",
      placeholderImage: "Visual to be added",
      technologies: "Technologies",
    },
    home: {
      status: "Portfolio in progress",
      projectsEyebrow: "Selected work",
      projectsTitle: "From data to the field",
      projectsDescription:
        "A selection of projects spanning pipelines, analysis, and mapping.",
      viewProjects: "View my projects",
      viewCv: "View my résumé",
      contact: "Contact me",
      github: "View GitHub",
    },
    cvPage: {
      eyebrow: "Résumé",
      title: "Experience and skills",
      intro:
        "View Yannick’s résumé in French or English. PDF versions will be added after personal information has been reviewed.",
      frenchTab: "French",
      englishTab: "English",
      previewLabel: "Résumé preview in {language}",
      previewFallback: "PDF preview is not available in this browser.",
      download: "Download résumé",
      open: "Open in a new tab",
      unavailable:
        "The redacted PDF version is not available yet. You can request a copy from Yannick in the meantime.",
      requestCopy: "Request a copy by email",
    },
    profilePage: {
      eyebrow: "Profile",
      title: "Engineering, data, and places",
      intro:
        "A path across software development, databases, and geographic data analysis.",
      portraitLabel: "Portrait of Yannick",
      summary: "About",
      quickFacts: "At a glance",
      location: "Location",
      languages: "Languages",
      availability: "Availability",
      desiredPosition: "Desired role",
      mobility: "Mobility",
      toConfirm: "To be confirmed",
      expertise: "Areas of expertise",
      skills: "Skills",
      skillsNote:
        "Skill levels still need confirmation. Skills are listed without individual ratings.",
      skillLevels: "Proficiency levels to confirm",
      mastery: "Proficient",
      comfortable: "Comfortable",
      learning: "Learning",
      experience: "Experience",
      interests: "Interests",
    },
    timelinePage: {
      eyebrow: "Journey",
      title: "Learning, building, sharing",
      intro: "Studies, experience, and projects, from newest to oldest.",
      expand: "Show details",
      collapse: "Hide details",
    },
    projectsPage: {
      eyebrow: "Projects",
      title: "Explore selected work",
      intro:
        "Projects in data engineering, data science, visualization, software development, and GIS.",
      filterLabel: "Filter projects",
      all: "All",
      dataEngineering: "Data engineering",
      dataScience: "Data science",
      dataviz: "Data visualization",
      development: "Development",
      gis: "GIS",
      featured: "Featured projects",
      empty: "There are no projects in this category.",
      details: "Project details",
      context: "Context",
      problem: "Problem",
      solution: "Solution",
      technicalChoices: "Technical choices",
      challenges: "Challenges",
      results: "Results",
      learnings: "Learnings",
      demo: "View demo",
      code: "View code",
      captures: "Screenshots",
    },
    projectDetail: {
      role: "Contribution",
    },
    contactPage: {
      eyebrow: "Contact",
      title: "Let's talk about your project",
      intro:
        "For collaboration, an opportunity, or a question, you can write to Yannick.",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      formTitle: "Send a message",
      name: "Name",
      emailLabel: "Email address",
      message: "Message",
      send: "Send message",
      sending: "Sending…",
      success: "Your message has been sent. Thank you.",
      fallback:
        "Direct sending is not configured. You can open your email application with the message prepared.",
      fallbackLink: "Continue by email",
      error:
        "The message could not be sent. Try again or contact Yannick by email.",
      validationError: "Check the fields and try again.",
    },
  },
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: messages[locale],
  };
});
