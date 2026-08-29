/** id messages — domain: Software Works / SDLC Studio */
export const idSoftwareTeamDlc = {
  "softwareTeamDlc.title": "Software Works",
  "softwareTeamDlc.uiName": "SDLC Studio",
  "softwareTeamDlc.enable": "Aktifkan Software Works",
  "softwareTeamDlc.enableDesc":
    "Saat aktif, panel Agen menjadi studio SDLC: daftar tim, papan pipeline, dan serah peran di Grok Build. Default mati. Tidak mengubah merek aplikasi saat mati dan tidak menjalankan agen CLI tambahan.",
  "softwareTeamDlc.optInNote":
    "Software Works adalah edisi pengiriman perangkat lunak untuk Grok Build — bukan runtime agen kedua.",
  "softwareTeamDlc.noSkinAutoApply":
    "Skin tampilan tidak pernah diterapkan otomatis. Pilih .grokskin di Pengaturan → Tampilan jika Anda menginginkannya.",
  "softwareTeamDlc.sharedHomeNote":
    "Data sesi bersama (GROK_HOME=~/.grok) tidak pernah ditulis ulang. Preset tetap di aplikasi kecuali Anda memasangnya ke proyek atau agent-home Independen.",
  "softwareTeamDlc.rosterTitle": "Daftar tim",
  "softwareTeamDlc.rosterHint":
    "Satu sesi Grok Build per peran. Buka kartu agar starter peran masuk ke komposer. Serah peran memajukan peran berikutnya dan memuat starternya di sana.",
  "softwareTeamDlc.role.product": "Product",
  "softwareTeamDlc.role.product.desc": "Lingkup, penerimaan, dan backlog. Menyerahkan satu irisan yang bisa dikirim.",
  "softwareTeamDlc.role.architect": "Architect",
  "softwareTeamDlc.role.architect.desc": "Desain yang cocok untuk repositori ini: modul, risiko, dan rencana Build yang konkret.",
  "softwareTeamDlc.role.engineer": "Engineer",
  "softwareTeamDlc.role.engineer.desc": "Implementasikan irisan yang disepakati. Ikuti gaya yang ada. Ringkas cara memverifikasi.",
  "softwareTeamDlc.role.reviewer": "Reviewer",
  "softwareTeamDlc.role.reviewer.desc": "Tinjau diff. Wajib diperbaiki vs nits. Jangan menulis ulang kecuali diminta.",
  "softwareTeamDlc.role.qa": "QA",
  "softwareTeamDlc.role.qa.desc": "Kasus uji, perintah, dan lulus/gagal yang jujur. Tanpa uji browser yang dikarang.",
  "softwareTeamDlc.role.writer": "Tech Writer",
  "softwareTeamDlc.role.writer.desc": "Wiki dan i18n hanya jika perubahan membutuhkannya. Pertahankan pengenal persis.",
  "softwareTeamDlc.slashHint": "Petunjuk slash: {slash}",
  "softwareTeamDlc.copyStarter": "Salin starter",
  "softwareTeamDlc.copied": "Disalin",
  "softwareTeamDlc.copyFailed": "Tidak bisa menyalin — pilih starter dan salin secara manual.",
  "softwareTeamDlc.sdlcTitle": "Tahap SDLC",
  "softwareTeamDlc.sdlcHint":
    "Papan studio (Backlog → Design → Build → Review → Ship) adalah sumber kebenaran. Kolom agen langsung tetap informatif.",
  "softwareTeamDlc.stage.backlog": "Backlog",
  "softwareTeamDlc.stage.design": "Design",
  "softwareTeamDlc.stage.build": "Build",
  "softwareTeamDlc.stage.review": "Review",
  "softwareTeamDlc.stage.ship": "Ship",
  "softwareTeamDlc.columnMap.needsYou": "Backlog · Design · Review",
  "softwareTeamDlc.columnMap.working": "Build",
  "softwareTeamDlc.columnMap.done": "Ship",
  "softwareTeamDlc.columnMap.idle": "Backlog (menganggur)",
  "softwareTeamDlc.assignRole": "Tetapkan peran",
  "softwareTeamDlc.assignStage": "Tetapkan tahap SDLC",
  "softwareTeamDlc.clearTag": "Lepas sesi",
  "softwareTeamDlc.packTitle": "Templat peran",
  "softwareTeamDlc.packHint":
    "Preset ada di aplikasi. Instal menulis 6 agen, 6 skill, dan team-handoff.rhai ke .grok proyek atau agent-home Independen — bukan ~/.grok bersama.",
  "softwareTeamDlc.honesty.noParallelAgents":
    "Tidak memulai agen CLI paralel. Tim = sesi terikat + attach-chat + starter serah peran.",
  "softwareTeamDlc.honesty.grokBuildOnly": "Workbench dan Remote IM tetap hanya mengendalikan Grok Build.",
  "softwareTeamDlc.kanbanHint":
    "SDLC Studio adalah pipeline. Klik kanan kartu untuk memindahkan tahap atau menyerahkan peran berikutnya.",
  "softwareTeamDlc.install.blockedShared":
    "Tidak dapat menulis templat home pengguna saat data sesi Bersama — itu akan menulis ulang ~/.grok.",
  "softwareTeamDlc.install.needProject":
    "Pilih folder proyek untuk memasang templat di direktori .grok proyek itu.",
  "softwareTeamDlc.install.independentOk":
    "Mode Independen boleh menulis templat ke agent-home Aplikasi (bukan ~/.grok).",
  "softwareTeamDlc.install.action": "Instal paket peran",
  "softwareTeamDlc.install.installing": "Menginstal paket…",
  "softwareTeamDlc.install.ok": "Terinstal {n} berkas paket ({target}).",
  "softwareTeamDlc.install.targetProject": ".grok proyek",
  "softwareTeamDlc.install.targetUser": "agent-home Independen",
  "softwareTeamDlc.install.needHost":
    "Instal membutuhkan Host desktop. Pratinjau ini tidak dapat menulis berkas dan tidak akan berpura-pura berhasil.",
  "softwareTeamDlc.install.hostError": "Instal gagal: {error}",
  "softwareTeamDlc.install.chooseTarget": "Target instal",
  "softwareTeamDlc.studioTitle": "SDLC Studio",
  "softwareTeamDlc.studioHint":
    "Ikat atau buat sesi, muat starter peran ke komposer, pindahkan tahap, serahkan peran berikutnya.",
  "softwareTeamDlc.pipelineTitle": "Pipeline",
  "softwareTeamDlc.liveAgents": "Agen langsung",
  "softwareTeamDlc.addItem": "Tambah item",
  "softwareTeamDlc.editItem": "Sunting item",
  "softwareTeamDlc.itemTitle": "Judul",
  "softwareTeamDlc.itemTitlePlaceholder": "Nama irisan",
  "softwareTeamDlc.planRef": "Rencana",
  "softwareTeamDlc.goalRef": "Tujuan",
  "softwareTeamDlc.artifactRef": "Artefak",
  "softwareTeamDlc.planPlaceholder": "Rencana atau catatan /plan",
  "softwareTeamDlc.goalPlaceholder": "Tujuan atau catatan /goal",
  "softwareTeamDlc.artifactPlaceholder": "PR, jalur, atau hasil kirim",
  "softwareTeamDlc.bindSession": "Ikat sesi",
  "softwareTeamDlc.unbound": "Tidak ada sesi",
  "softwareTeamDlc.sessionLabel": "Sesi",
  "softwareTeamDlc.handoff": "Serahkan",
  "softwareTeamDlc.handoffTo": "Serahkan ke {role}",
  "softwareTeamDlc.handoffDone":
    "Pipeline selesai — Tech Writer adalah peran terakhir. Ship masih butuh catatan Reviewer dan QA.",
  "softwareTeamDlc.handoffCopied": "Starter peran berikutnya disalin",
  "softwareTeamDlc.handoffLoaded": "Starter peran berikutnya ada di komposer.",
  "softwareTeamDlc.openInComposer": "Buka di komposer",
  "softwareTeamDlc.createAndOpen": "Buat sesi dan buka",
  "softwareTeamDlc.saveAndOpen": "Simpan dan buka",
  "softwareTeamDlc.starterLoaded": "Starter peran ada di komposer.",
  "softwareTeamDlc.needHostCreate":
    "Tanpa Host sesi tidak dapat dibuat. Ikat sesi yang ada, atau buka aplikasi desktop.",
  "softwareTeamDlc.createFailed": "Tidak dapat membuat sesi: {error}",
  "softwareTeamDlc.planChromeSet": "Catatan rencana dilampirkan ke sesi ini.",
  "softwareTeamDlc.planChromeSkipped":
    "Bidang rencana tetap di kartu. Host tidak menulis chrome rencana.",
  "softwareTeamDlc.slashAfterInstall":
    "Setelah paket terinstal, /team-* menyisipkan chip skill. Sebelum itu, buka sesi dari papan.",
  "softwareTeamDlc.noNextRole": "Peran ini tidak punya serah peran lagi.",
  "softwareTeamDlc.moveStage": "Pindah ke {stage}",
  "softwareTeamDlc.removeItem": "Hapus dari papan",
  "softwareTeamDlc.emptyBoard":
    "Belum ada item. Tambah irisan atau ikat sesi ke suatu peran.",
  "softwareTeamDlc.openStudio": "Buka SDLC Studio dari bilah sisi (Agen).",
  "softwareTeamDlc.roleOnStage": "{role} · {stage}",
  "softwareTeamDlc.install.status.installed":
    "{n} dari {total} berkas paket ada di target ini.",
  "softwareTeamDlc.install.status.missing":
    "{n} berkas paket hilang di target ini.",
  "softwareTeamDlc.install.status.checking":
    "Memeriksa berkas paket pada target yang dipilih…",
  "softwareTeamDlc.install.repair": "Perbaiki berkas yang hilang",
  "softwareTeamDlc.install.repairing": "Memperbaiki paket…",
  "softwareTeamDlc.install.repaired": "Menulis {n} berkas paket yang hilang.",
  "softwareTeamDlc.install.repairNone":
    "Tidak ada yang perlu diperbaiki — berkas paket sudah ada.",
  "softwareTeamDlc.goalModeSet": "Mode tujuan aktif untuk draf ini.",
  "softwareTeamDlc.goalModeSkipped":
    "Tujuan tetap di kartu. Host tidak punya API membuat tujuan.",
  "softwareTeamDlc.shipLocked":
    "Ship terkunci sampai pengiriman ini punya catatan Reviewer dan QA.",
  "softwareTeamDlc.shipNeedReviewer": "Irisan ini belum melewati Reviewer.",
  "softwareTeamDlc.shipNeedQa": "Irisan ini belum melewati QA.",
  "softwareTeamDlc.shipNeedReviewNote": "Simpan catatan Reviewer sebelum Ship.",
  "softwareTeamDlc.shipNeedQaNote": "Simpan catatan QA sebelum Ship.",
  "softwareTeamDlc.markReviewNote": "Tulis catatan Reviewer",
  "softwareTeamDlc.markQaNote": "Tulis catatan QA",
  "softwareTeamDlc.reviewNote": "Catatan Reviewer",
  "softwareTeamDlc.qaNote": "Catatan QA",
  "softwareTeamDlc.reviewNotePlaceholder": "Diff, perbaikan wajib vs nits, risiko.",
  "softwareTeamDlc.qaNotePlaceholder": "Kasus, perintah, lulus/gagal.",
  "softwareTeamDlc.notesSaved":
    "Catatan tersimpan. Ship terbuka jika pengiriman ini punya catatan Reviewer dan QA.",
  "softwareTeamDlc.startDelivery": "Mulai pengiriman",
  "softwareTeamDlc.startDeliveryHint":
    "Membuat item pipeline dan membuka sesi Grok Build dengan starter peran. Placeholder docs/sdlc hanya di folder proyek ini — bukan ~/.grok.",
  "softwareTeamDlc.startDeliveryTitle": "Judul irisan",
  "softwareTeamDlc.startDeliveryTitlePlaceholder": "Apa yang kita kirim?",
  "softwareTeamDlc.startDeliveryNeedTitle": "Beri nama irisan sebelum mulai.",
  "softwareTeamDlc.startDeliveryRole": "Peran pertama",
  "softwareTeamDlc.startDeliveryBootstrap": "Tambah placeholder docs/sdlc",
  "softwareTeamDlc.startDeliveryBootstrapHint":
    "Menulis spec.md, design.md, dan review.md di docs/sdlc proyek ini jika belum ada. Butuh Host desktop dan folder proyek.",
  "softwareTeamDlc.startDeliveryNeedProject":
    "Pilih folder proyek untuk menulis docs/sdlc.",
  "softwareTeamDlc.startDeliveryNeedHost":
    "Placeholder ruang kerja butuh Host desktop. Pratinjau ini tidak berpura-pura sudah menulis.",
  "softwareTeamDlc.startDeliveryBlockedHome":
    "Tidak bisa bootstrap ke ~/.grok bersama. Pilih folder proyek.",
  "softwareTeamDlc.startDeliveryHostError": "Tidak bisa menulis placeholder: {error}",
  "softwareTeamDlc.startDeliveryBootstrapped":
    "Menulis {n} berkas docs/sdlc di proyek.",
  "softwareTeamDlc.startDeliveryBootstrapSkip": "Placeholder ruang kerja dilewati.",
  "softwareTeamDlc.startDeliveryStarted": "Pengiriman dimulai.",
  "softwareTeamDlc.handoffCta": "Serahkan ke {role}",
  "softwareTeamDlc.shipCta": "Ship · starter Writer",
  "softwareTeamDlc.sessionDoneHint":
    "Sesi selesai. Serahkan atau Ship — papan tidak maju sendiri.",
  "softwareTeamDlc.attachSeeded":
    "{n} sesi attach-chat disemai di draf (maks. 3).",
  "softwareTeamDlc.addTeammateGroup": "Tambah sesi tim",
  "softwareTeamDlc.addTeammate": "Tambah sesi {role}",
  "softwareTeamDlc.attachedHint":
    "{n} obrolan tim pada pengiriman ini (attach-chat, maks. 3)",
  "softwareTeamDlc.pipelineFileOk":
    "Pipeline disimpan di proyek ini (.grok/software-works.json).",
  "softwareTeamDlc.pipelineFileMissing":
    "Belum ada berkas pipeline. Perubahan berikutnya menulis .grok/software-works.json.",
  "softwareTeamDlc.pipelineFileCache":
    "Tidak ada tulis Host ke proyek — pipeline hanya di cache aplikasi.",
  "softwareTeamDlc.pipelineFileNeedHost":
    "Pipeline proyek membutuhkan Host desktop. Pratinjau ini tidak berpura-pura menyimpan.",
  "softwareTeamDlc.pipelineFileNeedProject":
    "Pilih folder proyek untuk menyimpan pipeline di repositori.",
  "softwareTeamDlc.pipelineFileBlockedHome":
    "Tidak dapat menulis pipeline ke ~/.grok bersama.",
  "softwareTeamDlc.pipelineFileParseFail":
    "Berkas pipeline tidak terbaca. Dibiarkan utuh (cadangan {file}). Cache aplikasi dipakai.",
  "softwareTeamDlc.pipelineFileHostError": "Tidak dapat menyimpan pipeline: {error}",
  "softwareTeamDlc.deliveryFilter": "Pengiriman",
  "softwareTeamDlc.deliveryFilterAll": "Semua pengiriman",
  "softwareTeamDlc.deliveryUnscoped": "Tanpa grup",
  "softwareTeamDlc.roleHistory": "Peran: {roles}",
  "softwareTeamDlc.openSdlcDocs": "Buka docs/sdlc",
  "softwareTeamDlc.openSdlcDoc": "Buka {file}",
  "softwareTeamDlc.openSdlcDocOpened": "Berkas dibuka di editor.",
  "softwareTeamDlc.openSdlcDocCopied":
    "Jalur disalin. Host tidak membuka editor untuk berkas ini.",
  "softwareTeamDlc.openSdlcDocMissing": "Berkas docs/sdlc itu tidak ada di proyek ini.",
  "softwareTeamDlc.openSdlcDocNeedHost": "Buka di editor membutuhkan Host desktop.",
  "softwareTeamDlc.openSdlcDocNeedProject":
    "Pilih folder proyek untuk membuka docs/sdlc.",
  "softwareTeamDlc.openSdlcDocBlockedHome":
    "Tidak dapat membuka docs/sdlc dari ~/.grok bersama.",
  "softwareTeamDlc.openSdlcDocHostError": "Tidak dapat membuka berkas: {error}",
  "softwareTeamDlc.deliveryDetail": "Pengiriman",
  "softwareTeamDlc.deliveryDetailHint":
    "Judul, referensi irisan bersama, riwayat peran, catatan Review/QA (Ship untuk seluruh pengiriman), langkah berikutnya, docs/sdlc, dan sesi pada irisan ini.",
  "softwareTeamDlc.openDelivery": "Buka pengiriman",
  "softwareTeamDlc.deliverySessions": "Sesi pada pengiriman ini",
  "softwareTeamDlc.deliveryNoSessions": "Belum ada sesi terikat.",
  "softwareTeamDlc.activityLog": "Aktivitas",
  "softwareTeamDlc.activityEmpty": "Belum ada aktivitas.",
  "softwareTeamDlc.activity.item_added": "Item kerja ditambahkan",
  "softwareTeamDlc.activity.stage_changed": "Tahap dipindah",
  "softwareTeamDlc.activity.handoff": "Diserahkan",
  "softwareTeamDlc.activity.notes": "Catatan diperbarui",
  "softwareTeamDlc.activity.delivery_started": "Pengiriman ini dimulai",
  "softwareTeamDlc.pipelineFileReloaded":
    "Berkas pipeline proyek lebih baru — papan diperbarui.",
  "softwareTeamDlc.notesEmpty": "Belum ada",
  "softwareTeamDlc.searchTitle": "Cari menurut judul",
  "softwareTeamDlc.stageFilter": "Tahap",
  "softwareTeamDlc.stageFilterAll": "Semua tahap",
  "softwareTeamDlc.roleFilter": "Peran",
  "softwareTeamDlc.roleFilterAll": "Semua peran",
  "softwareTeamDlc.showArchived": "Tampilkan yang diarsipkan",
  "softwareTeamDlc.archiveDelivery": "Arsipkan pengiriman",
  "softwareTeamDlc.unarchiveDelivery": "Batalkan arsip",
  "softwareTeamDlc.archived": "Diarsipkan. Tersembunyi dari papan default.",
  "softwareTeamDlc.unarchived": "Pengiriman kembali ke papan.",
  "softwareTeamDlc.activity.archived": "Diarsipkan",
  "softwareTeamDlc.activity.unarchived": "Batal diarsipkan",
  "softwareTeamDlc.exportSummary": "Ekspor ringkasan",
  "softwareTeamDlc.exportOk": "Menulis {file} di proyek ini.",
  "softwareTeamDlc.exportNeedHost":
    "Ekspor membutuhkan Host desktop. Pratinjau ini tidak akan berpura-pura menulis.",
  "softwareTeamDlc.exportNeedProject":
    "Pilih folder proyek untuk mengekspor docs/sdlc.",
  "softwareTeamDlc.exportBlockedHome":
    "Tidak dapat mengekspor ringkasan ke ~/.grok bersama.",
  "softwareTeamDlc.exportBadSlug": "Judul itu tidak bisa menjadi nama berkas.",
  "softwareTeamDlc.exportHostError": "Tidak dapat mengekspor ringkasan: {error}",
  "softwareTeamDlc.pipelineFileConflict":
    "Berkas pipeline berubah di tempat lain. Dibiarkan utuh. Papan tetap di aplikasi. Penyimpanan berikutnya menulis cadangan {file} daripada menimpa berkas.",
  "softwareTeamDlc.undo": "Urungkan perubahan terakhir",
  "softwareTeamDlc.undone": "Perubahan papan terakhir diurungkan.",
  "softwareTeamDlc.undoEmpty": "Tidak ada yang diurungkan.",
  "softwareTeamDlc.removeItemConfirm": "Hapus kartu ini?",
  "softwareTeamDlc.removeItemConfirmBody":
    "Hapus “{title}” dari papan SDLC. Sesi Grok Build tetap ada. Urungkan dapat mengembalikan kartu di jendela ini.",
  "softwareTeamDlc.removeItemConfirmAction": "Hapus kartu",
  "softwareTeamDlc.gitBranch": "Label cabang git",
  "softwareTeamDlc.gitBranchPlaceholder": "feat/slice-name",
  "softwareTeamDlc.gitBranchHint":
    "Hanya label. Software Works tidak membuat worktree, tidak checkout cabang, dan tidak menulis ulang ~/.grok.",
  "softwareTeamDlc.gitBranchSave": "Simpan label cabang",
  "softwareTeamDlc.gitBranchSaved": "Label cabang disimpan pada pengiriman ini.",
  "softwareTeamDlc.gitBranchInvalid":
    "Gunakan huruf, angka, '.', '_' atau '-' dan '/' — tanpa spasi, tanpa tanda hubung di depan.",
  "softwareTeamDlc.gitBranchSuggest": "Sarankan dari judul",
  "softwareTeamDlc.gitBranchCopy": "Salin label cabang",
  "softwareTeamDlc.gitBranchCopied": "Label cabang disalin.",
  "softwareTeamDlc.activity.item_removed": "Item kerja dihapus",
  "softwareTeamDlc.activity.git_branch": "Label cabang git diperbarui",
  "softwareTeamDlc.redo": "Ulangi",
  "softwareTeamDlc.redone": "Perubahan papan diulang.",
  "softwareTeamDlc.redoEmpty": "Tidak ada yang diulang.",
  "softwareTeamDlc.duplicateDelivery": "Duplikat pengiriman",
  "softwareTeamDlc.duplicateSuffix": " (salinan)",
  "softwareTeamDlc.duplicated": "Pengiriman diduplikasi. Kartu baru tidak terikat sesi.",
  "softwareTeamDlc.duplicateFailed": "Tidak dapat menduplikasi pengiriman ini.",
  "softwareTeamDlc.deliveryName": "Nama pengiriman",
  "softwareTeamDlc.deliveryRename": "Simpan nama",
  "softwareTeamDlc.deliveryRenamed": "Nama pengiriman disimpan.",
  "softwareTeamDlc.deliveryRenameNeedTitle": "Beri nama sebelum menyimpan.",
  "softwareTeamDlc.activity.delivery_renamed": "Nama pengiriman diubah",
  "softwareTeamDlc.activity.delivery_duplicated": "Pengiriman diduplikasi",
  "softwareTeamDlc.bindThisChat": "Ikat obrolan ini",
  "softwareTeamDlc.bindThisChatDone": "Obrolan ini terikat ke kartu.",
  "softwareTeamDlc.bindThisChatNeedSession": "Buka obrolan dulu, lalu ikat.",
  "softwareTeamDlc.bindThisChatAlready": "Obrolan ini sudah ada di kartu ini.",
  "softwareTeamDlc.unbindSessionDone": "Sesi dilepas. Obrolan tetap ada.",
  "softwareTeamDlc.moveToDelivery": "Pindah ke pengiriman",
  "softwareTeamDlc.movedToDelivery": "Kartu dipindah ke {title}.",
  "softwareTeamDlc.movedUngrouped": "Kartu tidak berkelompok.",
  "softwareTeamDlc.activity.item_moved": "Dipindah ke pengiriman lain",
  "softwareTeamDlc.activity.session_bound": "Sesi diikat",
  "softwareTeamDlc.activity.session_unbound": "Sesi dilepas",
  "softwareTeamDlc.missingRoles": "Sesi tim yang kurang: {roles}",
  "softwareTeamDlc.teamComplete":
    "Kartu Product, Architect, Engineer, Reviewer, QA, dan Writer ada di pengiriman ini.",
  "softwareTeamDlc.addSdlcDocs": "Tambah berkas docs/sdlc yang kurang",
  "softwareTeamDlc.sliceRefsHint":
    "Rencana, tujuan, dan artefak dipakai bersama di setiap kartu pengiriman ini. Menyimpan akan memperbarui semuanya.",
  "softwareTeamDlc.sliceRefsSaved": "Referensi irisan disimpan di semua kartu pengiriman ini.",
  "softwareTeamDlc.saveSliceRefs": "Simpan referensi irisan",
  "softwareTeamDlc.copySummary": "Salin ringkasan",
  "softwareTeamDlc.copySummaryOk": "Ringkasan disalin.",
  "softwareTeamDlc.copySummaryFailed": "Tidak bisa menyalin ringkasan.",
  "softwareTeamDlc.exportCopiedInstead":
    "Ringkasan disalin. Tidak ada berkas proyek yang ditulis.",
} as const;
