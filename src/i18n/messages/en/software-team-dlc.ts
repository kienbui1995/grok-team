/** English messages — domain: Software Team DLC (opt-in workspace pack) */
export const enSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Team DLC",
  "softwareTeamDlc.uiName": "AI Software DLC",
  "softwareTeamDlc.enable": "Enable Software Team DLC",
  "softwareTeamDlc.enableDesc":
    "Optional workspace pack: AI team roles and SDLC aliases on the existing Agent Kanban. Off by default. Does not rebrand the app or spawn extra CLI agents.",
  "softwareTeamDlc.optInNote":
    "This is a downloadable-content mode for Grok Build — not a second agent runtime.",
  "softwareTeamDlc.noSkinAutoApply":
    "Appearance skins are never applied automatically. Choose a .grokskin in Settings → Appearance if you want one.",
  "softwareTeamDlc.sharedHomeNote":
    "Shared session data (GROK_HOME=~/.grok) is never rewritten. Presets stay in the app unless you install them into a project or Independent agent-home.",
  "softwareTeamDlc.rosterTitle": "Team roster",
  "softwareTeamDlc.rosterHint":
    "One Grok Build session per role. Copy a starter into the composer, or tag a Kanban card. Use attach-chat when sessions need each other’s context.",
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
    "Aliases on Needs you / Working / Done. Cards still move by live agent run state — this pack does not invent a new board.",
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
  "softwareTeamDlc.clearTag": "Clear team tag",
  "softwareTeamDlc.packTitle": "Pack templates",
  "softwareTeamDlc.packHint":
    "Agent, skill, and workflow presets are bundled in the app. They are available as soon as the DLC is on.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "The pack does not start parallel CLI agents. Team = tagged sessions + attach-chat.",
  "softwareTeamDlc.honesty.grokBuildOnly":
    "Workbench and Remote IM still control Grok Build only.",
  "softwareTeamDlc.kanbanHint":
    "SDLC aliases are labels on the live agent board. Right-click a card to assign a role.",
  "softwareTeamDlc.install.blockedShared":
    "Cannot write user-home templates while session data is Shared — that would rewrite ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Select a project folder to install templates under that project’s .grok directory.",
  "softwareTeamDlc.install.independentOk":
    "Independent mode may write templates to the App agent-home (not ~/.grok).",
} as const;
