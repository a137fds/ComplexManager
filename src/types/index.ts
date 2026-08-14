export type UserRole =
  | 'admin'
  | 'management_company'
  | 'chairman'
  | 'board_member'
  | 'financial_controller'
  | 'site_staff'
  | 'resident'
  | 'guest';

export type Language = 'ru' | 'en' | 'fr' | 'tr' | 'da' | 'sv' | 'pl';

export interface ComplexInfo {
  id: string;
  name: string;
  nativeName: string;
  taxNumber: string;
  taxOffice: string;
  address: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  totalUnits: number;
  totalBlocks: number;
  constructionYear: number;
  bankName: string;
  iban: string;
  swift: string;
  representativePhoto: string;
  galleryPhotos: string[];
  rules: string[];
  description: Record<Language, string>;
  emergencyContact: {
    caretaker: string;
    security: string;
    management: string;
    police: string;
    ambulance: string;
  };
}

export interface Building {
  id: string;
  blockCode: string;
  name: string;
  totalFloors: number;
  totalUnits: number;
  occupiedUnits: number;
  caretakerName: string;
  caretakerPhone: string;
  elevatorCount: number;
  heatingType: string;
  photos: string[];
  documentsCount: number;
  notes: string;
}

export interface Resident {
  id: string;
  unitNumber: string;
  blockCode: string;
  floor: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  isOwner: boolean;
  moveInDate: string;
  totalCharged: number;
  totalPaid: number;
  outstandingBalance: number;
}

export interface AnnualCharge {
  id: string;
  year: number;
  amount: number;
  currency: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'published' | 'sent_to_all';
  sentAt?: string;
  recipientsCount?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  residentId: string;
  residentName: string;
  unitNumber: string;
  blockCode: string;
  year: number;
  title: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid' | 'overdue';
  paidAmount: number;
  pdfGenerated: boolean;
  notes?: string;
  description?: string;
  pdfGeneratedDocName?: string;
  lineItems?: Array<{ description: string; amount: number }>;
}

export interface Payment {
  id: string;
  invoiceId: string;
  residentId: string;
  unitNumber: string;
  amount: number;
  currency: string;
  paymentDate: string;
  method: 'bank_transfer' | 'credit_card' | 'cash';
  payerName: string;
  referenceNo: string;
  verifiedBy: string;
  receiptNumber: string;
}

export interface TenderProposal {
  id: string;
  contractorName: string;
  companyRegNo: string;
  price: number;
  currency: string;
  scopeSummary: string;
  validityPeriod: string;
  commercialOfferDocName: string;
  isSelected: boolean;
  submittedAt: string;
}

export interface FinancialAudit {
  status: 'pending' | 'verified_correct' | 'discrepancy_flagged';
  controllerName?: string;
  checkedAt?: string;
  notes?: string;
  checklist: {
    tenderCompleted: boolean;
    proposalsVerified: boolean;
    priceReasonable: boolean;
    taxInvoiceAttached: boolean;
    boardApproved: boolean;
    proofOfExecutionAttached: boolean;
  };
  alternativeQuoteFound?: {
    contractor: string;
    price: number;
    details: string;
  };
}

export interface BoardVote {
  role: UserRole;
  memberName: string;
  vote: 'approve' | 'reject';
  comment?: string;
  votedAt: string;
}

export interface TaskComment {
  id: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'repairs' | 'landscaping' | 'security' | 'legal' | 'renovation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'tender_open' | 'board_review' | 'financial_audit' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  createdByRole: UserRole;
  creatorName: string;
  estimatedCost: number;
  currency: string;
  requiresTender: boolean;
  tenderProposals: TenderProposal[];
  financialAudit: FinancialAudit;
  boardApprovals: BoardVote[];
  comments: TaskComment[];
  createdAt: string;
  deadline?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'regulations' | 'minutes' | 'financial_reports' | 'contracts' | 'invoices' | 'technical' | 'insurance';
  fileType: 'pdf' | 'docx' | 'xlsx' | 'img';
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  isSoftDeleted: boolean;
  deletedByRole?: UserRole;
  deletedByName?: string;
  deletedAt?: string;
  relatedTo?: {
    type: 'complex' | 'building' | 'resident' | 'task';
    id?: string;
    name?: string;
  };
  downloadUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}
