/** vi messages — domain: Software Works / SDLC Studio */
export const viSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Bật Software Works",
  "softwareTeamDlc.enableDesc":
    "Khi bật, ngăn Agent là studio SDLC: danh sách đội, bảng pipeline, và bàn giao vai trên Grok Build. Tắt theo mặc định. Không đổi thương hiệu ứng dụng khi tắt, và không tạo thêm agent CLI.",
  "softwareTeamDlc.optInNote":
    "Software Works là bản giao phần mềm cho Grok Build — không phải runtime agent thứ hai.",
  "softwareTeamDlc.noSkinAutoApply":
    "Gói giao diện không bao giờ tự áp dụng. Chọn .grokskin trong Cài đặt → Giao diện nếu bạn muốn một gói.",
  "softwareTeamDlc.sharedHomeNote":
    "Dữ liệu phiên dùng chung (GROK_HOME=~/.grok) không bao giờ bị ghi đè. Preset ở lại trong ứng dụng trừ khi bạn cài chúng vào dự án hoặc agent-home Độc lập.",
  "softwareTeamDlc.rosterTitle": "Danh sách đội",
  "softwareTeamDlc.rosterHint":
    "Một phiên Grok Build mỗi vai. Mở thẻ để đưa starter vai vào ô soạn. Bàn giao chuyển vai tiếp theo và tải starter của vai đó vào đó.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc":
    "Phạm vi, nghiệm thu, và backlog. Bàn giao một lát có thể phát hành.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc":
    "Thiết kế khớp kho này: mô-đun, rủi ro, và kế hoạch Build cụ thể.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc":
    "Thực hiện lát đã thống nhất. Khớp phong cách sẵn có. Tóm tắt cách kiểm chứng.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc":
    "Đánh giá diff. Bắt buộc sửa so với nits. Không viết lại trừ khi được yêu cầu.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc":
    "Trường hợp kiểm thử, lệnh, và đạt/trượt trung thực. Không bịa lần chạy trình duyệt.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc":
    "Wiki và i18n chỉ khi thay đổi cần. Giữ định danh chính xác.",
  "softwareTeamDlc.slashHint": "Gợi ý slash: {slash}",
  "softwareTeamDlc.copyStarter": "Sao chép starter",
  "softwareTeamDlc.copied": "Đã sao chép",
  "softwareTeamDlc.copyFailed": "Không sao chép được — chọn starter và sao chép thủ công.",
  "softwareTeamDlc.sdlcTitle": "Giai đoạn SDLC",
  "softwareTeamDlc.sdlcHint":
    "Bảng studio (Backlog → Design → Build → Review → Ship) là nguồn chuẩn. Cột agent trực tiếp chỉ mang tính thông tin.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (rảnh)",
  "softwareTeamDlc.assignRole": "Gán vai",
  "softwareTeamDlc.assignStage": "Gán giai đoạn SDLC",
  "softwareTeamDlc.clearTag": "Bỏ gắn phiên",
  "softwareTeamDlc.packTitle": "Mẫu vai",
  "softwareTeamDlc.packHint":
    "Preset đi kèm ứng dụng. Cài sẽ ghi 6 agent, 6 kỹ năng, và team-handoff.rhai vào thư mục .grok của dự án hoặc agent-home Độc lập — không bao giờ ~/.grok dùng chung.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Không khởi chạy agent CLI song song. Đội = phiên đã gắn + attach-chat + starter bàn giao.",
  "softwareTeamDlc.honesty.grokBuildOnly":
    "Bàn làm việc và Remote IM vẫn chỉ điều khiển Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio là pipeline. Nhấp phải một thẻ để chuyển giai đoạn hoặc bàn giao vai tiếp theo.",
  "softwareTeamDlc.install.blockedShared":
    "Không thể ghi mẫu home người dùng khi dữ liệu phiên là Dùng chung — việc đó sẽ ghi đè ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Chọn thư mục dự án để cài mẫu vào thư mục .grok của dự án đó.",
  "softwareTeamDlc.install.independentOk":
    "Chế độ Độc lập có thể ghi mẫu vào agent-home của Ứng dụng (không phải ~/.grok).",
  "softwareTeamDlc.install.action": "Cài gói vai",
  "softwareTeamDlc.install.installing": "Đang cài gói…",
  "softwareTeamDlc.install.ok": "Đã cài {n} tệp gói ({target}).",
  "softwareTeamDlc.install.targetProject": ".grok dự án",
  "softwareTeamDlc.install.targetUser": "agent-home Độc lập",
  "softwareTeamDlc.install.needHost":
    "Cài cần Host máy tính. Bản xem trước này không ghi được tệp — sẽ không giả vờ thành công.",
  "softwareTeamDlc.install.hostError": "Cài thất bại: {error}",
  "softwareTeamDlc.install.chooseTarget": "Đích cài",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Gắn hoặc tạo phiên, tải starter vai vào ô soạn, chuyển giai đoạn, bàn giao vai tiếp theo.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Agent trực tiếp",
  "softwareTeamDlc.addItem": "Thêm hạng mục",
  "softwareTeamDlc.editItem": "Sửa hạng mục",
  "softwareTeamDlc.itemTitle": "Tiêu đề",
  "softwareTeamDlc.itemTitlePlaceholder": "Tên lát",
  "softwareTeamDlc.planRef": "Kế hoạch",
  "softwareTeamDlc.goalRef": "Mục tiêu",
  "softwareTeamDlc.artifactRef": "Ấn phẩm",
  "softwareTeamDlc.planPlaceholder": "Ghi chú kế hoạch hoặc /plan",
  "softwareTeamDlc.goalPlaceholder": "Ghi chú mục tiêu hoặc /goal",
  "softwareTeamDlc.artifactPlaceholder": "PR, đường dẫn, hoặc sản phẩm giao",
  "softwareTeamDlc.bindSession": "Gắn phiên",
  "softwareTeamDlc.unbound": "Không có phiên",
  "softwareTeamDlc.sessionLabel": "Phiên",
  "softwareTeamDlc.handoff": "Bàn giao",
  "softwareTeamDlc.handoffTo": "Bàn giao cho {role}",
  "softwareTeamDlc.handoffDone":
    "Pipeline xong — Writer là vai cuối. Ship vẫn cần ghi chú Reviewer và QA.",
  "softwareTeamDlc.handoffCopied": "Đã sao chép starter vai tiếp theo",
  "softwareTeamDlc.handoffLoaded": "Starter vai tiếp theo đã ở ô soạn.",
  "softwareTeamDlc.openInComposer": "Mở trong ô soạn",
  "softwareTeamDlc.createAndOpen": "Tạo phiên và mở",
  "softwareTeamDlc.saveAndOpen": "Lưu và mở",
  "softwareTeamDlc.starterLoaded": "Starter vai đã ở ô soạn.",
  "softwareTeamDlc.needHostCreate":
    "Không tạo được phiên nếu thiếu Host. Gắn một phiên có sẵn, hoặc mở ứng dụng máy tính.",
  "softwareTeamDlc.createFailed": "Không tạo được phiên: {error}",
  "softwareTeamDlc.planChromeSet": "Đã gắn ghi chú kế hoạch cho phiên này.",
  "softwareTeamDlc.planChromeSkipped":
    "Trường kế hoạch nằm trên thẻ. Host không lưu chrome kế hoạch.",
  "softwareTeamDlc.slashAfterInstall":
    "Sau khi cài gói, /team-* chèn chip kỹ năng. Trước đó, mở phiên từ bảng.",
  "softwareTeamDlc.noNextRole": "Vai này không còn bàn giao tiếp.",
  "softwareTeamDlc.moveStage": "Chuyển sang {stage}",
  "softwareTeamDlc.removeItem": "Gỡ khỏi bảng",
  "softwareTeamDlc.emptyBoard":
    "Chưa có hạng mục. Thêm một lát hoặc gắn phiên vào một vai.",
  "softwareTeamDlc.openStudio": "Mở SDLC Studio từ thanh bên (Agent).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} trên {total} tệp gói có trên đích này.",
  "softwareTeamDlc.install.status.missing":
    "Thiếu {n} tệp gói trên đích này.",
  "softwareTeamDlc.install.status.checking":
    "Đang kiểm tra tệp gói trên đích đã chọn…",
  "softwareTeamDlc.install.repair": "Sửa tệp còn thiếu",
  "softwareTeamDlc.install.repairing": "Đang sửa gói…",
  "softwareTeamDlc.install.repaired": "Đã ghi {n} tệp gói còn thiếu.",
  "softwareTeamDlc.install.repairNone":
    "Không cần sửa — tệp gói đã có đủ.",
  "softwareTeamDlc.goalModeSet": "Chế độ mục tiêu đang bật cho bản nháp ô soạn này.",
  "softwareTeamDlc.goalModeSkipped":
    "Mục tiêu ở lại trên thẻ. Host không có API tạo mục tiêu.",
  "softwareTeamDlc.shipLocked":
    "Ship bị khóa cho đến khi đợt giao này có ghi chú Reviewer và QA.",
  "softwareTeamDlc.shipNeedReviewer": "Lát này chưa qua Reviewer.",
  "softwareTeamDlc.shipNeedQa": "Lát này chưa qua QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Lưu ghi chú Reviewer trước khi Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Lưu ghi chú QA trước khi Ship.",
  "softwareTeamDlc.markReviewNote": "Đánh dấu ghi chú Reviewer",
  "softwareTeamDlc.markQaNote": "Đánh dấu ghi chú QA",
  "softwareTeamDlc.reviewNote": "Ghi chú Reviewer",
  "softwareTeamDlc.qaNote": "Ghi chú QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, bắt buộc sửa so với nits, rủi ro.",
  "softwareTeamDlc.qaNotePlaceholder": "Trường hợp, lệnh, đạt/trượt.",
  "softwareTeamDlc.notesSaved":
    "Đã lưu ghi chú. Ship mở khóa khi đợt giao này có cả ghi chú Reviewer và QA.",
  "softwareTeamDlc.startDelivery": "Bắt đầu đợt giao",
  "softwareTeamDlc.startDeliveryHint":
    "Tạo hạng mục pipeline và mở phiên Grok Build với starter vai. Placeholder docs/sdlc tùy chọn ở lại thư mục dự án này — không bao giờ ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Tiêu đề lát",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "Chúng ta phát hành gì?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Đặt tên lát trước khi bắt đầu.",
  "softwareTeamDlc.startDeliveryRole": "Vai đầu",
  "softwareTeamDlc.startDeliveryBootstrap": "Thêm placeholder docs/sdlc",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Ghi spec.md, design.md, và review.md vào docs/sdlc của dự án này nếu chưa có. Cần Host máy tính và thư mục dự án.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Chọn thư mục dự án để ghi placeholder docs/sdlc.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "Placeholder không gian làm việc cần Host máy tính. Bản xem trước này sẽ không giả vờ đã ghi.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Không thể bootstrap vào ~/.grok dùng chung. Chọn một thư mục dự án.",
  "softwareTeamDlc.startDeliveryHostError": "Không ghi được placeholder: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "Đã ghi {n} tệp placeholder docs/sdlc trong dự án.",
  "softwareTeamDlc.startDeliveryBootstrapSkip":
    "Đã bỏ qua placeholder không gian làm việc.",
  "softwareTeamDlc.startDeliveryStarted": "Đã bắt đầu đợt giao.",
  "softwareTeamDlc.handoffCta": "Bàn giao cho {role}",
  "softwareTeamDlc.shipCta": "Ship · starter Writer",
  "softwareTeamDlc.sessionDoneHint":
    "Phiên đã xong. Bàn giao hoặc Ship — bảng không tự chuyển giai đoạn.",
  "softwareTeamDlc.attachSeeded":
    "Đã gieo {n} phiên attach-chat trên bản nháp ô soạn (tối đa 3).",
  "softwareTeamDlc.addTeammateGroup": "Thêm phiên đội",
  "softwareTeamDlc.addTeammate": "Thêm phiên {role}",
  "softwareTeamDlc.attachedHint":
    "{n} trò chuyện đội trên đợt giao này (attach-chat, tối đa 3)",
  "softwareTeamDlc.pipelineFileOk":
    "Pipeline đã lưu trong dự án này (.grok/software-works.json).",
  "softwareTeamDlc.pipelineFileMissing":
    "Chưa có tệp pipeline dự án. Thay đổi tiếp theo sẽ ghi .grok/software-works.json.",
  "softwareTeamDlc.pipelineFileCache":
    "Không ghi Host vào dự án — pipeline chỉ ở cache ứng dụng này.",
  "softwareTeamDlc.pipelineFileNeedHost":
    "Pipeline dự án cần Host máy tính. Bản xem trước này sẽ không giả vờ lưu.",
  "softwareTeamDlc.pipelineFileNeedProject":
    "Chọn thư mục dự án để lưu pipeline trong kho.",
  "softwareTeamDlc.pipelineFileBlockedHome":
    "Không thể ghi pipeline vào ~/.grok dùng chung.",
  "softwareTeamDlc.pipelineFileParseFail":
    "Tệp pipeline dự án không đọc được. Đã để nguyên (sao lưu {file}). Đang dùng cache ứng dụng.",
  "softwareTeamDlc.pipelineFileHostError": "Không lưu được pipeline dự án: {error}",
  "softwareTeamDlc.deliveryFilter": "Đợt giao",
  "softwareTeamDlc.deliveryFilterAll": "Mọi đợt giao",
  "softwareTeamDlc.deliveryUnscoped": "Chưa nhóm",
  "softwareTeamDlc.roleHistory": "Vai: {roles}",
  "softwareTeamDlc.openSdlcDocs": "Mở docs/sdlc",
  "softwareTeamDlc.openSdlcDoc": "Mở {file}",
  "softwareTeamDlc.openSdlcDocOpened": "Đã mở tệp trong trình soạn.",
  "softwareTeamDlc.openSdlcDocCopied":
    "Đã sao chép đường dẫn. Host không mở trình soạn cho tệp này.",
  "softwareTeamDlc.openSdlcDocMissing": "Tệp docs/sdlc đó không có trong dự án này.",
  "softwareTeamDlc.openSdlcDocNeedHost": "Mở trong trình soạn cần Host máy tính.",
  "softwareTeamDlc.openSdlcDocNeedProject":
    "Chọn thư mục dự án để mở tệp docs/sdlc.",
  "softwareTeamDlc.openSdlcDocBlockedHome":
    "Không thể mở docs/sdlc từ ~/.grok dùng chung.",
  "softwareTeamDlc.openSdlcDocHostError": "Không mở được tệp: {error}",
  "softwareTeamDlc.deliveryDetail": "Đợt giao",
  "softwareTeamDlc.deliveryDetailHint":
    "Tiêu đề, tham chiếu lát dùng chung, lịch sử vai, ghi chú Review/QA (Ship theo đợt giao), bước tiếp, docs/sdlc, và phiên trên lát này.",
  "softwareTeamDlc.openDelivery": "Mở đợt giao",
  "softwareTeamDlc.deliverySessions": "Phiên trên đợt giao này",
  "softwareTeamDlc.deliveryNoSessions": "Chưa có phiên gắn.",
  "softwareTeamDlc.activityLog": "Hoạt động",
  "softwareTeamDlc.activityEmpty": "Chưa ghi hoạt động.",
  "softwareTeamDlc.activity.item_added": "Đã thêm hạng mục",
  "softwareTeamDlc.activity.stage_changed": "Đã chuyển giai đoạn",
  "softwareTeamDlc.activity.handoff": "Đã bàn giao",
  "softwareTeamDlc.activity.notes": "Đã cập nhật ghi chú",
  "softwareTeamDlc.activity.delivery_started": "Đã bắt đầu đợt giao này",
  "softwareTeamDlc.pipelineFileReloaded":
    "Tệp pipeline dự án mới hơn — bảng đã cập nhật.",
  "softwareTeamDlc.notesEmpty": "Chưa có",
  "softwareTeamDlc.searchTitle": "Tìm theo tiêu đề",
  "softwareTeamDlc.stageFilter": "Giai đoạn",
  "softwareTeamDlc.stageFilterAll": "Mọi giai đoạn",
  "softwareTeamDlc.roleFilter": "Vai",
  "softwareTeamDlc.roleFilterAll": "Mọi vai",
  "softwareTeamDlc.showArchived": "Hiện đã lưu trữ",
  "softwareTeamDlc.archiveDelivery": "Lưu trữ đợt giao",
  "softwareTeamDlc.unarchiveDelivery": "Bỏ lưu trữ đợt giao",
  "softwareTeamDlc.archived": "Đã lưu trữ. Ẩn khỏi bảng mặc định.",
  "softwareTeamDlc.unarchived": "Đợt giao đã trở lại bảng.",
  "softwareTeamDlc.activity.archived": "Đã lưu trữ",
  "softwareTeamDlc.activity.unarchived": "Đã bỏ lưu trữ",
  "softwareTeamDlc.exportSummary": "Xuất tóm tắt",
  "softwareTeamDlc.exportOk": "Đã ghi {file} trong dự án này.",
  "softwareTeamDlc.exportNeedHost":
    "Xuất cần Host máy tính. Bản xem trước này sẽ không giả vờ ghi.",
  "softwareTeamDlc.exportNeedProject":
    "Chọn thư mục dự án để xuất docs/sdlc.",
  "softwareTeamDlc.exportBlockedHome":
    "Không thể xuất tóm tắt đợt giao vào ~/.grok dùng chung.",
  "softwareTeamDlc.exportBadSlug": "Tiêu đề đợt giao đó không thể thành tên tệp.",
  "softwareTeamDlc.exportHostError": "Không xuất được tóm tắt: {error}",
  "softwareTeamDlc.pipelineFileConflict":
    "Tệp pipeline dự án đã đổi ở chỗ khác. Đã để nguyên. Bảng của bạn ở lại trong ứng dụng. Lần lưu tiếp ghi sao lưu {file} thay vì thay thế tệp.",
  "softwareTeamDlc.undo": "Hoàn tác thay đổi cuối",
  "softwareTeamDlc.undone": "Đã hoàn tác thay đổi bảng cuối.",
  "softwareTeamDlc.undoEmpty": "Không có gì để hoàn tác.",
  "softwareTeamDlc.removeItemConfirm": "Gỡ thẻ này?",
  "softwareTeamDlc.removeItemConfirmBody":
    "Gỡ “{title}” khỏi bảng SDLC. Phiên Grok Build được giữ. Hoàn tác có thể khôi phục thẻ trong cửa sổ này.",
  "softwareTeamDlc.removeItemConfirmAction": "Gỡ thẻ",
  "softwareTeamDlc.gitBranch": "Nhãn nhánh Git",
  "softwareTeamDlc.gitBranchPlaceholder": "feat/slice-name",
  "softwareTeamDlc.gitBranchHint":
    "Chỉ là nhãn. Software Works không tạo worktree, không checkout nhánh, và không ghi đè ~/.grok.",
  "softwareTeamDlc.gitBranchSave": "Lưu nhãn nhánh",
  "softwareTeamDlc.gitBranchSaved": "Đã lưu nhãn nhánh trên đợt giao này.",
  "softwareTeamDlc.gitBranchInvalid":
    "Dùng chữ, số, '.', '_' hoặc '-' và '/' — không khoảng trắng, không gạch đầu.",
  "softwareTeamDlc.gitBranchSuggest": "Gợi ý từ tiêu đề",
  "softwareTeamDlc.gitBranchCopy": "Sao chép nhãn nhánh",
  "softwareTeamDlc.gitBranchCopied": "Đã sao chép nhãn nhánh.",
  "softwareTeamDlc.activity.item_removed": "Đã gỡ một hạng mục",
  "softwareTeamDlc.activity.git_branch": "Đã cập nhật nhãn nhánh git",
  "softwareTeamDlc.redo": "Làm lại",
  "softwareTeamDlc.redone": "Đã làm lại thay đổi bảng.",
  "softwareTeamDlc.redoEmpty": "Không có gì để làm lại.",
  "softwareTeamDlc.duplicateDelivery": "Nhân bản đợt giao",
  "softwareTeamDlc.duplicateSuffix": " (bản sao)",
  "softwareTeamDlc.duplicated": "Đã nhân bản đợt giao. Thẻ mới chưa gắn phiên.",
  "softwareTeamDlc.duplicateFailed": "Không nhân bản được đợt giao này.",
  "softwareTeamDlc.deliveryName": "Tên đợt giao",
  "softwareTeamDlc.deliveryRename": "Lưu tên",
  "softwareTeamDlc.deliveryRenamed": "Đã lưu tên đợt giao.",
  "softwareTeamDlc.deliveryRenameNeedTitle": "Đặt tên đợt giao trước khi lưu.",
  "softwareTeamDlc.activity.delivery_renamed": "Đã đổi tên đợt giao này",
  "softwareTeamDlc.activity.delivery_duplicated": "Đã nhân bản một đợt giao",
  "softwareTeamDlc.bindThisChat": "Gắn trò chuyện này",
  "softwareTeamDlc.bindThisChatDone": "Trò chuyện này đã gắn vào thẻ.",
  "softwareTeamDlc.bindThisChatNeedSession": "Hãy mở một trò chuyện trước, rồi gắn.",
  "softwareTeamDlc.bindThisChatAlready": "Trò chuyện này đã ở trên thẻ này.",
  "softwareTeamDlc.unbindSessionDone": "Đã bỏ gắn phiên. Trò chuyện vẫn còn.",
  "softwareTeamDlc.moveToDelivery": "Chuyển sang đợt giao",
  "softwareTeamDlc.movedToDelivery": "Đã chuyển thẻ sang {title}.",
  "softwareTeamDlc.movedUngrouped": "Thẻ không còn nhóm.",
  "softwareTeamDlc.activity.item_moved": "Đã chuyển sang đợt giao khác",
  "softwareTeamDlc.activity.session_bound": "Đã gắn một phiên",
  "softwareTeamDlc.activity.session_unbound": "Đã bỏ gắn phiên",
  "softwareTeamDlc.missingRoles": "Thiếu phiên nhóm: {roles}",
  "softwareTeamDlc.teamComplete":
    "Đợt giao này đã có thẻ Product, Architect, Engineer, Reviewer, QA và Writer.",
  "softwareTeamDlc.addSdlcDocs": "Thêm tệp docs/sdlc còn thiếu",
  "softwareTeamDlc.sliceRefsHint":
    "Kế hoạch, mục tiêu và ấn phẩm dùng chung trên mọi thẻ của đợt giao này. Lưu sẽ cập nhật tất cả.",
  "softwareTeamDlc.sliceRefsSaved": "Đã lưu tham chiếu lát trên mọi thẻ của đợt giao này.",
  "softwareTeamDlc.saveSliceRefs": "Lưu tham chiếu lát",
  "softwareTeamDlc.copySummary": "Sao chép tóm tắt",
  "softwareTeamDlc.copySummaryOk": "Đã sao chép tóm tắt.",
  "softwareTeamDlc.copySummaryFailed": "Không sao chép được tóm tắt.",
  "softwareTeamDlc.exportCopiedInstead":
    "Đã sao chép tóm tắt. Không ghi tệp trong dự án.",
  "softwareTeamDlc.handoffKept":
    "Đã mở {role}. Thẻ này vẫn là {from}.",
  "softwareTeamDlc.handoffCreated":
    "Đã thêm thẻ {role}. Thẻ này vẫn là {from}.",
  "softwareTeamDlc.shipKept":
    "Đã mở Writer. Thẻ này vẫn là {from}.",
} as const;
