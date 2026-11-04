import React, { useState, useMemo, useRef } from 'react';
import { CMSTeamMember } from '../../types';
import ChigozieImg from '../../assets/management/chigozie.png';
import NnennaImg from '../../assets/management/nnenna.png';
import IsaacImg from '../../assets/management/isaac.png';
import AnaliImg from '../../assets/management/Anali.png';
import LayefaImg from '../../assets/management/layefa.png';
import UjuImg from '../../assets/management/uju.png';
import BrianImg from '../../assets/management/brian.png';
import SteveImg from '../../assets/management/steve.png';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  IconUsers,
  IconPlus,
  IconEdit,
  IconTrash,
  IconUpload,
  IconDownload,
  IconCheck,
  IconX,
  IconSearch,
  IconArrowUp,
  IconArrowDown,
  IconExternal,
  IconEye,
  IconCopy,
  IconGrid,
  IconList,
  IconClose,
  IconAlert
} from '../../components/admin/AdminIcons';

// Available preset leadership photo files in repository
export const PRESET_MANAGEMENT_PHOTOS = [
  { id: 'chigozie', label: 'Dr. Chigozie Dimgba (MD/CEO)', src: ChigozieImg, path: '/assets/management/chigozie.png' },
  { id: 'nnenna', label: 'Nnenna Ndubuisi (Chief Corporate Officer)', src: NnennaImg, path: '/assets/management/nnenna.png' },
  { id: 'isaac', label: 'Adamu Alumum Isaac (Chief Financial Officer)', src: IsaacImg, path: '/assets/management/isaac.png' },
  { id: 'anali', label: 'Analiefo Nzegwu (ED. Operations)', src: AnaliImg, path: '/assets/management/Anali.png' },
  { id: 'layefa', label: 'Layefa Chituru Igbe (Head, Business Dev)', src: LayefaImg, path: '/assets/management/layefa.png' },
  { id: 'uju', label: 'Uduma Ikpa Obianuju (Company Sec / Legal)', src: UjuImg, path: '/assets/management/uju.png' },
  { id: 'brian', label: 'Brian Akpotowo (Head, Technical Services)', src: BrianImg, path: '/assets/management/brian.png' },
  { id: 'steve', label: 'Steve Ubani (Head, QHSSE)', src: SteveImg, path: '/assets/management/steve.png' },
];

export const DEPARTMENTS = [
  'Executive Management',
  'Operations & Engineering',
  'Finance & Accounting',
  'Business Development',
  'Legal & Regulatory Compliance',
  'Technical Services & Geomatics',
  'QHSSE & Compliance'
];

interface AdminTeamProps {
  teamMembers: CMSTeamMember[];
  loading: boolean;
  onSave: (member: Partial<CMSTeamMember> & { name: string; role: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onImport: (members: Array<Partial<CMSTeamMember> & { name: string; role: string }>) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminTeam: React.FC<AdminTeamProps> = ({
  teamMembers,
  loading,
  onSave,
  onDelete,
  onImport,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modals state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CMSTeamMember | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Photo Management & Display State
  const [photoSourceTab, setPhotoSourceTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [lightboxMember, setLightboxMember] = useState<CMSTeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleCopyPhotoUrl = (url: string) => {
    if (!url) return;
    try {
      navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
  };

  const getPhotoSourceInfo = (url?: string) => {
    if (!url) return { label: 'No Photo', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
    if (url.includes('supabase.co') || url.includes('/storage/v1/object/public')) {
      return { label: 'Cloud Storage', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' };
    }
    if (url.startsWith('data:image')) {
      return { label: 'Local Base64', color: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' };
    }
    if (PRESET_MANAGEMENT_PHOTOS.some(p => p.src === url || p.path === url)) {
      return { label: 'Executive Preset', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' };
    }
    if (url.startsWith('/assets/')) {
      return { label: 'Built-in Asset', color: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800' };
    }
    return { label: 'External URL', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' };
  };

  // Form State for Single Member Edit/Create
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDept, setFormDept] = useState('Executive Management');
  const [formImage, setFormImage] = useState<string>(ChigozieImg);
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // File Import State
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedImportRows, setParsedImportRows] = useState<Array<Partial<CMSTeamMember> & { name: string; role: string }>>([]);
  const [importParsingError, setImportParsingError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return teamMembers.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDept = selectedDept === 'all' || m.department === selectedDept;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    }).sort((a, b) => a.display_order - b.display_order);
  }, [teamMembers, searchTerm, selectedDept, statusFilter]);

  // Open Edit Modal
  const handleOpenEdit = (member: CMSTeamMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormDept(member.department || 'Executive Management');
    const img = member.image || ChigozieImg;
    setFormImage(img);
    if (PRESET_MANAGEMENT_PHOTOS.some(p => p.src === img || p.path === img)) {
      setPhotoSourceTab('preset');
    } else if (img.startsWith('http')) {
      setPhotoSourceTab('url');
    } else {
      setPhotoSourceTab('upload');
    }
    setFormLinkedin(member.linkedin || '');
    setFormEmail(member.email || '');
    setFormBio(member.bio || '');
    setFormOrder(member.display_order);
    setFormStatus(member.status);
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName('');
    setFormRole('');
    setFormDept('Executive Management');
    setFormImage(ChigozieImg);
    setPhotoSourceTab('preset');
    setFormLinkedin('https://www.linkedin.com/company/polarisigl/');
    setFormEmail('');
    setFormBio('');
    setFormOrder(teamMembers.length + 1);
    setFormStatus('active');
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Submit Single Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Member name is required.');
      return;
    }
    if (!formRole.trim()) {
      setFormError('Member role / designation is required.');
      return;
    }

    setFormSaving(true);
    setFormError(null);
    try {
      await onSave({
        id: editingMember?.id,
        name: formName.trim(),
        role: formRole.trim(),
        department: formDept,
        image: formImage,
        linkedin: formLinkedin.trim(),
        email: formEmail.trim(),
        bio: formBio.trim(),
        display_order: Number(formOrder) || (teamMembers.length + 1),
        status: formStatus
      });
      setIsEditorOpen(false);
      setEditingMember(null);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save team member.');
    } finally {
      setFormSaving(false);
    }
  };

  // Quick Move Up/Down Order
  const handleReorder = async (member: CMSTeamMember, direction: 'up' | 'down') => {
    const sorted = [...teamMembers].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sorted.findIndex(m => m.id === member.id);
    if (currentIndex < 0) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const otherMember = sorted[targetIndex];
    const currentOrder = member.display_order;
    const targetOrder = otherMember.display_order;

    await onSave({ ...member, display_order: targetOrder });
    await onSave({ ...otherMember, display_order: currentOrder });
  };

  // Quick Toggle Status
  const handleToggleStatus = async (member: CMSTeamMember) => {
    const nextStatus = member.status === 'active' ? 'inactive' : 'active';
    await onSave({ ...member, status: nextStatus });
  };

  // Local Photo File Upload (converts file to base64 Data URL)
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // File Import Handling (CSV or JSON)
  const handleFileImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImportFile(file);
  };

  const processImportFile = (file: File) => {
    setImportFile(file);
    setImportParsingError(null);
    setParsedImportRows([]);
    setImportSuccessCount(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          const array = Array.isArray(parsed) ? parsed : (parsed.members || parsed.team || []);
          const validRows = array
            .filter((row: any) => row.name && row.role)
            .map((row: any, idx: number) => ({
              name: String(row.name).trim(),
              role: String(row.role).trim(),
              department: row.department ? String(row.department).trim() : 'Executive Management',
              image: row.image || ChigozieImg,
              linkedin: row.linkedin || '',
              email: row.email || '',
              bio: row.bio || '',
              display_order: Number(row.display_order) || (teamMembers.length + idx + 1),
              status: (row.status === 'inactive' ? 'inactive' : 'active') as 'active' | 'inactive'
            }));

          if (validRows.length === 0) {
            setImportParsingError('No valid team member records found. Each record must have at least "name" and "role".');
          } else {
            setParsedImportRows(validRows);
          }
        } else {
          // Parse CSV
          const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
          if (lines.length < 2) {
            setImportParsingError('CSV file must have a header row and at least one data row.');
            return;
          }

          // Parse header
          const parseCSVLine = (line: string) => {
            const result: string[] = [];
            let inQuotes = false;
            let current = '';
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                result.push(current.trim().replace(/^"|"$/g, ''));
                current = '';
              } else {
                current += char;
              }
            }
            result.push(current.trim().replace(/^"|"$/g, ''));
            return result;
          };

          const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[\s_-]+/g, ''));
          const nameIdx = headers.findIndex(h => h === 'name' || h === 'fullname' || h === 'membername');
          const roleIdx = headers.findIndex(h => h === 'role' || h === 'title' || h === 'designation' || h === 'position');
          const deptIdx = headers.findIndex(h => h === 'department' || h === 'dept');
          const imgIdx = headers.findIndex(h => h === 'image' || h === 'photo' || h === 'picture' || h === 'avatar');
          const linkIdx = headers.findIndex(h => h === 'linkedin' || h === 'profile' || h === 'link');
          const emailIdx = headers.findIndex(h => h === 'email' || h === 'mail');
          const bioIdx = headers.findIndex(h => h === 'bio' || h === 'biography' || h === 'summary');
          const orderIdx = headers.findIndex(h => h === 'order' || h === 'displayorder');
          const statusIdx = headers.findIndex(h => h === 'status');

          if (nameIdx === -1 || roleIdx === -1) {
            setImportParsingError('CSV must include "Name" and "Role" column headers.');
            return;
          }

          const rows: Array<Partial<CMSTeamMember> & { name: string; role: string }> = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = parseCSVLine(lines[i]);
            if (!cols[nameIdx] || !cols[roleIdx]) continue;

            rows.push({
              name: cols[nameIdx],
              role: cols[roleIdx],
              department: deptIdx >= 0 && cols[deptIdx] ? cols[deptIdx] : 'Executive Management',
              image: imgIdx >= 0 && cols[imgIdx] ? cols[imgIdx] : ChigozieImg,
              linkedin: linkIdx >= 0 && cols[linkIdx] ? cols[linkIdx] : '',
              email: emailIdx >= 0 && cols[emailIdx] ? cols[emailIdx] : '',
              bio: bioIdx >= 0 && cols[bioIdx] ? cols[bioIdx] : '',
              display_order: orderIdx >= 0 && Number(cols[orderIdx]) ? Number(cols[orderIdx]) : (teamMembers.length + rows.length + 1),
              status: statusIdx >= 0 && cols[statusIdx].toLowerCase() === 'inactive' ? 'inactive' : 'active'
            });
          }

          if (rows.length === 0) {
            setImportParsingError('No valid rows found in the CSV file.');
          } else {
            setParsedImportRows(rows);
          }
        }
      } catch (err: any) {
        setImportParsingError(`Failed to parse file: ${err?.message || 'Invalid format'}`);
      }
    };
    reader.readAsText(file);
  };

  // Execute Import
  const handleExecuteImport = async () => {
    if (parsedImportRows.length === 0) return;
    setIsImporting(true);
    try {
      await onImport(parsedImportRows);
      setImportSuccessCount(parsedImportRows.length);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportFile(null);
        setParsedImportRows([]);
        setImportSuccessCount(null);
      }, 1500);
    } catch (err: any) {
      setImportParsingError(err?.message || 'Failed to import records.');
    } finally {
      setIsImporting(false);
    }
  };

  // Download Sample Templates
  const handleDownloadCSVTemplate = () => {
    const headers = 'Name,Role,Department,Image,LinkedIn,Email,Bio,Display_Order,Status\n';
    const sample = 'Engr. Emeka Okafor,"Senior Project Director","Operations & Engineering","/assets/management/brian.png","https://linkedin.com/in/emeka-okafor","emeka@polarisigl.com","Oversees integrated geotechnical and marine operations across the Niger Delta.",9,active\n';
    const blob = new Blob([headers + sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pigl_team_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSONTemplate = () => {
    const template = [
      {
        name: "Engr. Emeka Okafor",
        role: "Senior Project Director",
        department: "Operations & Engineering",
        image: "/assets/management/brian.png",
        linkedin: "https://linkedin.com/in/emeka-okafor",
        email: "emeka@polarisigl.com",
        bio: "Oversees integrated geotechnical and marine operations across the Niger Delta.",
        display_order: 9,
        status: "active"
      }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'pigl_team_import_template.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Action Bar (No Duplicate Header) */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Manage leadership and specialist profiles displayed across the website.
        </p>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setImportFile(null);
              setParsedImportRows([]);
              setImportParsingError(null);
              setImportSuccessCount(null);
              setIsImportModalOpen(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-2 cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
            }`}
          >
            <IconUpload className="w-4 h-4 text-emerald-600" />
            <span>Import</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="relative w-full md:w-80">
          <IconSearch className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search by name, role, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className={`px-3 py-2 rounded-xl text-xs border focus:outline-none font-medium ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={`px-3 py-2 rounded-xl text-xs border focus:outline-none font-medium ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          {/* View Mode Toggle */}
          <div className={`flex items-center p-0.5 rounded-xl border ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Grid / Cards View"
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Table / List View"
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                viewMode === 'table'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table of Team Members */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm font-medium">
          <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading leadership roster...
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className={`p-12 border rounded-2xl text-center text-sm font-medium ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          No management team members match your current filters. Click "Add Member" or "Import from File" to add someone.
        </div>
      ) : viewMode === 'table' ? (
        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                <tr>
                  <th className="py-3 px-4">Executive Photo</th>
                  <th className="py-3 px-4">Name & Title</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Photo Source</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredMembers.map((member, index) => {
                  const srcInfo = getPhotoSourceInfo(member.image);
                  return (
                    <tr key={member.id} className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      <td className="py-3 px-4">
                        <div 
                          className="w-12 h-14 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 relative group cursor-pointer shrink-0"
                          onClick={() => setLightboxMember(member)}
                          title="Click to view full photo"
                        >
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = ChigozieImg; }}
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <IconEye className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</div>
                        <div className="text-slate-500 text-xs">{member.role}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">{member.department || 'Executive'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${srcInfo.color}`}>
                          {srcInfo.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                            member.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {member.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-1">
                          <span className="font-mono font-bold text-xs text-slate-500 mr-1">#{member.display_order}</span>
                          <button
                            onClick={() => handleReorder(member, 'up')}
                            disabled={index === 0}
                            title="Move Up"
                            className="p-1 hover:text-emerald-600 disabled:opacity-20 transition-colors"
                          >
                            <IconArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleReorder(member, 'down')}
                            disabled={index === filteredMembers.length - 1}
                            title="Move Down"
                            className="p-1 hover:text-emerald-600 disabled:opacity-20 transition-colors"
                          >
                            <IconArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setLightboxMember(member)}
                            title="Inspect Full Photo"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <IconEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCopyPhotoUrl(member.image)}
                            title={copiedUrl === member.image ? 'Copied!' : 'Copy Photo URL'}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            {copiedUrl === member.image ? <IconCheck className="w-4 h-4 text-emerald-500" /> : <IconCopy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleOpenEdit(member)}
                            title="Edit Member"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === member.id ? (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={async () => {
                                  await onDelete(member.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-1 text-slate-400 hover:text-slate-600 text-[10px]"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(member.id)}
                              title="Delete Member"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id}
              className={`rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
              }`}
            >
              {/* Photo Area with Click-to-Preview Lightbox and Quick Image Actions */}
              <div 
                className="relative aspect-[4/4.5] bg-slate-100 overflow-hidden group cursor-pointer"
                onClick={() => setLightboxMember(member)}
                title="Click to inspect photo in high resolution"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = ChigozieImg;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5 z-10">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    member.status === 'active'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {member.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-900/80 text-white border border-slate-700">
                    #{member.display_order}
                  </span>
                </div>

                {/* Top Right Actions: Photo Actions on Hover & Order Controls */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 z-10" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-1 bg-slate-950/80 backdrop-blur-sm rounded-lg p-0.5 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setLightboxMember(member)}
                      title="Inspect Photo in Full Size"
                      className="p-1 text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      <IconEye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyPhotoUrl(member.image)}
                      title={copiedUrl === member.image ? 'Copied!' : 'Copy Photo URL'}
                      className="p-1 text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      {copiedUrl === member.image ? <IconCheck className="w-3.5 h-3.5 text-emerald-400" /> : <IconCopy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleReorder(member, 'up')}
                      disabled={index === 0}
                      title="Move higher in hierarchy"
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors border-l border-slate-800"
                    >
                      <IconArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(member, 'down')}
                      disabled={index === filteredMembers.length - 1}
                      title="Move lower in hierarchy"
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                    >
                      <IconArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Overlay Info with Photo Source Chip */}
                <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border ${getPhotoSourceInfo(member.image).color}`}>
                      {getPhotoSourceInfo(member.image).label}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold group-hover:underline flex items-center gap-0.5">
                      <IconEye className="w-3 h-3" /> View Photo
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight truncate leading-tight drop-shadow-sm">
                    {member.name}
                  </h3>
                  <p className="text-xs text-slate-300 truncate font-medium">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Details & Actions Footer */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                {/* Bio snippet or contact links */}
                <div className="space-y-2">
                  {member.bio ? (
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {member.bio}
                    </p>
                  ) : (
                    <p className={`text-xs italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      No executive biography entered.
                    </p>
                  )}

                  <div className="flex items-center space-x-3 pt-1 text-xs">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
                      >
                        <IconExternal className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {member.email && (
                      <span className={`text-[11px] font-mono truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {member.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}>
                  <button
                    onClick={() => handleToggleStatus(member)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                      member.status === 'active'
                        ? isDark ? 'text-slate-400 border-slate-800 hover:bg-slate-800' : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                        : isDark ? 'text-emerald-400 border-emerald-800/50 hover:bg-emerald-950/40' : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {member.status === 'active' ? 'Set Inactive' : 'Activate'}
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      title="Edit member details"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>

                    {deleteConfirmId === member.id ? (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={async () => {
                            await onDelete(member.id);
                            setDeleteConfirmId(null);
                          }}
                          title="Confirm deletion"
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="p-1 text-slate-400 hover:text-slate-200"
                        >
                          <IconX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(member.id)}
                        title="Delete member"
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDark ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
                        }`}
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ====================================================================== */}
      {/* ADD / EDIT MEMBER MODAL */}
      {/* ====================================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}>
              <div>
                <h2 className="text-lg font-bold">
                  {editingMember ? 'Edit Management Team Member' : 'Add New Management Team Member'}
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Configure leadership information, assign photos from existing files or upload a new photo.
                </p>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className={`p-1.5 rounded-lg ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Full Name & Title <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Chigozie Dimgba"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>

                {/* Role / Designation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Executive Role <span className="text-emerald-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Managing Director / CEO"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Department */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Department / Division
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Display Order (#)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-semibold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* Comprehensive Executive Photo Management */}
              {/* ========================================================================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>Executive Photo Management</span>
                    <span className="text-[10px] font-normal text-emerald-600 dark:text-emerald-400 font-mono">
                      (4:5 Portrait Recommended)
                    </span>
                  </label>
                  <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Cloud Storage, Presets or Direct URL
                  </span>
                </div>

                {/* Active Photo Details Card */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-3.5">
                    <div 
                      className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 border-2 border-emerald-500/30 shrink-0 relative group cursor-pointer shadow-sm"
                      onClick={() => {
                        if (formImage) {
                          setLightboxMember({
                            id: editingMember?.id || 'preview',
                            name: formName || 'Preview Executive',
                            role: formRole || 'Leadership Role',
                            image: formImage,
                            department: formDept,
                            bio: formBio,
                            linkedin: formLinkedin,
                            email: formEmail,
                            display_order: formOrder,
                            status: formStatus
                          });
                        }
                      }}
                      title="Click to preview full size photo"
                    >
                      <img
                        src={formImage || ChigozieImg}
                        alt="Preview"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <IconEye className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Active Photo</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPhotoSourceInfo(formImage).color}`}>
                          {getPhotoSourceInfo(formImage).label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[240px] sm:max-w-[320px]">
                        {formImage}
                      </p>
                    </div>
                  </div>

                  {/* Actions for active photo */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopyPhotoUrl(formImage)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                        copiedUrl === formImage
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                          : isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {copiedUrl === formImage ? <IconCheck className="w-3.5 h-3.5 text-emerald-600" /> : <IconCopy className="w-3.5 h-3.5" />}
                      <span>{copiedUrl === formImage ? 'Copied' : 'Copy URL'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setFormImage(ChigozieImg);
                        setPhotoSourceTab('preset');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1 text-slate-500 hover:text-red-600 ${
                        isDark ? 'border-slate-800 hover:bg-red-950/20' : 'border-slate-200 hover:bg-red-50'
                      }`}
                      title="Reset to default executive preset"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>

                {/* Photo Source Tabs */}
                <div className={`p-4 rounded-xl border space-y-4 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center space-x-1.5 border-b pb-3 border-slate-200 dark:border-slate-800 flex-wrap gap-y-1.5">
                    <button
                      type="button"
                      onClick={() => setPhotoSourceTab('upload')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        photoSourceTab === 'upload'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <IconUpload className="w-3.5 h-3.5" />
                      <span>Cloud Storage Upload</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoSourceTab('preset')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        photoSourceTab === 'preset'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <IconUsers className="w-3.5 h-3.5" />
                      <span>Leadership Presets ({PRESET_MANAGEMENT_PHOTOS.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoSourceTab('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        photoSourceTab === 'url'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <IconExternal className="w-3.5 h-3.5" />
                      <span>Direct Image URL</span>
                    </button>
                  </div>

                  {/* Tab 1: Cloud Storage Uploader */}
                  {photoSourceTab === 'upload' && (
                    <div className="space-y-3">
                      <ImageUploader
                        currentUrl={formImage}
                        onUploadComplete={(url) => {
                          setFormImage(url);
                        }}
                        bucket="media"
                        label="Upload Photo to Cloud Storage (Supabase)"
                        helperText="PNG, JPG, WEBP (Max 10MB). Automatically optimised and hosted on high-availability CDN."
                        theme={theme}
                      />
                    </div>
                  )}

                  {/* Tab 2: Leadership Presets */}
                  {photoSourceTab === 'preset' && (
                    <div className="space-y-2">
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Click to Assign Preset Photo:
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                        {PRESET_MANAGEMENT_PHOTOS.map((photo) => {
                          const isSelected = formImage === photo.src || formImage === photo.path;
                          return (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() => setFormImage(photo.src)}
                              title={photo.label}
                              className={`group relative rounded-xl overflow-hidden aspect-[4/5] border-2 transition-all ${
                                isSelected
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-95 shadow-sm'
                                  : 'border-transparent hover:border-slate-400 opacity-80 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={photo.src}
                                alt={photo.label}
                                className="w-full h-full object-cover object-top"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-emerald-600/35 flex items-center justify-center">
                                  <IconCheck className="w-5 h-5 text-white drop-shadow" />
                                </div>
                              )}
                              <div className="absolute bottom-0 inset-x-0 p-1 bg-gradient-to-t from-slate-950/80 to-transparent text-[9px] text-white truncate text-center font-bold">
                                {photo.label.split(' ')[0]}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Direct URL Input */}
                  {photoSourceTab === 'url' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider">
                        Image Public URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/photo.jpg or /assets/management/..."
                          value={formImage}
                          onChange={(e) => setFormImage(e.target.value)}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setFormImage('')}
                          className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-colors text-slate-500 hover:text-red-600 ${
                            isDark ? 'border-slate-800 hover:bg-slate-900' : 'border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Paste a direct URL to an image hosted on any CDN or internal storage bucket.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* LinkedIn & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={formLinkedin}
                    onChange={(e) => setFormLinkedin(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@polarisigl.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                    }`}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Executive Biography / Profile Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of experience, technical certifications, and corporate responsibilities..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              {/* Status */}
              <div className="flex items-center space-x-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider">
                  Display Status:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setFormStatus('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      formStatus === 'active'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Active (Public)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStatus('inactive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      formStatus === 'inactive'
                        ? 'bg-amber-600 text-white border-amber-500'
                        : isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Inactive (Hidden)
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className={`pt-4 border-t flex items-center justify-end space-x-3 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  {formSaving ? 'Saving...' : editingMember ? 'Save Changes' : 'Add Executive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* IMPORT FROM FILE MODAL */}
      {/* ====================================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}>
              <div>
                <h2 className="text-lg font-bold">
                  Import Management Team from Existing File
                </h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Upload an existing CSV or JSON file containing team personnel data.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className={`p-1.5 rounded-lg ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Template Download Prompts */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Need the format specification?
                  </h4>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Download a pre-formatted template with standard columns (Name, Role, Department, etc.).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadCSVTemplate}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                        : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                    }`}
                  >
                    <IconDownload className="w-3.5 h-3.5" />
                    <span>CSV Template</span>
                  </button>
                  <button
                    onClick={handleDownloadJSONTemplate}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                        : 'bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
                    }`}
                  >
                    <IconDownload className="w-3.5 h-3.5" />
                    <span>JSON Template</span>
                  </button>
                </div>
              </div>

              {/* Drag and Drop / File Browser Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-700 hover:border-emerald-500 bg-slate-950/40 hover:bg-slate-950/80'
                    : 'border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,text/csv,application/json"
                  onChange={handleFileImportChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                  <IconUpload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold">
                  {importFile ? importFile.name : 'Click to select or drag and drop existing file'}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Supported file extensions: <span className="font-mono font-bold">.csv</span> or <span className="font-mono font-bold">.json</span>
                </p>
              </div>

              {/* Parsing Errors */}
              {importParsingError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                  {importParsingError}
                </div>
              )}

              {/* Success Notification */}
              {importSuccessCount !== null && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-bold flex items-center space-x-2">
                  <IconCheck className="w-4 h-4" />
                  <span>Successfully imported {importSuccessCount} team members into the system!</span>
                </div>
              )}

              {/* Preview of Parsed Rows */}
              {parsedImportRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      Preview Parsed Members ({parsedImportRows.length} found)
                    </h3>
                    <span className="text-[11px] text-emerald-600 font-bold">
                      Ready to merge
                    </span>
                  </div>

                  <div className={`border rounded-xl max-h-60 overflow-auto ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}>
                    <table className="w-full text-left text-xs">
                      <thead className={`border-b font-bold uppercase tracking-wider text-[10px] ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <tr>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Department</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {parsedImportRows.map((row, idx) => (
                          <tr key={idx} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                            <td className="p-2.5 font-bold">{row.name}</td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400">{row.role}</td>
                            <td className="p-2.5 text-slate-500 dark:text-slate-400">{row.department}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                                row.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-6 py-4 border-t flex items-center justify-end space-x-3 shrink-0 ${
              isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={parsedImportRows.length === 0 || isImporting}
                onClick={handleExecuteImport}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center space-x-2"
              >
                <IconUpload className="w-3.5 h-3.5" />
                <span>{isImporting ? 'Importing...' : `Confirm & Import (${parsedImportRows.length})`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* High-Resolution Photo Lightbox & Management Modal */}
      {/* ========================================================================= */}
      {lightboxMember && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxMember(null)}
        >
          <div 
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center space-x-2">
                <IconEye className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm">Executive Photo Viewer</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {/* Photo Preview Container */}
            <div className="p-6 flex flex-col items-center bg-slate-950/40 relative">
              <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-900 shrink-0">
                <img
                  src={lightboxMember.image}
                  alt={lightboxMember.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ChigozieImg;
                  }}
                />
              </div>

              {/* Member Summary */}
              <div className="mt-4 text-center">
                <h4 className="text-lg font-bold">{lightboxMember.name}</h4>
                <p className="text-xs text-slate-400 font-medium">{lightboxMember.role}</p>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getPhotoSourceInfo(lightboxMember.image).color}`}>
                    {getPhotoSourceInfo(lightboxMember.image).label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Order #{lightboxMember.display_order}
                  </span>
                </div>
              </div>
            </div>

            {/* Photo URL & Actions Bar */}
            <div className={`p-4 border-t space-y-3 ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50'}`}>
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Image Resource URL
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={lightboxMember.image}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-mono border ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyPhotoUrl(lightboxMember.image)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1 shrink-0 ${
                      copiedUrl === lightboxMember.image
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : isDark ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {copiedUrl === lightboxMember.image ? <IconCheck className="w-3.5 h-3.5" /> : <IconCopy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === lightboxMember.image ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={lightboxMember.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 border border-slate-700 hover:border-emerald-500 transition-colors shrink-0"
                    title="Open original image in new tab"
                  >
                    <IconExternal className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const mem = lightboxMember;
                    setLightboxMember(null);
                    handleOpenEdit(mem);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  <span>Edit Team Member & Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLightboxMember(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTeam;
