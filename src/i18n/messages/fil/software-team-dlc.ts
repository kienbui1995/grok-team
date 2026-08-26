/** fil messages — domain: Software Works / SDLC Studio */
export const filSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "I-enable ang Software Works",
  "softwareTeamDlc.enableDesc":
    "Kapag naka-on, ang pane ng Agents ay SDLC studio: roster, pipeline board, at role handoff sa Grok Build. Naka-off by default. Hindi nire-rebrand ang app habang naka-off at hindi nagla-launch ng extra CLI agents.",
  "softwareTeamDlc.optInNote":
    "Ang Software Works ay ang software-delivery edition para sa Grok Build — hindi pangalawang agent runtime.",
  "softwareTeamDlc.noSkinAutoApply":
    "Hindi kailanman awtomatikong ina-apply ang appearance skins. Pumili ng .grokskin sa Settings → Appearance kung gusto mo.",
  "softwareTeamDlc.sharedHomeNote":
    "Hindi sinusulat muli ang shared session data (GROK_HOME=~/.grok). Nananatili sa app ang presets hangga't hindi mo i-install sa project o Independent agent-home.",
  "softwareTeamDlc.rosterTitle": "Roster ng team",
  "softwareTeamDlc.rosterHint":
    "Isang Grok Build session bawat role. Buksan ang card para ilagay ang starter sa composer. Ang handoff ay nagpapasulong ng susunod na role at niloload ang starter doon.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Scope, acceptance, at backlog. Naghahand-off ng isang slice na pwedeng i-ship.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Disenyong bagay sa repo na ito: modules, risks, at konkretong Build plan.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "I-implement ang napagkasunduang slice. Sundin ang existing style. I-summarize kung paano i-verify.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "I-review ang diff. Must-fix vs nits. Huwag i-rewrite maliban kung hiningi.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Mga test case, command, at tapat na pass/fail. Walang imbento na browser run.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Wiki at i18n lang kapag kailangan ng change. Panatilihing eksakto ang identifiers.",
  "softwareTeamDlc.slashHint": "Slash hint: {slash}",
  "softwareTeamDlc.copyStarter": "Kopyahin ang starter",
  "softwareTeamDlc.copied": "Nakopya",
  "softwareTeamDlc.copyFailed": "Hindi nakopya — piliin ang starter at kopyahin nang manu-mano.",
  "softwareTeamDlc.sdlcTitle": "Mga yugto ng SDLC",
  "softwareTeamDlc.sdlcHint":
    "Ang studio board (Backlog → Design → Build → Review → Ship) ang pinagmulan ng katotohanan. Ang live agent columns ay pampaalam lang.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (idle)",
  "softwareTeamDlc.assignRole": "I-assign ang role",
  "softwareTeamDlc.assignStage": "I-assign ang SDLC stage",
  "softwareTeamDlc.clearTag": "I-unbind ang session",
  "softwareTeamDlc.packTitle": "Mga template ng role",
  "softwareTeamDlc.packHint":
    "Naka-bundle sa app ang presets. Ang install ay nagsusulat ng 6 agents, 6 skills, at team-handoff.rhai sa .grok ng proyekto o Independent agent-home — hindi sa shared ~/.grok.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Hindi nagpapasimula ng parallel CLI agents. Team = naka-bind na sessions + attach-chat + handoff starters.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Ang workbench at Remote IM ay Grok Build pa rin ang kinokontrol.",
  "softwareTeamDlc.kanbanHint":
    "Ang SDLC Studio ang pipeline. I-right-click ang card para ilipat ang stage o i-hand off ang susunod na role.",
  "softwareTeamDlc.install.blockedShared":
    "Hindi pwedeng magsulat ng user-home templates habang Shared ang session data — masasamahan nito ang ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Pumili ng project folder para i-install ang templates sa .grok directory nito.",
  "softwareTeamDlc.install.independentOk":
    "Puwedeng magsulat ang Independent mode ng templates sa App agent-home (hindi ~/.grok).",
  "softwareTeamDlc.install.action": "I-install ang role pack",
  "softwareTeamDlc.install.installing": "Ini-install ang pack…",
  "softwareTeamDlc.install.ok": "Na-install ang {n} pack file ({target}).",
  "softwareTeamDlc.install.targetProject": "project .grok",
  "softwareTeamDlc.install.targetUser": "Independent agent-home",
  "softwareTeamDlc.install.needHost":
    "Kailangan ng desktop Host ang install. Hindi makakasulat ng file ang preview na ito — hindi ito magpapanggap na successful.",
  "softwareTeamDlc.install.hostError": "Bigo ang install: {error}",
  "softwareTeamDlc.install.chooseTarget": "Target ng install",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "I-bind o gumawa ng session, iload ang role starter sa composer, ilipat ang stage, i-hand off ang susunod na role.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Mga live na agent",
  "softwareTeamDlc.addItem": "Magdagdag ng item",
  "softwareTeamDlc.editItem": "I-edit ang item",
  "softwareTeamDlc.itemTitle": "Pamagat",
  "softwareTeamDlc.itemTitlePlaceholder": "Pangalan ng slice",
  "softwareTeamDlc.planRef": "Plan",
  "softwareTeamDlc.goalRef": "Goal",
  "softwareTeamDlc.artifactRef": "Artifact",
  "softwareTeamDlc.planPlaceholder": "Plan o /plan note",
  "softwareTeamDlc.goalPlaceholder": "Goal o /goal note",
  "softwareTeamDlc.artifactPlaceholder": "PR, path, o deliverable",
  "softwareTeamDlc.bindSession": "I-bind ang session",
  "softwareTeamDlc.unbound": "Walang session",
  "softwareTeamDlc.sessionLabel": "Session",
  "softwareTeamDlc.handoff": "I-hand off",
  "softwareTeamDlc.handoffTo": "I-hand off kay {role}",
  "softwareTeamDlc.handoffDone":
    "Tapos na ang pipeline — Tech Writer ang huling role. Kailangan pa ng notes ng Reviewer at QA para sa Ship.",
  "softwareTeamDlc.handoffCopied": "Nakopya ang starter ng susunod na role",
  "softwareTeamDlc.handoffLoaded": "Nasa composer na ang starter ng susunod na role.",
  "softwareTeamDlc.openInComposer": "Buksan sa composer",
  "softwareTeamDlc.createAndOpen": "Gumawa ng session at buksan",
  "softwareTeamDlc.saveAndOpen": "I-save at buksan",
  "softwareTeamDlc.starterLoaded": "Nasa composer na ang role starter.",
  "softwareTeamDlc.needHostCreate":
    "Hindi makagawa ng session kung walang Host. I-bind ang existing session, o buksan ang desktop app.",
  "softwareTeamDlc.createFailed": "Hindi nakagawa ng session: {error}",
  "softwareTeamDlc.planChromeSet": "May plan note na sa session na ito.",
  "softwareTeamDlc.planChromeSkipped":
    "Nasa card pa rin ang plan field. Hindi nag-persist ang Host ng plan chrome.",
  "softwareTeamDlc.slashAfterInstall":
    "Pagkatapos i-install ang pack, naglalagay ang /team-* ng skill chip. Bago iyon, magbukas ng session mula sa board.",
  "softwareTeamDlc.noNextRole": "Wala nang further handoff ang role na ito.",
  "softwareTeamDlc.moveStage": "Ilipat sa {stage}",
  "softwareTeamDlc.removeItem": "Alisin sa board",
  "softwareTeamDlc.emptyBoard":
    "Wala pang work items. Magdagdag ng slice o i-bind ang session sa role.",
  "softwareTeamDlc.openStudio": "Buksan ang SDLC Studio mula sa sidebar (Agents).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} sa {total} pack file ang nasa target na ito.",
  "softwareTeamDlc.install.status.missing":
    "Kulang ng {n} pack file sa target na ito.",
  "softwareTeamDlc.install.status.checking":
    "Tinitingnan ang pack file sa napiling target…",
  "softwareTeamDlc.install.repair": "Ayusin ang nawawalang file",
  "softwareTeamDlc.install.repairing": "Inaayos ang pack…",
  "softwareTeamDlc.install.repaired": "Naisulat ang {n} nawawalang pack file.",
  "softwareTeamDlc.install.repairNone":
    "Walang aayusin — nandiyan na ang pack file.",
  "softwareTeamDlc.goalModeSet": "Naka-on ang goal mode sa draft na ito.",
  "softwareTeamDlc.goalModeSkipped":
    "Nanatili ang goal sa card. Walang create-goal API ang Host.",
  "softwareTeamDlc.shipLocked":
    "Naka-lock ang Ship hanggang maisave ang notes ng Reviewer at QA.",
  "softwareTeamDlc.shipNeedReviewer": "Hindi pa dumaan sa Reviewer ang slice na ito.",
  "softwareTeamDlc.shipNeedQa": "Hindi pa dumaan sa QA ang slice na ito.",
  "softwareTeamDlc.shipNeedReviewNote": "I-save ang notes ng Reviewer bago ang Ship.",
  "softwareTeamDlc.shipNeedQaNote": "I-save ang notes ng QA bago ang Ship.",
  "softwareTeamDlc.markReviewNote": "Lagyan ng notes ng Reviewer",
  "softwareTeamDlc.markQaNote": "Lagyan ng notes ng QA",
  "softwareTeamDlc.reviewNote": "Notes ng Reviewer",
  "softwareTeamDlc.qaNote": "Notes ng QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, dapat ayusin vs nits, panganib.",
  "softwareTeamDlc.qaNotePlaceholder": "Mga case, command, pass/fail.",
  "softwareTeamDlc.notesSaved":
    "Nai-save ang notes. Mag-unlock ang Ship kapag may notes na ng Reviewer at QA.",
} as const;
