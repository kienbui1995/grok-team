/** ru messages — domain: Software Works / SDLC Studio */
export const ruSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Включить Software Works",
  "softwareTeamDlc.enableDesc":
    "Когда включено, панель агентов — это SDLC-студия: состав, доска конвейера и передача ролей на Grok Build. По умолчанию выкл. Не меняет бренд приложения, пока выкл., и не запускает лишние CLI-агенты.",
  "softwareTeamDlc.optInNote":
    "Software Works — редакция поставки ПО для Grok Build, а не вторая среда агентов.",
  "softwareTeamDlc.noSkinAutoApply":
    "Облики не применяются сами. Выберите .grokskin в Настройки → Оформление, если нужен.",
  "softwareTeamDlc.sharedHomeNote":
    "Общие данные сессий (GROK_HOME=~/.grok) никогда не перезаписываются. Заготовки остаются в приложении, пока вы не установите их в проект или независимое agent-home.",
  "softwareTeamDlc.rosterTitle": "Состав команды",
  "softwareTeamDlc.rosterHint":
    "Одна сессия Grok Build на роль. Откройте карточку — стартер роли попадёт в поле ввода. Передача двигает следующую роль и загружает её стартер туда же.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Объём, приёмка и бэклог. Передаёт один отгружаемый срез.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Дизайн под этот репозиторий: модули, риски и конкретный план Build.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "Реализуйте согласованный срез. Держите стиль репозитория. Кратко опишите проверку.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "Просмотрите diff. Обязательные правки и мелочи. Не переписывайте без просьбы.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Тест-кейсы, команды и честный pass/fail. Никаких выдуманных прогонов в браузере.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Вики и i18n только если изменение этого требует. Идентификаторы оставляйте точными.",
  "softwareTeamDlc.slashHint": "Подсказка слэша: {slash}",
  "softwareTeamDlc.copyStarter": "Копировать стартер",
  "softwareTeamDlc.copied": "Скопировано",
  "softwareTeamDlc.copyFailed": "Не удалось скопировать — выделите стартер и скопируйте вручную.",
  "softwareTeamDlc.sdlcTitle": "Этапы SDLC",
  "softwareTeamDlc.sdlcHint":
    "Доска студии (Backlog → Design → Build → Review → Ship) — источник истины. Живые колонки агентов остаются справочными.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (простой)",
  "softwareTeamDlc.assignRole": "Назначить роль",
  "softwareTeamDlc.assignStage": "Назначить этап SDLC",
  "softwareTeamDlc.clearTag": "Отвязать сессию",
  "softwareTeamDlc.packTitle": "Шаблоны ролей",
  "softwareTeamDlc.packHint":
    "Заготовки в приложении. Установка пишет 6 агентов, 6 навыков и team-handoff.rhai в .grok проекта или независимый agent-home — общий ~/.grok не трогает.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Не запускает параллельные CLI-агенты. Команда = привязанные сессии + attach-chat + стартеры передачи.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Верстак и Remote IM по-прежнему управляют только Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio — это конвейер. Правый щелчок по карточке меняет этап или передаёт следующую роль.",
  "softwareTeamDlc.install.blockedShared":
    "Нельзя писать шаблоны в домашний каталог пользователя в общем режиме — это перезаписало бы ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Выберите папку проекта, чтобы установить шаблоны в его каталог .grok.",
  "softwareTeamDlc.install.independentOk":
    "Независимый режим может писать шаблоны в agent-home приложения (не ~/.grok).",
  "softwareTeamDlc.install.action": "Установить пакет ролей",
  "softwareTeamDlc.install.installing": "Установка пакета…",
  "softwareTeamDlc.install.ok": "Установлено файлов пакета: {n} ({target}).",
  "softwareTeamDlc.install.targetProject": ".grok проекта",
  "softwareTeamDlc.install.targetUser": "независимый agent-home",
  "softwareTeamDlc.install.needHost":
    "Установка нужна настольному Host. Этот предпросмотр не пишет файлы и не притворяется успехом.",
  "softwareTeamDlc.install.hostError": "Установка не удалась: {error}",
  "softwareTeamDlc.install.chooseTarget": "Куда ставить",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Привяжите или создайте сессию, загрузите стартер в поле ввода, сдвиньте этап, передайте следующую роль.",
  "softwareTeamDlc.pipelineTitle": "Конвейер",
  "softwareTeamDlc.liveAgents": "Живые агенты",
  "softwareTeamDlc.addItem": "Добавить элемент",
  "softwareTeamDlc.editItem": "Изменить элемент",
  "softwareTeamDlc.itemTitle": "Название",
  "softwareTeamDlc.itemTitlePlaceholder": "Имя среза",
  "softwareTeamDlc.planRef": "План",
  "softwareTeamDlc.goalRef": "Цель",
  "softwareTeamDlc.artifactRef": "Артефакт",
  "softwareTeamDlc.planPlaceholder": "План или заметка /plan",
  "softwareTeamDlc.goalPlaceholder": "Цель или заметка /goal",
  "softwareTeamDlc.artifactPlaceholder": "PR, путь или поставка",
  "softwareTeamDlc.bindSession": "Привязать сессию",
  "softwareTeamDlc.unbound": "Нет сессии",
  "softwareTeamDlc.sessionLabel": "Сессия",
  "softwareTeamDlc.handoff": "Передать",
  "softwareTeamDlc.handoffTo": "Передать {role}",
  "softwareTeamDlc.handoffDone":
    "Конвейер завершён — Tech Writer последняя роль. Для Ship всё ещё нужны заметки Reviewer и QA.",
  "softwareTeamDlc.handoffCopied": "Стартер следующей роли скопирован",
  "softwareTeamDlc.handoffLoaded": "Стартер следующей роли в поле ввода.",
  "softwareTeamDlc.openInComposer": "Открыть в поле ввода",
  "softwareTeamDlc.createAndOpen": "Создать сессию и открыть",
  "softwareTeamDlc.saveAndOpen": "Сохранить и открыть",
  "softwareTeamDlc.starterLoaded": "Стартер роли в поле ввода.",
  "softwareTeamDlc.needHostCreate":
    "Без Host сессию не создать. Привяжите существующую или откройте настольное приложение.",
  "softwareTeamDlc.createFailed": "Не удалось создать сессию: {error}",
  "softwareTeamDlc.planChromeSet": "Заметка плана прикреплена к этой сессии.",
  "softwareTeamDlc.planChromeSkipped":
    "Поле плана остаётся на карточке. Host не записал план-хром.",
  "softwareTeamDlc.slashAfterInstall":
    "После установки пакета /team-* вставляет чип навыка. До этого откройте сессию с доски.",
  "softwareTeamDlc.noNextRole": "У этой роли нет дальнейшей передачи.",
  "softwareTeamDlc.moveStage": "Переместить в {stage}",
  "softwareTeamDlc.removeItem": "Убрать с доски",
  "softwareTeamDlc.emptyBoard":
    "Пока нет элементов. Добавьте срез или привяжите сессию к роли.",
  "softwareTeamDlc.openStudio": "Откройте SDLC Studio в боковой панели (Агенты).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "На этой цели {n} из {total} файлов пакета.",
  "softwareTeamDlc.install.status.missing":
    "На этой цели не хватает {n} файлов пакета.",
  "softwareTeamDlc.install.status.checking":
    "Проверяем файлы пакета на выбранной цели…",
  "softwareTeamDlc.install.repair": "Дописать недостающие файлы",
  "softwareTeamDlc.install.repairing": "Идёт восстановление пакета…",
  "softwareTeamDlc.install.repaired": "Записано {n} недостающих файлов пакета.",
  "softwareTeamDlc.install.repairNone":
    "Восстанавливать нечего — файлы пакета уже на месте.",
  "softwareTeamDlc.goalModeSet": "Режим цели включён для этого черновика.",
  "softwareTeamDlc.goalModeSkipped":
    "Цель остаётся на карточке. У Host нет API создания цели.",
  "softwareTeamDlc.shipLocked":
    "Ship заблокирован, пока не сохранены заметки Reviewer и QA.",
  "softwareTeamDlc.shipNeedReviewer": "Этот срез не прошёл через Reviewer.",
  "softwareTeamDlc.shipNeedQa": "Этот срез не прошёл через QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Сохраните заметки Reviewer перед Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Сохраните заметки QA перед Ship.",
  "softwareTeamDlc.markReviewNote": "Записать заметки Reviewer",
  "softwareTeamDlc.markQaNote": "Записать заметки QA",
  "softwareTeamDlc.reviewNote": "Заметки Reviewer",
  "softwareTeamDlc.qaNote": "Заметки QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, обязательные правки и мелочи, риск.",
  "softwareTeamDlc.qaNotePlaceholder": "Случаи, команды, успех/провал.",
  "softwareTeamDlc.notesSaved":
    "Заметки сохранены. Ship откроется, когда будут и Reviewer, и QA.",
  "softwareTeamDlc.startDelivery": "Начать поставку",
  "softwareTeamDlc.startDeliveryHint":
    "Создаёт элемент конвейера и открывает сессию Grok Build со стартером роли. Заготовки docs/sdlc только в папке этого проекта — не в ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Название среза",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "Что поставляем?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Сначала назовите срез.",
  "softwareTeamDlc.startDeliveryRole": "Первая роль",
  "softwareTeamDlc.startDeliveryBootstrap": "Добавить заготовки docs/sdlc",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Пишет spec.md, design.md и review.md в docs/sdlc этого проекта, если их нет. Нужны десктопный Host и папка проекта.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Выберите папку проекта, чтобы писать docs/sdlc.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "Заготовки рабочей области требуют десктопный Host. Этот предпросмотр не притворяется, что записал их.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Нельзя писать в общий ~/.grok. Выберите папку проекта.",
  "softwareTeamDlc.startDeliveryHostError": "Не удалось записать заготовки: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "В проекте записано {n} файлов docs/sdlc.",
  "softwareTeamDlc.startDeliveryBootstrapSkip": "Заготовки рабочей области пропущены.",
  "softwareTeamDlc.startDeliveryStarted": "Поставка начата.",
  "softwareTeamDlc.handoffCta": "Передать {role}",
  "softwareTeamDlc.shipCta": "Ship · стартер Writer",
  "softwareTeamDlc.sessionDoneHint":
    "Сессия завершена. Передайте или Ship — доска сама не двигается.",
  "softwareTeamDlc.attachSeeded":
    "В черновик добавлено {n} сессий attach-chat (макс. 3).",
  "softwareTeamDlc.addTeammateGroup": "Добавить сессию команды",
  "softwareTeamDlc.addTeammate": "Добавить сессию {role}",
  "softwareTeamDlc.attachedHint":
    "{n} командных чатов в этой поставке (attach-chat, макс. 3)",
} as const;
