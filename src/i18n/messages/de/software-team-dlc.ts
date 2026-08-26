/** de messages — domain: Software Works / SDLC Studio */
export const deSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Software Works aktivieren",
  "softwareTeamDlc.enableDesc":
    "Wenn an, ist die Agenten-Ansicht ein SDLC-Studio: Besetzung, Pipeline-Board und Rollenübergabe auf Grok Build. Standard aus. Benennt die App nicht um, solange aus, und startet keine extra CLI-Agenten.",
  "softwareTeamDlc.optInNote":
    "Software Works ist die Software-Lieferedition für Grok Build — keine zweite Agent-Laufzeit.",
  "softwareTeamDlc.noSkinAutoApply":
    "Oberflächen-Skins werden nie automatisch angewendet. Wählen Sie bei Bedarf ein .grokskin unter Einstellungen → Erscheinungsbild.",
  "softwareTeamDlc.sharedHomeNote":
    "Geteilte Sitzungsdaten (GROK_HOME=~/.grok) werden nie umgeschrieben. Vorgaben bleiben in der App, bis Sie sie in ein Projekt oder das unabhängige Agent-Home installieren.",
  "softwareTeamDlc.rosterTitle": "Team-Besetzung",
  "softwareTeamDlc.rosterHint":
    "Eine Grok-Build-Sitzung pro Rolle. Karte öffnen, damit der Rollenstarter im Composer liegt. Übergabe rückt die nächste Rolle vor und lädt deren Starter dort.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Umfang, Abnahme und Backlog. Übergibt eine lieferbare Scheibe.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Design passend zu diesem Repo: Module, Risiken und ein konkreter Build-Plan.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "Die vereinbarte Scheibe umsetzen. Vorhandenen Stil treffen. Verifikation zusammenfassen.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "Diff prüfen. Pflichtfix vs. Nits. Nicht umschreiben, außer danach gefragt.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Testfälle, Befehle und ehrliches Bestanden/Fehlgeschlagen. Keine erfundenen Browser-Läufe.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Wiki und i18n nur wenn die Änderung es braucht. Kennungen exakt lassen.",
  "softwareTeamDlc.slashHint": "Slash-Hinweis: {slash}",
  "softwareTeamDlc.copyStarter": "Starter kopieren",
  "softwareTeamDlc.copied": "Kopiert",
  "softwareTeamDlc.copyFailed": "Kopieren fehlgeschlagen — Starter markieren und manuell kopieren.",
  "softwareTeamDlc.sdlcTitle": "SDLC-Stufen",
  "softwareTeamDlc.sdlcHint":
    "Das Studio-Board (Backlog → Design → Build → Review → Ship) ist die Quelle der Wahrheit. Live-Agent-Spalten bleiben informativ.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (inaktiv)",
  "softwareTeamDlc.assignRole": "Rolle zuweisen",
  "softwareTeamDlc.assignStage": "SDLC-Stufe zuweisen",
  "softwareTeamDlc.clearTag": "Sitzung lösen",
  "softwareTeamDlc.packTitle": "Rollenvorlagen",
  "softwareTeamDlc.packHint":
    "Vorgaben sind in der App gebündelt. Installieren schreibt 6 Agents, 6 Skills und team-handoff.rhai ins Projekt-.grok oder das unabhängige Agent-Home — nie ins geteilte ~/.grok.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Startet keine parallelen CLI-Agenten. Team = gebundene Sitzungen + attach-chat + Übergabe-Starter.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Workbench und Remote IM steuern weiter nur Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio ist die Pipeline. Rechtsklick auf eine Karte verschiebt die Stufe oder übergibt die nächste Rolle.",
  "softwareTeamDlc.install.blockedShared":
    "Benutzer-Home-Vorlagen können im geteilten Sitzungsmodus nicht geschrieben werden — das würde ~/.grok umschreiben.",
  "softwareTeamDlc.install.needProject":
    "Wählen Sie einen Projektordner, um Vorlagen unter dessen .grok-Verzeichnis zu installieren.",
  "softwareTeamDlc.install.independentOk":
    "Der unabhängige Modus darf Vorlagen ins App-Agent-Home schreiben (nicht ~/.grok).",
  "softwareTeamDlc.install.action": "Rollenpaket installieren",
  "softwareTeamDlc.install.installing": "Paket wird installiert…",
  "softwareTeamDlc.install.ok": "{n} Paketdateien installiert ({target}).",
  "softwareTeamDlc.install.targetProject": "Projekt-.grok",
  "softwareTeamDlc.install.targetUser": "Unabhängiges Agent-Home",
  "softwareTeamDlc.install.needHost":
    "Installieren braucht den Desktop-Host. Diese Vorschau kann keine Dateien schreiben — sie täuscht keinen Erfolg vor.",
  "softwareTeamDlc.install.hostError": "Installation fehlgeschlagen: {error}",
  "softwareTeamDlc.install.chooseTarget": "Installationsziel",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Sitzung binden oder anlegen, Rollenstarter in den Composer laden, Stufe verschieben, nächste Rolle übergeben.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Live-Agenten",
  "softwareTeamDlc.addItem": "Arbeitselement hinzufügen",
  "softwareTeamDlc.editItem": "Arbeitselement bearbeiten",
  "softwareTeamDlc.itemTitle": "Titel",
  "softwareTeamDlc.itemTitlePlaceholder": "Name der Scheibe",
  "softwareTeamDlc.planRef": "Plan",
  "softwareTeamDlc.goalRef": "Ziel",
  "softwareTeamDlc.artifactRef": "Artefakt",
  "softwareTeamDlc.planPlaceholder": "Plan oder /plan-Notiz",
  "softwareTeamDlc.goalPlaceholder": "Ziel oder /goal-Notiz",
  "softwareTeamDlc.artifactPlaceholder": "PR, Pfad oder Liefergegenstand",
  "softwareTeamDlc.bindSession": "Sitzung binden",
  "softwareTeamDlc.unbound": "Keine Sitzung",
  "softwareTeamDlc.sessionLabel": "Sitzung",
  "softwareTeamDlc.handoff": "Übergeben",
  "softwareTeamDlc.handoffTo": "Übergeben an {role}",
  "softwareTeamDlc.handoffDone":
    "Pipeline fertig — Tech Writer ist die letzte Rolle. Ship braucht noch Reviewer- und QA-Notizen.",
  "softwareTeamDlc.handoffCopied": "Starter der nächsten Rolle kopiert",
  "softwareTeamDlc.handoffLoaded": "Starter der nächsten Rolle liegt im Composer.",
  "softwareTeamDlc.openInComposer": "Im Composer öffnen",
  "softwareTeamDlc.createAndOpen": "Sitzung anlegen und öffnen",
  "softwareTeamDlc.saveAndOpen": "Speichern und öffnen",
  "softwareTeamDlc.starterLoaded": "Rollenstarter liegt im Composer.",
  "softwareTeamDlc.needHostCreate":
    "Ohne Host kann keine Sitzung angelegt werden. Binden Sie eine vorhandene Sitzung oder öffnen Sie die Desktop-App.",
  "softwareTeamDlc.createFailed": "Sitzung konnte nicht angelegt werden: {error}",
  "softwareTeamDlc.planChromeSet": "Plannotiz an dieser Sitzung angehängt.",
  "softwareTeamDlc.planChromeSkipped":
    "Planfeld bleibt auf der Karte. Der Host hat kein Plan-Chrome geschrieben.",
  "softwareTeamDlc.slashAfterInstall":
    "Nach der Paketinstallation fügt /team-* den Skill-Chip ein. Davor Sitzung vom Board öffnen.",
  "softwareTeamDlc.noNextRole": "Diese Rolle hat keine weitere Übergabe.",
  "softwareTeamDlc.moveStage": "Nach {stage} verschieben",
  "softwareTeamDlc.removeItem": "Vom Board entfernen",
  "softwareTeamDlc.emptyBoard":
    "Noch keine Arbeitselemente. Eine Scheibe anlegen oder eine Sitzung an eine Rolle binden.",
  "softwareTeamDlc.openStudio": "SDLC Studio über die Seitenleiste (Agenten) öffnen.",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} von {total} Pack-Dateien sind auf diesem Ziel.",
  "softwareTeamDlc.install.status.missing":
    "{n} Pack-Dateien fehlen auf diesem Ziel.",
  "softwareTeamDlc.install.status.checking":
    "Pack-Dateien auf dem gewählten Ziel werden geprüft…",
  "softwareTeamDlc.install.repair": "Fehlende Dateien reparieren",
  "softwareTeamDlc.install.repairing": "Pack wird repariert…",
  "softwareTeamDlc.install.repaired": "{n} fehlende Pack-Dateien geschrieben.",
  "softwareTeamDlc.install.repairNone":
    "Nichts zu reparieren — Pack-Dateien sind schon da.",
  "softwareTeamDlc.goalModeSet": "Goal-Modus ist für diesen Entwurf an.",
  "softwareTeamDlc.goalModeSkipped":
    "Goal bleibt auf der Karte. Host hat keine Goal-Erzeugungs-API.",
  "softwareTeamDlc.shipLocked":
    "Ship ist gesperrt, bis Reviewer- und QA-Notizen gespeichert sind.",
  "softwareTeamDlc.shipNeedReviewer": "Diese Scheibe ist nicht durch Reviewer gegangen.",
  "softwareTeamDlc.shipNeedQa": "Diese Scheibe ist nicht durch QA gegangen.",
  "softwareTeamDlc.shipNeedReviewNote": "Reviewer-Notizen vor Ship speichern.",
  "softwareTeamDlc.shipNeedQaNote": "QA-Notizen vor Ship speichern.",
  "softwareTeamDlc.markReviewNote": "Reviewer-Notizen eintragen",
  "softwareTeamDlc.markQaNote": "QA-Notizen eintragen",
  "softwareTeamDlc.reviewNote": "Reviewer-Notizen",
  "softwareTeamDlc.qaNote": "QA-Notizen",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, Muss-Fixes vs. Nits, Risiko.",
  "softwareTeamDlc.qaNotePlaceholder": "Fälle, Befehle, Bestanden/Fehlschlag.",
  "softwareTeamDlc.notesSaved":
    "Notizen gespeichert. Ship öffnet, wenn Reviewer- und QA-Notizen beide da sind.",
  "softwareTeamDlc.startDelivery": "Lieferung starten",
  "softwareTeamDlc.startDeliveryHint":
    "Legt ein Pipeline-Element an und öffnet eine Grok-Build-Sitzung mit dem Rollenstarter. Optionale docs/sdlc-Platzhalter bleiben in diesem Projektordner — nie ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Scheiben-Titel",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "Was liefern wir?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Bitte zuerst die Scheibe benennen.",
  "softwareTeamDlc.startDeliveryRole": "Erste Rolle",
  "softwareTeamDlc.startDeliveryBootstrap": "docs/sdlc-Platzhalter anlegen",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Schreibt spec.md, design.md und review.md unter docs/sdlc dieses Projekts, wenn sie fehlen. Braucht Desktop-Host und Projektordner.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Projektordner wählen, um docs/sdlc-Platzhalter zu schreiben.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "Arbeitsplatzhalter brauchen den Desktop-Host. Diese Vorschau tut nicht so, als hätte sie geschrieben.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Kein Bootstrap in gemeinsames ~/.grok. Bitte einen Projektordner wählen.",
  "softwareTeamDlc.startDeliveryHostError": "Platzhalter nicht geschrieben: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "{n} docs/sdlc-Platzhalter im Projekt geschrieben.",
  "softwareTeamDlc.startDeliveryBootstrapSkip": "Arbeitsplatzhalter übersprungen.",
  "softwareTeamDlc.startDeliveryStarted": "Lieferung gestartet.",
  "softwareTeamDlc.handoffCta": "Übergeben an {role}",
  "softwareTeamDlc.shipCta": "Ship · Writer-Starter",
  "softwareTeamDlc.sessionDoneHint":
    "Sitzung fertig. Übergeben oder Ship — das Board rückt nicht von selbst vor.",
  "softwareTeamDlc.attachSeeded":
    "{n} attach-chat-Sitzungen im Composer-Entwurf vorgemerkt (max. 3).",
  "softwareTeamDlc.addTeammateGroup": "Teamsitzung hinzufügen",
  "softwareTeamDlc.addTeammate": "{role}-Sitzung hinzufügen",
  "softwareTeamDlc.attachedHint":
    "{n} Team-Chats in dieser Lieferung (attach-chat, max. 3)",
} as const;
