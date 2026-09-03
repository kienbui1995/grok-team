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
    "Ship è bloccato finché questa consegna non ha note Reviewer e QA.",
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
    "Note salvate. Ship si sblocca quando questa consegna ha note Reviewer e QA.",
  "softwareTeamDlc.startDelivery": "Avvia una consegna",
  "softwareTeamDlc.startDeliveryHint":
    "Crea un elemento pipeline e apre una sessione Grok Build con lo starter del ruolo. I placeholder docs/sdlc restano in questa cartella progetto — mai ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Titolo della fetta",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "Cosa consegniamo?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Dai un nome alla fetta prima di iniziare.",
  "softwareTeamDlc.startDeliveryRole": "Primo ruolo",
  "softwareTeamDlc.startDeliveryBootstrap": "Aggiungi placeholder docs/sdlc",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Scrive spec.md, design.md e review.md sotto docs/sdlc di questo progetto se mancano. Serve l’Host desktop e una cartella progetto.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Scegli una cartella progetto per scrivere docs/sdlc.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "I placeholder richiedono l’Host desktop. Questa anteprima non finge di averli scritti.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Impossibile avviare in ~/.grok condiviso. Scegli una cartella progetto.",
  "softwareTeamDlc.startDeliveryHostError": "Impossibile scrivere i placeholder: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "Scritti {n} file docs/sdlc nel progetto.",
  "softwareTeamDlc.startDeliveryBootstrapSkip": "Placeholder di workspace saltati.",
  "softwareTeamDlc.startDeliveryStarted": "Consegna avviata.",
  "softwareTeamDlc.handoffCta": "Passa a {role}",
  "softwareTeamDlc.shipCta": "Ship · starter Writer",
  "softwareTeamDlc.sessionDoneHint":
    "Sessione finita. Passa o Ship — la bacheca non avanza da sola.",
  "softwareTeamDlc.attachSeeded":
    "Inserite {n} sessioni attach-chat nella bozza (max 3).",
  "softwareTeamDlc.addTeammateGroup": "Aggiungi sessione di team",
  "softwareTeamDlc.addTeammate": "Aggiungi sessione {role}",
  "softwareTeamDlc.attachedHint":
    "{n} chat di team in questa consegna (attach-chat, max 3)",
  "softwareTeamDlc.pipelineFileOk":
    "Pipeline salvata in questo progetto (.grok/software-works.json).",
  "softwareTeamDlc.pipelineFileMissing":
    "Nessun file pipeline. La prossima modifica scrive .grok/software-works.json.",
  "softwareTeamDlc.pipelineFileCache":
    "Nessuna scrittura Host sul progetto — la pipeline resta nella cache dell’app.",
  "softwareTeamDlc.pipelineFileNeedHost":
    "La pipeline di progetto richiede l’Host desktop. Questa anteprima non finge di salvarla.",
  "softwareTeamDlc.pipelineFileNeedProject":
    "Scegli una cartella progetto per salvare la pipeline nel repo.",
  "softwareTeamDlc.pipelineFileBlockedHome":
    "Impossibile scrivere la pipeline in ~/.grok condiviso.",
  "softwareTeamDlc.pipelineFileParseFail":
    "File pipeline illeggibile. Lasciato intatto (backup {file}). Si usa la cache.",
  "softwareTeamDlc.pipelineFileHostError": "Impossibile salvare la pipeline: {error}",
  "softwareTeamDlc.deliveryFilter": "Consegna",
  "softwareTeamDlc.deliveryFilterAll": "Tutte le consegne",
  "softwareTeamDlc.deliveryUnscoped": "Senza gruppo",
  "softwareTeamDlc.roleHistory": "Ruoli: {roles}",
  "softwareTeamDlc.openSdlcDocs": "Apri docs/sdlc",
  "softwareTeamDlc.openSdlcDoc": "Apri {file}",
  "softwareTeamDlc.openSdlcDocOpened": "File aperto nell’editor.",
  "softwareTeamDlc.openSdlcDocCopied":
    "Percorso copiato. L’Host non ha aperto un editor per questo file.",
  "softwareTeamDlc.openSdlcDocMissing": "Quel file docs/sdlc non è in questo progetto.",
  "softwareTeamDlc.openSdlcDocNeedHost": "Aprire nell’editor richiede l’Host desktop.",
  "softwareTeamDlc.openSdlcDocNeedProject":
    "Scegli una cartella progetto per aprire docs/sdlc.",
  "softwareTeamDlc.openSdlcDocBlockedHome":
    "Impossibile aprire docs/sdlc da ~/.grok condiviso.",
  "softwareTeamDlc.openSdlcDocHostError": "Impossibile aprire il file: {error}",
  "softwareTeamDlc.deliveryDetail": "Consegna",
  "softwareTeamDlc.deliveryDetailHint":
    "Titolo, rif. della fetta condivisi, cronologia ruoli, note Review/QA (Ship per tutta la consegna), passo successivo, docs/sdlc e sessioni di questa fetta.",
  "softwareTeamDlc.openDelivery": "Apri consegna",
  "softwareTeamDlc.deliverySessions": "Sessioni di questa consegna",
  "softwareTeamDlc.deliveryNoSessions": "Nessuna sessione collegata.",
  "softwareTeamDlc.activityLog": "Attività",
  "softwareTeamDlc.activityEmpty": "Nessuna attività ancora.",
  "softwareTeamDlc.activity.item_added": "Elemento aggiunto",
  "softwareTeamDlc.activity.stage_changed": "Fase spostata",
  "softwareTeamDlc.activity.handoff": "Passato al ruolo successivo",
  "softwareTeamDlc.activity.notes": "Note aggiornate",
  "softwareTeamDlc.activity.delivery_started": "Consegna avviata",
  "softwareTeamDlc.pipelineFileReloaded":
    "Il file pipeline del progetto è più recente — lavagna aggiornata.",
  "softwareTeamDlc.notesEmpty": "Ancora nessuna",
  "softwareTeamDlc.searchTitle": "Cerca per titolo",
  "softwareTeamDlc.stageFilter": "Fase",
  "softwareTeamDlc.stageFilterAll": "Tutte le fasi",
  "softwareTeamDlc.roleFilter": "Ruolo",
  "softwareTeamDlc.roleFilterAll": "Tutti i ruoli",
  "softwareTeamDlc.showArchived": "Mostra archiviate",
  "softwareTeamDlc.archiveDelivery": "Archivia consegna",
  "softwareTeamDlc.unarchiveDelivery": "Ripristina consegna",
  "softwareTeamDlc.archived": "Archiviata. Nascosta dalla lavagna predefinita.",
  "softwareTeamDlc.unarchived": "La consegna è di nuovo sulla lavagna.",
  "softwareTeamDlc.activity.archived": "Archiviata",
  "softwareTeamDlc.activity.unarchived": "Ripristinata",
  "softwareTeamDlc.exportSummary": "Esporta riepilogo",
  "softwareTeamDlc.exportOk": "Scritto {file} in questo progetto.",
  "softwareTeamDlc.exportNeedHost":
    "L’esportazione richiede l’Host desktop. Questa anteprima non finge di aver scritto.",
  "softwareTeamDlc.exportNeedProject":
    "Scegli una cartella progetto per esportare docs/sdlc.",
  "softwareTeamDlc.exportBlockedHome":
    "Impossibile esportare il riepilogo in ~/.grok condiviso.",
  "softwareTeamDlc.exportBadSlug": "Quel titolo non può diventare un nome file.",
  "softwareTeamDlc.exportHostError": "Impossibile esportare il riepilogo: {error}",
  "softwareTeamDlc.pipelineFileConflict":
    "Il file pipeline è cambiato altrove. Lasciato intatto. La lavagna resta nell’app. Il prossimo salvataggio scrive un backup {file} invece di sostituire il file.",
  "softwareTeamDlc.undo": "Annulla ultima modifica",
  "softwareTeamDlc.undone": "Ultima modifica della bacheca annullata.",
  "softwareTeamDlc.undoEmpty": "Niente da annullare.",
  "softwareTeamDlc.removeItemConfirm": "Rimuovere questa scheda?",
  "softwareTeamDlc.removeItemConfirmBody":
    "Rimuovi “{title}” dalla bacheca SDLC. La sessione Grok Build resta. Annulla può ripristinare la scheda in questa finestra.",
  "softwareTeamDlc.removeItemConfirmAction": "Rimuovi scheda",
  "softwareTeamDlc.gitBranch": "Etichetta ramo git",
  "softwareTeamDlc.gitBranchPlaceholder": "feat/slice-name",
  "softwareTeamDlc.gitBranchHint":
    "Solo un’etichetta. Software Works non crea worktree, non fa checkout e non riscrive ~/.grok.",
  "softwareTeamDlc.gitBranchSave": "Salva etichetta ramo",
  "softwareTeamDlc.gitBranchSaved": "Etichetta ramo salvata su questa consegna.",
  "softwareTeamDlc.gitBranchInvalid": "Usa lettere, cifre, '.', '_' o '-' e '/' — niente spazi né trattino iniziale.",
  "softwareTeamDlc.gitBranchSuggest": "Suggerisci dal titolo",
  "softwareTeamDlc.gitBranchCopy": "Copia etichetta ramo",
  "softwareTeamDlc.gitBranchCopied": "Etichetta ramo copiata.",
  "softwareTeamDlc.activity.item_removed": "Elemento rimosso",
  "softwareTeamDlc.activity.git_branch": "Etichetta ramo git aggiornata",
  "softwareTeamDlc.redo": "Ripeti",
  "softwareTeamDlc.redone": "Modifica della bacheca ripetuta.",
  "softwareTeamDlc.redoEmpty": "Niente da ripetere.",
  "softwareTeamDlc.duplicateDelivery": "Duplica consegna",
  "softwareTeamDlc.duplicateSuffix": " (copia)",
  "softwareTeamDlc.duplicated": "Consegna duplicata. Le nuove schede non sono collegate.",
  "softwareTeamDlc.duplicateFailed": "Impossibile duplicare questa consegna.",
  "softwareTeamDlc.deliveryName": "Nome della consegna",
  "softwareTeamDlc.deliveryRename": "Salva nome",
  "softwareTeamDlc.deliveryRenamed": "Nome della consegna salvato.",
  "softwareTeamDlc.deliveryRenameNeedTitle": "Assegna un nome prima di salvare.",
  "softwareTeamDlc.activity.delivery_renamed": "Consegna rinominata",
  "softwareTeamDlc.activity.delivery_duplicated": "Consegna duplicata",
  "softwareTeamDlc.bindThisChat": "Collega questa chat",
  "softwareTeamDlc.bindThisChatDone": "Questa chat è collegata alla scheda.",
  "softwareTeamDlc.bindThisChatNeedSession": "Apri prima una chat, poi collegala.",
  "softwareTeamDlc.bindThisChatAlready": "Questa chat è già su questa scheda.",
  "softwareTeamDlc.unbindSessionDone": "Sessione scollegata. La chat resta.",
  "softwareTeamDlc.moveToDelivery": "Sposta nella consegna",
  "softwareTeamDlc.movedToDelivery": "Scheda spostata in {title}.",
  "softwareTeamDlc.movedUngrouped": "La scheda non è raggruppata.",
  "softwareTeamDlc.activity.item_moved": "Spostata in un’altra consegna",
  "softwareTeamDlc.activity.session_bound": "Sessione collegata",
  "softwareTeamDlc.activity.session_unbound": "Sessione scollegata",
  "softwareTeamDlc.missingRoles": "Sessioni del team mancanti: {roles}",
  "softwareTeamDlc.teamComplete":
    "Le schede Product, Architect, Engineer, Reviewer, QA e Writer sono su questa consegna.",
  "softwareTeamDlc.addSdlcDocs": "Aggiungi i file docs/sdlc mancanti",
  "softwareTeamDlc.sliceRefsHint":
    "Piano, obiettivo e artefatto sono condivisi su ogni scheda di questa consegna. Salvare li aggiorna tutti.",
  "softwareTeamDlc.sliceRefsSaved": "Rif. della fetta salvati su ogni scheda di questa consegna.",
  "softwareTeamDlc.saveSliceRefs": "Salva rif. della fetta",
  "softwareTeamDlc.copySummary": "Copia riepilogo",
  "softwareTeamDlc.copySummaryOk": "Riepilogo copiato.",
  "softwareTeamDlc.copySummaryFailed": "Impossibile copiare il riepilogo.",
  "softwareTeamDlc.exportCopiedInstead":
    "Riepilogo copiato. Nessun file del progetto è stato scritto.",
  "softwareTeamDlc.handoffKept":
    "Aperto {role}. Questa scheda resta {from}.",
  "softwareTeamDlc.handoffCreated":
    "Aggiunta una scheda {role}. Questa scheda resta {from}.",
  "softwareTeamDlc.shipKept":
    "Aperto Writer. Questa scheda resta {from}.",
} as const;
