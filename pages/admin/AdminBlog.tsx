import React, { useState } from 'react';
import { CMSBlogPost } from '../../types';
import AdminBlogEditor from './AdminBlogEditor';
import {
  IconBlog,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconExternal
} from '../../components/admin/AdminIcons';

interface AdminBlogProps {
  posts: CMSBlogPost[];
  loading: boolean;
  onSave: (post: Partial<CMSBlogPost> & { title: string; content: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminBlog: React.FC<AdminBlogProps> = ({
  posts,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const [editingPost, setEditingPost] = useState<CMSBlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const isDark = theme === 'dark';

  const categories = ['All', 'Technical Updates', 'Project Milestones', 'Industry Insights', 'HSSEQ & Safety', 'Company News'];

  const filtered = posts.filter(p => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (filterStatus !== 'All' && p.status !== filterStatus) return false;
    return true;
  });

  const handleSaveAndClose = async (payload: any) => {
    await onSave(payload);
    setEditingPost(null);
    setIsCreating(false);
  };

  if (isCreating || editingPost) {
    return (
      <AdminBlogEditor
        initialData={editingPost}
        onSave={handleSaveAndClose}
        theme={theme}
        onCancel={() => {
          setEditingPost(null);
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
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Blog & Technical Insights
          </h1>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Publish engineering articles, project milestones, and corporate developments to the public website.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-1.5 text-xs sm:text-sm border rounded-xl font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading articles from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No articles found matching your filter criteria. Click "Write New Article" to publish one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">Article</th>
                  <th className="py-3.5 px-4 sm:px-5">Category</th>
                  <th className="py-3.5 px-4 sm:px-5">Author</th>
                  <th className="py-3.5 px-4 sm:px-5">Date</th>
                  <th className="py-3.5 px-4 sm:px-5">Status</th>
                  <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                {filtered.map((post) => (
                  <tr key={post.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                    <td className="py-4 px-4 sm:px-5">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-12 h-10 rounded-xl overflow-hidden border flex-shrink-0 ${
                          isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'
                        }`}>
                          <img
                            src={post.featured_image || '/assets/IMG_6170.jpg'}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-md">
                          <p className={`font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{post.title}</p>
                          <p className={`text-xs font-mono mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/blog/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                      }`}>
                        {post.category}
                      </span>
                    </td>
                    <td className={`py-4 px-4 sm:px-5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {post.author}
                    </td>
                    <td className={`py-4 px-4 sm:px-5 whitespace-nowrap text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-4 sm:px-5">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase border ${
                          post.status === 'published'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                            : post.status === 'draft'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}>
                          {post.status}
                        </span>
                        {post.featured && (
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/60 dark:border-purple-700/50">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-5 text-right space-x-2 whitespace-nowrap">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-colors"
                      >
                        <IconExternal className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </a>
                      <button
                        onClick={() => setEditingPost(post)}
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
                          if (confirm(`Are you sure you want to delete article "${post.title}"?`)) {
                            onDelete(post.id);
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

export default AdminBlog;
