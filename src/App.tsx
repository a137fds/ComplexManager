import React, { useState } from 'react';
import {
  ComplexInfo,
  Building,
  Resident,
  AnnualCharge,
  Invoice,
  Payment,
  TaskItem,
  DocumentItem,
  AuditLog,
  UserRole,
  Language
} from './types';
import {
  initialComplexInfo,
  initialBuildings,
  initialResidents,
  initialAnnualCharges,
  initialInvoices,
  initialPayments,
  initialTasks,
  initialDocuments,
  initialAuditLogs
} from './data/initialData';

import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { CloudSqlCrudView } from './components/CloudSqlCrudView';
import { ComplexView } from './components/ComplexView';
import { BuildingsView } from './components/BuildingsView';
import { ResidentsView } from './components/ResidentsView';
import { BillingView } from './components/BillingView';
import { TasksView } from './components/TasksView';
import { DocumentsView } from './components/DocumentsView';
import { AdministrationView } from './components/AdministrationView';
import { GuestLandingView } from './components/GuestLandingView';
import { InvoiceModal } from './components/InvoiceModal';

export const App: React.FC = () => {
  // Application Data State
  const [complex, setComplex] = useState<ComplexInfo>(initialComplexInfo);
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [residents, setResidents] = useState<Resident[]>(initialResidents);
  const [annualCharges, setAnnualCharges] = useState<AnnualCharge[]>(initialAnnualCharges);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Active Session & View State
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<TabType>('database_crud');

  // Modal State
  const [activeInvoiceModal, setActiveInvoiceModal] = useState<Invoice | null>(null);

  // Helper to log audit actions
  const addAuditLog = (action: string, targetType: string, targetId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userRole: currentRole,
      userName: currentRole === 'management_company'
        ? 'Alanya Site Management Ltd.'
        : currentRole === 'financial_controller'
        ? 'Ahmet Çelik (Controller)'
        : currentRole === 'chairman'
        ? 'Mehmet Demir (Chairman)'
        : currentRole.replace('_', ' ').toUpperCase(),
      action,
      targetType,
      targetId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Role switch handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'guest') {
      setCurrentTab('guest_overview');
    } else if (newRole === 'resident' && currentTab === 'administration') {
      setCurrentTab('residents');
    } else if (newRole === 'site_staff' && (currentTab === 'billing' || currentTab === 'administration')) {
      setCurrentTab('tasks');
    }
  };

  // Complex update handler
  const handleUpdateComplex = (updated: ComplexInfo) => {
    setComplex(updated);
    addAuditLog('UPDATE_COMPLEX_INFO', 'complex', updated.id, `Updated legal & banking registry for ${updated.name}`);
  };

  // Buildings handler
  const handleUpdateBuilding = (updated: Building) => {
    setBuildings(prev => prev.map(b => b.id === updated.id ? updated : b));
    addAuditLog('UPDATE_BUILDING', 'building', updated.id, `Updated specifications for ${updated.blockCode}`);
  };

  const handleAddBuilding = (created: Building) => {
    setBuildings(prev => [...prev, created]);
    addAuditLog('CREATE_BUILDING', 'building', created.id, `Added new building block ${created.blockCode} (${created.name})`);
  };

  // Billing Handlers (SPEC 6.1 & 6.2)
  const handleDefineAnnualCharge = (chargeData: Partial<AnnualCharge>) => {
    const created: AnnualCharge = {
      id: `chg-${Date.now()}`,
      year: chargeData.year || 2027,
      amount: chargeData.amount || 1500,
      currency: 'EUR',
      title: chargeData.title || `${chargeData.year} General Maintenance Dues`,
      description: chargeData.description || 'Approved annual budget dues.',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentRole === 'management_company' ? 'Alanya Site Management Ltd.' : 'Board Administration',
      status: 'draft'
    };

    setAnnualCharges(prev => [created, ...prev]);
    addAuditLog('DEFINE_ANNUAL_CHARGE', 'annual_charge', created.id, `Defined annual charge for Year ${created.year}: €${created.amount}`);
  };

  // Send to All: generates individual invoices for all residents, updates resident debt balances, archives records
  const handleSendToAll = (chargeId: string) => {
    const charge = annualCharges.find(c => c.id === chargeId);
    if (!charge) return;

    const newInvoices: Invoice[] = residents.map((resident, idx) => {
      const invNum = `INV-${charge.year}-${resident.unitNumber.replace('-', '')}`;
      return {
        id: `inv-${Date.now()}-${idx}`,
        invoiceNumber: invNum,
        chargeId: charge.id,
        residentId: resident.id,
        unitNumber: resident.unitNumber,
        blockCode: resident.blockCode,
        residentName: `${resident.firstName} ${resident.lastName}`,
        year: charge.year,
        amount: charge.amount,
        paidAmount: 0,
        currency: 'EUR',
        status: 'unpaid',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: `${charge.year}-03-31`,
        title: charge.title,
        description: charge.description,
        pdfGenerated: true,
        pdfGeneratedDocName: `Aidat_${charge.year}_Unit_${resident.unitNumber}.pdf`,
        lineItems: [
          {
            description: `Annual Complex Maintenance Dues (Aidat) - Year ${charge.year}`,
            amount: charge.amount
          }
        ]
      };
    });

    // Update invoices
    setInvoices(prev => [...newInvoices, ...prev]);

    // Update resident debt balances
    setResidents(prev =>
      prev.map(r => ({
        ...r,
        totalCharged: r.totalCharged + charge.amount,
        outstandingBalance: r.outstandingBalance + charge.amount
      }))
    );

    addAuditLog(
      'SEND_TO_ALL_RESIDENTS',
      'annual_charge',
      charge.id,
      `Generated and distributed ${newInvoices.length} individual invoices of €${charge.amount} for Year ${charge.year}`
    );
  };

  // Payment Recording
  const handleRecordPayment = (paymentData: Partial<Payment>) => {
    if (!paymentData.residentId || !paymentData.amount) return;

    const createdPayment: Payment = {
      id: `pay-${Date.now()}`,
      invoiceId: paymentData.invoiceId || 'inv-batch',
      residentId: paymentData.residentId,
      unitNumber: paymentData.unitNumber || '',
      amount: Number(paymentData.amount),
      currency: 'EUR',
      paymentDate: paymentData.paymentDate || new Date().toISOString().split('T')[0],
      method: paymentData.method || 'bank_transfer',
      referenceNo: paymentData.referenceNo || 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      verifiedBy: currentRole === 'management_company' ? 'Alanya Site Management Ltd.' : 'Admin Office',
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      payerName: paymentData.payerName || 'Resident'
    };

    setPayments(prev => [createdPayment, ...prev]);

    // Update resident financial balances
    setResidents(prev =>
      prev.map(res => {
        if (res.id === createdPayment.residentId) {
          const newTotalPaid = res.totalPaid + createdPayment.amount;
          const newBalance = Math.max(0, res.totalCharged - newTotalPaid);
          return {
            ...res,
            totalPaid: newTotalPaid,
            outstandingBalance: newBalance
          };
        }
        return res;
      })
    );

    // Update unpaid invoice status for this resident
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.residentId === createdPayment.residentId && inv.status !== 'paid') {
          return {
            ...inv,
            status: 'paid'
          };
        }
        return inv;
      })
    );

    addAuditLog(
      'RECORD_PAYMENT',
      'payment',
      createdPayment.id,
      `Recorded payment of €${createdPayment.amount} from Unit ${createdPayment.unitNumber} (${createdPayment.referenceNo})`
    );
  };

  // Tasks & Tenders Handlers
  const handleAddTask = (task: TaskItem) => {
    setTasks(prev => [task, ...prev]);
    addAuditLog('CREATE_TASK', 'task', task.id, `Created task: ${task.title} (Requires tender: ${task.requiresTender})`);
  };

  const handleUpdateTask = (updated: TaskItem) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    addAuditLog('UPDATE_TASK_WORKFLOW', 'task', updated.id, `Updated task ${updated.title} status to ${updated.status}`);
  };

  // Documents Handlers (SPEC 3.2 Soft-Delete)
  const handleUploadDocument = (doc: DocumentItem) => {
    setDocuments(prev => [doc, ...prev]);
    addAuditLog('UPLOAD_DOCUMENT', 'document', doc.id, `Uploaded document: ${doc.title} (${doc.category})`);
  };

  const handleSoftDeleteDocument = (docId: string) => {
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            isSoftDeleted: true,
            deletedAt: new Date().toISOString().split('T')[0],
            deletedByRole: currentRole,
            deletedByName: currentRole === 'management_company'
              ? 'Alanya Site Management Ltd. (Operator)'
              : currentRole.replace('_', ' ').toUpperCase()
          };
        }
        return d;
      })
    );
    addAuditLog(
      'SOFT_DELETE_DOCUMENT',
      'document',
      docId,
      `Marked document for deletion by ${currentRole} (Archived for Admin review)`
    );
  };

  const handleRestoreDocument = (docId: string) => {
    setDocuments(prev =>
      prev.map(d => {
        if (d.id === docId) {
          return {
            ...d,
            isSoftDeleted: false,
            deletedAt: undefined,
            deletedByRole: undefined,
            deletedByName: undefined
          };
        }
        return d;
      })
    );
    addAuditLog('RESTORE_DOCUMENT', 'document', docId, `Admin restored document back to active repository`);
  };

  const handlePermanentDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    addAuditLog('PERMANENT_PURGE_DOCUMENT', 'document', docId, `Admin permanently purged document from database`);
  };

  const pendingAuditsCount = tasks.filter(t => t.financialAudit.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans flex flex-col antialiased selection:bg-teal-600 selection:text-white">
      
      {/* Universal Header */}
      <Header
        complex={complex}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        pendingAuditsCount={pendingAuditsCount}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabSelect={setCurrentTab}
          currentRole={currentRole}
          currentLang={currentLang}
        />

        {/* Content View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'database_crud' && (
            <CloudSqlCrudView
              currentLang={currentLang}
              onAuditLog={addAuditLog}
            />
          )}

          {currentTab === 'complex' && (
            <ComplexView
              complex={complex}
              onUpdateComplex={handleUpdateComplex}
              currentRole={currentRole}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'buildings' && (
            <BuildingsView
              buildings={buildings}
              onUpdateBuilding={handleUpdateBuilding}
              onAddBuilding={handleAddBuilding}
              currentRole={currentRole}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'residents' && (
            <ResidentsView
              residents={residents}
              invoices={invoices}
              payments={payments}
              onRecordPayment={handleRecordPayment}
              onOpenInvoiceModal={(inv) => setActiveInvoiceModal(inv)}
              currentRole={currentRole}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView
              annualCharges={annualCharges}
              invoices={invoices}
              payments={payments}
              residents={residents}
              onDefineAnnualCharge={handleDefineAnnualCharge}
              onSendToAll={handleSendToAll}
              onOpenInvoiceModal={(inv) => setActiveInvoiceModal(inv)}
              currentRole={currentRole}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              currentRole={currentRole}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsView
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onSoftDeleteDocument={handleSoftDeleteDocument}
              onRestoreDocument={handleRestoreDocument}
              onPermanentDeleteDocument={handlePermanentDeleteDocument}
              currentRole={currentRole}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'administration' && (
            <AdministrationView
              auditLogs={auditLogs}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              currentLang={currentLang}
            />
          )}

          {currentTab === 'guest_overview' && (
            <GuestLandingView
              complex={complex}
              currentLang={currentLang}
              onExploreClick={() => setCurrentTab('complex')}
            />
          )}
        </main>
      </div>

      {/* Official Printable Invoice Modal */}
      {activeInvoiceModal && (
        <InvoiceModal
          invoice={activeInvoiceModal}
          complex={complex}
          onClose={() => setActiveInvoiceModal(null)}
          currentLang={currentLang}
        />
      )}

    </div>
  );
};
