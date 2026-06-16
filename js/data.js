/* ══ URLS AUDIO ══ */
const AU = {
  A1_1: "AUDIO_URL_A1_1",
  A2_1: "AUDIO_URL_A2_1",
  B1_1: "AUDIO_URL_B1_1",
  B2_1: "assets/audio/test-audio-B2_1.mp3",
  C1_1: "assets/audio/test-audio-C1_1.mp3",
  C2_1: "assets/audio/test-audio-C2_1.mp3",
};

/* ══ DESCRIPTIONS NIVEAUX ══ */
const DESC = {
  "Pre-A1": "Vous débutez en français. Continuez — chaque mot compte !",
  A1: "Vous comprenez et utilisez des expressions très familières du quotidien.",
  A2: "Vous communiquez sur des sujets simples de la vie courante.",
  B1: "Vous vous débrouillez dans la plupart des situations courantes.",
  B2: "Vous comprenez des sujets complexes et vous exprimez avec aisance.",
  C1: "Vous maîtrisez la langue avec flexibilité et précision."
};

/* ══ COMPÉTENCES ══ */
const COMP = [
  { key:"grammaire",   label:"Grammaire",   icon:"📐",
    ids:["Q01","Q02","Q04","Q06","Q07","Q08","Q10","Q15","Q16","Q18","Q21","Q27"] },
  { key:"conjugaison", label:"Conjugaison", icon:"🔄",
    ids:["Q03","Q05","Q12","Q14","Q19","Q20","Q28","Q29"] },
  { key:"oral",        label:"Oral",        icon:"🎧",
    ids:["Q22","Q26","Q30"] },
  { key:"ecrit",       label:"Écrit",       icon:"📖",
    ids:["Q13","Q17","Q25"] },
  { key:"vocabulaire", label:"Vocabulaire", icon:"📚",
    ids:["Q09","Q11","Q23","Q24"] }
];

const COMP_COLORS = {
  grammaire:  "#1D4ED8",
  conjugaison:"#7C3AED",
  oral:       "#0ea5e9",
  ecrit:      "#10b981",
  vocabulaire:"#f59e0b"
};

const PAR_NIVEAU = {
  "Pré-A1": ["Q01","Q02"],
  "A1":     ["Q03","Q04","Q05","Q06"],
  "A2":     ["Q07","Q08","Q09","Q10","Q11","Q12"],
  "B1":     ["Q13","Q14","Q15","Q16","Q17","Q18"],
  "B2":     ["Q19","Q20","Q21","Q22"],
  "C1":     ["Q23","Q24","Q25","Q26","Q27","Q28","Q29","Q30"]
};

const NIV_COLORS = {
  "Pré-A1": "#9090b0",
  "A1":     "#7C3AED",
  "A2":     "#0ea5e9",
  "B1":     "#f59e0b",
  "B2":     "#A855F7",
  "C1":     "#f43f5e"
};

/* ══ BANQUE DE 30 QUESTIONS ══ */
const QUESTIONS = [

  /* ───── Q1-6 : Pré-A1 / A1 ───── */
  {
    id:"Q01", niveau:"Pré-A1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Bonjour ! Vous ___ suisse ?",
    opts:["es","être","êtes","est","Je ne sais pas"],
    ok:"êtes"
  },
  {
    id:"Q02", niveau:"Pré-A1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"___ vous habitez ?",
    opts:["Qu'est-ce que","Où","Quel","Quoi","Je ne sais pas"],
    ok:"Où"
  },
  {
    id:"Q03", niveau:"A1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Le matin, je ___ à sept heures et demie.",
    opts:["me lève","me lever","se lève","me lèves","Je ne sais pas"],
    ok:"me lève"
  },
  {
    id:"Q04", niveau:"A1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"J'habite ___ Lausanne, ___ Suisse.",
    opts:["au, en","en, en","à, en","en, à","Je ne sais pas"],
    ok:"à, en"
  },
  {
    id:"Q05", niveau:"A1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Hier, Marie ___ en avance pour son premier jour de travail.",
    opts:["est arrivée","a arrivée","arrivait","arrive","Je ne sais pas"],
    ok:"est arrivée"
  },
  {
    id:"Q06", niveau:"A1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Au marché, j'achète ___ pain, ___ fromage et ___ eau minérale.",
    opts:["du, du, de l'","un, un, une","de, de, de","le, le, l'","Je ne sais pas"],
    ok:"du, du, de l'"
  },

  /* ───── Q7-12 : A1 / A2 ───── */
  {
    id:"Q07", niveau:"A2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"La boulangerie du centre-ville est ___ que celle de mon quartier.",
    opts:["meilleure","plus bonne","mieux","la mieux","Je ne sais pas"],
    ok:"meilleure"
  },
  {
    id:"Q08", niveau:"A2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Pour aller à la gare, vous tournez ___ après la pharmacie.",
    opts:["tout droit","à la droite","à droite","droit","Je ne sais pas"],
    ok:"à droite"
  },
  {
    id:"Q09", niveau:"A2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Votre chef vous annonce que vous devrez suivre une ___ obligatoire de deux jours pour apprendre à utiliser le nouveau logiciel.",
    opts:["formation","évaluation","présentation","réunion","Je ne sais pas"],
    ok:"formation"
  },
  {
    id:"Q10", niveau:"A2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Marc ne fait ___ de sport depuis son accident ; il reste à la maison.",
    opts:["jamais","toujours","souvent","parfois","Je ne sais pas"],
    ok:"jamais"
  },
  {
    id:"Q11", niveau:"A2", type:"qcm_u",
    instr:"Lisez le début du récit, puis complétez.",
    texte:"« D'abord, j'ai raté mon bus. ___, j'ai dû attendre vingt minutes sous la pluie. À la fin, je suis arrivé en retard à l'entretien. »",
    q:"Quel mot convient pour relier les deux événements ?",
    opts:["Ensuite","Pourtant","Surtout","Au contraire","Je ne sais pas"],
    ok:"Ensuite"
  },
  {
    id:"Q12", niveau:"A2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Pour proposer une sortie à un ami : « On ___ aller se balader au bord du lac, si tu veux ? »",
    opts:["pourrait","pouvait","peut","pouvons","Je ne sais pas"],
    ok:"pourrait"
  },

  /* ───── Q13-18 : A2 / B1 ───── */
  {
    id:"Q13", niveau:"B1", type:"qcm_u",
    instr:"Lisez le message, puis répondez.",
    texte:"Salut Marion,\n\nJ'espère que tu vas bien ! Pour ce soir, j'ai une idée : on pourrait faire une raclette à la maison. Est-ce que tu peux passer au Coop en rentrant du travail ? Il faudrait 400 g de fromage à raclette, des petites pommes de terre, un paquet de charcuterie et de la moutarde. N'oublie pas le vin blanc — c'est indispensable !\n\nJe m'occupe du dessert. À tout à l'heure !\nNathalie",
    q:"Quel est l'objectif principal de ce message ?",
    opts:["Demander de faire des courses pour le repas du soir.","Proposer d'aller au restaurant ensemble.","Expliquer comment préparer une raclette.","Annuler un dîner prévu.","Je ne sais pas"],
    ok:"Demander de faire des courses pour le repas du soir."
  },
  {
    id:"Q14", niveau:"B1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Quand j'habitais à Fribourg, je ___ le bus tous les matins.",
    opts:["ai pris","prenais","prendrais","avais pris","Je ne sais pas"],
    ok:"prenais"
  },
  {
    id:"Q15", niveau:"B1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Tu connais bien ce collègue ? Oui, je ___ connais depuis cinq ans.",
    opts:["lui","le","leur","la","Je ne sais pas"],
    ok:"le"
  },
  {
    id:"Q16", niveau:"B1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"As-tu téléphoné à Madame Perret ? Non, je ___ téléphonerai cet après-midi.",
    opts:["la","le","leur","lui","Je ne sais pas"],
    ok:"lui"
  },
  {
    id:"Q17", niveau:"B1", type:"qcm_u",
    instr:"Lisez l'annonce, puis répondez.",
    texte:"Appartement 3 pièces à louer, centre-ville, 2e étage sans ascenseur.\nCuisine équipée, balcon, cave et place de parc inclus.\nCHF 1 450.–/mois, charges comprises. Disponible dès le 1er mars.\nContact : 079 123 45 67 (appels uniquement, pas de SMS).",
    q:"Qu'est-ce qui est inclus dans le loyer ?",
    opts:["La cave et la place de parc.","Le mobilier et l'électricité.","L'internet et le téléphone.","Le service de ménage.","Je ne sais pas"],
    ok:"La cave et la place de parc."
  },
  {
    id:"Q18", niveau:"B1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Le téléphone de mon collègue est toujours chargé, ___ n'a plus de batterie.",
    opts:["le mien","le sien","le leur","le tien","Je ne sais pas"],
    ok:"le mien"
  },

  /* ───── Q19-22 : B1 / B2 ───── */
  {
    id:"Q19", niveau:"B2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"La direction exige que vous ___ votre rapport avant vendredi midi.",
    opts:["rendiez","rendez","rendrez","rendriez","Je ne sais pas"],
    ok:"rendiez"
  },
  {
    id:"Q20", niveau:"B2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Si je pouvais, je ___ une semaine de vacances la semaine prochaine.",
    opts:["prendrai","prendrais","prenais","vais prendre","Je ne sais pas"],
    ok:"prendrais"
  },
  {
    id:"Q21", niveau:"B2", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"C'est exactement le poste ___ je rêvais depuis des années.",
    opts:["que","qui","dont","où","Je ne sais pas"],
    ok:"dont"
  },
  {
    id:"Q22", niveau:"B2", audio:"B2_1", type:"qcm_u",
    instr:"Écoutez l'extrait, puis répondez. Vous pouvez écouter plusieurs fois.",
    q:"Que souhaite faire la personne qui téléphone ?",
    opts:["Faire un échange.","Garder son article.","Se faire rembourser.","Annuler sa commande.","Je ne sais pas"],
    ok:"Se faire rembourser."
  },

  /* ───── Q23-27 : B2 / C1 ───── */
  {
    id:"Q23", niveau:"C1", type:"qcm_u",
    instr:"Lisez la phrase, puis répondez.",
    texte:"« Il serait souhaitable que les participants transmettent leurs contributions avant la réunion. »",
    q:"Cette phrase appartient à un registre :",
    opts:["soutenu.","familier.","standard.","argotique.","Je ne sais pas"],
    ok:"soutenu."
  },
  {
    id:"Q24", niveau:"C1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"En analysant un article, le professeur explique que le ___ choisi par le journaliste oriente l'interprétation du lecteur : certains aspects sont mis en avant, d'autres sont ignorés.",
    opts:["cadrage","bilan","sondage","résumé","Je ne sais pas"],
    ok:"cadrage"
  },
  {
    id:"Q25", niveau:"C1", type:"qcm_u",
    instr:"Lisez le texte, puis répondez.",
    texte:"« Le télétravail a considérablement transformé la relation entre les employés et leur entreprise. Si certains salariés se déclarent plus productifs depuis qu'ils travaillent depuis chez eux, d'autres se plaignent d'un isolement croissant et d'une difficulté à séparer vie professionnelle et vie privée. Les managers, quant à eux, doivent repenser leurs méthodes d'encadrement pour maintenir la cohésion des équipes à distance. »",
    q:"D'après ce texte, quel est l'un des défis du télétravail pour les managers ?",
    opts:[
      "Maintenir la cohésion des équipes à distance.",
      "Améliorer la productivité individuelle des employés.",
      "Réduire les coûts liés aux locaux de l'entreprise.",
      "Encourager les employés à travailler davantage.",
      "Je ne sais pas"
    ],
    ok:"Maintenir la cohésion des équipes à distance."
  },
  {
    id:"Q26", niveau:"C1", audio:"C1_1", type:"qcm_u",
    instr:"Écoutez l'extrait, puis répondez. Vous pouvez écouter plusieurs fois.",
    q:"Quelle est l'attitude de la personne qui prend la parole ?",
    opts:["Elle s'énerve violemment.","Elle se félicite d'un résultat.","Elle s'impatiente face aux retards.","Elle accepte la situation avec résignation.","Je ne sais pas"],
    ok:"Elle s'impatiente face aux retards."
  },
  {
    id:"Q27", niveau:"C1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Elle a décidé de postuler pour ce poste, ___ elle ne remplisse pas tous les critères requis.",
    opts:["quoiqu'","pourvu qu'","pour peu qu'","à condition qu'","Je ne sais pas"],
    ok:"quoiqu'"
  },

  /* ───── Q28-30 : C1 ───── */
  {
    id:"Q28", niveau:"C1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"La directrice aurait préféré que l'équipe ___ une autre solution à ce problème.",
    opts:["ait proposé","avait proposé","aurait proposé","proposait","Je ne sais pas"],
    ok:"ait proposé"
  },
  {
    id:"Q29", niveau:"C1", type:"qcm_u",
    instr:"Sélectionnez le mot adéquat pour compléter la phrase.",
    q:"Si nous avions lu les instructions attentivement, nous ___ cette erreur coûteuse.",
    opts:["aurions évité","avions évité","aurions éviter","éviterions","Je ne sais pas"],
    ok:"aurions évité"
  },
  {
    id:"Q30", niveau:"C1", audio:"C2_1", type:"qcm_u",
    instr:"Écoutez l'extrait, puis répondez. Vous pouvez écouter plusieurs fois.",
    q:"Selon l'intervenante, quel est le principal avantage des nouveaux outils numériques par rapport aux méthodes traditionnelles ?",
    opts:[
      "La personnalisation selon le profil de chaque utilisateur.",
      "La diversité des domaines couverts par ces plateformes.",
      "Le faible coût d'accès pour les apprenants.",
      "La rapidité de mise en œuvre pour les formateurs.",
      "Je ne sais pas"
    ],
    ok:"La personnalisation selon le profil de chaque utilisateur."
  }

]; // fin QUESTIONS
