/** English messages — domain: Software Works / SDLC Studio */
export const enSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Enable Software Works",
  "softwareTeamDlc.enableDesc":
    "When on, the Agents pane is an SDLC studio: roster, pipeline board, and role handoff on Grok Build. Off by default. Does not rebrand the app while off, and does not spawn extra CLI agents.",
  "softwareTeamDlc.optInNote":
    "Software Works is the software-delivery edition for Grok Build — not a second agent runtime.",
  "softwareTeamDlc.noSkinAutoApply":
    "Appearance skins are never applied automatically. Choose a .grokskin in Settings → Appearance if you want one.",
  "softwareTeamDlc.sharedHomeNote":
    "Shared session data (GROK_HOME=~/.grok) is never rewritten. Presets stay in the app unless you install them into a project or Independent agent-home.",
  "softwareTeamDlc.rosterTitle": "Team roster",
  "softwareTeamDlc.rosterHint":
    "One Grok Build session per role. Open a card to put the role starter in the composer. Handoff advances the next role and loads its starter there.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc":
    "Scope, acceptance, and backlog. Hands off a single shippable slice.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc":
    "Design fit for this repo: modules, risks, and a concrete Build plan.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc":
    "Implement the agreed slice. Match existing style. Summarize how to verify.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc":
    "Review the diff. Must-fix vs nits. Do not rewrite unless asked.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc":
    "Test cases, commands, and honest pass/fail. No invented browser runs.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc":
    "Wiki and i18n only when the change needs it. Keep identifiers exact.",
  "softwareTeamDlc.slashHint": "Slash hint: {slash}",
  "softwareTeamDlc.copyStarter": "Copy starter",
  "softwareTeamDlc.copied": "Copied",
  "softwareTeamDlc.copyFailed": "Could not copy — select the starter and copy it manually.",
  "softwareTeamDlc.sdlcTitle": "SDLC stages",
  "softwareTeamDlc.sdlcHint":
    "The studio board (Backlog → Design → Build → Review → Ship) is the source of truth. Live agent columns stay informational.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (idle)",
  "softwareTeamDlc.assignRole": "Assign role",
  "softwareTeamDlc.assignStage": "Assign SDLC stage",
  "softwareTeamDlc.clearTag": "Unbind session",
  "softwareTeamDlc.packTitle": "Role templates",
  "softwareTeamDlc.packHint":
    "Presets are bundled in the app. Install writes 6 agents, 6 skills, and team-handoff.rhai into the project .grok folder or Independent agent-home — never shared ~/.grok.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Does not start parallel CLI agents. Team = bound sessions + attach-chat + handoff starters.",
  "softwareTeamDlc.honesty.grokBuildOnly":
    "Workbench and Remote IM still control Grok Build only.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio is the pipeline. Right-click a card to move its stage or hand off the next role.",
  "softwareTeamDlc.install.blockedShared":
    "Cannot write user-home templates while session data is Shared — that would rewrite ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Select a project folder to install templates under that project’s .grok directory.",
  "softwareTeamDlc.install.independentOk":
    "Independent mode may write templates to the App agent-home (not ~/.grok).",
  "softwareTeamDlc.install.action": "Install role pack",
  "softwareTeamDlc.install.installing": "Installing pack…",
  "softwareTeamDlc.install.ok": "Installed {n} pack files ({target}).",
  "softwareTeamDlc.install.targetProject": "project .grok",
  "softwareTeamDlc.install.targetUser": "Independent agent-home",
  "softwareTeamDlc.install.needHost":
    "Install needs the desktop Host. This preview cannot write files — it will not pretend to succeed.",
  "softwareTeamDlc.install.hostError": "Install failed: {error}",
  "softwareTeamDlc.install.chooseTarget": "Install target",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Bind or create a session, load the role starter into the composer, move the stage, hand off the next role.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Live agents",
  "softwareTeamDlc.addItem": "Add work item",
  "softwareTeamDlc.editItem": "Edit work item",
  "softwareTeamDlc.itemTitle": "Title",
  "softwareTeamDlc.itemTitlePlaceholder": "Slice name",
  "softwareTeamDlc.planRef": "Plan",
  "softwareTeamDlc.goalRef": "Goal",
  "softwareTeamDlc.artifactRef": "Artifact",
  "softwareTeamDlc.planPlaceholder": "Plan or /plan note",
  "softwareTeamDlc.goalPlaceholder": "Goal or /goal note",
  "softwareTeamDlc.artifactPlaceholder": "PR, path, or deliverable",
  "softwareTeamDlc.bindSession": "Bind session",
  "softwareTeamDlc.unbound": "No session",
  "softwareTeamDlc.sessionLabel": "Session",
  "softwareTeamDlc.handoff": "Hand off",
  "softwareTeamDlc.handoffTo": "Hand off to {role}",
  "softwareTeamDlc.handoffDone":
    "Pipeline complete — Writer is the last role. Ship still needs Reviewer and QA notes.",
  "softwareTeamDlc.handoffCopied": "Next-role starter copied",
  "softwareTeamDlc.handoffLoaded": "Next-role starter is in the composer.",
  "softwareTeamDlc.openInComposer": "Open in composer",
  "softwareTeamDlc.createAndOpen": "Create session and open",
  "softwareTeamDlc.saveAndOpen": "Save and open",
  "softwareTeamDlc.starterLoaded": "Role starter is in the composer.",
  "softwareTeamDlc.needHostCreate":
    "Cannot create a session without the Host. Bind an existing session, or open the desktop app.",
  "softwareTeamDlc.createFailed": "Could not create a session: {error}",
  "softwareTeamDlc.planChromeSet": "Plan note attached on this session.",
  "softwareTeamDlc.planChromeSkipped":
    "Plan field is on the card. Host did not persist plan chrome.",
  "softwareTeamDlc.slashAfterInstall":
    "After pack install, /team-* inserts the skill chip. Before that, open a session from the board.",
  "softwareTeamDlc.noNextRole": "This role has no further handoff.",
  "softwareTeamDlc.moveStage": "Move to {stage}",
  "softwareTeamDlc.removeItem": "Remove from board",
  "softwareTeamDlc.emptyBoard":
    "No work items yet. Add a slice or bind a session to a role.",
  "softwareTeamDlc.openStudio": "Open SDLC Studio from the sidebar (Agents).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} of {total} pack files are on this target.",
  "softwareTeamDlc.install.status.missing":
    "{n} pack files are missing on this target.",
  "softwareTeamDlc.install.status.checking":
    "Checking pack files on the chosen target…",
  "softwareTeamDlc.install.repair": "Repair missing files",
  "softwareTeamDlc.install.repairing": "Repairing pack…",
  "softwareTeamDlc.install.repaired": "Wrote {n} missing pack files.",
  "softwareTeamDlc.install.repairNone":
    "Nothing to repair — pack files are already present.",
  "softwareTeamDlc.goalModeSet": "Goal mode is on for this composer draft.",
  "softwareTeamDlc.goalModeSkipped":
    "Goal stays on the card. Host has no create-goal API.",
  "softwareTeamDlc.shipLocked":
    "Ship is locked until Reviewer and QA notes are saved.",
  "softwareTeamDlc.shipNeedReviewer": "This slice has not passed through Reviewer.",
  "softwareTeamDlc.shipNeedQa": "This slice has not passed through QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Save Reviewer notes before Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Save QA notes before Ship.",
  "softwareTeamDlc.markReviewNote": "Mark Reviewer notes",
  "softwareTeamDlc.markQaNote": "Mark QA notes",
  "softwareTeamDlc.reviewNote": "Reviewer notes",
  "softwareTeamDlc.qaNote": "QA notes",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, must-fix vs nits, risk.",
  "softwareTeamDlc.qaNotePlaceholder": "Cases, commands, pass/fail.",
  "softwareTeamDlc.notesSaved":
    "Notes saved. Ship unlocks when Reviewer and QA notes are both present.",
} as const;
