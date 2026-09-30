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
  IconExternal
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
    setFormImage(member.image || ChigozieImg);
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
      
      {/* Page Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Executive Management Team
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              {teamMembers.length} Executives
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage leadership profiles for the public About Us page. Reorder display hierarchy, edit bios, and import personnel from CSV or JSON files.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setImportFile(null);
              setParsedImportRows([]);
              setImportParsingError(null);
              setImportSuccessCount(null);
              setIsImportModalOpen(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-2 ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-xs'
            }`}
          >
            <IconUpload className="w-4 h-4 text-emerald-600" />
            <span>Import from File</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2"
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
        </div>
      </div>

      {/* Grid of Team Members */}
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
              {/* Photo Area */}
              <div className="relative aspect-[4/4.5] bg-slate-100 overflow-hidden group">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = ChigozieImg;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
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

                {/* Reordering Controls */}
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-slate-950/70 backdrop-blur-sm rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => handleReorder(member, 'up')}
                    disabled={index === 0}
                    title="Move higher in hierarchy"
                    className="p-1 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
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

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider truncate">
                    {member.department || 'Executive Management'}
                  </p>
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

              {/* Photo Selector (From Existing Files in Repository OR Local Upload) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Executive Photo
                  </label>
                  <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Choose from existing files or upload a new photo
                  </span>
                </div>

                <div className={`p-4 rounded-xl border space-y-4 ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  {/* Current Selected Photo Preview */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-bold">Selected Image</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
                          }`}
                        >
                          <IconUpload className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Attach Photo File</span>
                        </button>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Existing Photo Files Picker */}
                  <div className="space-y-2">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Or Pick From Existing Leadership Files:
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {PRESET_MANAGEMENT_PHOTOS.map((photo) => {
                        const isSelected = formImage === photo.src || formImage === photo.path;
                        return (
                          <button
                            key={photo.id}
                            type="button"
                            onClick={() => setFormImage(photo.src)}
                            title={photo.label}
                            className={`group relative rounded-lg overflow-hidden aspect-[4/5] border-2 transition-all ${
                              isSelected
                                ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-95'
                                : 'border-transparent hover:border-slate-400 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={photo.src}
                              alt={photo.label}
                              className="w-full h-full object-cover object-top"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-emerald-600/30 flex items-center justify-center">
                                <IconCheck className="w-4 h-4 text-white drop-shadow" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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

    </div>
  );
};

export default AdminTeam;
