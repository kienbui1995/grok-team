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
    "Ship is locked until this delivery has Reviewer and QA notes.",
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
    "Notes saved. Ship unlocks when this delivery has both Reviewer and QA notes.",
  "softwareTeamDlc.startDelivery": "Start a delivery",
  "softwareTeamDlc.startDeliveryHint":
    "Create a pipeline item and open a Grok Build session with the role starter. Optional docs/sdlc placeholders stay in this project folder — never ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Slice title",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "What are we shipping?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Name the slice before starting.",
  "softwareTeamDlc.startDeliveryRole": "First role",
  "softwareTeamDlc.startDeliveryBootstrap": "Add docs/sdlc placeholders",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Writes spec.md, design.md, and review.md under this project’s docs/sdlc if they are missing. Needs the desktop Host and a project folder.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Select a project folder to write docs/sdlc placeholders.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "Workspace placeholders need the desktop Host. This preview will not pretend to write them.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Cannot bootstrap into shared ~/.grok. Choose a project folder.",
  "softwareTeamDlc.startDeliveryHostError": "Could not write placeholders: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "Wrote {n} docs/sdlc placeholder files in the project.",
  "softwareTeamDlc.startDeliveryBootstrapSkip":
    "Skipped workspace placeholders.",
  "softwareTeamDlc.startDeliveryStarted": "Delivery started.",
  "softwareTeamDlc.handoffCta": "Handoff to {role}",
  "softwareTeamDlc.shipCta": "Ship · Writer starter",
  "softwareTeamDlc.sessionDoneHint":
    "Session finished. Hand off or Ship — the board does not auto-advance.",
  "softwareTeamDlc.attachSeeded":
    "Seeded {n} attach-chat sessions on the composer draft (max 3).",
  "softwareTeamDlc.addTeammateGroup": "Add team session",
  "softwareTeamDlc.addTeammate": "Add {role} session",
  "softwareTeamDlc.attachedHint":
    "{n} team chats on this delivery (attach-chat, max 3)",
  "softwareTeamDlc.pipelineFileOk":
    "Pipeline saved in this project (.grok/software-works.json).",
  "softwareTeamDlc.pipelineFileMissing":
    "No project pipeline file yet. The next change writes .grok/software-works.json.",
  "softwareTeamDlc.pipelineFileCache":
    "No project Host write — pipeline stays in this app cache only.",
  "softwareTeamDlc.pipelineFileNeedHost":
    "Project pipeline needs the desktop Host. This preview will not pretend to save it.",
  "softwareTeamDlc.pipelineFileNeedProject":
    "Select a project folder to save the pipeline in the repo.",
  "softwareTeamDlc.pipelineFileBlockedHome":
    "Cannot write the pipeline into shared ~/.grok.",
  "softwareTeamDlc.pipelineFileParseFail":
    "Project pipeline file is unreadable. Left it untouched (backup {file}). Using the app cache.",
  "softwareTeamDlc.pipelineFileHostError": "Could not save project pipeline: {error}",
  "softwareTeamDlc.deliveryFilter": "Delivery",
  "softwareTeamDlc.deliveryFilterAll": "All deliveries",
  "softwareTeamDlc.deliveryUnscoped": "Ungrouped",
  "softwareTeamDlc.roleHistory": "Roles: {roles}",
  "softwareTeamDlc.openSdlcDocs": "Open docs/sdlc",
  "softwareTeamDlc.openSdlcDoc": "Open {file}",
  "softwareTeamDlc.openSdlcDocOpened": "Opened the file in the editor.",
  "softwareTeamDlc.openSdlcDocCopied":
    "Path copied. Host did not open an editor for this file.",
  "softwareTeamDlc.openSdlcDocMissing": "That docs/sdlc file is not in this project.",
  "softwareTeamDlc.openSdlcDocNeedHost": "Open in editor needs the desktop Host.",
  "softwareTeamDlc.openSdlcDocNeedProject":
    "Select a project folder to open docs/sdlc files.",
  "softwareTeamDlc.openSdlcDocBlockedHome":
    "Cannot open docs/sdlc from shared ~/.grok.",
  "softwareTeamDlc.openSdlcDocHostError": "Could not open the file: {error}",
  "softwareTeamDlc.deliveryDetail": "Delivery",
  "softwareTeamDlc.deliveryDetailHint":
    "Title, shared slice refs, role history, Review/QA notes (delivery-wide Ship), next step, docs/sdlc, and sessions on this slice.",
  "softwareTeamDlc.openDelivery": "Open delivery",
  "softwareTeamDlc.deliverySessions": "Sessions on this delivery",
  "softwareTeamDlc.deliveryNoSessions": "No bound sessions yet.",
  "softwareTeamDlc.activityLog": "Activity",
  "softwareTeamDlc.activityEmpty": "No activity recorded yet.",
  "softwareTeamDlc.activity.item_added": "Added a work item",
  "softwareTeamDlc.activity.stage_changed": "Moved stage",
  "softwareTeamDlc.activity.handoff": "Handed off",
  "softwareTeamDlc.activity.notes": "Updated notes",
  "softwareTeamDlc.activity.delivery_started": "Started this delivery",
  "softwareTeamDlc.pipelineFileReloaded":
    "Project pipeline file is newer — board updated.",
  "softwareTeamDlc.notesEmpty": "None yet",
  "softwareTeamDlc.searchTitle": "Search by title",
  "softwareTeamDlc.stageFilter": "Stage",
  "softwareTeamDlc.stageFilterAll": "All stages",
  "softwareTeamDlc.roleFilter": "Role",
  "softwareTeamDlc.roleFilterAll": "All roles",
  "softwareTeamDlc.showArchived": "Show archived",
  "softwareTeamDlc.archiveDelivery": "Archive delivery",
  "softwareTeamDlc.unarchiveDelivery": "Unarchive delivery",
  "softwareTeamDlc.archived": "Archived. Hidden from the default board.",
  "softwareTeamDlc.unarchived": "Delivery is on the board again.",
  "softwareTeamDlc.activity.archived": "Archived",
  "softwareTeamDlc.activity.unarchived": "Unarchived",
  "softwareTeamDlc.exportSummary": "Export summary",
  "softwareTeamDlc.exportOk": "Wrote {file} in this project.",
  "softwareTeamDlc.exportNeedHost":
    "Export needs the desktop Host. This preview will not pretend to write it.",
  "softwareTeamDlc.exportNeedProject":
    "Select a project folder to export docs/sdlc.",
  "softwareTeamDlc.exportBlockedHome":
    "Cannot export a delivery summary into shared ~/.grok.",
  "softwareTeamDlc.exportBadSlug": "That delivery title cannot become a file name.",
  "softwareTeamDlc.exportHostError": "Could not export the summary: {error}",
  "softwareTeamDlc.pipelineFileConflict":
    "Project pipeline file changed elsewhere. Left it untouched. Your board stays in the app. Next save writes a backup {file} instead of replacing the file.",
  "softwareTeamDlc.undo": "Undo last change",
  "softwareTeamDlc.undone": "Last board change undone.",
  "softwareTeamDlc.undoEmpty": "Nothing to undo.",
  "softwareTeamDlc.removeItemConfirm": "Remove this card?",
  "softwareTeamDlc.removeItemConfirmBody":
    "Remove “{title}” from the SDLC board. The Grok Build session stays. Undo can restore the card in this window.",
  "softwareTeamDlc.removeItemConfirmAction": "Remove card",
  "softwareTeamDlc.gitBranch": "Git branch label",
  "softwareTeamDlc.gitBranchPlaceholder": "feat/slice-name",
  "softwareTeamDlc.gitBranchHint":
    "A label only. Software Works does not create a worktree, check out a branch, or rewrite ~/.grok.",
  "softwareTeamDlc.gitBranchSave": "Save branch label",
  "softwareTeamDlc.gitBranchSaved": "Branch label saved on this delivery.",
  "softwareTeamDlc.gitBranchInvalid":
    "Use letters, digits, '.', '_' or '-' and '/' — no spaces, no leading dash.",
  "softwareTeamDlc.gitBranchSuggest": "Suggest from title",
  "softwareTeamDlc.gitBranchCopy": "Copy branch label",
  "softwareTeamDlc.gitBranchCopied": "Branch label copied.",
  "softwareTeamDlc.activity.item_removed": "Removed a work item",
  "softwareTeamDlc.activity.git_branch": "Updated git branch label",
  "softwareTeamDlc.redo": "Redo",
  "softwareTeamDlc.redone": "Board change redone.",
  "softwareTeamDlc.redoEmpty": "Nothing to redo.",
  "softwareTeamDlc.duplicateDelivery": "Duplicate delivery",
  "softwareTeamDlc.duplicateSuffix": " (copy)",
  "softwareTeamDlc.duplicated": "Delivery duplicated. New cards are unbound.",
  "softwareTeamDlc.duplicateFailed": "Could not duplicate this delivery.",
  "softwareTeamDlc.deliveryName": "Delivery name",
  "softwareTeamDlc.deliveryRename": "Save name",
  "softwareTeamDlc.deliveryRenamed": "Delivery name saved.",
  "softwareTeamDlc.deliveryRenameNeedTitle": "Name the delivery before saving.",
  "softwareTeamDlc.activity.delivery_renamed": "Renamed this delivery",
  "softwareTeamDlc.activity.delivery_duplicated": "Duplicated a delivery",
  "softwareTeamDlc.bindThisChat": "Bind this chat",
  "softwareTeamDlc.bindThisChatDone": "This chat is bound to the card.",
  "softwareTeamDlc.bindThisChatNeedSession": "Open a chat first, then bind it.",
  "softwareTeamDlc.bindThisChatAlready": "This chat is already on this card.",
  "softwareTeamDlc.unbindSessionDone": "Session unbound. The chat stays.",
  "softwareTeamDlc.moveToDelivery": "Move to delivery",
  "softwareTeamDlc.movedToDelivery": "Card moved to {title}.",
  "softwareTeamDlc.movedUngrouped": "Card is ungrouped.",
  "softwareTeamDlc.activity.item_moved": "Moved to another delivery",
  "softwareTeamDlc.activity.session_bound": "Bound a session",
  "softwareTeamDlc.activity.session_unbound": "Unbound a session",
  "softwareTeamDlc.missingRoles": "Missing team sessions: {roles}",
  "softwareTeamDlc.teamComplete":
    "Product, Architect, Engineer, Reviewer, QA, and Writer cards are on this delivery.",
  "softwareTeamDlc.addSdlcDocs": "Add missing docs/sdlc files",
  "softwareTeamDlc.sliceRefsHint":
    "Plan, goal, and artifact are shared across every card on this delivery. Saving updates all of them.",
  "softwareTeamDlc.sliceRefsSaved": "Slice refs saved on every card in this delivery.",
  "softwareTeamDlc.saveSliceRefs": "Save slice refs",
  "softwareTeamDlc.copySummary": "Copy summary",
  "softwareTeamDlc.copySummaryOk": "Summary copied.",
  "softwareTeamDlc.copySummaryFailed": "Could not copy the summary.",
  "softwareTeamDlc.exportCopiedInstead":
    "Copied the summary. No project file was written.",
  "softwareTeamDlc.handoffKept":
    "Opened {role}. This card stays {from}.",
  "softwareTeamDlc.handoffCreated":
    "Added a {role} card. This card stays {from}.",
  "softwareTeamDlc.shipKept":
    "Opened Writer. This card stays {from}.",
  "softwareTeamDlc.conflictTitle": "Project pipeline conflict",
  "softwareTeamDlc.conflictBody":
    "This project’s pipeline file changed while this board still has unsaved edits. Choose which copy to keep. The other copy can stay in {file}.",
  "softwareTeamDlc.conflictUseFile": "Use project file",
  "softwareTeamDlc.conflictKeepBoard": "Keep this board",
  "softwareTeamDlc.conflictUsedFile": "Board replaced from the project file.",
  "softwareTeamDlc.conflictKeptBoard":
    "This board was written to the project file. The other copy is in {file}.",
  "softwareTeamDlc.conflictKeepFailed":
    "Could not write this board over the project file.",
} as const;
