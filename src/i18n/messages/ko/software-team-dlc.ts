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
    "Reviewer와 QA 메모를 저장하기 전까지 Ship이 잠깁니다.",
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
    "메모를 저장했습니다. Reviewer와 QA 메모가 모두 있으면 Ship이 열립니다.",
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
} as const;
