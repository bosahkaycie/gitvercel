import React, { useState } from 'react';
import { AdminUser, AdminRole } from '../../types';
import {
  IconUsers,
  IconPlus,
  IconSearch,
  IconCheck,
  IconShield,
  IconEdit,
  IconTrash,
  IconClose
} from '../../components/admin/AdminIcons';

interface AdminUsersProps {
  users: AdminUser[];
  loading: boolean;
  onSave: (user: Partial<AdminUser> & { email: string; full_name: string; role: AdminRole }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onToggleStatus: (id: string, currentStatus: 'active' | 'suspended') => Promise<any>;
  currentUserRole?: string;
  theme?: 'light' | 'dark';
}

const ROLE_PERMISSIONS: Record<AdminRole, { description: string; badges: string[] }> = {
  'Super Admin': {
    description: 'Full unrestricted system authority across all PIGL database tables, user management, and cloud storage.',
    badges: ['Manage Admins', 'Services CMS', 'Blog CMS', 'Hero Sliders', 'Inquiries Desk', 'Media Storage', 'System Settings']
  },
  'Content Editor': {
    description: 'Can manage, draft, edit, and publish Services, Technical Articles, Case Studies, Homepage Sliders, and upload Media.',
    badges: ['Services CMS', 'Blog CMS', 'Hero Sliders', 'Media Storage']
  },
  'Inquiries Manager': {
    description: 'Dedicated commercial & business development desk for reviewing and responding to client RFPs and consultation requests.',
    badges: ['Inquiries Desk', 'Consultation Export', 'Client Notes']
  },
  'Viewer': {
    description: 'Read-only access to review CMS content status, analytics overview, and inquiry logs without modification rights.',
    badges: ['Read-Only Analytics', 'Content Review']
  }
};

const AdminUsers: React.FC<AdminUsersProps> = ({
  users,
  loading,
  onSave,
  onDelete,
  onToggleStatus,
  currentUserRole,
  theme = 'light'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AdminRole>('Content Editor');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const openCreateModal = () => {
    setEditingUser(null);
    setEmail('');
    setFullName('');
    setRole('Content Editor');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEmail(user.email);
    setFullName(user.full_name);
    setRole(user.role);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      setError('Please provide both full name and a valid corporate email.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        ...(editingUser ? { id: editingUser.id, created_at: editingUser.created_at } : {}),
        email: email.trim(),
        full_name: fullName.trim(),
        role
      });
      setSuccessMsg(editingUser ? 'Administrator profile updated.' : 'New administrator added successfully.');
      setIsModalOpen(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save administrator.');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Administrator Team & Roles
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              {users.length} Active
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage authorized portal administrators, assign role privileges, and control platform access permissions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <IconCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 dark:text-emerald-300 font-bold">
            <IconClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Privileges Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.keys(ROLE_PERMISSIONS) as AdminRole[]).map((r) => {
          const info = ROLE_PERMISSIONS[r];
          const count = users.filter(u => u.role === r).length;
          return (
            <div
              key={r}
              className={`p-5 rounded-2xl border transition-all ${
                r === 'Super Admin'
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md'
                  : isDark 
                    ? 'bg-slate-900 text-slate-200 border-slate-800 hover:border-slate-700' 
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  r === 'Super Admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                  r === 'Content Editor' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50' :
                  r === 'Inquiries Manager' ? 'bg-blue-100 text-blue-900 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300/60 dark:border-blue-700/50' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}>
                  {r}
                </span>
                <span className={`text-xs font-bold ${r === 'Super Admin' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {count} {count === 1 ? 'User' : 'Users'}
                </span>
              </div>
              <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 ${r === 'Super Admin' ? 'text-slate-300' : isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {info.description}
              </p>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {info.badges.slice(0, 3).map(b => (
                  <span
                    key={b}
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                      r === 'Super Admin' ? 'bg-slate-800 border-slate-700 text-slate-300' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {b}
                  </span>
                ))}
                {info.badges.length > 3 && (
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded text-slate-400">
                    +{info.badges.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter & Search Toolbar */}
      <div className={`p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="relative w-full sm:w-84">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <IconSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search administrators by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Super Admin', 'Content Editor', 'Inquiries Manager', 'Viewer'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                roleFilter === r
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Users Table */}
      <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading administrator directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No administrators match your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Administrator</th>
                  <th className="py-3.5 px-4 sm:px-5">Role & Privileges</th>
                  <th className="py-3.5 px-4 sm:px-5">Status</th>
                  <th className="py-3.5 px-4 sm:px-5">Last Active</th>
                  <th className="py-3.5 px-4 sm:px-5">Added On</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                {filteredUsers.map((user) => {
                  const roleStyle =
                    user.role === 'Super Admin'
                      ? 'bg-amber-100 text-amber-900 border-amber-300/60 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700/50'
                      : user.role === 'Content Editor'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300/60 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/50'
                      : user.role === 'Inquiries Manager'
                      ? 'bg-blue-100 text-blue-900 border-blue-300/60 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-700/50'
                      : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

                  return (
                    <tr key={user.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                      <td className="py-4 px-4 sm:px-5">
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs border ${
                            isDark ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'bg-slate-900 text-white border-slate-800'
                          }`}>
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {user.full_name}
                            </div>
                            <div className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${roleStyle}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-5">
                        <button
                          onClick={() => onToggleStatus(user.id, user.status)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer transition-all border ${
                            user.status === 'active'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300/60 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/50'
                              : 'bg-rose-100 text-rose-900 border-rose-300/60 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/50'
                          }`}
                          title="Click to toggle active/suspended status"
                        >
                          <span className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span className="capitalize">{user.status}</span>
                        </button>
                      </td>

                      <td className={`py-4 px-4 sm:px-5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Recent'}
                      </td>

                      <td className={`py-4 px-4 sm:px-5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="py-4 px-4 sm:px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className={`inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            <IconEdit className="w-3.5 h-3.5" />
                            <span>Edit Role</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to remove administrator "${user.full_name}"?`)) {
                                onDelete(user.id);
                              }
                            }}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg transition-colors"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden animate-scaleIn ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold tracking-tight">
                  {editingUser ? 'Edit Administrator Privileges' : 'Add New Administrator'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Grant role privileges and administrative access to the PIGL management portal.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              {error && (
                <div className="p-3 bg-rose-100 border border-rose-300 text-rose-900 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/50 text-xs font-bold rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Chigozie Bosah"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Corporate Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@polarisigl.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-400 focus:border-emerald-600 shadow-2xs'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                  Assigned Administrative Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-950 focus:border-emerald-600 shadow-2xs'
                  }`}
                >
                  <option value="Super Admin">Super Admin (Full System & Database Authority)</option>
                  <option value="Content Editor">Content Editor (Services, Blog, Sliders, Media)</option>
                  <option value="Inquiries Manager">Inquiries Manager (Consultations & RFPs Desk)</option>
                  <option value="Viewer">Viewer (Read-Only Metrics & Content Review)</option>
                </select>
              </div>

              {/* Role description preview */}
              <div className={`p-4 rounded-xl border space-y-2 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-xs font-bold flex items-center space-x-2 ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                  <IconShield className="w-4 h-4" />
                  <span>Role Authority: {role}</span>
                </div>
                <p className={`text-xs sm:text-sm leading-relaxed font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {ROLE_PERMISSIONS[role].description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {ROLE_PERMISSIONS[role].badges.map(b => (
                    <span key={b} className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`pt-4 flex items-center justify-end space-x-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2.5 font-bold rounded-xl text-xs uppercase border transition-colors ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center space-x-2"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{editingUser ? 'Update Administrator' : 'Save & Grant Access'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
