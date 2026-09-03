/** ko messages — domain: Software Works / SDLC Studio */
export const koSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Software Works 사용",
  "softwareTeamDlc.enableDesc":
    "켜면 에이전트 칸이 SDLC 스튜디오가 됩니다. 로스터, 파이프라인 보드, 역할 핸드오프는 Grok Build 위에서만 동작합니다. 기본은 끔. 꺼져 있을 때는 앱을 리브랜드하지 않으며 추가 CLI 에이전트를 켜지 않습니다.",
  "softwareTeamDlc.optInNote":
    "Software Works는 Grok Build용 소프트웨어 납품 에디션입니다. 두 번째 에이전트 런타임이 아닙니다.",
  "softwareTeamDlc.noSkinAutoApply":
    "모양 스킨은 자동 적용되지 않습니다. 필요하면 설정 → 모양에서 .grokskin을 고르세요.",
  "softwareTeamDlc.sharedHomeNote":
    "공유 세션 데이터(GROK_HOME=~/.grok)는 다시 쓰지 않습니다. 프리셋은 앱 안에 있고, 프로젝트나 독립 agent-home에 설치할 때만 디스크에 나갑니다.",
  "softwareTeamDlc.rosterTitle": "팀 로스터",
  "softwareTeamDlc.rosterHint":
    "역할마다 Grok Build 세션 하나. 카드를 열면 역할 스타터가 입력창에 들어갑니다. 핸드오프는 다음 역할로 넘기고 그 스타터를 입력창에 넣습니다.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "범위, 수락, 백로그. 출고 가능한 한 조각을 넘깁니다.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "이 저장소에 맞는 설계: 모듈, 위험, 구체적인 Build 계획.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "합의된 조각을 구현합니다. 기존 스타일을 맞추고 검증 방법을 요약합니다.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "디프를 검토합니다. 필수 수정과 nits. 요청 없으면 다시 쓰지 않습니다.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "테스트 케이스, 명령, 정직한 합격/실패. 지어낸 브라우저 실행은 없습니다.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "변경이 필요할 때만 위키와 i18n. 식별자는 그대로 둡니다.",
  "softwareTeamDlc.slashHint": "슬래시 힌트: {slash}",
  "softwareTeamDlc.copyStarter": "스타터 복사",
  "softwareTeamDlc.copied": "복사됨",
  "softwareTeamDlc.copyFailed": "복사하지 못했습니다 — 스타터를 선택한 뒤 직접 복사하세요.",
  "softwareTeamDlc.sdlcTitle": "SDLC 단계",
  "softwareTeamDlc.sdlcHint":
    "스튜디오 보드(Backlog → Design → Build → Review → Ship)가 단일 진실입니다. 실시간 에이전트 열은 참고용입니다.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog(유휴)",
  "softwareTeamDlc.assignRole": "역할 지정",
  "softwareTeamDlc.assignStage": "SDLC 단계 지정",
  "softwareTeamDlc.clearTag": "세션 연결 해제",
  "softwareTeamDlc.packTitle": "역할 템플릿",
  "softwareTeamDlc.packHint":
    "프리셋은 앱에 들어 있습니다. 설치는 에이전트 6개, 스킬 6개, team-handoff.rhai를 프로젝트 .grok 또는 독립 agent-home에 쓰며 공유 ~/.grok는 건드리지 않습니다.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "병렬 CLI 에이전트를 시작하지 않습니다. 팀 = 묶인 세션 + attach-chat + 핸드오프 스타터.",
  "softwareTeamDlc.honesty.grokBuildOnly": "워크벤치와 Remote IM은 여전히 Grok Build만 제어합니다.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio가 파이프라인입니다. 카드를 오른쪽 클릭해 단계를 옮기거나 다음 역할로 넘기세요.",
  "softwareTeamDlc.install.blockedShared":
    "세션 데이터가 공유일 때는 사용자 홈에 쓸 수 없습니다 — ~/.grok를 다시 쓰게 됩니다.",
  "softwareTeamDlc.install.needProject":
    "해당 프로젝트의 .grok에 템플릿을 넣으려면 프로젝트 폴더를 선택하세요.",
  "softwareTeamDlc.install.independentOk":
    "독립 모드는 앱 agent-home에 쓸 수 있습니다(~/.grok 아님).",
  "softwareTeamDlc.install.action": "역할 팩 설치",
  "softwareTeamDlc.install.installing": "팩 설치 중…",
  "softwareTeamDlc.install.ok": "팩 파일 {n}개를 설치했습니다({target}).",
  "softwareTeamDlc.install.targetProject": "프로젝트 .grok",
  "softwareTeamDlc.install.targetUser": "독립 agent-home",
  "softwareTeamDlc.install.needHost":
    "설치에는 데스크톱 Host가 필요합니다. 이 미리보기는 파일을 쓰지 않으며 성공한 척하지 않습니다.",
  "softwareTeamDlc.install.hostError": "설치 실패: {error}",
  "softwareTeamDlc.install.chooseTarget": "설치 대상",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "세션을 묶거나 만들고, 역할 스타터를 입력창에 넣고, 단계를 옮기고, 다음 역할로 넘깁니다.",
  "softwareTeamDlc.pipelineTitle": "파이프라인",
  "softwareTeamDlc.liveAgents": "실시간 에이전트",
  "softwareTeamDlc.addItem": "작업 항목 추가",
  "softwareTeamDlc.editItem": "작업 항목 편집",
  "softwareTeamDlc.itemTitle": "제목",
  "softwareTeamDlc.itemTitlePlaceholder": "슬라이스 이름",
  "softwareTeamDlc.planRef": "계획",
  "softwareTeamDlc.goalRef": "목표",
  "softwareTeamDlc.artifactRef": "산출물",
  "softwareTeamDlc.planPlaceholder": "계획 또는 /plan 메모",
  "softwareTeamDlc.goalPlaceholder": "목표 또는 /goal 메모",
  "softwareTeamDlc.artifactPlaceholder": "PR, 경로, 산출물",
  "softwareTeamDlc.bindSession": "세션 묶기",
  "softwareTeamDlc.unbound": "세션 없음",
  "softwareTeamDlc.sessionLabel": "세션",
  "softwareTeamDlc.handoff": "넘기기",
  "softwareTeamDlc.handoffTo": "{role}에게 넘기기",
  "softwareTeamDlc.handoffDone":
    "파이프라인 완료 — Tech Writer가 마지막 역할입니다. Ship에는 Reviewer와 QA 메모가 필요합니다.",
  "softwareTeamDlc.handoffCopied": "다음 역할 스타터를 복사했습니다",
  "softwareTeamDlc.handoffLoaded": "다음 역할 스타터가 입력창에 있습니다.",
  "softwareTeamDlc.openInComposer": "입력창에서 열기",
  "softwareTeamDlc.createAndOpen": "세션을 만들고 열기",
  "softwareTeamDlc.saveAndOpen": "저장하고 열기",
  "softwareTeamDlc.starterLoaded": "역할 스타터가 입력창에 있습니다.",
  "softwareTeamDlc.needHostCreate":
    "Host 없이는 세션을 만들 수 없습니다. 기존 세션을 묶거나 데스크톱 앱을 여세요.",
  "softwareTeamDlc.createFailed": "세션을 만들지 못했습니다: {error}",
  "softwareTeamDlc.planChromeSet": "이 세션에 계획 메모를 붙였습니다.",
  "softwareTeamDlc.planChromeSkipped":
    "계획 필드는 카드에 남습니다. Host가 계획 표시줄을 쓰지 않았습니다.",
  "softwareTeamDlc.slashAfterInstall":
    "팩 설치 후 /team-* 는 스킬 칩을 넣습니다. 그전에는 보드에서 세션을 여세요.",
  "softwareTeamDlc.noNextRole": "이 역할에는 더 이상 핸드오프가 없습니다.",
  "softwareTeamDlc.moveStage": "{stage}(으)로 이동",
  "softwareTeamDlc.removeItem": "보드에서 제거",
  "softwareTeamDlc.emptyBoard":
    "아직 작업 항목이 없습니다. 슬라이스를 추가하거나 세션을 역할에 묶으세요.",
  "softwareTeamDlc.openStudio": "사이드바(에이전트)에서 SDLC Studio를 여세요.",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "이 대상에 팩 파일이 {n} / {total}개 있습니다.",
  "softwareTeamDlc.install.status.missing":
    "이 대상에 팩 파일이 {n}개 없습니다.",
  "softwareTeamDlc.install.status.checking":
    "선택한 대상의 팩 파일을 확인하는 중…",
  "softwareTeamDlc.install.repair": "빠진 파일 복구",
  "softwareTeamDlc.install.repairing": "복구 중…",
  "softwareTeamDlc.install.repaired": "빠진 팩 파일 {n}개를 썼습니다.",
  "softwareTeamDlc.install.repairNone":
    "복구할 항목 없음 — 팩 파일이 이미 있습니다.",
  "softwareTeamDlc.goalModeSet": "이 초안에 Goal 모드를 켰습니다.",
  "softwareTeamDlc.goalModeSkipped":
    "Goal은 카드에 남습니다. Host에 Goal 생성 API가 없습니다.",
  "softwareTeamDlc.shipLocked":
    "이 딜리버리에 Reviewer와 QA 메모가 있을 때까지 Ship이 잠깁니다.",
  "softwareTeamDlc.shipNeedReviewer": "이 슬라이스는 Reviewer를 거치지 않았습니다.",
  "softwareTeamDlc.shipNeedQa": "이 슬라이스는 QA를 거치지 않았습니다.",
  "softwareTeamDlc.shipNeedReviewNote": "Ship 전에 Reviewer 메모를 저장하세요.",
  "softwareTeamDlc.shipNeedQaNote": "Ship 전에 QA 메모를 저장하세요.",
  "softwareTeamDlc.markReviewNote": "Reviewer 메모 작성",
  "softwareTeamDlc.markQaNote": "QA 메모 작성",
  "softwareTeamDlc.reviewNote": "Reviewer 메모",
  "softwareTeamDlc.qaNote": "QA 메모",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, 필수 수정과 nits, 위험.",
  "softwareTeamDlc.qaNotePlaceholder": "케이스, 명령, 합격/불합격.",
  "softwareTeamDlc.notesSaved":
    "메모를 저장했습니다. 이 딜리버리에 Reviewer와 QA 메모가 모두 있으면 Ship이 열립니다.",
  "softwareTeamDlc.startDelivery": "딜리버리 시작",
  "softwareTeamDlc.startDeliveryHint":
    "파이프라인 항목을 만들고 역할 스타터와 함께 Grok Build 세션을 엽니다. docs/sdlc 자리 표시자는 이 프로젝트 폴더에만 쓰며 ~/.grok 에는 쓰지 않습니다.",
  "softwareTeamDlc.startDeliveryTitle": "슬라이스 제목",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "무엇을 출시할까요?",
  "softwareTeamDlc.startDeliveryNeedTitle": "시작하기 전에 슬라이스 이름을 넣으세요.",
  "softwareTeamDlc.startDeliveryRole": "첫 역할",
  "softwareTeamDlc.startDeliveryBootstrap": "docs/sdlc 자리 표시자 추가",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "없으면 이 프로젝트의 docs/sdlc 에 spec.md, design.md, review.md 를 씁니다. 데스크톱 Host 와 프로젝트 폴더가 필요합니다.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "docs/sdlc 를 쓰려면 프로젝트 폴더를 고르세요.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "워크스페이스 자리 표시자는 데스크톱 Host 가 필요합니다. 이 미리보기는 쓴 척하지 않습니다.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "공유 ~/.grok 에는 부트스트랩할 수 없습니다. 프로젝트 폴더를 고르세요.",
  "softwareTeamDlc.startDeliveryHostError": "자리 표시자를 쓰지 못했습니다: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "프로젝트에 docs/sdlc 자리 표시자 {n}개를 썼습니다.",
  "softwareTeamDlc.startDeliveryBootstrapSkip": "워크스페이스 자리 표시자를 건너뛰었습니다.",
  "softwareTeamDlc.startDeliveryStarted": "딜리버리를 시작했습니다.",
  "softwareTeamDlc.handoffCta": "{role}에게 넘기기",
  "softwareTeamDlc.shipCta": "Ship · Writer 스타터",
  "softwareTeamDlc.sessionDoneHint":
    "세션이 끝났습니다. 넘기거나 Ship — 보드는 자동으로 진행하지 않습니다.",
  "softwareTeamDlc.attachSeeded":
    "초안에 attach-chat 세션 {n}개를 심었습니다(최대 3).",
  "softwareTeamDlc.addTeammateGroup": "팀 세션 추가",
  "softwareTeamDlc.addTeammate": "{role} 세션 추가",
  "softwareTeamDlc.attachedHint":
    "이 딜리버리에 팀 채팅 {n}개(attach-chat, 최대 3)",
  "softwareTeamDlc.pipelineFileOk":
    "파이프라인을 이 프로젝트에 저장했습니다(.grok/software-works.json).",
  "softwareTeamDlc.pipelineFileMissing":
    "아직 프로젝트 파이프라인 파일이 없습니다. 다음 변경에서 .grok/software-works.json 을 씁니다.",
  "softwareTeamDlc.pipelineFileCache":
    "프로젝트 Host 쓰기 없음 — 파이프라인은 앱 캐시에만 있습니다.",
  "softwareTeamDlc.pipelineFileNeedHost":
    "프로젝트 파이프라인에는 데스크톱 Host 가 필요합니다. 이 미리보기는 저장한 척하지 않습니다.",
  "softwareTeamDlc.pipelineFileNeedProject":
    "저장소에 파이프라인을 쓰려면 프로젝트 폴더를 고르세요.",
  "softwareTeamDlc.pipelineFileBlockedHome":
    "공유 ~/.grok 에는 파이프라인을 쓸 수 없습니다.",
  "softwareTeamDlc.pipelineFileParseFail":
    "파이프라인 파일을 읽을 수 없습니다. 원본은 그대로 두었습니다(백업 {file}). 앱 캐시를 씁니다.",
  "softwareTeamDlc.pipelineFileHostError": "파이프라인을 저장하지 못했습니다: {error}",
  "softwareTeamDlc.deliveryFilter": "딜리버리",
  "softwareTeamDlc.deliveryFilterAll": "모든 딜리버리",
  "softwareTeamDlc.deliveryUnscoped": "그룹 없음",
  "softwareTeamDlc.roleHistory": "역할: {roles}",
  "softwareTeamDlc.openSdlcDocs": "docs/sdlc 열기",
  "softwareTeamDlc.openSdlcDoc": "{file} 열기",
  "softwareTeamDlc.openSdlcDocOpened": "편집기에서 파일을 열었습니다.",
  "softwareTeamDlc.openSdlcDocCopied":
    "경로를 복사했습니다. Host 가 이 파일용 편집기를 열지 않았습니다.",
  "softwareTeamDlc.openSdlcDocMissing": "해당 docs/sdlc 파일이 이 프로젝트에 없습니다.",
  "softwareTeamDlc.openSdlcDocNeedHost": "편집기에서 열려면 데스크톱 Host 가 필요합니다.",
  "softwareTeamDlc.openSdlcDocNeedProject":
    "docs/sdlc 를 열려면 프로젝트 폴더를 고르세요.",
  "softwareTeamDlc.openSdlcDocBlockedHome":
    "공유 ~/.grok 에서 docs/sdlc 를 열 수 없습니다.",
  "softwareTeamDlc.openSdlcDocHostError": "파일을 열지 못했습니다: {error}",
  "softwareTeamDlc.deliveryDetail": "딜리버리",
  "softwareTeamDlc.deliveryDetailHint":
    "제목, 공유 슬라이스 참조, 역할 이력, Review/QA 메모(딜리버리 전체 Ship), 다음 단계, docs/sdlc, 이 슬라이스의 세션.",
  "softwareTeamDlc.openDelivery": "딜리버리 열기",
  "softwareTeamDlc.deliverySessions": "이 딜리버리의 세션",
  "softwareTeamDlc.deliveryNoSessions": "연결된 세션이 아직 없습니다.",
  "softwareTeamDlc.activityLog": "활동",
  "softwareTeamDlc.activityEmpty": "아직 활동이 없습니다.",
  "softwareTeamDlc.activity.item_added": "작업 항목을 추가했습니다",
  "softwareTeamDlc.activity.stage_changed": "단계를 옮겼습니다",
  "softwareTeamDlc.activity.handoff": "인계했습니다",
  "softwareTeamDlc.activity.notes": "메모를 업데이트했습니다",
  "softwareTeamDlc.activity.delivery_started": "이 딜리버리를 시작했습니다",
  "softwareTeamDlc.pipelineFileReloaded":
    "프로젝트 파이프라인 파일이 더 최신입니다 — 보드를 갱신했습니다.",
  "softwareTeamDlc.notesEmpty": "아직 없음",
  "softwareTeamDlc.searchTitle": "제목으로 검색",
  "softwareTeamDlc.stageFilter": "단계",
  "softwareTeamDlc.stageFilterAll": "모든 단계",
  "softwareTeamDlc.roleFilter": "역할",
  "softwareTeamDlc.roleFilterAll": "모든 역할",
  "softwareTeamDlc.showArchived": "보관됨 표시",
  "softwareTeamDlc.archiveDelivery": "딜리버리 보관",
  "softwareTeamDlc.unarchiveDelivery": "보관 해제",
  "softwareTeamDlc.archived": "보관됨. 기본 보드에서는 숨깁니다.",
  "softwareTeamDlc.unarchived": "딜리버리가 보드에 다시 있습니다.",
  "softwareTeamDlc.activity.archived": "보관함",
  "softwareTeamDlc.activity.unarchived": "보관 해제함",
  "softwareTeamDlc.exportSummary": "요약 내보내기",
  "softwareTeamDlc.exportOk": "이 프로젝트에 {file} 을(를) 썼습니다.",
  "softwareTeamDlc.exportNeedHost":
    "내보내기는 데스크톱 Host 가 필요합니다. 이 미리보기는 쓴 척하지 않습니다.",
  "softwareTeamDlc.exportNeedProject":
    "docs/sdlc 를 내보내려면 프로젝트 폴더를 고르세요.",
  "softwareTeamDlc.exportBlockedHome":
    "공유 ~/.grok 로는 요약을 내보낼 수 없습니다.",
  "softwareTeamDlc.exportBadSlug": "그 제목은 파일 이름이 될 수 없습니다.",
  "softwareTeamDlc.exportHostError": "요약을 내보내지 못했습니다: {error}",
  "softwareTeamDlc.pipelineFileConflict":
    "프로젝트 파이프라인 파일이 다른 곳에서 바뀌었습니다. 그대로 두었습니다. 보드는 앱에 유지됩니다. 다음 저장은 파일을 덮어쓰지 않고 백업 {file} 을(를) 씁니다.",
  "softwareTeamDlc.undo": "마지막 변경 취소",
  "softwareTeamDlc.undone": "보드의 마지막 변경을 취소했습니다.",
  "softwareTeamDlc.undoEmpty": "취소할 내용이 없습니다.",
  "softwareTeamDlc.removeItemConfirm": "이 카드를 제거할까요?",
  "softwareTeamDlc.removeItemConfirmBody": "SDLC 보드에서 “{title}”을(를) 제거합니다. Grok Build 세션은 유지됩니다. 이 창에서 실행 취소로 되돌릴 수 있습니다.",
  "softwareTeamDlc.removeItemConfirmAction": "카드 제거",
  "softwareTeamDlc.gitBranch": "Git 브랜치 라벨",
  "softwareTeamDlc.gitBranchPlaceholder": "feat/slice-name",
  "softwareTeamDlc.gitBranchHint": "라벨만 저장합니다. Software Works는 worktree를 만들지 않고, 체크아웃하지 않으며 ~/.grok를 쓰지 않습니다.",
  "softwareTeamDlc.gitBranchSave": "브랜치 라벨 저장",
  "softwareTeamDlc.gitBranchSaved": "이 딜리버리에 브랜치 라벨을 저장했습니다.",
  "softwareTeamDlc.gitBranchInvalid": "문자, 숫자, '.', '_' 또는 '-'와 '/'만 사용하세요. 공백과 앞쪽 하이픈은 안 됩니다.",
  "softwareTeamDlc.gitBranchSuggest": "제목에서 제안",
  "softwareTeamDlc.gitBranchCopy": "브랜치 라벨 복사",
  "softwareTeamDlc.gitBranchCopied": "브랜치 라벨을 복사했습니다.",
  "softwareTeamDlc.activity.item_removed": "작업 항목을 제거함",
  "softwareTeamDlc.activity.git_branch": "Git 브랜치 라벨을 업데이트함",
  "softwareTeamDlc.redo": "다시 실행",
  "softwareTeamDlc.redone": "보드 변경을 다시 실행했습니다.",
  "softwareTeamDlc.redoEmpty": "다시 실행할 내용이 없습니다.",
  "softwareTeamDlc.duplicateDelivery": "딜리버리 복제",
  "softwareTeamDlc.duplicateSuffix": " (복사본)",
  "softwareTeamDlc.duplicated": "딜리버리를 복제했습니다. 새 카드는 세션에 묶이지 않습니다.",
  "softwareTeamDlc.duplicateFailed": "이 딜리버리를 복제하지 못했습니다.",
  "softwareTeamDlc.deliveryName": "딜리버리 이름",
  "softwareTeamDlc.deliveryRename": "이름 저장",
  "softwareTeamDlc.deliveryRenamed": "딜리버리 이름을 저장했습니다.",
  "softwareTeamDlc.deliveryRenameNeedTitle": "저장하기 전에 이름을 지정하세요.",
  "softwareTeamDlc.activity.delivery_renamed": "딜리버리 이름을 바꿈",
  "softwareTeamDlc.activity.delivery_duplicated": "딜리버리를 복제함",
  "softwareTeamDlc.bindThisChat": "이 채팅 묶기",
  "softwareTeamDlc.bindThisChatDone": "이 채팅을 카드에 묶었습니다.",
  "softwareTeamDlc.bindThisChatNeedSession": "먼저 채팅을 연 다음 묶으세요.",
  "softwareTeamDlc.bindThisChatAlready": "이 채팅은 이미 이 카드에 있습니다.",
  "softwareTeamDlc.unbindSessionDone": "세션 연결을 해제했습니다. 채팅은 그대로입니다.",
  "softwareTeamDlc.moveToDelivery": "딜리버리로 이동",
  "softwareTeamDlc.movedToDelivery": "카드를 {title}(으)로 옮겼습니다.",
  "softwareTeamDlc.movedUngrouped": "카드 그룹을 해제했습니다.",
  "softwareTeamDlc.activity.item_moved": "다른 딜리버리로 이동",
  "softwareTeamDlc.activity.session_bound": "세션을 묶음",
  "softwareTeamDlc.activity.session_unbound": "세션 묶기를 해제",
  "softwareTeamDlc.missingRoles": "빠진 팀 세션: {roles}",
  "softwareTeamDlc.teamComplete":
    "이 딜리버리에 Product, Architect, Engineer, Reviewer, QA, Writer 카드가 있습니다.",
  "softwareTeamDlc.addSdlcDocs": "빠진 docs/sdlc 파일 추가",
  "softwareTeamDlc.sliceRefsHint":
    "계획, 목표, 산출물은 이 딜리버리의 모든 카드에서 공유됩니다. 저장하면 모두 업데이트됩니다.",
  "softwareTeamDlc.sliceRefsSaved": "슬라이스 참조를 이 딜리버리의 모든 카드에 저장했습니다.",
  "softwareTeamDlc.saveSliceRefs": "슬라이스 참조 저장",
  "softwareTeamDlc.copySummary": "요약 복사",
  "softwareTeamDlc.copySummaryOk": "요약을 복사했습니다.",
  "softwareTeamDlc.copySummaryFailed": "요약을 복사하지 못했습니다.",
  "softwareTeamDlc.exportCopiedInstead":
    "요약을 복사했습니다. 프로젝트 파일은 쓰지 않았습니다.",
  "softwareTeamDlc.handoffKept":
    "{role}을(를) 열었습니다. 이 카드는 {from}으로 유지됩니다.",
  "softwareTeamDlc.handoffCreated":
    "{role} 카드를 추가했습니다. 이 카드는 {from}으로 유지됩니다.",
  "softwareTeamDlc.shipKept":
    "Writer를 열었습니다. 이 카드는 {from}으로 유지됩니다.",
  "softwareTeamDlc.conflictTitle": "프로젝트 파이프라인 충돌",
  "softwareTeamDlc.conflictBody":
    "이 보드에 저장되지 않은 변경이 있는 동안 프로젝트 파이프라인 파일이 바뀌었습니다. 어떤 복사본을 유지할지 고르세요. 다른 쪽은 {file}에 둘 수 있습니다.",
  "softwareTeamDlc.conflictUseFile": "프로젝트 파일 사용",
  "softwareTeamDlc.conflictKeepBoard": "이 보드 유지",
  "softwareTeamDlc.conflictUsedFile": "보드를 프로젝트 파일로 바꿨습니다.",
  "softwareTeamDlc.conflictKeptBoard":
    "이 보드를 프로젝트 파일에 썼습니다. 다른 복사본은 {file}에 있습니다.",
  "softwareTeamDlc.conflictKeepFailed":
    "이 보드로 프로젝트 파일을 덮어쓰지 못했습니다.",
} as const;
