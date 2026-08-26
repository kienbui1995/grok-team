/** uk messages — domain: Software Works / SDLC Studio */
export const ukSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Увімкнути Software Works",
  "softwareTeamDlc.enableDesc":
    "Коли увімкнено, панель агентів стає SDLC-студією: склад, дошка конвеєра й передача ролей на Grok Build. Типово вимкнено. Не змінює бренд застосунку, поки вимкнено, і не запускає зайвих CLI-агентів.",
  "softwareTeamDlc.optInNote":
    "Software Works — редакція поставки ПЗ для Grok Build, а не друге середовище агентів.",
  "softwareTeamDlc.noSkinAutoApply":
    "Скіни вигляду ніколи не застосовуються самі. Оберіть .grokskin у Параметри → Вигляд, якщо потрібен.",
  "softwareTeamDlc.sharedHomeNote":
    "Спільні дані сесій (GROK_HOME=~/.grok) ніколи не перезаписуються. Заготовки лишаються в застосунку, доки ви не встановите їх у проєкт або незалежний agent-home.",
  "softwareTeamDlc.rosterTitle": "Склад команди",
  "softwareTeamDlc.rosterHint":
    "Одна сесія Grok Build на роль. Відкрийте картку — стартер ролі потрапить у поле вводу. Передача рухає наступну роль і завантажує її стартер туди ж.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Обсяг, приймання й беклог. Передає один відвантажуваний зріз.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Дизайн під цей репозиторій: модулі, ризики й конкретний план Build.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "Реалізуйте узгоджений зріз. Дотримуйтесь наявного стилю. Стисло опишіть перевірку.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "Перегляньте diff. Обов’язкові виправлення й дрібниці. Не переписуйте без прохання.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Тест-кейси, команди й чесний pass/fail. Жодних вигаданих прогонів у браузері.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Вікі та i18n лише якщо зміна цього потребує. Ідентифікатори лишайте точними.",
  "softwareTeamDlc.slashHint": "Підказка слеша: {slash}",
  "softwareTeamDlc.copyStarter": "Копіювати стартер",
  "softwareTeamDlc.copied": "Скопійовано",
  "softwareTeamDlc.copyFailed": "Не вдалося скопіювати — виділіть стартер і скопіюйте вручну.",
  "softwareTeamDlc.sdlcTitle": "Етапи SDLC",
  "softwareTeamDlc.sdlcHint":
    "Дошка студії (Backlog → Design → Build → Review → Ship) — джерело істини. Живі колонки агентів лишаються довідковими.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (простоювання)",
  "softwareTeamDlc.assignRole": "Призначити роль",
  "softwareTeamDlc.assignStage": "Призначити етап SDLC",
  "softwareTeamDlc.clearTag": "Відв’язати сесію",
  "softwareTeamDlc.packTitle": "Шаблони ролей",
  "softwareTeamDlc.packHint":
    "Заготовки в застосунку. Встановлення пише 6 агентів, 6 навичок і team-handoff.rhai в .grok проєкту або незалежний agent-home — спільний ~/.grok не чіпає.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Не запускає паралельні CLI-агенти. Команда = прив’язані сесії + attach-chat + стартери передачі.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Верстак і Remote IM як і раніше керують лише Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio — це конвеєр. Правий клік по картці змінює етап або передає наступну роль.",
  "softwareTeamDlc.install.blockedShared":
    "Не можна писати шаблони в домашній каталог користувача в спільному режимі — це перезаписало б ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Оберіть теку проєкту, щоб установити шаблони в його каталог .grok.",
  "softwareTeamDlc.install.independentOk":
    "Незалежний режим може писати шаблони в agent-home застосунку (не ~/.grok).",
  "softwareTeamDlc.install.action": "Встановити пакет ролей",
  "softwareTeamDlc.install.installing": "Встановлення пакета…",
  "softwareTeamDlc.install.ok": "Встановлено файлів пакета: {n} ({target}).",
  "softwareTeamDlc.install.targetProject": ".grok проєкту",
  "softwareTeamDlc.install.targetUser": "незалежний agent-home",
  "softwareTeamDlc.install.needHost":
    "Встановлення потребує настільний Host. Цей попередній перегляд не пише файли і не удає успіх.",
  "softwareTeamDlc.install.hostError": "Встановлення не вдалося: {error}",
  "softwareTeamDlc.install.chooseTarget": "Куди ставити",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Прив’яжіть або створіть сесію, завантажте стартер у поле вводу, зсуньте етап, передайте наступну роль.",
  "softwareTeamDlc.pipelineTitle": "Конвеєр",
  "softwareTeamDlc.liveAgents": "Живі агенти",
  "softwareTeamDlc.addItem": "Додати елемент",
  "softwareTeamDlc.editItem": "Змінити елемент",
  "softwareTeamDlc.itemTitle": "Назва",
  "softwareTeamDlc.itemTitlePlaceholder": "Ім’я зрізу",
  "softwareTeamDlc.planRef": "План",
  "softwareTeamDlc.goalRef": "Мета",
  "softwareTeamDlc.artifactRef": "Артефакт",
  "softwareTeamDlc.planPlaceholder": "План або нотатка /plan",
  "softwareTeamDlc.goalPlaceholder": "Мета або нотатка /goal",
  "softwareTeamDlc.artifactPlaceholder": "PR, шлях або поставка",
  "softwareTeamDlc.bindSession": "Прив’язати сесію",
  "softwareTeamDlc.unbound": "Немає сесії",
  "softwareTeamDlc.sessionLabel": "Сесія",
  "softwareTeamDlc.handoff": "Передати",
  "softwareTeamDlc.handoffTo": "Передати {role}",
  "softwareTeamDlc.handoffDone":
    "Конвеєр завершено — Tech Writer остання роль. Для Ship ще потрібні нотатки Reviewer і QA.",
  "softwareTeamDlc.handoffCopied": "Стартер наступної ролі скопійовано",
  "softwareTeamDlc.handoffLoaded": "Стартер наступної ролі в полі вводу.",
  "softwareTeamDlc.openInComposer": "Відкрити в полі вводу",
  "softwareTeamDlc.createAndOpen": "Створити сесію й відкрити",
  "softwareTeamDlc.saveAndOpen": "Зберегти й відкрити",
  "softwareTeamDlc.starterLoaded": "Стартер ролі в полі вводу.",
  "softwareTeamDlc.needHostCreate":
    "Без Host сесію не створити. Прив’яжіть наявну або відкрийте настільний застосунок.",
  "softwareTeamDlc.createFailed": "Не вдалося створити сесію: {error}",
  "softwareTeamDlc.planChromeSet": "Нотатку плану прикріплено до цієї сесії.",
  "softwareTeamDlc.planChromeSkipped":
    "Поле плану лишається на картці. Host не записав план-хром.",
  "softwareTeamDlc.slashAfterInstall":
    "Після встановлення пакета /team-* вставляє чип навички. До того відкрийте сесію з дошки.",
  "softwareTeamDlc.noNextRole": "У цієї ролі немає подальшої передачі.",
  "softwareTeamDlc.moveStage": "Перемістити в {stage}",
  "softwareTeamDlc.removeItem": "Прибрати з дошки",
  "softwareTeamDlc.emptyBoard":
    "Поки немає елементів. Додайте зріз або прив’яжіть сесію до ролі.",
  "softwareTeamDlc.openStudio": "Відкрийте SDLC Studio в бічній панелі (Агенти).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "На цій цілі {n} з {total} файлів пакета.",
  "softwareTeamDlc.install.status.missing":
    "На цій цілі бракує {n} файлів пакета.",
  "softwareTeamDlc.install.status.checking":
    "Перевіряємо файли пакета на вибраній цілі…",
  "softwareTeamDlc.install.repair": "Дописати відсутні файли",
  "softwareTeamDlc.install.repairing": "Відновлюємо пакет…",
  "softwareTeamDlc.install.repaired": "Записано {n} відсутніх файлів пакета.",
  "softwareTeamDlc.install.repairNone":
    "Відновлювати нічого — файли пакета вже на місці.",
  "softwareTeamDlc.goalModeSet": "Режим цілі увімкнено для цього чернетки.",
  "softwareTeamDlc.goalModeSkipped":
    "Ціль лишається на картці. У Host немає API створення цілі.",
  "softwareTeamDlc.shipLocked":
    "Ship заблоковано, доки не збережено нотатки Reviewer і QA.",
  "softwareTeamDlc.shipNeedReviewer": "Цей зріз не пройшов через Reviewer.",
  "softwareTeamDlc.shipNeedQa": "Цей зріз не пройшов через QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Збережіть нотатки Reviewer перед Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Збережіть нотатки QA перед Ship.",
  "softwareTeamDlc.markReviewNote": "Записати нотатки Reviewer",
  "softwareTeamDlc.markQaNote": "Записати нотатки QA",
  "softwareTeamDlc.reviewNote": "Нотатки Reviewer",
  "softwareTeamDlc.qaNote": "Нотатки QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, обов’язкові правки й дрібниці, ризик.",
  "softwareTeamDlc.qaNotePlaceholder": "Випадки, команди, успіх/провал.",
  "softwareTeamDlc.notesSaved":
    "Нотатки збережено. Ship відкриється, коли будуть і Reviewer, і QA.",
} as const;
