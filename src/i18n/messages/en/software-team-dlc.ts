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
    "One Grok Build session per role. Bind a session on the studio board. Handoff advances the next role and copies its starter.",
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
    "Agent, skill, and workflow presets are bundled in the app. They are available as soon as Software Works is on.",
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
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "One pipeline: bind a session, move the stage, hand off the next role.",
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
  "softwareTeamDlc.handoffDone": "Pipeline complete — Writer has the Ship stage.",
  "softwareTeamDlc.handoffCopied": "Next-role starter copied",
  "softwareTeamDlc.noNextRole": "This role has no further handoff.",
  "softwareTeamDlc.moveStage": "Move to {stage}",
  "softwareTeamDlc.removeItem": "Remove from board",
  "softwareTeamDlc.emptyBoard":
    "No work items yet. Add a slice or bind a session to a role.",
  "softwareTeamDlc.openStudio": "Open SDLC Studio from the sidebar (Agents).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
} as const;
