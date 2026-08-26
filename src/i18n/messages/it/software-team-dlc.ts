/** it messages — domain: Software Works / SDLC Studio */
export const itSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Attiva Software Works",
  "softwareTeamDlc.enableDesc":
    "Quando è attivo, il riquadro Agenti è uno studio SDLC: rosa, board della pipeline e handoff dei ruoli su Grok Build. Disattivato di default. Non rebranda l’app da spento e non avvia agenti CLI extra.",
  "softwareTeamDlc.optInNote":
    "Software Works è l’edizione di consegna software per Grok Build — non un secondo runtime di agenti.",
  "softwareTeamDlc.noSkinAutoApply":
    "Le skin di aspetto non si applicano mai da sole. Scegli un .grokskin in Impostazioni → Aspetto se ne vuoi una.",
  "softwareTeamDlc.sharedHomeNote":
    "I dati di sessione condivisi (GROK_HOME=~/.grok) non vengono mai riscritti. I preset restano nell’app finché non li installi in un progetto o nell’agent-home Indipendente.",
  "softwareTeamDlc.rosterTitle": "Rosa del team",
  "softwareTeamDlc.rosterHint":
    "Una sessione Grok Build per ruolo. Apri una scheda per mettere lo starter nel composer. L’handoff avanza il ruolo successivo e lo carica lì.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Ambito, accettazione e backlog. Passa una sola fetta consegnabile.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Progetto adatto a questo repo: moduli, rischi e un piano Build concreto.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "Implementa la fetta concordata. Segui lo stile esistente. Riassumi come verificare.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "Rivedi il diff. Bloccanti vs nits. Non riscrivere se non richiesto.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Casi di test, comandi e pass/fail onesto. Nessuna corsa browser inventata.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Wiki e i18n solo quando il cambiamento lo richiede. Tieni gli identificatori esatti.",
  "softwareTeamDlc.slashHint": "Suggerimento slash: {slash}",
  "softwareTeamDlc.copyStarter": "Copia starter",
  "softwareTeamDlc.copied": "Copiato",
  "softwareTeamDlc.copyFailed": "Impossibile copiare — seleziona lo starter e copialo a mano.",
  "softwareTeamDlc.sdlcTitle": "Fasi SDLC",
  "softwareTeamDlc.sdlcHint":
    "La board dello studio (Backlog → Design → Build → Review → Ship) è la fonte di verità. Le colonne agenti live restano informative.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (inattivo)",
  "softwareTeamDlc.assignRole": "Assegna ruolo",
  "softwareTeamDlc.assignStage": "Assegna fase SDLC",
  "softwareTeamDlc.clearTag": "Scollega sessione",
  "softwareTeamDlc.packTitle": "Modelli di ruolo",
  "softwareTeamDlc.packHint":
    "I preset sono nell’app. Installa scrive 6 agent, 6 skill e team-handoff.rhai nella .grok del progetto o nell’agent-home Indipendente — mai la ~/.grok condivisa.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Non avvia agenti CLI in parallelo. Team = sessioni collegate + attach-chat + starter di handoff.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Workbench e Remote IM controllano ancora solo Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio è la pipeline. Clic destro su una scheda per spostare la fase o passare il ruolo successivo.",
  "softwareTeamDlc.install.blockedShared":
    "Impossibile scrivere modelli nella home utente con dati sessione Condivisi — riscriverebbe ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Seleziona una cartella progetto per installare i modelli nella sua directory .grok.",
  "softwareTeamDlc.install.independentOk":
    "La modalità Indipendente può scrivere i modelli nell’agent-home dell’App (non ~/.grok).",
  "softwareTeamDlc.install.action": "Installa il pack dei ruoli",
  "softwareTeamDlc.install.installing": "Installazione del pack…",
  "softwareTeamDlc.install.ok": "Installati {n} file del pack ({target}).",
  "softwareTeamDlc.install.targetProject": ".grok del progetto",
  "softwareTeamDlc.install.targetUser": "agent-home Indipendente",
  "softwareTeamDlc.install.needHost":
    "L’installazione richiede l’Host desktop. Questa anteprima non può scrivere file e non finge il successo.",
  "softwareTeamDlc.install.hostError": "Installazione non riuscita: {error}",
  "softwareTeamDlc.install.chooseTarget": "Destinazione di installazione",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Collega o crea una sessione, carica lo starter nel composer, sposta la fase, passa il ruolo successivo.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Agenti live",
  "softwareTeamDlc.addItem": "Aggiungi elemento",
  "softwareTeamDlc.editItem": "Modifica elemento",
  "softwareTeamDlc.itemTitle": "Titolo",
  "softwareTeamDlc.itemTitlePlaceholder": "Nome della fetta",
  "softwareTeamDlc.planRef": "Piano",
  "softwareTeamDlc.goalRef": "Obiettivo",
  "softwareTeamDlc.artifactRef": "Artefatto",
  "softwareTeamDlc.planPlaceholder": "Piano o nota /plan",
  "softwareTeamDlc.goalPlaceholder": "Obiettivo o nota /goal",
  "softwareTeamDlc.artifactPlaceholder": "PR, percorso o deliverable",
  "softwareTeamDlc.bindSession": "Collega sessione",
  "softwareTeamDlc.unbound": "Nessuna sessione",
  "softwareTeamDlc.sessionLabel": "Sessione",
  "softwareTeamDlc.handoff": "Passa",
  "softwareTeamDlc.handoffTo": "Passa a {role}",
  "softwareTeamDlc.handoffDone":
    "Pipeline completa — Tech Writer è l’ultimo ruolo. Ship richiede ancora le note Reviewer e QA.",
  "softwareTeamDlc.handoffCopied": "Starter del ruolo successivo copiato",
  "softwareTeamDlc.handoffLoaded": "Lo starter del ruolo successivo è nel composer.",
  "softwareTeamDlc.openInComposer": "Apri nel composer",
  "softwareTeamDlc.createAndOpen": "Crea sessione e apri",
  "softwareTeamDlc.saveAndOpen": "Salva e apri",
  "softwareTeamDlc.starterLoaded": "Lo starter del ruolo è nel composer.",
  "softwareTeamDlc.needHostCreate":
    "Senza Host non si può creare una sessione. Collega una esistente o apri l’app desktop.",
  "softwareTeamDlc.createFailed": "Impossibile creare la sessione: {error}",
  "softwareTeamDlc.planChromeSet": "Nota di piano allegata a questa sessione.",
  "softwareTeamDlc.planChromeSkipped":
    "Il campo piano resta sulla scheda. L’Host non ha persistito il chrome del piano.",
  "softwareTeamDlc.slashAfterInstall":
    "Dopo l’installazione, /team-* inserisce il chip skill. Prima, apri una sessione dalla board.",
  "softwareTeamDlc.noNextRole": "Questo ruolo non ha ulteriori handoff.",
  "softwareTeamDlc.moveStage": "Sposta in {stage}",
  "softwareTeamDlc.removeItem": "Rimuovi dalla board",
  "softwareTeamDlc.emptyBoard":
    "Nessun elemento ancora. Aggiungi una fetta o collega una sessione a un ruolo.",
  "softwareTeamDlc.openStudio": "Apri SDLC Studio dalla barra laterale (Agenti).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} di {total} file del pack sono su questa destinazione.",
  "softwareTeamDlc.install.status.missing":
    "Mancano {n} file del pack su questa destinazione.",
  "softwareTeamDlc.install.status.checking":
    "Controllo dei file del pack sulla destinazione scelta…",
  "softwareTeamDlc.install.repair": "Ripara i file mancanti",
  "softwareTeamDlc.install.repairing": "Riparazione del pack…",
  "softwareTeamDlc.install.repaired": "Scritti {n} file mancanti del pack.",
  "softwareTeamDlc.install.repairNone":
    "Niente da riparare — i file del pack sono già presenti.",
  "softwareTeamDlc.goalModeSet": "La modalità obiettivo è attiva su questa bozza.",
  "softwareTeamDlc.goalModeSkipped":
    "L’obiettivo resta sulla scheda. L’host non ha un’API per creare obiettivi.",
  "softwareTeamDlc.shipLocked":
    "Ship è bloccato finché non salvi le note Reviewer e QA.",
  "softwareTeamDlc.shipNeedReviewer": "Questa fetta non è passata da Reviewer.",
  "softwareTeamDlc.shipNeedQa": "Questa fetta non è passata da QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Salva le note Reviewer prima di Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Salva le note QA prima di Ship.",
  "softwareTeamDlc.markReviewNote": "Segna le note Reviewer",
  "softwareTeamDlc.markQaNote": "Segna le note QA",
  "softwareTeamDlc.reviewNote": "Note Reviewer",
  "softwareTeamDlc.qaNote": "Note QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, correzioni obbligatorie vs nits, rischio.",
  "softwareTeamDlc.qaNotePlaceholder": "Casi, comandi, esito.",
  "softwareTeamDlc.notesSaved":
    "Note salvate. Ship si sblocca quando ci sono sia le note Reviewer sia QA.",
} as const;
