import { Language } from '../types';

export interface TranslationDict {
  appName: string;
  tagline: string;
  // Navigation
  navComplex: string;
  navBuildings: string;
  navDatabaseCrud?: string;
  navResidents: string;
  navBilling: string;
  navTasks: string;
  navDocuments: string;
  navAdministration: string;
  navPublicOverview: string;

  // Roles
  roleAdmin: string;
  roleManagementCompany: string;
  roleChairman: string;
  roleBoardMember: string;
  roleFinancialController: string;
  roleSiteStaff: string;
  roleResident: string;
  roleGuest: string;

  // Common UI
  switchRole: string;
  activeRole: string;
  currentLanguage: string;
  search: string;
  filter: string;
  add: string;
  edit: string;
  delete: string;
  softDelete: string;
  restore: string;
  permanentDelete: string;
  save: string;
  cancel: string;
  close: string;
  view: string;
  download: string;
  print: string;
  status: string;
  actions: string;
  confirm: string;
  refresh: string;
  details: string;
  exportCsv: string;
  all: string;
  yes: string;
  no: string;
  required: string;

  // Complex View
  complexTitle: string;
  complexSubtitle: string;
  taxInfo: string;
  bankAccountInfo: string;
  totalBlocksLabel: string;
  totalUnitsLabel: string;
  builtIn: string;
  complexRules: string;
  emergencyContacts: string;
  photoGallery: string;
  editComplexDetails: string;

  // Buildings View
  buildingsTitle: string;
  buildingsSubtitle: string;
  blockName: string;
  floorsCount: string;
  unitsCount: string;
  occupancyRate: string;
  caretakerContact: string;
  buildingDocs: string;
  addBuilding: string;

  // Residents View
  residentsTitle: string;
  residentsSubtitle: string;
  unitNo: string;
  residentName: string;
  contactInfo: string;
  nationality: string;
  ownership: string;
  owner: string;
  tenant: string;
  totalCharged: string;
  totalPaid: string;
  outstandingDebt: string;
  settled: string;
  myResidentProfile: string;
  residentLedger: string;
  recordPayment: string;
  issueManualInvoice: string;

  // Billing & Invoices View
  billingTitle: string;
  billingSubtitle: string;
  annualCharges: string;
  defineAnnualCharge: string;
  yearLabel: string;
  amountLabel: string;
  sendToAll: string;
  sendToAllDesc: string;
  sendToAllSuccess: string;
  invoicesList: string;
  invoiceNo: string;
  dueDate: string;
  paid: string;
  unpaid: string;
  partial: string;
  overdue: string;
  pdfInvoice: string;
  totalCollected: string;
  totalReceivables: string;
  collectionRate: string;
  paymentReceipt: string;
  paymentMethod: string;
  referenceCode: string;

  // Tasks & Tenders View
  tasksTitle: string;
  tasksSubtitle: string;
  createTask: string;
  requiresTender: string;
  tenderOffers: string;
  financialAudit: string;
  boardApproval: string;
  financialControllerChecklist: string;
  tenderCompleted: string;
  proposalsVerified: string;
  priceReasonable: string;
  taxInvoiceAttached: string;
  boardApproved: string;
  proofAttached: string;
  auditCorrect: string;
  auditDiscrepancy: string;
  auditPending: string;
  voteApprove: string;
  voteReject: string;
  estimatedCost: string;
  selectedContractor: string;

  // Documents & Soft-Delete View
  documentsTitle: string;
  documentsSubtitle: string;
  documentCategory: string;
  uploadDocument: string;
  softDeletedNotice: string;
  markedByManagement: string;
  adminRestrictedDelete: string;
  managementSoftDeleteNote: string;
  categories: {
    regulations: string;
    minutes: string;
    financial_reports: string;
    contracts: string;
    invoices: string;
    technical: string;
    insurance: string;
  };

  // Administration View
  adminTitle: string;
  adminSubtitle: string;
  userAccounts: string;
  rolePermissionMatrix: string;
  auditTrail: string;
  permissionCanView: string;
  permissionCanEdit: string;
  permissionCanDelete: string;
  permissionCanAudit: string;
  permissionCanBill: string;

  // Guest View
  guestWelcome: string;
  guestDesc: string;
  publicPhotos: string;
  siteRegulations: string;
  locationInfo: string;
  contactOffice: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    appName: "ComplexManager",
    tagline: "Residential Complex Management for Türkiye",
    navComplex: "Complex (Site)",
    navBuildings: "Buildings",
    navResidents: "Residents",
    navBilling: "Billing & Charges",
    navTasks: "Tasks & Tenders",
    navDocuments: "Documents",
    navAdministration: "Administration",
    navPublicOverview: "Public Overview",

    roleAdmin: "Admin",
    roleManagementCompany: "Management Company",
    roleChairman: "Board Chairman",
    roleBoardMember: "Board Member",
    roleFinancialController: "Financial Controller",
    roleSiteStaff: "Site Staff (Kapıcı)",
    roleResident: "Resident",
    roleGuest: "Guest (Visitor)",

    switchRole: "Switch Role",
    activeRole: "Active Role",
    currentLanguage: "Language",
    search: "Search...",
    filter: "Filter",
    add: "Add New",
    edit: "Edit",
    delete: "Delete",
    softDelete: "Soft Delete (Archive)",
    restore: "Restore Item",
    permanentDelete: "Permanent Delete",
    save: "Save Changes",
    cancel: "Cancel",
    close: "Close",
    view: "View Details",
    download: "Download",
    print: "Print / Save PDF",
    status: "Status",
    actions: "Actions",
    confirm: "Confirm",
    refresh: "Refresh",
    details: "Details",
    exportCsv: "Export Data",
    all: "All",
    yes: "Yes",
    no: "No",
    required: "Required",

    complexTitle: "Residential Complex Details",
    complexSubtitle: "Official site registry, banking data and general specifications",
    taxInfo: "Tax Registry & Office",
    bankAccountInfo: "Official Complex Bank Account (Site IBAN)",
    totalBlocksLabel: "Residential Blocks",
    totalUnitsLabel: "Total Units / Apartments",
    builtIn: "Construction Year",
    complexRules: "Site Regulations & House Rules",
    emergencyContacts: "Emergency & Operational Contacts",
    photoGallery: "Complex Media Gallery",
    editComplexDetails: "Edit Complex Data",

    buildingsTitle: "Building Blocks",
    buildingsSubtitle: "Manage structural blocks, floors, caretaker assignments and documents",
    blockName: "Block Code & Name",
    floorsCount: "Floors",
    unitsCount: "Units",
    occupancyRate: "Occupancy",
    caretakerContact: "Assigned Caretaker (Kapıcı)",
    buildingDocs: "Technical Docs",
    addBuilding: "Add Building Block",

    residentsTitle: "Residents & Unit Ledgers",
    residentsSubtitle: "Unit ownership, billing balances, invoice archives and payment status",
    unitNo: "Unit",
    residentName: "Resident Name",
    contactInfo: "Contact",
    nationality: "Nationality",
    ownership: "Status",
    owner: "Owner",
    tenant: "Tenant",
    totalCharged: "Total Charged",
    totalPaid: "Total Paid",
    outstandingDebt: "Remaining Debt",
    settled: "Settled (0.00)",
    myResidentProfile: "My Apartment & Financial Record",
    residentLedger: "Resident Statement of Account",
    recordPayment: "Record Payment",
    issueManualInvoice: "Issue Invoice",

    billingTitle: "Billing, Annual Dues & Invoices",
    billingSubtitle: "Define annual charges, send individualized invoices to all residents, and track payments",
    annualCharges: "Annual Site Dues (Aidat)",
    defineAnnualCharge: "Define Annual Charge",
    yearLabel: "Billing Year",
    amountLabel: "Amount per Unit",
    sendToAll: "Send to All Residents",
    sendToAllDesc: "Generates individual invoices for each apartment, updates balances and registers PDF documents.",
    sendToAllSuccess: "Successfully generated and sent invoices to all 48 residents for the selected year!",
    invoicesList: "Issued Invoices & Receipts",
    invoiceNo: "Invoice #",
    dueDate: "Due Date",
    paid: "Paid in Full",
    unpaid: "Unpaid",
    partial: "Partially Paid",
    overdue: "Overdue",
    pdfInvoice: "Invoice PDF",
    totalCollected: "Total Collected",
    totalReceivables: "Total Outstanding Dues",
    collectionRate: "Collection Rate",
    paymentReceipt: "Payment Receipt",
    paymentMethod: "Payment Method",
    referenceCode: "Bank Reference No",

    tasksTitle: "Site Maintenance, Tenders & Procurement",
    tasksSubtitle: "Task workflows with contractor tenders, Financial Controller audits, and Board approvals",
    createTask: "Create Maintenance Task",
    requiresTender: "Requires Tender (> €500)",
    tenderOffers: "Contractor Commercial Proposals",
    financialAudit: "Financial Controller Audit",
    boardApproval: "Board of Directors Approval",
    financialControllerChecklist: "Financial Controller Inspection Checklist",
    tenderCompleted: "Tender procedure completed with ≥ 3 quotes",
    proposalsVerified: "Contractor registration & tax verification confirmed",
    priceReasonable: "Price matches local Antalya market standards",
    taxInvoiceAttached: "Official Turkish e-Fatura attached",
    boardApproved: "Board approval registered by Chairman/Members",
    proofAttached: "Photographic proof of completed work attached",
    auditCorrect: "Audit Verified (Financially Sound)",
    auditDiscrepancy: "Discrepancy / Price Flagged",
    auditPending: "Pending Controller Review",
    voteApprove: "Approve Task",
    voteReject: "Reject Task",
    estimatedCost: "Estimated Cost",
    selectedContractor: "Selected Contractor",

    documentsTitle: "Official Document Repository",
    documentsSubtitle: "Governing site documents, meeting minutes, contracts and soft-delete governance",
    documentCategory: "Category",
    uploadDocument: "Upload Document",
    softDeletedNotice: "Marked for Deletion by Management Company (Hidden from others)",
    markedByManagement: "Marked for deletion by Management Company",
    adminRestrictedDelete: "Management Company can only soft-delete. Only Admin can permanently remove.",
    managementSoftDeleteNote: "Items you delete will be hidden from residents but preserved for Board/Admin audit review.",
    categories: {
      regulations: "Regulations & By-laws",
      minutes: "Board & General Meeting Minutes",
      financial_reports: "Financial Reports & Audit Summaries",
      contracts: "Maintenance & Service Contracts",
      invoices: "Official Invoices & Tax Bills",
      technical: "Technical Plans & Permits",
      insurance: "Site Insurance Policies"
    },

    adminTitle: "System Administration & Governance",
    adminSubtitle: "User access, granular role permissions, and immutable audit logs",
    userAccounts: "System Accounts & Roles",
    rolePermissionMatrix: "Permission Matrix by Role",
    auditTrail: "System Audit Log (Security & Actions)",
    permissionCanView: "View Records",
    permissionCanEdit: "Edit & Update",
    permissionCanDelete: "Permanent Delete",
    permissionCanAudit: "Financial Audit Sign-off",
    permissionCanBill: "Manage Dues & Invoices",

    guestWelcome: "Welcome to Sunset Bay Residence (Günbatımı Evleri)",
    guestDesc: "A prestigious residential community in Alanya, Antalya, Türkiye.",
    publicPhotos: "Site Photo Gallery",
    siteRegulations: "General Community Overview & Rules",
    locationInfo: "Address & Site Office Location",
    contactOffice: "Site Caretaker & Management Office"
  },

  ru: {
    appName: "ComplexManager",
    tagline: "Система управления жилым комплексом (ситом) в Турции",
    navComplex: "Жилой комплекс (Сайт)",
    navBuildings: "Корпуса / Блоки",
    navResidents: "Жильцы и квартиры",
    navBilling: "Начисления и квитанции",
    navTasks: "Задачи и тендеры",
    navDocuments: "Документы",
    navAdministration: "Администрирование",
    navPublicOverview: "Публичный обзор",

    roleAdmin: "Администратор (Admin)",
    roleManagementCompany: "Управляющая компания (MC)",
    roleChairman: "Председатель правления (Chairman)",
    roleBoardMember: "Член правления (Board)",
    roleFinancialController: "Финконтролёр (Controller)",
    roleSiteStaff: "Персонал / Смотритель (Kapıcı)",
    roleResident: "Жилец (Resident)",
    roleGuest: "Гость (Guest)",

    switchRole: "Сменить роль",
    activeRole: "Текущая роль",
    currentLanguage: "Язык",
    search: "Поиск...",
    filter: "Фильтр",
    add: "Добавить",
    edit: "Редактировать",
    delete: "Удалить",
    softDelete: "Пометить на удаление (Soft Delete)",
    restore: "Восстановить",
    permanentDelete: "Удалить навсегда",
    save: "Сохранить",
    cancel: "Отмена",
    close: "Закрыть",
    view: "Просмотр",
    download: "Скачать",
    print: "Печать / PDF",
    status: "Статус",
    actions: "Действия",
    confirm: "Подтвердить",
    refresh: "Обновить",
    details: "Подробности",
    exportCsv: "Экспорт",
    all: "Все",
    yes: "Да",
    no: "Нет",
    required: "Обязательно",

    complexTitle: "Информация о жилом комплексе",
    complexSubtitle: "Официальный реестр комплекса, банковские реквизиты и характеристики",
    taxInfo: "Налоговый номер и инспекция",
    bankAccountInfo: "Официальный банковский счёт комплекса (IBAN)",
    totalBlocksLabel: "Жилых блоков (корпусов)",
    totalUnitsLabel: "Всего квартир (апартаментов)",
    builtIn: "Год постройки",
    complexRules: "Правила проживания в комплексе",
    emergencyContacts: "Экстренные и оперативные контакты",
    photoGallery: "Медиагалерея комплекса",
    editComplexDetails: "Редактировать данные комплекса",

    buildingsTitle: "Корпуса (Блоки)",
    buildingsSubtitle: "Управление блоками, этажностью, смотрителями и техпаспортами",
    blockName: "Код и наименование блока",
    floorsCount: "Этажей",
    unitsCount: "Квартир",
    occupancyRate: "Заселённость",
    caretakerContact: "Закреплённый смотритель (Kapıcı)",
    buildingDocs: "Документы блока",
    addBuilding: "Добавить корпус",

    residentsTitle: "Жильцы и лицевые счета",
    residentsSubtitle: "Собственники, начисления, история оплат и долговые балансы",
    unitNo: "Кв.",
    residentName: "Ф.И.О. жильца",
    contactInfo: "Контакты",
    nationality: "Гражданство",
    ownership: "Статус",
    owner: "Собственник",
    tenant: "Арендатор",
    totalCharged: "Всего начислено",
    totalPaid: "Всего оплачено",
    outstandingDebt: "Остаток долга",
    settled: "Оплачено (0.00)",
    myResidentProfile: "Мой лицевой счёт и квартира",
    residentLedger: "Ведомость взаиморасчётов",
    recordPayment: "Внести платёж",
    issueManualInvoice: "Выставить квитанцию",

    billingTitle: "Начисления, годовой айдат и квитанции",
    billingSubtitle: "Установка годового взноса, формирование персональных квитанций и контроль оплат",
    annualCharges: "Годовые начисления (Айдат)",
    defineAnnualCharge: "Установить годовой айдат",
    yearLabel: "Расчётный год",
    amountLabel: "Сумма на квартиру",
    sendToAll: "Отправить всем жильцам (Send to All)",
    sendToAllDesc: "Формирует индивидуальные квитанции для каждой квартиры, обновляет сальдо и прикрепляет PDF.",
    sendToAllSuccess: "Квитанции успешно сформированы и разосланы 48 жильцам на выбранный год!",
    invoicesList: "Выставленные квитанции и счета",
    invoiceNo: "Квитанция №",
    dueDate: "Срок оплаты",
    paid: "Оплачено",
    unpaid: "Не оплачено",
    partial: "Частично",
    overdue: "Просрочено",
    pdfInvoice: "Квитанция PDF",
    totalCollected: "Всего собрано",
    totalReceivables: "Общая задолженность",
    collectionRate: "Процент сбора",
    paymentReceipt: "Платёжный ордер",
    paymentMethod: "Способ оплаты",
    referenceCode: "Банковский референс",

    tasksTitle: "Задачи, закупки и тендеры",
    tasksSubtitle: "Процесс исполнения работ: предложения подрядчиков, аудит финконтролёра и одобрение правления",
    createTask: "Создать задачу",
    requiresTender: "Требуется тендер (> €500)",
    tenderOffers: "Коммерческие предложения подрядчиков",
    financialAudit: "Проверка финансового контролёра",
    boardApproval: "Утверждение Правлением (Board)",
    financialControllerChecklist: "Контрольный чек-лист финконтролёра",
    tenderCompleted: "Тендер проведён (не менее 3 предложений)",
    proposalsVerified: "Подрядчики проверены в налоговом реестре",
    priceReasonable: "Стоимость соответствует рынку Антальи/Аланьи",
    taxInvoiceAttached: "Приложен официальный счёт-фактура (e-Fatura)",
    boardApproved: "Одобрение правления зарегистрировано",
    proofAttached: "Фотофиксация выполненных работ приложена",
    auditCorrect: "Проверка пройдена (Без замечаний)",
    auditDiscrepancy: "Выявлено расхождение цен",
    auditPending: "Ожидает проверки финконтролёром",
    voteApprove: "Утвердить задачу",
    voteReject: "Отклонить",
    estimatedCost: "Ориентировочная стоимость",
    selectedContractor: "Выбранный подрядчик",

    documentsTitle: "Реестр официальных документов",
    documentsSubtitle: "Протоколы собраний, договоры, отчёты и контроль удаления управляющей компанией",
    documentCategory: "Категория",
    uploadDocument: "Загрузить документ",
    softDeletedNotice: "Помечен на удаление УК (скрыт от жильцов и УК)",
    markedByManagement: "Помечен на удаление Управляющей Компанией",
    adminRestrictedDelete: "УК может только помечать на удаление. Окончательно удаляет только Администратор.",
    managementSoftDeleteNote: "Удалённые вами файлы скрываются из общего доступа, но остаются у Администратора для аудита.",
    categories: {
      regulations: "Устав и правила проживания",
      minutes: "Протоколы собраний правления",
      financial_reports: "Финансовые отчёты и ревизии",
      contracts: "Договоры подряда и обслуживания",
      invoices: "Официальные накладные и счета",
      technical: "Технические паспорта и схемы",
      insurance: "Страховые полисы комплекса"
    },

    adminTitle: "Администрирование и безопасность",
    adminSubtitle: "Управление аккаунтами, матрица ролевых прав и журнал действий",
    userAccounts: "Пользователи и роли",
    rolePermissionMatrix: "Матрица прав доступа",
    auditTrail: "Журнал аудита действий (Audit Log)",
    permissionCanView: "Просмотр",
    permissionCanEdit: "Редактирование",
    permissionCanDelete: "Полное удаление",
    permissionCanAudit: "Финконтроль и подпись",
    permissionCanBill: "Управление начислениями",

    guestWelcome: "Добро пожаловать в Sunset Bay Residence (Günbatımı Evleri)",
    guestDesc: "Жилой комплекс премиум-класса в Аланье (Анталья, Турция).",
    publicPhotos: "Фотогалерея комплекса",
    siteRegulations: "Общая информация и правила",
    locationInfo: "Адрес и офис смотрителя",
    contactOffice: "Контакты смотрителя и правления"
  },

  tr: {
    appName: "ComplexManager",
    tagline: "Türkiye Site ve Toplu Konut Yönetim Sistemi",
    navComplex: "Site Bilgileri",
    navBuildings: "Bloklar",
    navResidents: "Sakinler & Daireler",
    navBilling: "Aidat & Faturalar",
    navTasks: "İşler & İhaleler",
    navDocuments: "Belgeler",
    navAdministration: "Yönetim Paneli",
    navPublicOverview: "Genel Bakış",

    roleAdmin: "Sistem Yöneticisi (Admin)",
    roleManagementCompany: "Yönetim Şirketi",
    roleChairman: "Site Yönetim Kurulu Başkanı",
    roleBoardMember: "Yönetim Kurulu Üyesi",
    roleFinancialController: "Denetçi (Finansal Kontrolör)",
    roleSiteStaff: "Site Görevlisi (Kapıcı)",
    roleResident: "Kat Maliki / Sakin",
    roleGuest: "Ziyaretçi (Misafir)",

    switchRole: "Rol Değiştir",
    activeRole: "Aktif Rol",
    currentLanguage: "Dil",
    search: "Ara...",
    filter: "Filtrele",
    add: "Yeni Ekle",
    edit: "Düzenle",
    delete: "Sil",
    softDelete: "Silme İşareti Koy (Arşivle)",
    restore: "Geri Yükle",
    permanentDelete: "Kalıcı Olarak Sil",
    save: "Kaydet",
    cancel: "İptal",
    close: "Kapat",
    view: "İncele",
    download: "İndir",
    print: "Yazdır / PDF",
    status: "Durum",
    actions: "İşlemler",
    confirm: "Onayla",
    refresh: "Yenile",
    details: "Detaylar",
    exportCsv: "Dışa Aktar",
    all: "Tümü",
    yes: "Evet",
    no: "Hayır",
    required: "Zorunlu",

    complexTitle: "Site Resmi Bilgileri",
    complexSubtitle: "Site karar defteri, banka hesapları ve genel tesis özellikleri",
    taxInfo: "Vergi No ve Vergi Dairesi",
    bankAccountInfo: "Site Resmi Banka Hesabı (IBAN)",
    totalBlocksLabel: "Blok Sayısı",
    totalUnitsLabel: "Toplam Bağımsız Bölüm (Daire)",
    builtIn: "Yapım Yılı",
    complexRules: "Site Yaşam Kuralları ve Yönetim Planı",
    emergencyContacts: "Acil Durum & Görevli İletişim",
    photoGallery: "Site Fotoğraf Galerisi",
    editComplexDetails: "Site Bilgilerini Düzenle",

    buildingsTitle: "Site Blokları",
    buildingsSubtitle: "Kat sayıları, kapıcı görevlendirmeleri ve blok bazlı teknik dosyalar",
    blockName: "Blok Kodu ve Adı",
    floorsCount: "Kat Sayısı",
    unitsCount: "Daire Sayısı",
    occupancyRate: "Doluluk Oranı",
    caretakerContact: "Görevli Kapıcı",
    buildingDocs: "Blok Belgeleri",
    addBuilding: "Blok Ekle",

    residentsTitle: "Kat Malikleri ve Daire Hesapları",
    residentsSubtitle: "Daire mülkiyeti, tahakkuklar, ödeme geçmişi ve borç bakiyeleri",
    unitNo: "Daire No",
    residentName: "Sakin Adı Soyadı",
    contactInfo: "İletişim",
    nationality: "Uyruk",
    ownership: "Mülkiyet Durumu",
    owner: "Ev Sahibi",
    tenant: "Kiracı",
    totalCharged: "Toplam Tahakkuk",
    totalPaid: "Toplam Ödenen",
    outstandingDebt: "Kalan Borç",
    settled: "Borçsuz (0.00)",
    myResidentProfile: "Dairem ve Hesap Özeti",
    residentLedger: "Daire Cari Hesap Ekstresi",
    recordPayment: "Ödeme Girişi Yap",
    issueManualInvoice: "Makbuz / Fatura Kes",

    billingTitle: "Aidat Tahakkukları ve Makbuzlar",
    billingSubtitle: "Yıllık aidat belirleme, tüm dairelere toplu makbuz oluşturma ve ödeme takibi",
    annualCharges: "Yıllık Genel Aidat",
    defineAnnualCharge: "Yeni Yıllık Aidat Tanımla",
    yearLabel: "Dönem Yılı",
    amountLabel: "Daire Başı Tutar",
    sendToAll: "Tüm Sakinlere Gönder (Send to All)",
    sendToAllDesc: "Her daire için ayrı aidat makbuzu üretir, borç bakiyelerini günceller ve PDF oluşturur.",
    sendToAllSuccess: "Seçilen yıl için 48 dairenin tümüne aidat makbuzları başarıyla oluşturuldu!",
    invoicesList: "Kesilen Aidat Makbuzları & Faturalar",
    invoiceNo: "Makbuz No",
    dueDate: "Son Ödeme Tarihi",
    paid: "Ödendi",
    unpaid: "Ödenmedi",
    partial: "Kısmi Ödeme",
    overdue: "Gecikmiş",
    pdfInvoice: "Aidat PDF",
    totalCollected: "Toplam Tahsilat",
    totalReceivables: "Toplam Alacak (Gecikmiş)",
    collectionRate: "Tahsilat Oranı",
    paymentReceipt: "Tahsilat Makbuzu",
    paymentMethod: "Ödeme Türü",
    referenceCode: "Banka Dekont / Referans No",

    tasksTitle: "Bakım Onarım, İhaleler ve Satın Alma",
    tasksSubtitle: "Yüklenici teklifleri, denetçi kontrolleri ve yönetim kurulu onay süreçleri",
    createTask: "Bakım Talebi Oluştur",
    requiresTender: "İhale Zorunlu (> €500)",
    tenderOffers: "Yüklenici Firma Teklifleri",
    financialAudit: "Denetçi (Kontrolör) İncelemesi",
    boardApproval: "Yönetim Kurulu Onayı",
    financialControllerChecklist: "Denetçi Kontrol Listesi",
    tenderCompleted: "En az 3 teklifli ihale tamamlandı",
    proposalsVerified: "Firma vergi levhası ve yetki belgesi doğrulandı",
    priceReasonable: "Fiyat Alanya/Antalya piyasa rayicine uygun",
    taxInvoiceAttached: "Resmi e-Fatura sisteme eklendi",
    boardApproved: "Yönetim Kurulu karar defterine işlendi",
    proofAttached: "İş bitim fotoğrafı ve tutanak eklendi",
    auditCorrect: "Denetimden Geçti (Uygun)",
    auditDiscrepancy: "Fiyat Uyuşmazlığı / Şüpheli",
    auditPending: "Denetim Bekliyor",
    voteApprove: "İşi Onayla",
    voteReject: "Reddet",
    estimatedCost: "Tahmini Bütçe",
    selectedContractor: "Seçilen Yüklenici",

    documentsTitle: "Resmi Site Evrak Arşivi",
    documentsSubtitle: "Karar defterleri, sözleşmeler, denetim raporları ve silme güvenliği",
    documentCategory: "Kategori",
    uploadDocument: "Belge Yükle",
    softDeletedNotice: "Yönetim Şirketi Tarafından Silme İşaretli (Gizlendi)",
    markedByManagement: "Yönetim Şirketi tarafından silindi olarak işaretlendi",
    adminRestrictedDelete: "Yönetim şirketi kalıcı silemez; yalnızca Admin silebilir.",
    managementSoftDeleteNote: "Sildiğiniz belgeler diğer sakinlerden gizlenir ancak denetim için sistemde saklanır.",
    categories: {
      regulations: "Yönetim Planı ve Kurallar",
      minutes: "Genel Kurul & Yönetim Kurulu Kararları",
      financial_reports: "Mali Tablolar & Denetim Raporları",
      contracts: "Bakım ve Hizmet Sözleşmeleri",
      invoices: "Resmi Faturalar ve Gider Makbuzları",
      technical: "Teknik Projeler ve İskan Ruhsatları",
      insurance: "Site Ortak Alan Sigorta Poliçeleri"
    },

    adminTitle: "Sistem Yönetimi ve Güvenlik",
    adminSubtitle: "Kullanıcı rolleri, detaylı yetki matrisi ve işlem denetim kütüğü",
    userAccounts: "Kullanıcı Hesapları",
    rolePermissionMatrix: "Rol Yetki Matrisi",
    auditTrail: "Sistem İşlem Günlüğü (Audit Log)",
    permissionCanView: "Görüntüleme",
    permissionCanEdit: "Düzenleme",
    permissionCanDelete: "Kalıcı Silme",
    permissionCanAudit: "Mali Denetim Onayı",
    permissionCanBill: "Aidat & Fatura Kesme",

    guestWelcome: "Sunset Bay Sitesine (Günbatımı Evleri) Hoş Geldiniz",
    guestDesc: "Alanya, Antalya'da yer alan seçkin bir yaşam kompleksi.",
    publicPhotos: "Site Fotoğrafları",
    siteRegulations: "Genel Bilgiler ve Kurallar",
    locationInfo: "Adres ve Site Ofisi",
    contactOffice: "Site Görevlisi ve Yönetim İletişim"
  },

  fr: {
    appName: "ComplexManager",
    tagline: "Gestion de Résidence et Copropriété en Turquie",
    navComplex: "Résidence (Site)",
    navBuildings: "Bâtiments",
    navResidents: "Résidents",
    navBilling: "Charges & Factures",
    navTasks: "Travaux & Appels d'offres",
    navDocuments: "Documents",
    navAdministration: "Administration",
    navPublicOverview: "Aperçu Public",

    roleAdmin: "Administrateur",
    roleManagementCompany: "Société de Gestion",
    roleChairman: "Président du Conseil",
    roleBoardMember: "Membre du Conseil",
    roleFinancialController: "Contrôleur Financier",
    roleSiteStaff: "Gardien / Concierge (Kapıcı)",
    roleResident: "Résident",
    roleGuest: "Visiteur (Invité)",

    switchRole: "Changer de rôle",
    activeRole: "Rôle actif",
    currentLanguage: "Langue",
    search: "Recherche...",
    filter: "Filtrer",
    add: "Ajouter",
    edit: "Modifier",
    delete: "Supprimer",
    softDelete: "Marquer comme supprimé (Archiver)",
    restore: "Restaurer",
    permanentDelete: "Suppression définitive",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    view: "Détails",
    download: "Télécharger",
    print: "Imprimer / PDF",
    status: "Statut",
    actions: "Actions",
    confirm: "Confirmer",
    refresh: "Actualiser",
    details: "Détails",
    exportCsv: "Exporter",
    all: "Tous",
    yes: "Oui",
    no: "Non",
    required: "Obligatoire",

    complexTitle: "Détails de la Résidence",
    complexSubtitle: "Informations officielles, coordonnées bancaires et caractéristiques générales",
    taxInfo: "Numéro fiscal et bureau des impôts",
    bankAccountInfo: "Compte bancaire officiel de la résidence (IBAN)",
    totalBlocksLabel: "Nombre de blocs",
    totalUnitsLabel: "Total d'appartements",
    builtIn: "Année de construction",
    complexRules: "Règlement intérieur de la résidence",
    emergencyContacts: "Contacts d'urgence et gardien",
    photoGallery: "Galerie de photos",
    editComplexDetails: "Modifier les données de la résidence",

    buildingsTitle: "Blocs Résidentiels",
    buildingsSubtitle: "Gestion des blocs, étages, gardiens et documents techniques",
    blockName: "Code et nom du bloc",
    floorsCount: "Étages",
    unitsCount: "Appartements",
    occupancyRate: "Taux d'occupation",
    caretakerContact: "Gardien assigné (Kapıcı)",
    buildingDocs: "Documents du bloc",
    addBuilding: "Ajouter un bloc",

    residentsTitle: "Résidents & Comptes Individuels",
    residentsSubtitle: "Propriété, charges annuelles, historique de paiement et soldes",
    unitNo: "Appt",
    residentName: "Nom du résident",
    contactInfo: "Contact",
    nationality: "Nationalité",
    ownership: "Statut",
    owner: "Propriétaire",
    tenant: "Locataire",
    totalCharged: "Total facturé",
    totalPaid: "Total payé",
    outstandingDebt: "Solde restant",
    settled: "À jour (0.00)",
    myResidentProfile: "Mon appartement & Relevé de compte",
    residentLedger: "Grand livre du résident",
    recordPayment: "Enregistrer un paiement",
    issueManualInvoice: "Émettre une facture",

    billingTitle: "Facturation & Charges Annuelles",
    billingSubtitle: "Définition des charges, génération d'avis individuels et suivi des paiements",
    annualCharges: "Charges Annuelles (Aidat)",
    defineAnnualCharge: "Définir la charge annuelle",
    yearLabel: "Année de facturation",
    amountLabel: "Montant par appartement",
    sendToAll: "Envoyer à tous les résidents",
    sendToAllDesc: "Génère un avis individuel pour chaque appartement et met à jour les soldes.",
    sendToAllSuccess: "Factures générées et envoyées avec succès aux 48 résidents !",
    invoicesList: "Factures et reçus émis",
    invoiceNo: "Facture N°",
    dueDate: "Date d'échéance",
    paid: "Payé",
    unpaid: "Impayé",
    partial: "Partiellement payé",
    overdue: "En retard",
    pdfInvoice: "Facture PDF",
    totalCollected: "Total recouvré",
    totalReceivables: "Créances totales",
    collectionRate: "Taux de recouvrement",
    paymentReceipt: "Reçu de paiement",
    paymentMethod: "Mode de paiement",
    referenceCode: "Référence bancaire",

    tasksTitle: "Maintenance, Travaux & Appels d'offres",
    tasksSubtitle: "Flux de travaux : devis prestataires, vérification financière et validation du Conseil",
    createTask: "Créer une tâche",
    requiresTender: "Appel d'offres requis (> €500)",
    tenderOffers: "Offres commerciales des prestataires",
    financialAudit: "Audit du Contrôleur Financier",
    boardApproval: "Approbation du Conseil d'Administration",
    financialControllerChecklist: "Checklist de vérification financière",
    tenderCompleted: "Procédure d'appel d'offres complétée (≥ 3 devis)",
    proposalsVerified: "Vérification fiscale de l'entreprise confirmée",
    priceReasonable: "Prix conforme au marché d'Antalya",
    taxInvoiceAttached: "Facture électronique officielle (e-Fatura) jointe",
    boardApproved: "Approbation du conseil enregistrée",
    proofAttached: "Preuve photo des travaux achevés fournie",
    auditCorrect: "Audit validé (Sans anomalie)",
    auditDiscrepancy: "Écart de prix / Anomalie signalée",
    auditPending: "En attente de contrôle",
    voteApprove: "Approuver la tâche",
    voteReject: "Rejeter",
    estimatedCost: "Coût estimé",
    selectedContractor: "Prestataire retenu",

    documentsTitle: "Répertoire Officiel des Documents",
    documentsSubtitle: "Règlements, procès-verbaux, contrats et traçabilité de suppression",
    documentCategory: "Catégorie",
    uploadDocument: "Téléverser un document",
    softDeletedNotice: "Marqué pour suppression par la société de gestion (Masqué)",
    markedByManagement: "Marqué pour suppression par la Société de Gestion",
    adminRestrictedDelete: "La société de gestion ne peut qu'archiver. Seul l'Admin peut supprimer définitivement.",
    managementSoftDeleteNote: "Les fichiers supprimés sont masqués pour les résidents mais conservés pour l'audit.",
    categories: {
      regulations: "Règlements de copropriété",
      minutes: "Procès-verbaux d'assemblée",
      financial_reports: "Rapports financiers & bilans",
      contracts: "Contrats de maintenance",
      invoices: "Factures officielles & justificatifs",
      technical: "Plans techniques & permis",
      insurance: "Polices d'assurance"
    },

    adminTitle: "Administration & Sécurité",
    adminSubtitle: "Gestion des utilisateurs, matrice des droits et journal d'audit",
    userAccounts: "Comptes utilisateurs",
    rolePermissionMatrix: "Matrice des permissions",
    auditTrail: "Journal d'audit du système",
    permissionCanView: "Lecture",
    permissionCanEdit: "Modification",
    permissionCanDelete: "Suppression définitive",
    permissionCanAudit: "Contrôle financier",
    permissionCanBill: "Gestion des charges",

    guestWelcome: "Bienvenue à la Résidence Sunset Bay (Günbatımı Evleri)",
    guestDesc: "Une résidence de prestige à Alanya, Antalya, Turquie.",
    publicPhotos: "Galerie de photos",
    siteRegulations: "Informations générales et règles",
    locationInfo: "Adresse & Bureau de la résidence",
    contactOffice: "Contact du gardien et du syndic"
  },

  da: {
    appName: "ComplexManager",
    tagline: "Boligkompleks Administration for Tyrkiet",
    navComplex: "Kompleks (Site)",
    navBuildings: "Bygninger",
    navResidents: "Beboere",
    navBilling: "Opkrævninger & Regninger",
    navTasks: "Opgaver & Udbud",
    navDocuments: "Dokumenter",
    navAdministration: "Administration",
    navPublicOverview: "Offentlig Oversigt",

    roleAdmin: "Administrator",
    roleManagementCompany: "Administrationsselskab",
    roleChairman: "Bestyrelsesformand",
    roleBoardMember: "Bestyrelsesmedlem",
    roleFinancialController: "Revisor / Finanskontrol",
    roleSiteStaff: "Vicevært / Personale (Kapıcı)",
    roleResident: "Beboer / Ejer",
    roleGuest: "Gæst (Besøgende)",

    switchRole: "Skift Rolle",
    activeRole: "Aktiv Rolle",
    currentLanguage: "Sprog",
    search: "Søg...",
    filter: "Filtrer",
    add: "Tilføj Ny",
    edit: "Rediger",
    delete: "Slet",
    softDelete: "Marker som slettet (Arkiver)",
    restore: "Gendan",
    permanentDelete: "Permanent sletning",
    save: "Gem ændringer",
    cancel: "Annuller",
    close: "Luk",
    view: "Vis detaljer",
    download: "Download",
    print: "Udskriv / PDF",
    status: "Status",
    actions: "Handlinger",
    confirm: "Bekræft",
    refresh: "Opdater",
    details: "Detaljer",
    exportCsv: "Eksporter",
    all: "Alle",
    yes: "Ja",
    no: "Nej",
    required: "Påkrævet",

    complexTitle: "Boligkompleks Detaljer",
    complexSubtitle: "Officielle oplysninger, bankoplysninger og faciliteter",
    taxInfo: "Skattenummer og skattekontor",
    bankAccountInfo: "Officiel bankkonto for komplekset (IBAN)",
    totalBlocksLabel: "Antal blokke",
    totalUnitsLabel: "Samlet antal lejligheder",
    builtIn: "Byggeår",
    complexRules: "Husorden og vedtægter",
    emergencyContacts: "Nødkontakter og vicevært",
    photoGallery: "Billedgalleri",
    editComplexDetails: "Rediger kompleksdata",

    buildingsTitle: "Boligblokke",
    buildingsSubtitle: "Administrer blokke, etager, viceværter og tekniske dokumenter",
    blockName: "Bloknavn & Kode",
    floorsCount: "Etager",
    unitsCount: "Lejligheder",
    occupancyRate: "Belægningsgrad",
    caretakerContact: "Tilknyttet vicevært (Kapıcı)",
    buildingDocs: "Blokdokumenter",
    addBuilding: "Tilføj Blok",

    residentsTitle: "Beboere & Kontoudtog",
    residentsSubtitle: "Ejerstatus, årlige opkrævninger, betalinger og saldi",
    unitNo: "Lejl.",
    residentName: "Beboers navn",
    contactInfo: "Kontakt",
    nationality: "Nationalitet",
    ownership: "Status",
    owner: "Ejer",
    tenant: "Lejer",
    totalCharged: "Samlet opkrævet",
    totalPaid: "Samlet betalt",
    outstandingDebt: "Restgæld",
    settled: "Afregnet (0.00)",
    myResidentProfile: "Min lejlighed & Kontoudtog",
    residentLedger: "Beboerens kontokort",
    recordPayment: "Registrer betaling",
    issueManualInvoice: "Opret opkrævning",

    billingTitle: "Opkrævninger, Kontingent & Fakturaer",
    billingSubtitle: "Fastlæg årligt fælleskontingent (aidat) og udsend opkrævninger til alle beboere",
    annualCharges: "Årligt Fællesbidrag (Aidat)",
    defineAnnualCharge: "Opret årlig opkrævning",
    yearLabel: "Regnskabsår",
    amountLabel: "Beløb pr. lejlighed",
    sendToAll: "Send til alle beboere (Send to All)",
    sendToAllDesc: "Genererer individuelle opkrævninger for hver lejlighed og opdaterer saldi.",
    sendToAllSuccess: "Opkrævninger er genereret og sendt til alle 48 beboere!",
    invoicesList: "Udstedte opkrævninger & kvitteringer",
    invoiceNo: "Faktura Nr.",
    dueDate: "Forfaldsdato",
    paid: "Betalt",
    unpaid: "Ubetalt",
    partial: "Delvist betalt",
    overdue: "Forfalden",
    pdfInvoice: "Opkrævning PDF",
    totalCollected: "Samlet indbetalt",
    totalReceivables: "Samlede udeståender",
    collectionRate: "Opkrævningsprocent",
    paymentReceipt: "Indbetalingskvittering",
    paymentMethod: "Betalingsmetode",
    referenceCode: "Bankreference",

    tasksTitle: "Vedligeholdelse, Udbud & Indkøb",
    tasksSubtitle: "Opgaveforløb med tilbud, revisionskontrol og bestyrelsesgodkendelser",
    createTask: "Opret opgave",
    requiresTender: "Kræver udbud (> €500)",
    tenderOffers: "Tilbud fra leverandører",
    financialAudit: "Finansiel Revisionskontrol",
    boardApproval: "Bestyrelsesgodkendelse",
    financialControllerChecklist: "Revisors tjekliste",
    tenderCompleted: "Udbud gennemført (mindst 3 tilbud)",
    proposalsVerified: "Firmaets skatte- og momsregistrering bekræftet",
    priceReasonable: "Prisen er rimelig ift. lokalt marked i Antalya",
    taxInvoiceAttached: "Officiel e-Faktura vedhæftet",
    boardApproved: "Bestyrelsesgodkendelse registreret",
    proofAttached: "Billeddokumentation for udført arbejde vedhæftet",
    auditCorrect: "Revision godkendt (Uden anmærkninger)",
    auditDiscrepancy: "Uoverensstemmelse opdaget",
    auditPending: "Afventer revisionskontrol",
    voteApprove: "Godkend opgave",
    voteReject: "Afvis",
    estimatedCost: "Estimeret pris",
    selectedContractor: "Valgt leverandør",

    documentsTitle: "Officielt Dokumentarkiv",
    documentsSubtitle: "Vedtægter, mødereferater, kontrakter og slettesikring for administrationsselskab",
    documentCategory: "Kategori",
    uploadDocument: "Upload dokument",
    softDeletedNotice: "Markeret som slettet af administrationsselskab (Skjult)",
    markedByManagement: "Markeret som slettet af administrationsselskab",
    adminRestrictedDelete: "Administrationsselskabet kan kun arkivere. Kun Admin kan slette permanent.",
    managementSoftDeleteNote: "Filer du sletter skjules for beboere, men bevares for revision.",
    categories: {
      regulations: "Vedtægter og husorden",
      minutes: "Bestyrelses- og generalforsamlingsreferater",
      financial_reports: "Finansielle rapporter og årsregnskaber",
      contracts: "Service- og håndværkeraftaler",
      invoices: "Officielle fakturaer og bilag",
      technical: "Tekniske tegninger og tilladelser",
      insurance: "Forsikringspolicer"
    },

    adminTitle: "Systemadministration & Sikkerhed",
    adminSubtitle: "Brugerkonti, rettighedsmatrix og uforanderlig revisionslog",
    userAccounts: "Brugerkonti & Roller",
    rolePermissionMatrix: "Rettighedsmatrix efter rolle",
    auditTrail: "Systemhændelseslog (Audit Log)",
    permissionCanView: "Visning",
    permissionCanEdit: "Redigering",
    permissionCanDelete: "Permanent sletning",
    permissionCanAudit: "Finanskontrol",
    permissionCanBill: "Opkrævninger",

    guestWelcome: "Velkommen til Sunset Bay Residence (Günbatımı Evleri)",
    guestDesc: "Et prestigefyldt boligkompleks i Alanya, Antalya, Tyrkiet.",
    publicPhotos: "Billedgalleri",
    siteRegulations: "Generel information og regler",
    locationInfo: "Adresse & Kontor",
    contactOffice: "Vicevært og administration kontakt"
  },

  sv: {
    appName: "ComplexManager",
    tagline: "Fastighetsförvaltning för Bostadsrättskomplex i Turkiet",
    navComplex: "Komplex (Site)",
    navBuildings: "Byggnader",
    navResidents: "Boende",
    navBilling: "Avgifter & Fakturor",
    navTasks: "Underhåll & Upphandling",
    navDocuments: "Dokument",
    navAdministration: "Administration",
    navPublicOverview: "Offentlig Översikt",

    roleAdmin: "Administratör",
    roleManagementCompany: "Förvaltningsbolag",
    roleChairman: "Styrelseordförande",
    roleBoardMember: "Styrelseledamot",
    roleFinancialController: "Ekonomisk Revisor",
    roleSiteStaff: "Fastighetsskötare (Kapıcı)",
    roleResident: "Boende / Lägenhetsägare",
    roleGuest: "Gäst (Besökare)",

    switchRole: "Byt Roll",
    activeRole: "Aktiv Roll",
    currentLanguage: "Språk",
    search: "Sök...",
    filter: "Filtrera",
    add: "Lägg till",
    edit: "Redigera",
    delete: "Ta bort",
    softDelete: "Markera som raderad (Arkivera)",
    restore: "Återställ",
    permanentDelete: "Permanent radering",
    save: "Spara ändringar",
    cancel: "Avbryt",
    close: "Stäng",
    view: "Visa detaljer",
    download: "Ladda ner",
    print: "Skriv ut / PDF",
    status: "Status",
    actions: "Åtgärder",
    confirm: "Bekräfta",
    refresh: "Uppdatera",
    details: "Detaljer",
    exportCsv: "Exportera",
    all: "Alla",
    yes: "Ja",
    no: "Nej",
    required: "Obligatoriskt",

    complexTitle: "Information om Bostadskomplexet",
    complexSubtitle: "Officiella föreningsuppgifter, bankkonton och anläggningsfakta",
    taxInfo: "Skattenummer och skattekontor",
    bankAccountInfo: "Komplexets officiella bankkonto (IBAN)",
    totalBlocksLabel: "Antal block/byggnader",
    totalUnitsLabel: "Totalt antal lägenheter",
    builtIn: "Byggår",
    complexRules: "Föreningsstadgar och ordningsregler",
    emergencyContacts: "Nödkontakter och fastighetsskötare",
    photoGallery: "Bildgalleri",
    editComplexDetails: "Redigera information",

    buildingsTitle: "Byggnadsblock",
    buildingsSubtitle: "Hantera block, våningar, fastighetsskötare och tekniska dokument",
    blockName: "Blockkod och namn",
    floorsCount: "Våningar",
    unitsCount: "Lägenheter",
    occupancyRate: "Beläggningsgrad",
    caretakerContact: "Fastighetsskötare (Kapıcı)",
    buildingDocs: "Blockdokument",
    addBuilding: "Lägg till block",

    residentsTitle: "Boende & Lägenhetsreskontra",
    residentsSubtitle: "Ägarförhållanden, årsavgifter, betalningshistorik och saldon",
    unitNo: "Lgh",
    residentName: "Namn på boende",
    contactInfo: "Kontakt",
    nationality: "Nationalitet",
    ownership: "Status",
    owner: "Ägare",
    tenant: "Hyresgäst",
    totalCharged: "Totalt debiterat",
    totalPaid: "Totalt inbetalt",
    outstandingDebt: "Kvarvarande skuld",
    settled: "Reglerad (0.00)",
    myResidentProfile: "Min lägenhet & Kontoutdrag",
    residentLedger: "Boendekontoutdrag",
    recordPayment: "Registrera inbetalning",
    issueManualInvoice: "Skapa faktura",

    billingTitle: "Avgifter, Årsdebitering & Fakturor",
    billingSubtitle: "Definiera årlig medlemsavgift (aidat), skicka ut fakturor till alla och följ inbetalningar",
    annualCharges: "Årlig Månads-/Årsavgift (Aidat)",
    defineAnnualCharge: "Fastställ årsavgift",
    yearLabel: "Räkenskapsår",
    amountLabel: "Belopp per lägenhet",
    sendToAll: "Skicka till alla boende (Send to All)",
    sendToAllDesc: "Skapar individuella fakturor för varje lägenhet och uppdaterar saldon automatiskt.",
    sendToAllSuccess: "Fakturor har skapats och skickats till alla 48 lägenheter!",
    invoicesList: "Utfärdade fakturor & kvitton",
    invoiceNo: "Faktura Nr",
    dueDate: "Förfallodatum",
    paid: "Betald",
    unpaid: "Obetald",
    partial: "Delvis betald",
    overdue: "Förfallen",
    pdfInvoice: "Faktura PDF",
    totalCollected: "Totalt insamlat",
    totalReceivables: "Totala fordringar",
    collectionRate: "Inbetalningsgrad",
    paymentReceipt: "Inbetalningskvitto",
    paymentMethod: "Betalsätt",
    referenceCode: "Bankreferens",

    tasksTitle: "Underhåll, Upphandlingar & Inköp",
    tasksSubtitle: "Arbetsflöde med offerter, revisionsgranskning och styrelsebeslut",
    createTask: "Skapa underhållsärende",
    requiresTender: "Kräver upphandling (> €500)",
    tenderOffers: "Offertförslag från leverantörer",
    financialAudit: "Revisionsgranskning",
    boardApproval: "Styrelsens Godkännande",
    financialControllerChecklist: "Revisorns kontrollista",
    tenderCompleted: "Upphandling genomförd (minst 3 offerter)",
    proposalsVerified: "Företagets skatteregistrering verifierad",
    priceReasonable: "Priset överensstämmer med marknadsnivå i Antalya",
    taxInvoiceAttached: "Officiell e-Faktura bifogad",
    boardApproved: "Styrelsebeslut registrerat",
    proofAttached: "Fotodokumentation på utfört arbete bifogad",
    auditCorrect: "Revision godkänd (Utan anmärkning)",
    auditDiscrepancy: "Avvikelse / Prisflagga",
    auditPending: "Väntar på revisionskontroll",
    voteApprove: "Godkänn ärende",
    voteReject: "Avslå",
    estimatedCost: "Uppskattad kostnad",
    selectedContractor: "Vald entreprenör",

    documentsTitle: "Officiellt Dokumentarkiv",
    documentsSubtitle: "Stadgar, protokoll, avtal och raderingsskydd för förvaltare",
    documentCategory: "Kategori",
    uploadDocument: "Ladda upp dokument",
    softDeletedNotice: "Markerad som raderad av förvaltningsbolaget (Dold)",
    markedByManagement: "Markerad som raderad av förvaltningsbolag",
    adminRestrictedDelete: "Förvaltningsbolaget kan endast arkivera. Endast Admin kan radera permanent.",
    managementSoftDeleteNote: "Filer du raderar döljs för boende men sparas för revisionskontroll.",
    categories: {
      regulations: "Stadgar och ordningsregler",
      minutes: "Styrelse- och årsmötesprotokoll",
      financial_reports: "Bokslut och revisionsberättelser",
      contracts: "Underhålls- och serviceavtal",
      invoices: "Officiella fakturor och verifikat",
      technical: "Ritningar och bygglov",
      insurance: "Fastighetsförsäkringar"
    },

    adminTitle: "Systemadministration & Säkerhet",
    adminSubtitle: "Användarkonton, behörighetsmatris och revisionslogg",
    userAccounts: "Användarkonton",
    rolePermissionMatrix: "Behörighetsmatris",
    auditTrail: "Händelselogg (Audit Log)",
    permissionCanView: "Läsa",
    permissionCanEdit: "Ändra",
    permissionCanDelete: "Permanent radering",
    permissionCanAudit: "Ekonomisk revision",
    permissionCanBill: "Fakturering & Avgifter",

    guestWelcome: "Välkommen till Sunset Bay Residence (Günbatımı Evleri)",
    guestDesc: "Ett exklusivt bostadskomplex i Alanya, Antalya, Turkiet.",
    publicPhotos: "Fotogalleri",
    siteRegulations: "Allmän information och trivselregler",
    locationInfo: "Adress och fastighetskontor",
    contactOffice: "Fastighetsskötare och styrelsekontakt"
  },

  pl: {
    appName: "ComplexManager",
    tagline: "System Zarządzania Wspólnotą Mieszkaniową w Turcji",
    navComplex: "Kompleks (Site)",
    navBuildings: "Budynki",
    navResidents: "Mieszkańcy",
    navBilling: "Opłaty i Rachunki",
    navTasks: "Zadania i Przetargi",
    navDocuments: "Dokumenty",
    navAdministration: "Administracja",
    navPublicOverview: "Przegląd Publiczny",

    roleAdmin: "Administrator",
    roleManagementCompany: "Firma Zarządzająca",
    roleChairman: "Przewodniczący Zarządu",
    roleBoardMember: "Członek Zarządu",
    roleFinancialController: "Kontroler Finansowy",
    roleSiteStaff: "Gospodarz / Dozorca (Kapıcı)",
    roleResident: "Mieszkaniec / Właściciel",
    roleGuest: "Gość (Odwiedzający)",

    switchRole: "Zmień Rolę",
    activeRole: "Aktywna Rola",
    currentLanguage: "Język",
    search: "Szukaj...",
    filter: "Filtruj",
    add: "Dodaj nowy",
    edit: "Edytuj",
    delete: "Usuń",
    softDelete: "Oznacz jako usunięte (Archiwizuj)",
    restore: "Przywróć",
    permanentDelete: "Usuń trwale",
    save: "Zapisz",
    cancel: "Anuluj",
    close: "Zamknij",
    view: "Szczegóły",
    download: "Pobierz",
    print: "Drukuj / PDF",
    status: "Status",
    actions: "Akcje",
    confirm: "Potwierdź",
    refresh: "Odśwież",
    details: "Szczegóły",
    exportCsv: "Eksportuj",
    all: "Wszystkie",
    yes: "Tak",
    no: "Nie",
    required: "Wymagane",

    complexTitle: "Dane Kompleksu Mieszkaniowego",
    complexSubtitle: "Rejestr wspólnoty, rachunki bankowe i specyfikacja techniczna",
    taxInfo: "Numer podatkowy i urząd skarbowy",
    bankAccountInfo: "Oficjalny rachunek bankowy wspólnoty (IBAN)",
    totalBlocksLabel: "Liczba bloków",
    totalUnitsLabel: "Łączna liczba lokali",
    builtIn: "Rok budowy",
    complexRules: "Regulamin porządku domowego",
    emergencyContacts: "Numery alarmowe i kontakt do dozorcy",
    photoGallery: "Galeria zdjęć",
    editComplexDetails: "Edytuj dane kompleksu",

    buildingsTitle: "Bloki Mieszkaniowe",
    buildingsSubtitle: "Zarządzanie budynkami, piętrami, dozorcami i dokumentacją",
    blockName: "Kod i nazwa bloku",
    floorsCount: "Liczba pięter",
    unitsCount: "Liczba lokali",
    occupancyRate: "Stopień zasiedlenia",
    caretakerContact: "Dedykowany dozorca (Kapıcı)",
    buildingDocs: "Dokumenty bloku",
    addBuilding: "Dodaj blok",

    residentsTitle: "Mieszkańcy i Kartoteki Lokali",
    residentsSubtitle: "Status własności, wymiar opłat, historia wpłat i salda zadłużenia",
    unitNo: "Lokal",
    residentName: "Imię i nazwisko",
    contactInfo: "Kontakt",
    nationality: "Obywatelstwo",
    ownership: "Status",
    owner: "Właściciel",
    tenant: "Najemca",
    totalCharged: "Naliczenia łączne",
    totalPaid: "Wpłaty łączne",
    outstandingDebt: "Pozostałe zadłużenie",
    settled: "Rozliczone (0.00)",
    myResidentProfile: "Mój lokal i wyciąg z konta",
    residentLedger: "Kartoteka rozrachunków",
    recordPayment: "Zarejestruj wpłatę",
    issueManualInvoice: "Wystaw rachunek",

    billingTitle: "Naliczenia, Czynsz Roczny (Aidat) i Rachunki",
    billingSubtitle: "Określanie rocznego wymiaru opłat, masowe generowanie rachunków i windykacja",
    annualCharges: "Roczny Czynsz Wspólnoty (Aidat)",
    defineAnnualCharge: "Ustal wymiar roczny",
    yearLabel: "Rok rozliczeniowy",
    amountLabel: "Kwota na lokal",
    sendToAll: "Wyślij do wszystkich mieszkańców",
    sendToAllDesc: "Generuje indywidualne rachunki dla każdego lokalu, aktualizuje salda i dołącza pliki PDF.",
    sendToAllSuccess: "Rachunki zostały pomyślnie wygenerowane i wysłane do 48 mieszkańców!",
    invoicesList: "Wystawione rachunki i pokwitowania",
    invoiceNo: "Rachunek Nr",
    dueDate: "Termin płatności",
    paid: "Opłacony",
    unpaid: "Nieopłacony",
    partial: "Częściowo opłacony",
    overdue: "Przeterminowany",
    pdfInvoice: "Rachunek PDF",
    totalCollected: "Łącznie pobrano",
    totalReceivables: "Należności zaległe",
    collectionRate: "Wskaźnik ściągalności",
    paymentReceipt: "Pokwitowanie wpłaty",
    paymentMethod: "Forma płatności",
    referenceCode: "Numer referencyjny",

    tasksTitle: "Konserwacja, Przetargi i Zakupy",
    tasksSubtitle: "Oferty wykonawców, weryfikacja kontrolera finansowego i zatwierdzenia Zarządu",
    createTask: "Utwórz zadanie",
    requiresTender: "Wymaga przetargu (> €500)",
    tenderOffers: "Oferty handlowe wykonawców",
    financialAudit: "Audyt Kontrolera Finansowego",
    boardApproval: "Zatwierdzenie przez Zarząd",
    financialControllerChecklist: "Lista kontrolna rewidenta",
    tenderCompleted: "Procedura przetargowa zakończona (≥ 3 oferty)",
    proposalsVerified: "Weryfikacja podatkowa i NIP wykonawcy potwierdzona",
    priceReasonable: "Cena zgodna ze standardami rynkowymi w Antalyi",
    taxInvoiceAttached: "Oficjalna e-Faktura (e-Fatura) dołączona",
    boardApproved: "Zatwierdzenie zarządu zarejestrowane",
    proofAttached: "Dokumentacja fotograficzna wykonanych prac dołączona",
    auditCorrect: "Audyt zatwierdzony (Bez zastrzeżeń)",
    auditDiscrepancy: "Zgłoszono rozbieżność cenową",
    auditPending: "Oczekuje na audyt",
    voteApprove: "Zatwierdź zadanie",
    voteReject: "Odrzuć",
    estimatedCost: "Szacunkowy koszt",
    selectedContractor: "Wybrany wykonawca",

    documentsTitle: "Oficjalne Archiwum Dokumentów",
    documentsSubtitle: "Uchwały, protokoły zebrań, umowy i ochrona przed usunięciem przez zarządcę",
    documentCategory: "Kategoria",
    uploadDocument: "Prześlij dokument",
    softDeletedNotice: "Oznaczony do usunięcia przez Zarządcę (Ukryty)",
    markedByManagement: "Oznaczony do usunięcia przez Firmę Zarządzającą",
    adminRestrictedDelete: "Zarządca może tylko oznaczyć do usunięcia. Trwale usuwa tylko Administrator.",
    managementSoftDeleteNote: "Usunięte pliki są ukrywane przed mieszkańcami, lecz zachowane do audytu.",
    categories: {
      regulations: "Regulaminy i statut",
      minutes: "Protokoły posiedzeń i uchwały",
      financial_reports: "Sprawozdania finansowe i bilanse",
      contracts: "Umowy serwisowe i remontowe",
      invoices: "Faktury kosztowe i rachunki",
      technical: "Projekty techniczne i pozwolenia",
      insurance: "Polisy ubezpieczeniowe"
    },

    adminTitle: "Administracja Systemem i Bezpieczeństwo",
    adminSubtitle: "Konta użytkowników, macierz uprawnień i dziennik audytu",
    userAccounts: "Konta użytkowników",
    rolePermissionMatrix: "Macierz uprawnień ról",
    auditTrail: "Dziennik zdarzeń (Audit Log)",
    permissionCanView: "Odczyt",
    permissionCanEdit: "Edycja",
    permissionCanDelete: "Trwałe usuwanie",
    permissionCanAudit: "Kontrola finansowa",
    permissionCanBill: "Zarządzanie opłatami",

    guestWelcome: "Witamy w Sunset Bay Residence (Günbatımı Evleri)",
    guestDesc: "Prestiżowy kompleks mieszkaniowy w Alanyi, Antalya, Turcja.",
    publicPhotos: "Galeria zdjęć",
    siteRegulations: "Informacje ogólne i zasady",
    locationInfo: "Adres i biuro wspólnoty",
    contactOffice: "Kontakt do dozorcy i zarządu"
  }
};
