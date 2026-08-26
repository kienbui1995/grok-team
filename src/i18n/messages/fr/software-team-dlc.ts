/** fr messages — domain: Software Works / SDLC Studio */
export const frSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Activer Software Works",
  "softwareTeamDlc.enableDesc":
    "Une fois activé, le volet Agents devient un studio SDLC : effectif, tableau de pipeline et passation de rôle sur Grok Build. Désactivé par défaut. Ne rebrande pas l’app à l’arrêt et ne lance pas d’agents CLI supplémentaires.",
  "softwareTeamDlc.optInNote":
    "Software Works est l’édition de livraison logicielle pour Grok Build — pas un second runtime d’agents.",
  "softwareTeamDlc.noSkinAutoApply":
    "Les skins d’apparence ne s’appliquent jamais tout seuls. Choisissez un .grokskin dans Réglages → Apparence si vous en voulez un.",
  "softwareTeamDlc.sharedHomeNote":
    "Les données de session partagées (GROK_HOME=~/.grok) ne sont jamais réécrites. Les préréglages restent dans l’app tant que vous ne les installez pas dans un projet ou l’agent-home Indépendant.",
  "softwareTeamDlc.rosterTitle": "Effectif de l’équipe",
  "softwareTeamDlc.rosterHint":
    "Une session Grok Build par rôle. Ouvrez une carte pour placer le starter dans le compositeur. La passation avance le rôle suivant et y charge son starter.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Périmètre, recette et backlog. Passe une seule tranche livrable.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Conception adaptée à ce dépôt : modules, risques et plan Build concret.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "Implémentez la tranche convenue. Respectez le style existant. Résumez comment vérifier.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "Relisez le diff. Bloquants vs nits. Ne réécrivez pas sauf demande.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Cas de test, commandes, et succès/échec honnête. Pas de passages navigateur inventés.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Wiki et i18n seulement si le changement l’exige. Gardez les identifiants exacts.",
  "softwareTeamDlc.slashHint": "Raccourci slash : {slash}",
  "softwareTeamDlc.copyStarter": "Copier le starter",
  "softwareTeamDlc.copied": "Copié",
  "softwareTeamDlc.copyFailed": "Impossible de copier — sélectionnez le starter et copiez-le à la main.",
  "softwareTeamDlc.sdlcTitle": "Étapes SDLC",
  "softwareTeamDlc.sdlcHint":
    "Le tableau du studio (Backlog → Design → Build → Review → Ship) est la source de vérité. Les colonnes d’agents live restent informatives.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (inactif)",
  "softwareTeamDlc.assignRole": "Assigner un rôle",
  "softwareTeamDlc.assignStage": "Assigner une étape SDLC",
  "softwareTeamDlc.clearTag": "Délier la session",
  "softwareTeamDlc.packTitle": "Modèles de rôle",
  "softwareTeamDlc.packHint":
    "Les préréglages sont dans l’app. Installer écrit 6 agents, 6 skills et team-handoff.rhai dans le .grok du projet ou l’agent-home Indépendant — jamais le ~/.grok partagé.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Ne démarre pas d’agents CLI en parallèle. Équipe = sessions liées + attach-chat + starters de passation.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Le workbench et Remote IM contrôlent toujours uniquement Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio est le pipeline. Clic droit sur une carte pour déplacer l’étape ou passer le rôle suivant.",
  "softwareTeamDlc.install.blockedShared":
    "Impossible d’écrire des modèles dans le home utilisateur en mode Partagé — cela réécrirait ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Choisissez un dossier projet pour installer les modèles dans son répertoire .grok.",
  "softwareTeamDlc.install.independentOk":
    "Le mode Indépendant peut écrire les modèles dans l’agent-home de l’app (pas ~/.grok).",
  "softwareTeamDlc.install.action": "Installer le pack de rôles",
  "softwareTeamDlc.install.installing": "Installation du pack…",
  "softwareTeamDlc.install.ok": "{n} fichiers du pack installés ({target}).",
  "softwareTeamDlc.install.targetProject": ".grok du projet",
  "softwareTeamDlc.install.targetUser": "agent-home Indépendant",
  "softwareTeamDlc.install.needHost":
    "L’installation exige l’hôte bureau. Cet aperçu ne peut pas écrire de fichiers — il ne simulera pas un succès.",
  "softwareTeamDlc.install.hostError": "Échec de l’installation : {error}",
  "softwareTeamDlc.install.chooseTarget": "Cible d’installation",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Lier ou créer une session, charger le starter dans le compositeur, déplacer l’étape, passer le rôle suivant.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Agents live",
  "softwareTeamDlc.addItem": "Ajouter un élément",
  "softwareTeamDlc.editItem": "Modifier l’élément",
  "softwareTeamDlc.itemTitle": "Titre",
  "softwareTeamDlc.itemTitlePlaceholder": "Nom de la tranche",
  "softwareTeamDlc.planRef": "Plan",
  "softwareTeamDlc.goalRef": "Objectif",
  "softwareTeamDlc.artifactRef": "Artefact",
  "softwareTeamDlc.planPlaceholder": "Plan ou note /plan",
  "softwareTeamDlc.goalPlaceholder": "Objectif ou note /goal",
  "softwareTeamDlc.artifactPlaceholder": "PR, chemin ou livrable",
  "softwareTeamDlc.bindSession": "Lier la session",
  "softwareTeamDlc.unbound": "Aucune session",
  "softwareTeamDlc.sessionLabel": "Session",
  "softwareTeamDlc.handoff": "Passer",
  "softwareTeamDlc.handoffTo": "Passer à {role}",
  "softwareTeamDlc.handoffDone":
    "Pipeline terminé — Tech Writer est le dernier rôle. Ship exige encore les notes Reviewer et QA.",
  "softwareTeamDlc.handoffCopied": "Starter du rôle suivant copié",
  "softwareTeamDlc.handoffLoaded": "Le starter du rôle suivant est dans le compositeur.",
  "softwareTeamDlc.openInComposer": "Ouvrir dans le compositeur",
  "softwareTeamDlc.createAndOpen": "Créer une session et ouvrir",
  "softwareTeamDlc.saveAndOpen": "Enregistrer et ouvrir",
  "softwareTeamDlc.starterLoaded": "Le starter du rôle est dans le compositeur.",
  "softwareTeamDlc.needHostCreate":
    "Impossible de créer une session sans l’hôte. Liez une session existante ou ouvrez l’app bureau.",
  "softwareTeamDlc.createFailed": "Impossible de créer une session : {error}",
  "softwareTeamDlc.planChromeSet": "Note de plan attachée à cette session.",
  "softwareTeamDlc.planChromeSkipped":
    "Le champ plan reste sur la carte. L’hôte n’a pas persisté le chrome de plan.",
  "softwareTeamDlc.slashAfterInstall":
    "Après installation, /team-* insère la puce skill. Avant, ouvrez une session depuis le tableau.",
  "softwareTeamDlc.noNextRole": "Ce rôle n’a plus de passation.",
  "softwareTeamDlc.moveStage": "Déplacer vers {stage}",
  "softwareTeamDlc.removeItem": "Retirer du tableau",
  "softwareTeamDlc.emptyBoard":
    "Aucun élément pour l’instant. Ajoutez une tranche ou liez une session à un rôle.",
  "softwareTeamDlc.openStudio": "Ouvrez SDLC Studio depuis la barre latérale (Agents).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} fichiers du pack sur {total} sont sur cette cible.",
  "softwareTeamDlc.install.status.missing":
    "{n} fichiers du pack manquent sur cette cible.",
  "softwareTeamDlc.install.status.checking":
    "Vérification des fichiers du pack sur la cible choisie…",
  "softwareTeamDlc.install.repair": "Réparer les fichiers manquants",
  "softwareTeamDlc.install.repairing": "Réparation du pack…",
  "softwareTeamDlc.install.repaired": "{n} fichiers manquants du pack écrits.",
  "softwareTeamDlc.install.repairNone":
    "Rien à réparer — les fichiers du pack sont déjà présents.",
  "softwareTeamDlc.goalModeSet": "Le mode objectif est activé pour ce brouillon.",
  "softwareTeamDlc.goalModeSkipped":
    "L’objectif reste sur la carte. L’hôte n’a pas d’API de création d’objectif.",
  "softwareTeamDlc.shipLocked":
    "Ship est verrouillé tant que les notes Reviewer et QA ne sont pas enregistrées.",
  "softwareTeamDlc.shipNeedReviewer": "Cette tranche n’est pas passée par Reviewer.",
  "softwareTeamDlc.shipNeedQa": "Cette tranche n’est pas passée par QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Enregistrez les notes Reviewer avant Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Enregistrez les notes QA avant Ship.",
  "softwareTeamDlc.markReviewNote": "Saisir les notes Reviewer",
  "softwareTeamDlc.markQaNote": "Saisir les notes QA",
  "softwareTeamDlc.reviewNote": "Notes Reviewer",
  "softwareTeamDlc.qaNote": "Notes QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, corrections obligatoires vs nits, risque.",
  "softwareTeamDlc.qaNotePlaceholder": "Cas, commandes, succès/échec.",
  "softwareTeamDlc.notesSaved":
    "Notes enregistrées. Ship s’ouvre quand les notes Reviewer et QA sont toutes deux présentes.",
  "softwareTeamDlc.startDelivery": "Démarrer une livraison",
  "softwareTeamDlc.startDeliveryHint":
    "Crée un élément de pipeline et ouvre une session Grok Build avec le starter du rôle. Les espaces docs/sdlc restent dans ce dossier projet — jamais ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Titre de la tranche",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "Que livrons-nous ?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Nommez la tranche avant de commencer.",
  "softwareTeamDlc.startDeliveryRole": "Premier rôle",
  "softwareTeamDlc.startDeliveryBootstrap": "Ajouter les fichiers docs/sdlc",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Écrit spec.md, design.md et review.md sous docs/sdlc de ce projet s’ils manquent. Nécessite l’hôte bureau et un dossier projet.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Choisissez un dossier projet pour écrire les fichiers docs/sdlc.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "Les fichiers d’espace de travail nécessitent l’hôte bureau. Cet aperçu ne prétend pas les avoir écrits.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Impossible d’écrire dans ~/.grok partagé. Choisissez un dossier projet.",
  "softwareTeamDlc.startDeliveryHostError": "Impossible d’écrire les fichiers : {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "{n} fichiers docs/sdlc écrits dans le projet.",
  "softwareTeamDlc.startDeliveryBootstrapSkip": "Fichiers d’espace de travail ignorés.",
  "softwareTeamDlc.startDeliveryStarted": "Livraison démarrée.",
  "softwareTeamDlc.handoffCta": "Passer à {role}",
  "softwareTeamDlc.shipCta": "Ship · starter Rédacteur",
  "softwareTeamDlc.sessionDoneHint":
    "Session terminée. Passez ou Ship — le tableau n’avance pas tout seul.",
  "softwareTeamDlc.attachSeeded":
    "{n} sessions attach-chat semées dans le brouillon (max. 3).",
  "softwareTeamDlc.addTeammateGroup": "Ajouter une session d’équipe",
  "softwareTeamDlc.addTeammate": "Ajouter une session {role}",
  "softwareTeamDlc.attachedHint":
    "{n} chats d’équipe sur cette livraison (attach-chat, max. 3)",
  "softwareTeamDlc.pipelineFileOk":
    "Pipeline enregistré dans ce projet (.grok/software-works.json).",
  "softwareTeamDlc.pipelineFileMissing":
    "Pas encore de fichier pipeline. Le prochain changement écrit .grok/software-works.json.",
  "softwareTeamDlc.pipelineFileCache":
    "Pas d’écriture Host vers le projet — le pipeline reste dans le cache de l’app.",
  "softwareTeamDlc.pipelineFileNeedHost":
    "Le pipeline projet nécessite l’Host bureau. Cet aperçu ne prétend pas l’avoir enregistré.",
  "softwareTeamDlc.pipelineFileNeedProject":
    "Choisissez un dossier projet pour enregistrer le pipeline dans le dépôt.",
  "softwareTeamDlc.pipelineFileBlockedHome":
    "Impossible d’écrire le pipeline dans ~/.grok partagé.",
  "softwareTeamDlc.pipelineFileParseFail":
    "Fichier pipeline illisible. Laissé intact (sauvegarde {file}). Cache de l’app utilisé.",
  "softwareTeamDlc.pipelineFileHostError": "Impossible d’enregistrer le pipeline : {error}",
  "softwareTeamDlc.deliveryFilter": "Livraison",
  "softwareTeamDlc.deliveryFilterAll": "Toutes les livraisons",
  "softwareTeamDlc.deliveryUnscoped": "Sans groupe",
  "softwareTeamDlc.roleHistory": "Rôles : {roles}",
  "softwareTeamDlc.openSdlcDocs": "Ouvrir docs/sdlc",
  "softwareTeamDlc.openSdlcDoc": "Ouvrir {file}",
  "softwareTeamDlc.openSdlcDocOpened": "Fichier ouvert dans l’éditeur.",
  "softwareTeamDlc.openSdlcDocCopied":
    "Chemin copié. L’Host n’a pas ouvert d’éditeur pour ce fichier.",
  "softwareTeamDlc.openSdlcDocMissing": "Ce fichier docs/sdlc n’est pas dans ce projet.",
  "softwareTeamDlc.openSdlcDocNeedHost": "Ouvrir dans l’éditeur nécessite l’Host bureau.",
  "softwareTeamDlc.openSdlcDocNeedProject":
    "Choisissez un dossier projet pour ouvrir docs/sdlc.",
  "softwareTeamDlc.openSdlcDocBlockedHome":
    "Impossible d’ouvrir docs/sdlc depuis ~/.grok partagé.",
  "softwareTeamDlc.openSdlcDocHostError": "Impossible d’ouvrir le fichier : {error}",
} as const;
