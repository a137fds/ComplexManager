import {
  ComplexInfo,
  Building,
  Resident,
  AnnualCharge,
  Invoice,
  Payment,
  TaskItem,
  DocumentItem,
  AuditLog
} from '../types';

export const initialComplexInfo: ComplexInfo = {
  id: 'site-001',
  name: 'Sunset Bay Residence',
  nativeName: 'Günbatımı Evleri Sitesi',
  taxNumber: '3880492150',
  taxOffice: 'Alanya Vergi Dairesi',
  address: 'Barbaros Caddesi No: 142, Mahmutlar Mahallesi',
  district: 'Alanya',
  city: 'Antalya',
  country: 'Türkiye',
  postalCode: '07460',
  totalUnits: 48,
  totalBlocks: 3,
  constructionYear: 2021,
  bankName: 'Türkiye Garanti Bankası A.Ş. — Alanya Şubesi',
  iban: 'TR33 0006 2000 1122 3344 5566 77',
  swift: 'TGBATRISXXX',
  representativePhoto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  galleryPhotos: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
  ],
  rules: [
    'Quiet hours are strictly observed between 23:00 and 08:00 daily.',
    'Swimming pool is open between 08:00 and 21:00. Shower is mandatory before entering.',
    'Balconies must remain orderly. Hanging laundry visibly over balcony railings is not permitted.',
    'Common garbage collection is carried out by the site staff (kapıcı) at 09:00 and 19:00 daily.',
    'All contractors and delivery staff must check in at the site management office.'
  ],
  description: {
    en: 'Sunset Bay Residence is a premier residential community situated on the Mediterranean coast of Alanya, Türkiye. Comprising 3 modern blocks and 48 luxury apartments, the complex offers landscaped botanical gardens, semi-olympic swimming pool, 24/7 security and professional on-site concierge.',
    ru: 'Sunset Bay Residence (Günbatımı Evleri) — современный жилой комплекс на средиземноморском побережье Аланьи (Турция). Включает 3 блока и 48 квартир, закрытую территорию с бассейнами, круглосуточную охрану и штатного смотрителя.',
    tr: 'Günbatımı Evleri Sitesi, Alanya Mahmutlar sahilinde yer alan 3 blok ve 48 bağımsız bölümden oluşan, yüzme havuzu, yeşil alanları ve 7/24 güvenlik personeli bulunan çağdaş bir yaşam alanıdır.',
    fr: 'Sunset Bay Residence est une résidence de standing située sur la côte méditerranéenne à Alanya, Turquie. Composée de 3 bâtiments et 48 appartements avec piscine, conciergerie et sécurité 24h/24.',
    da: 'Sunset Bay Residence er et eksklusivt boligkompleks ved Middelhavet i Alanya, Tyrkiet, bestående af 3 blokke og 48 lejligheder med swimmingpool, haveanlæg og fast vicevært.',
    sv: 'Sunset Bay Residence är ett attraktivt bostadskomplex i Alanya, Turkiet, med 3 huskroppar och 48 lägenheter, poolområde, trädgård och heltidsanställd fastighetsskötare.',
    pl: 'Sunset Bay Residence to nowoczesny kompleks mieszkaniowy w Alanyi w Turcji, obejmujący 3 bloki i 48 apartamentów z basenem, ogrodami i całodobowym dozorem.'
  },
  emergencyContact: {
    caretaker: '+90 532 555 0192 (Mehmet Bey - Kapıcı)',
    security: '+90 532 555 0199 (Nöbetçi Güvenlik)',
    management: '+90 242 513 8800 (Alanya Site Yönetimi)',
    police: '112 (Acil Çağrı / Police)',
    ambulance: '112 (Ambulans)'
  }
};

export const initialBuildings: Building[] = [
  {
    id: 'bld-a',
    blockCode: 'Block A',
    name: 'Liman Blok (Seaside)',
    totalFloors: 6,
    totalUnits: 16,
    occupiedUnits: 15,
    caretakerName: 'Mehmet Yılmaz',
    caretakerPhone: '+90 532 555 0192',
    elevatorCount: 2,
    heatingType: 'Individual VRF / Multi-Split Heat Pump',
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'
    ],
    documentsCount: 6,
    notes: 'Block A directly faces the southern pool garden and seaside avenue. Lift modernization completed in 2024.'
  },
  {
    id: 'bld-b',
    blockCode: 'Block B',
    name: 'Toros Blok (Mountain View)',
    totalFloors: 6,
    totalUnits: 16,
    occupiedUnits: 16,
    caretakerName: 'Mehmet Yılmaz',
    caretakerPhone: '+90 532 555 0192',
    elevatorCount: 2,
    heatingType: 'Individual VRF / Multi-Split Heat Pump',
    photos: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80'
    ],
    documentsCount: 4,
    notes: 'Block B faces north towards the Taurus mountains. Solar water heating collectors inspected in May 2025.'
  },
  {
    id: 'bld-c',
    blockCode: 'Block C',
    name: 'Akdeniz Blok (Garden View)',
    totalFloors: 6,
    totalUnits: 16,
    occupiedUnits: 14,
    caretakerName: 'Ali Karaca (Assistant)',
    caretakerPhone: '+90 533 555 0841',
    elevatorCount: 2,
    heatingType: 'Individual VRF / Multi-Split Heat Pump',
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
    ],
    documentsCount: 5,
    notes: 'Block C houses the ground-floor fitness salon and caretaker service station.'
  }
];

export const initialResidents: Resident[] = [
  {
    id: 'res-101',
    unitNumber: 'A-01',
    blockCode: 'Block A',
    floor: 1,
    firstName: 'Hakan',
    lastName: 'Öztürk',
    email: 'hakan.ozturk@example.tr',
    phone: '+90 532 444 1101',
    nationality: 'Turkish (TR)',
    isOwner: true,
    moveInDate: '2021-06-15',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-102',
    unitNumber: 'A-02',
    blockCode: 'Block A',
    floor: 1,
    firstName: 'Alexander',
    lastName: 'Ivanov',
    email: 'alex.ivanov@example.com',
    phone: '+90 534 888 1202',
    nationality: 'Russian (RU)',
    isOwner: true,
    moveInDate: '2021-08-20',
    totalCharged: 2600,
    totalPaid: 1200,
    outstandingBalance: 1400
  },
  {
    id: 'res-103',
    unitNumber: 'A-03',
    blockCode: 'Block A',
    floor: 2,
    firstName: 'Sophie',
    lastName: 'Dubois',
    email: 'sophie.dubois@example.fr',
    phone: '+33 6 12 34 56 78',
    nationality: 'French (FR)',
    isOwner: true,
    moveInDate: '2022-03-10',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-104',
    unitNumber: 'A-04',
    blockCode: 'Block A',
    floor: 2,
    firstName: 'Lars',
    lastName: 'Mikkelsen',
    email: 'lars.mikkelsen@example.dk',
    phone: '+45 20 12 34 56',
    nationality: 'Danish (DA)',
    isOwner: false,
    moveInDate: '2023-01-15',
    totalCharged: 2600,
    totalPaid: 1900,
    outstandingBalance: 700
  },
  {
    id: 'res-105',
    unitNumber: 'B-01',
    blockCode: 'Block B',
    floor: 1,
    firstName: 'Erik',
    lastName: 'Lindqvist',
    email: 'erik.lindqvist@example.se',
    phone: '+46 70 987 6543',
    nationality: 'Swedish (SV)',
    isOwner: true,
    moveInDate: '2021-07-01',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-106',
    unitNumber: 'B-02',
    blockCode: 'Block B',
    floor: 1,
    firstName: 'Piotr',
    lastName: 'Kowalski',
    email: 'piotr.kowalski@example.pl',
    phone: '+48 601 234 567',
    nationality: 'Polish (PL)',
    isOwner: true,
    moveInDate: '2022-09-01',
    totalCharged: 2600,
    totalPaid: 1200,
    outstandingBalance: 1400
  },
  {
    id: 'res-107',
    unitNumber: 'B-03',
    blockCode: 'Block B',
    floor: 2,
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@example.co.uk',
    phone: '+44 7700 900123',
    nationality: 'British (UK)',
    isOwner: true,
    moveInDate: '2021-09-12',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-108',
    unitNumber: 'B-04',
    blockCode: 'Block B',
    floor: 2,
    firstName: 'Fatma',
    lastName: 'Demir',
    email: 'fatma.demir@example.tr',
    phone: '+90 535 777 4404',
    nationality: 'Turkish (TR)',
    isOwner: true,
    moveInDate: '2021-06-15',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-109',
    unitNumber: 'C-01',
    blockCode: 'Block C',
    floor: 1,
    firstName: 'Elena',
    lastName: 'Smirnova',
    email: 'elena.smirnova@example.com',
    phone: '+90 538 222 9901',
    nationality: 'Russian (RU)',
    isOwner: false,
    moveInDate: '2023-05-01',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-110',
    unitNumber: 'C-02',
    blockCode: 'Block C',
    floor: 1,
    firstName: 'Mads',
    lastName: 'Nielsen',
    email: 'mads.nielsen@example.dk',
    phone: '+45 30 55 66 77',
    nationality: 'Danish (DA)',
    isOwner: true,
    moveInDate: '2022-04-18',
    totalCharged: 2600,
    totalPaid: 1200,
    outstandingBalance: 1400
  },
  {
    id: 'res-111',
    unitNumber: 'C-03',
    blockCode: 'Block C',
    floor: 2,
    firstName: 'Klaus',
    lastName: 'Weber',
    email: 'klaus.weber@example.de',
    phone: '+49 170 1234567',
    nationality: 'German (DE)',
    isOwner: true,
    moveInDate: '2021-10-05',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  },
  {
    id: 'res-112',
    unitNumber: 'C-04',
    blockCode: 'Block C',
    floor: 2,
    firstName: 'Anna',
    lastName: 'Nowak',
    email: 'anna.nowak@example.pl',
    phone: '+48 502 987 654',
    nationality: 'Polish (PL)',
    isOwner: true,
    moveInDate: '2022-11-20',
    totalCharged: 2600,
    totalPaid: 2600,
    outstandingBalance: 0
  }
];

export const initialAnnualCharges: AnnualCharge[] = [
  {
    id: 'charge-2025',
    year: 2025,
    amount: 1200,
    currency: 'EUR',
    title: '2025 Annual Operational Dues (Aidat)',
    description: 'Covers 24/7 security, caretaker salary, pool chemical management, garden landscaping and common electricity.',
    createdAt: '2025-01-05',
    createdBy: 'Alanya Site Management Ltd. (MC)',
    status: 'sent_to_all',
    sentAt: '2025-01-08',
    recipientsCount: 48
  },
  {
    id: 'charge-2026',
    year: 2026,
    amount: 1400,
    currency: 'EUR',
    title: '2026 General Maintenance & Energy Dues',
    description: 'Approved at General Assembly on 10 Jan 2026: covers inflation adjustments, elevator certifications and solar heating upgrade.',
    createdAt: '2026-01-12',
    createdBy: 'Alanya Site Management Ltd. (MC)',
    status: 'sent_to_all',
    sentAt: '2026-01-15',
    recipientsCount: 48
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-2025-101',
    invoiceNumber: 'GBE-2025-001',
    residentId: 'res-101',
    residentName: 'Hakan Öztürk',
    unitNumber: 'A-01',
    blockCode: 'Block A',
    year: 2025,
    title: '2025 Annual Site Dues (Aidat)',
    amount: 1200,
    currency: 'EUR',
    issueDate: '2025-01-08',
    dueDate: '2025-02-28',
    status: 'paid',
    paidAmount: 1200,
    pdfGenerated: true,
    notes: 'Paid in full via Garanti Bank wire transfer.'
  },
  {
    id: 'inv-2026-101',
    invoiceNumber: 'GBE-2026-001',
    residentId: 'res-101',
    residentName: 'Hakan Öztürk',
    unitNumber: 'A-01',
    blockCode: 'Block A',
    year: 2026,
    title: '2026 Annual Site Dues (Aidat)',
    amount: 1400,
    currency: 'EUR',
    issueDate: '2026-01-15',
    dueDate: '2026-02-28',
    status: 'paid',
    paidAmount: 1400,
    pdfGenerated: true,
    notes: 'Early bird settlement.'
  },
  {
    id: 'inv-2025-102',
    invoiceNumber: 'GBE-2025-002',
    residentId: 'res-102',
    residentName: 'Alexander Ivanov',
    unitNumber: 'A-02',
    blockCode: 'Block A',
    year: 2025,
    title: '2025 Annual Site Dues (Aidat)',
    amount: 1200,
    currency: 'EUR',
    issueDate: '2025-01-08',
    dueDate: '2025-02-28',
    status: 'paid',
    paidAmount: 1200,
    pdfGenerated: true
  },
  {
    id: 'inv-2026-102',
    invoiceNumber: 'GBE-2026-002',
    residentId: 'res-102',
    residentName: 'Alexander Ivanov',
    unitNumber: 'A-02',
    blockCode: 'Block A',
    year: 2026,
    title: '2026 Annual Site Dues (Aidat)',
    amount: 1400,
    currency: 'EUR',
    issueDate: '2026-01-15',
    dueDate: '2026-02-28',
    status: 'unpaid',
    paidAmount: 0,
    pdfGenerated: true,
    notes: 'Reminder notice dispatched.'
  },
  {
    id: 'inv-2026-104',
    invoiceNumber: 'GBE-2026-004',
    residentId: 'res-104',
    residentName: 'Lars Mikkelsen',
    unitNumber: 'A-04',
    blockCode: 'Block A',
    year: 2026,
    title: '2026 Annual Site Dues (Aidat)',
    amount: 1400,
    currency: 'EUR',
    issueDate: '2026-01-15',
    dueDate: '2026-02-28',
    status: 'partial',
    paidAmount: 700,
    pdfGenerated: true,
    notes: 'First installment settled. Remaining balance due 31 March.'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-001',
    invoiceId: 'inv-2025-101',
    residentId: 'res-101',
    unitNumber: 'A-01',
    amount: 1200,
    currency: 'EUR',
    paymentDate: '2025-01-14',
    method: 'bank_transfer',
    payerName: 'Hakan Öztürk',
    referenceNo: 'GAR-994821',
    verifiedBy: 'Management Company (Alanya Site)',
    receiptNumber: 'REC-2025-001'
  },
  {
    id: 'pay-002',
    invoiceId: 'inv-2026-101',
    residentId: 'res-101',
    unitNumber: 'A-01',
    amount: 1400,
    currency: 'EUR',
    paymentDate: '2026-01-18',
    method: 'bank_transfer',
    payerName: 'Hakan Öztürk',
    referenceNo: 'GAR-109244',
    verifiedBy: 'Management Company (Alanya Site)',
    receiptNumber: 'REC-2026-001'
  },
  {
    id: 'pay-003',
    invoiceId: 'inv-2025-102',
    residentId: 'res-102',
    unitNumber: 'A-02',
    amount: 1200,
    currency: 'EUR',
    paymentDate: '2025-02-02',
    method: 'credit_card',
    payerName: 'Alexander Ivanov',
    referenceNo: 'POS-883192',
    verifiedBy: 'Management Company (Alanya Site)',
    receiptNumber: 'REC-2025-008'
  },
  {
    id: 'pay-004',
    invoiceId: 'inv-2026-104',
    residentId: 'res-104',
    unitNumber: 'A-04',
    amount: 700,
    currency: 'EUR',
    paymentDate: '2026-01-25',
    method: 'bank_transfer',
    payerName: 'Lars Mikkelsen',
    referenceNo: 'DK-SEPA-4412',
    verifiedBy: 'Management Company (Alanya Site)',
    receiptNumber: 'REC-2026-015'
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task-001',
    title: 'Pool Filtration Pump Overhaul & Quartz Sand Replacement',
    description: 'Annual technical maintenance of the primary swimming pool filtration pumps (2 units) and replacement of grade-3 quartz sand filter media before the summer season.',
    category: 'maintenance',
    priority: 'high',
    status: 'financial_audit',
    createdByRole: 'management_company',
    creatorName: 'Alanya Site Management',
    estimatedCost: 850,
    currency: 'EUR',
    requiresTender: true,
    tenderProposals: [
      {
        id: 'prop-1',
        contractorName: 'Akdeniz Havuzculuk Ltd.',
        companyRegNo: 'TR-AL-9841',
        price: 820,
        currency: 'EUR',
        scopeSummary: '2x DAB pump overhaul, 400kg quartz sand, pressure gauges and water seal replacements.',
        validityPeriod: '30 Days',
        commercialOfferDocName: 'Offer_AkdenizHavuz_2026.pdf',
        isSelected: true,
        submittedAt: '2026-02-01'
      },
      {
        id: 'prop-2',
        contractorName: 'Toros Su Sistemleri A.Ş.',
        companyRegNo: 'TR-AL-1102',
        price: 960,
        currency: 'EUR',
        scopeSummary: 'Standard pump maintenance and filter backwash servicing.',
        validityPeriod: '15 Days',
        commercialOfferDocName: 'Toros_Water_Quote.pdf',
        isSelected: false,
        submittedAt: '2026-02-03'
      },
      {
        id: 'prop-3',
        contractorName: 'Alanya Teknik Havuz Servisi',
        companyRegNo: 'TR-AL-7750',
        price: 890,
        currency: 'EUR',
        scopeSummary: 'Pump seals, bearings and sand replacement with 1-year warranty.',
        validityPeriod: '30 Days',
        commercialOfferDocName: 'AlanyaTeknik_Tender.pdf',
        isSelected: false,
        submittedAt: '2026-02-04'
      }
    ],
    financialAudit: {
      status: 'verified_correct',
      controllerName: 'Ahmet Çelik (Financial Controller)',
      checkedAt: '2026-02-08',
      notes: 'Reviewed all 3 quotes. Akdeniz Havuzculuk is registered with the Alanya Chamber of Commerce and provides the best price with a comprehensive 12-month warranty. Price is within normal market range.',
      checklist: {
        tenderCompleted: true,
        proposalsVerified: true,
        priceReasonable: true,
        taxInvoiceAttached: true,
        boardApproved: true,
        proofOfExecutionAttached: true
      }
    },
    boardApprovals: [
      {
        role: 'chairman',
        memberName: 'Mehmet Demir (Chairman)',
        vote: 'approve',
        comment: 'Essential for pool opening in April. Approved.',
        votedAt: '2026-02-06'
      },
      {
        role: 'board_member',
        memberName: 'Elena Volkova (Board Member)',
        vote: 'approve',
        comment: 'Quotes are reasonable, please ensure certified sand is used.',
        votedAt: '2026-02-07'
      }
    ],
    comments: [
      {
        id: 'comm-1',
        authorName: 'Mehmet Yılmaz (Kapıcı)',
        authorRole: 'site_staff',
        text: 'The pressure gauge on Pump #2 is showing 2.2 bar which indicates filter media clogging.',
        createdAt: '2026-01-28 10:15'
      },
      {
        id: 'comm-2',
        authorName: 'Alanya Site Management',
        authorRole: 'management_company',
        text: 'Tender completed. Akdeniz Havuzculuk selected as lowest qualified bid.',
        createdAt: '2026-02-05 14:30'
      }
    ],
    createdAt: '2026-01-28',
    deadline: '2026-03-15'
  },
  {
    id: 'task-002',
    title: 'Block A & B Exterior LED Facade Lighting Repair',
    description: 'Replacement of burned-out architectural LED driver units and waterproof light fixtures along the front facades.',
    category: 'repairs',
    priority: 'medium',
    status: 'in_progress',
    createdByRole: 'chairman',
    creatorName: 'Mehmet Demir (Chairman)',
    estimatedCost: 320,
    currency: 'EUR',
    requiresTender: false,
    tenderProposals: [],
    financialAudit: {
      status: 'pending',
      checklist: {
        tenderCompleted: false,
        proposalsVerified: true,
        priceReasonable: true,
        taxInvoiceAttached: false,
        boardApproved: true,
        proofOfExecutionAttached: false
      }
    },
    boardApprovals: [
      {
        role: 'chairman',
        memberName: 'Mehmet Demir (Chairman)',
        vote: 'approve',
        comment: 'Under €500 threshold, direct repair authorized.',
        votedAt: '2026-02-10'
      }
    ],
    comments: [],
    createdAt: '2026-02-10',
    deadline: '2026-02-25'
  }
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-001',
    title: '2026 Annual General Assembly Meeting Minutes (Kat Malikleri Genel Kurul Karar Tutanağı)',
    category: 'minutes',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-01-11',
    uploadedBy: 'Mehmet Demir (Chairman)',
    uploadedByRole: 'chairman',
    isSoftDeleted: false,
    relatedTo: { type: 'complex', name: 'Sunset Bay Residence' }
  },
  {
    id: 'doc-002',
    title: 'Site Management Plan & House Regulations (Site Yönetim Planı)',
    category: 'regulations',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    uploadDate: '2021-06-01',
    uploadedBy: 'System Admin',
    uploadedByRole: 'admin',
    isSoftDeleted: false,
    relatedTo: { type: 'complex', name: 'Sunset Bay Residence' }
  },
  {
    id: 'doc-003',
    title: 'Elevator Annual Technical Inspection Certificates (MMO Muayene Raporu)',
    category: 'technical',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    uploadDate: '2025-11-14',
    uploadedBy: 'Alanya Site Management',
    uploadedByRole: 'management_company',
    isSoftDeleted: false,
    relatedTo: { type: 'building', name: 'Block A & B Lifts' }
  },
  {
    id: 'doc-004',
    title: 'Common Area Comprehensive Fire & Earthquake Insurance Policy (DASK + Ortak Alan Sigortası)',
    category: 'insurance',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    uploadDate: '2025-12-28',
    uploadedBy: 'Alanya Site Management',
    uploadedByRole: 'management_company',
    isSoftDeleted: false,
    relatedTo: { type: 'complex', name: 'Sunset Bay Residence' }
  },
  {
    id: 'doc-005',
    title: 'Draft Security Service Contract Proposal 2025 (Old Draft)',
    category: 'contracts',
    fileType: 'docx',
    fileSize: '540 KB',
    uploadDate: '2025-04-10',
    uploadedBy: 'Alanya Site Management',
    uploadedByRole: 'management_company',
    isSoftDeleted: true,
    deletedByRole: 'management_company',
    deletedByName: 'Alanya Site Management Ltd.',
    deletedAt: '2025-06-15 11:22',
    relatedTo: { type: 'complex', name: 'Security' }
  },
  {
    id: 'doc-006',
    title: '2025 Q3 Financial Audit Summary & Bank Reconciliation',
    category: 'financial_reports',
    fileType: 'xlsx',
    fileSize: '890 KB',
    uploadDate: '2025-10-05',
    uploadedBy: 'Ahmet Çelik (Financial Controller)',
    uploadedByRole: 'financial_controller',
    isSoftDeleted: false,
    relatedTo: { type: 'complex', name: 'Finance Committee' }
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-01-15 09:30:12',
    userName: 'Alanya Site Management (MC)',
    userRole: 'management_company',
    action: 'SEND_TO_ALL_INVOICES',
    targetType: 'AnnualCharge',
    targetId: 'charge-2026',
    details: 'Batch issued 48 individual 2026 aidat invoices totaling €67,200.'
  },
  {
    id: 'log-002',
    timestamp: '2026-01-18 14:12:05',
    userName: 'Alanya Site Management (MC)',
    userRole: 'management_company',
    action: 'RECORD_PAYMENT',
    targetType: 'Invoice',
    targetId: 'inv-2026-101',
    details: 'Recorded wire payment of €1,400 from Hakan Öztürk (A-01).'
  },
  {
    id: 'log-003',
    timestamp: '2026-02-08 16:45:00',
    userName: 'Ahmet Çelik (Controller)',
    userRole: 'financial_controller',
    action: 'FINANCIAL_AUDIT_SIGN_OFF',
    targetType: 'TaskItem',
    targetId: 'task-001',
    details: 'Verified tender compliance and market pricing for Pool Filtration overhaul (€820).'
  },
  {
    id: 'log-004',
    timestamp: '2025-06-15 11:22:40',
    userName: 'Alanya Site Management (MC)',
    userRole: 'management_company',
    action: 'SOFT_DELETE_DOCUMENT',
    targetType: 'DocumentItem',
    targetId: 'doc-005',
    details: 'Marked "Draft Security Service Contract Proposal" for deletion. Item hidden from residents, retained for Admin review.'
  }
];
