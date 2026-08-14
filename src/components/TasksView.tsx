import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Building,
  ShieldCheck,
  Eye,
  DollarSign
} from 'lucide-react';
import { TaskItem, UserRole, Language } from '../types';
import { translations } from '../i18n/translations';
import { TaskDetailModal } from './TaskDetailModal';

interface TasksViewProps {
  tasks: TaskItem[];
  onAddTask: (task: TaskItem) => void;
  onUpdateTask: (task: TaskItem) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const canCreate = ['admin', 'management_company', 'chairman', 'board_member', 'site_staff'].includes(currentRole);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [activeTaskModal, setActiveTaskModal] = useState<TaskItem | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCost, setNewTaskCost] = useState<number>(650);
  const [newTaskCategory, setNewTaskCategory] = useState<TaskItem['category']>('maintenance');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('medium');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description} ${task.creatorName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const requiresTender = Number(newTaskCost) >= 500;

    const created: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      category: newTaskCategory,
      priority: newTaskPriority,
      status: requiresTender ? 'tender_open' : 'board_review',
      createdByRole: currentRole,
      creatorName: currentRole.replace('_', ' ').toUpperCase(),
      estimatedCost: Number(newTaskCost),
      currency: 'EUR',
      requiresTender,
      tenderProposals: requiresTender ? [
        {
          id: `prop-${Date.now()}-1`,
          contractorName: 'Akdeniz Yapı & Teknik Ltd.',
          companyRegNo: 'TR-AL-3921',
          price: Number(newTaskCost) - 30,
          currency: 'EUR',
          scopeSummary: 'Full turnkey execution according to specification.',
          validityPeriod: '30 Days',
          commercialOfferDocName: 'Offer_AkdenizYapi.pdf',
          isSelected: true,
          submittedAt: new Date().toISOString().split('T')[0]
        },
        {
          id: `prop-${Date.now()}-2`,
          contractorName: 'Toros Mühendislik A.Ş.',
          companyRegNo: 'TR-AL-8812',
          price: Number(newTaskCost) + 50,
          currency: 'EUR',
          scopeSummary: 'Standard quote with certified components.',
          validityPeriod: '15 Days',
          commercialOfferDocName: 'Toros_Quote.pdf',
          isSelected: false,
          submittedAt: new Date().toISOString().split('T')[0]
        }
      ] : [],
      financialAudit: {
        status: 'pending',
        checklist: {
          tenderCompleted: requiresTender,
          proposalsVerified: false,
          priceReasonable: true,
          taxInvoiceAttached: false,
          boardApproved: false,
          proofOfExecutionAttached: false
        }
      },
      boardApprovals: [],
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
      deadline: '2026-03-31'
    };

    onAddTask(created);
    setIsCreatingTask(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.tasksTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.tasksSubtitle}</p>
        </div>
        {canCreate && (
          <button
            id="create-task-btn"
            onClick={() => setIsCreatingTask(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {t.createTask}
          </button>
        )}
      </div>

      {/* KPI metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Active Tasks</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{tasks.length} Operations</p>
          <span className="text-[11px] text-teal-700 font-semibold">Under Governance</span>
        </div>
        <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-2xs">
          <span className="text-xs font-semibold text-amber-800 block">Financial Audits Pending</span>
          <p className="text-2xl font-black text-amber-950 mt-1">
            {tasks.filter(tk => tk.financialAudit.status === 'pending').length} Tasks
          </p>
          <span className="text-[11px] text-amber-700 font-semibold">Controller Review</span>
        </div>
        <div className="p-4 bg-teal-50/80 rounded-2xl border border-teal-200 shadow-2xs">
          <span className="text-xs font-semibold text-teal-800 block">Tenders Completed</span>
          <p className="text-2xl font-black text-teal-950 mt-1">
            {tasks.filter(tk => tk.requiresTender).length} Tenders
          </p>
          <span className="text-[11px] text-teal-700 font-semibold">&gt; €500 Threshold</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="maintenance">Maintenance</option>
            <option value="repairs">Repairs</option>
            <option value="landscaping">Landscaping</option>
            <option value="security">Security</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="tender_open">Tender Open</option>
            <option value="financial_audit">Financial Audit</option>
            <option value="board_review">Board Review</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setActiveTaskModal(task)}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                    {task.category}
                  </span>
                </div>
                <span className="font-black text-slate-900 text-base">€{task.estimatedCost}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{task.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{task.description}</p>
              </div>

              {/* Status and tender indicator */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {task.requiresTender && (
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold flex items-center">
                    <Building className="w-3 h-3 mr-1" />
                    Tender ({task.tenderProposals.length} Quotes)
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  task.financialAudit.status === 'verified_correct' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
                  task.financialAudit.status === 'discrepancy_flagged' ? 'bg-rose-50 border border-rose-200 text-rose-800' :
                  'bg-amber-50 border border-amber-200 text-amber-800'
                }`}>
                  Audit: {task.financialAudit.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Created by {task.creatorName}</span>
              <span className="text-teal-700 font-bold inline-flex items-center">
                Inspect Workflow →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {isCreatingTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-sm">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-slate-200">
              {t.createTask}
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-3 pt-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Garden Irrigation Pump Replacement"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repairs">Repairs</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="security">Security</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Cost (EUR)</label>
                <input
                  type="number"
                  min="10"
                  value={newTaskCost}
                  onChange={(e) => setNewTaskCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  {newTaskCost >= 500
                    ? '⚠️ Cost >= €500: Automated tender procedure with ≥ 3 contractor bids will be initialized.'
                    : 'ℹ️ Cost < €500: Direct purchase authorization.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scope & Description</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Describe necessary work, location, parts required..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreatingTask(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs"
                >
                  {t.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {activeTaskModal && (
        <TaskDetailModal
          task={activeTaskModal}
          onClose={() => setActiveTaskModal(null)}
          onUpdateTask={(updated) => {
            onUpdateTask(updated);
            setActiveTaskModal(updated);
          }}
          currentRole={currentRole}
          currentLang={currentLang}
        />
      )}

    </div>
  );
};
