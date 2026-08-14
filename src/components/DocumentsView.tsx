import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Trash2,
  RotateCcw,
  AlertOctagon,
  Download,
  Eye,
  ShieldAlert,
  FolderOpen,
  Plus,
  X,
  FileSpreadsheet,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { DocumentItem, UserRole, Language } from '../types';
import { translations } from '../i18n/translations';

interface DocumentsViewProps {
  documents: DocumentItem[];
  onUploadDocument: (doc: DocumentItem) => void;
  onSoftDeleteDocument: (docId: string) => void;
  onRestoreDocument: (docId: string) => void;
  onPermanentDeleteDocument: (docId: string) => void;
  currentRole: UserRole;
  currentLang: Language;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onUploadDocument,
  onSoftDeleteDocument,
  onRestoreDocument,
  onPermanentDeleteDocument,
  currentRole,
  currentLang
}) => {
  const t = translations[currentLang];
  const isAdmin = currentRole === 'admin';
  const isManagement = currentRole === 'management_company';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // New Document Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentItem['category']>('minutes');
  const [newFileType, setNewFileType] = useState<DocumentItem['fileType']>('pdf');
  const [newFileSize, setNewFileSize] = useState('1.5 MB');

  // Filter documents according to role visibility rules (SPEC 3.2)
  // Non-admins see ONLY non-soft-deleted documents.
  // Admins see active documents + soft-deleted documents with clear governance indicator.
  const activeDocuments = documents.filter((doc) => {
    if (doc.isSoftDeleted) return false;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = `${doc.title} ${doc.uploadedBy}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const softDeletedDocuments = documents.filter((doc) => doc.isSoftDeleted);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      fileType: newFileType,
      fileSize: newFileSize,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: currentRole === 'management_company' ? 'Alanya Site Management' : currentRole.replace('_', ' ').toUpperCase(),
      uploadedByRole: currentRole,
      isSoftDeleted: false,
      relatedTo: { type: 'complex', name: 'Sunset Bay Site' }
    };

    onUploadDocument(created);
    setIsUploading(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.documentsTitle}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.documentsSubtitle}</p>
        </div>
        {currentRole !== 'guest' && (
          <button
            id="upload-doc-btn"
            onClick={() => setIsUploading(true)}
            className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Upload className="w-4 h-4 mr-1.5" />
            {t.uploadDocument}
          </button>
        )}
      </div>

      {/* Governance & Soft-Delete Notice (SPEC 3.2) */}
      {isManagement && (
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-blue-950 text-xs flex items-start space-x-3 shadow-2xs">
          <ShieldAlert className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">{t.adminRestrictedDelete}</h4>
            <p className="text-blue-800 leading-relaxed">{t.managementSoftDeleteNote}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
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

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Categories</option>
          <option value="regulations">{t.categories.regulations}</option>
          <option value="minutes">{t.categories.minutes}</option>
          <option value="financial_reports">{t.categories.financial_reports}</option>
          <option value="contracts">{t.categories.contracts}</option>
          <option value="technical">{t.categories.technical}</option>
          <option value="insurance">{t.categories.insurance}</option>
        </select>
      </div>

      {/* Active Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 uppercase">
                  {t.categories[doc.category] || doc.category}
                </span>
                <span className="text-[11px] font-mono text-slate-600 font-semibold">{doc.fileSize}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.title}</h3>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <p>Uploaded: {doc.uploadDate}</p>
                <p className="truncate">By: {doc.uploadedBy}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => alert(`Simulated downloading: ${doc.title}`)}
                className="text-teal-700 hover:text-teal-900 text-xs font-bold inline-flex items-center"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                {t.download}
              </button>

              {/* Delete Button behavior based on role */}
              {['admin', 'management_company', 'chairman'].includes(currentRole) && (
                <button
                  onClick={() => onSoftDeleteDocument(doc.id)}
                  title={isManagement ? "Mark for deletion (Soft Delete)" : "Archive Document"}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Exclusive: Soft-Deleted Documents Section (SPEC 3.2) */}
      {isAdmin && softDeletedDocuments.length > 0 && (
        <div className="bg-amber-50/60 rounded-2xl p-6 border-2 border-amber-300 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-amber-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {t.softDeletedNotice} ({softDeletedDocuments.length})
                </h3>
                <p className="text-xs text-amber-800">
                  Visible ONLY to Admin. Marked for deletion by Management Company.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-amber-200/80 text-amber-900 rounded-lg text-xs font-extrabold uppercase">
              Admin Audit View
            </span>
          </div>

          <div className="space-y-3">
            {softDeletedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{doc.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      Marked for Deletion
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Deleted by: <strong>{doc.deletedByName || 'Management Company'}</strong> on {doc.deletedAt || '2025-06-15'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => onRestoreDocument(doc.id)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 rounded-lg text-xs font-bold inline-flex items-center transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    {t.restore}
                  </button>
                  <button
                    onClick={() => onPermanentDeleteDocument(doc.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold inline-flex items-center transition-colors shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    {t.permanentDelete}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">{t.uploadDocument}</h3>
              <button
                onClick={() => setIsUploading(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2026 Solar Heating Service Contract"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t.documentCategory}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="regulations">Regulations</option>
                    <option value="minutes">Minutes</option>
                    <option value="financial_reports">Financial Reports</option>
                    <option value="contracts">Contracts</option>
                    <option value="technical">Technical</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">File Type</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              {/* Simulated File Dropper */}
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center space-y-1">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">Drag file here or click to browse</p>
                <span className="text-[10px] text-slate-600">Supports PDF, DOCX, XLSX up to 25MB</span>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold shadow-xs"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
