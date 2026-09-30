import React, { useState } from 'react';
import { CMSProject } from '../../types';
import AdminProjectEditor from './AdminProjectEditor';
import {
  IconProjects,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconExternal
} from '../../components/admin/AdminIcons';

interface AdminProjectsProps {
  projects: CMSProject[];
  loading: boolean;
  onSave: (project: Partial<CMSProject> & { title: string; client: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const CATEGORIES = ['All', 'Intelligence', 'Solutions & Engineering', 'Pipeline', 'Civil'];

const AdminProjects: React.FC<AdminProjectsProps> = ({
  projects,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const [editingProject, setEditingProject] = useState<CMSProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isDark = theme === 'dark';

  const filtered = projects.filter(p => {
    const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSaveAndClose = async (payload: any) => {
    await onSave(payload);
    setEditingProject(null);
    setIsCreating(false);
  };

  if (isCreating || editingProject) {
    return (
      <AdminProjectEditor
        initialData={editingProject}
        onSave={handleSaveAndClose}
        theme={theme}
        onCancel={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Projects & Engineering Case Studies
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              {projects.length} Total
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage major Nigerian energy, offshore, pipeline, and infrastructure milestones displayed on the website.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Project / Case Study</span>
        </button>
      </div>

      {/* Toolbar & Filter */}
      <div className={`p-4 rounded-2xl border shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="relative w-full sm:w-84">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <IconSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search projects by title, client, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading projects from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No projects found matching your search. Click "Add Project / Case Study" to record a new engineering delivery.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Project & Location</th>
                  <th className="py-3.5 px-4 sm:px-5">Client</th>
                  <th className="py-3.5 px-4 sm:px-5">Category</th>
                  <th className="py-3.5 px-4 sm:px-5">Year</th>
                  <th className="py-3.5 px-4 sm:px-5">Status</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                {filtered.map((project) => (
                  <tr key={project.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                    <td className="py-4 px-4 sm:px-5">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-12 h-10 rounded-xl overflow-hidden border flex-shrink-0 ${
                          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'
                        }`}>
                          <img
                            src={project.image || '/assets/slider.jpeg'}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-md">
                          <p className={`font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.title}</p>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{project.location || 'Nigeria'}</p>
                        </div>
                      </div>
                    </td>

                    <td className={`py-4 px-4 sm:px-5 font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {project.client}
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}>
                        {project.category}
                      </span>
                    </td>

                    <td className={`py-4 px-4 sm:px-5 font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {project.year || '2024'}
                    </td>

                    <td className="py-4 px-4 sm:px-5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                          project.status === 'published'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                        }`}>
                          {project.status}
                        </span>
                        {project.featured && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/60 dark:border-purple-700/50">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                      <a
                        href={`/projects?id=${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
                      >
                        <IconExternal className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                      <button
                        onClick={() => setEditingProject(project)}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isDark 
                            ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/50' 
                            : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200'
                        }`}
                      >
                        <IconEdit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${project.title}"?`)) {
                            onDelete(project.id);
                          }
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg text-xs font-bold transition-colors"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
