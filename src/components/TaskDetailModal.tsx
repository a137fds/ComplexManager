import React, { useState } from 'react';
import {
  X,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  ShieldCheck,
  MessageSquare,
  Plus,
  Send,
  Building,
  Check
} from 'lucide-react';
import { TaskItem, UserRole, Language, TenderProposal, FinancialAudit } from '../types';
import { translations } from '../i18n/translations';

interface TaskDetailModalProps {
  task: TaskItem;
  onClose: () => void;
  onUpdateTask: (task: TaskItem) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  onClose,
  onUpdateTask,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const [commentText, setCommentText] = useState('');

  // Financial Controller Audit Checklist State
  const [checklist, setChecklist] = useState(task.financialAudit.checklist || {
    tenderCompleted: false,
    proposalsVerified: false,
    priceReasonable: false,
    taxInvoiceAttached: false,
    boardApproved: false,
    proofOfExecutionAttached: false
  });
  const [auditNotes, setAuditNotes] = useState(task.financialAudit.notes || '');
  const [auditStatus, setAuditStatus] = useState(task.financialAudit.status || 'pending');

  const canAudit = ['admin', 'financial_controller'].includes(currentRole);
  const canVoteBoard = ['admin', 'chairman', 'board_member'].includes(currentRole);
  const canSelectTender = ['admin', 'management_company', 'chairman'].includes(currentRole);

  const handleToggleChecklist = (key: keyof typeof checklist) => {
    if (!canAudit) return;
    const updated = { ...checklist, [key]: !checklist[key] };
    setChecklist(updated);
  };

  const handleSaveAudit = (status: 'verified_correct' | 'discrepancy_flagged') => {
    const updatedAudit: FinancialAudit = {
      status,
      controllerName: 'Ahmet Çelik (Financial Controller)',
      checkedAt: new Date().toISOString().split('T')[0],
      notes: auditNotes,
      checklist
    };

    onUpdateTask({
      ...task,
      financialAudit: updatedAudit,
      status: status === 'verified_correct' ? 'approved' : 'board_review'
    });
  };

  const handleBoardVote = (vote: 'approve' | 'reject') => {
    const newVote = {
      role: currentRole,
      memberName: currentRole === 'chairman' ? 'Mehmet Demir (Chairman)' : 'Board Member',
      vote,
      comment: vote === 'approve' ? 'Approved in accordance with complex budget.' : 'Rejected / Revisions needed.',
      votedAt: new Date().toISOString().split('T')[0]
    };

    const updatedApprovals = [...(task.boardApprovals || []).filter(v => v.role !== currentRole), newVote];

    onUpdateTask({
      ...task,
      boardApprovals: updatedApprovals,
      status: vote === 'approve' ? (task.requiresTender ? 'financial_audit' : 'approved') : 'rejected'
    });
  };

  const handleSelectProposal = (propId: string) => {
    if (!canSelectTender) return;
    const updatedProposals = task.tenderProposals.map(p => ({
      ...p,
      isSelected: p.id === propId
    }));
    onUpdateTask({
      ...task,
      tenderProposals: updatedProposals
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `comm-${Date.now()}`,
      authorName: currentRole.replace('_', ' ').toUpperCase(),
      authorRole: currentRole,
      text: commentText.trim(),
      createdAt: new Date().toLocaleString()
    };

    onUpdateTask({
      ...task,
      comments: [...(task.comments || []), newComment]
    });
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-slate-200 text-sm space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                task.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {task.priority.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {task.category.toUpperCase()}
              </span>
              <span className="text-xs text-slate-600 font-mono">Created: {task.createdAt}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tender Commercial Proposals (if requiresTender) */}
        {task.requiresTender && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
                <Building className="w-4 h-4 mr-1.5 text-teal-600" />
                {t.tenderOffers} ({task.tenderProposals.length} Submitted)
              </h4>
              <span className="text-[11px] text-slate-600">Threshold &gt; €500 requires ≥3 competitive quotes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {task.tenderProposals.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => handleSelectProposal(prop.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    prop.isSelected
                      ? 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">{prop.contractorName}</span>
                      {prop.isSelected && (
                        <span className="p-0.5 bg-teal-600 text-white rounded-full">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight line-clamp-2">{prop.scopeSummary}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-black text-slate-900 text-sm">€{prop.price}</span>
                    <span className="text-[10px] text-slate-600">{prop.validityPeriod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Controller Audit Inspection Section (SPEC 3.5 & TODO 3) */}
        <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                {t.financialControllerChecklist}
              </h4>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              task.financialAudit.status === 'verified_correct'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : task.financialAudit.status === 'discrepancy_flagged'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {task.financialAudit.status === 'verified_correct' ? t.auditCorrect :
               task.financialAudit.status === 'discrepancy_flagged' ? t.auditDiscrepancy : t.auditPending}
            </span>
          </div>

          {/* 6 Inspection checkpoints */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { key: 'tenderCompleted', label: t.tenderCompleted },
              { key: 'proposalsVerified', label: t.proposalsVerified },
              { key: 'priceReasonable', label: t.priceReasonable },
              { key: 'taxInvoiceAttached', label: t.taxInvoiceAttached },
              { key: 'boardApproved', label: t.boardApproved },
              { key: 'proofOfExecutionAttached', label: t.proofAttached },
            ].map(({ key, label }) => {
              const checked = (checklist as any)[key] || false;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleToggleChecklist(key as any)}
                  disabled={!canAudit}
                  className={`flex items-center p-2 rounded-lg border text-left transition-colors ${
                    checked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600'
                  } ${canAudit ? 'cursor-pointer hover:border-teal-400' : 'cursor-default'}`}
                >
                  <span className={`w-4 h-4 rounded mr-2 flex items-center justify-center border ${
                    checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {checked && <Check className="w-3 h-3" />}
                  </span>
                  <span className="text-[11px]">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Controller Notes & Actions */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Financial Controller Review Summary / Audit Findings
            </label>
            <textarea
              rows={2}
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
              disabled={!canAudit}
              placeholder="Record audit verification notes or price market benchmark comparisons..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
            />
            {canAudit && (
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAudit('discrepancy_flagged')}
                  className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold hover:bg-rose-100"
                >
                  Flag Discrepancy
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveAudit('verified_correct')}
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 shadow-xs"
                >
                  Certify Financial Audit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Board Approvals & Voting (Chairman & Board) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {t.boardApproval} ({task.boardApprovals?.length || 0} Registered)
            </h4>
            {canVoteBoard && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBoardVote('reject')}
                  className="px-2.5 py-1 bg-white border border-rose-300 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-50"
                >
                  {t.voteReject}
                </button>
                <button
                  onClick={() => handleBoardVote('approve')}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 shadow-xs"
                >
                  {t.voteApprove}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {task.boardApprovals?.map((vote, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{vote.memberName}</span>
                  <p className="text-slate-500 text-[11px]">{vote.comment}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                  vote.vote === 'approve' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {vote.vote.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Log */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center">
            <MessageSquare className="w-4 h-4 mr-1.5 text-teal-600" />
            Communication & Work Notes
          </h4>
          <div className="space-y-2 max-h-36 overflow-y-auto">
            {(task.comments || []).map((comm) => (
              <div key={comm.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                  <span>{comm.authorName} ({comm.authorRole})</span>
                  <span className="text-slate-600 font-normal">{comm.createdAt}</span>
                </div>
                <p className="text-slate-600 mt-1">{comm.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add observation or technical note..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
