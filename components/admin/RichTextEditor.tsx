import React, { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
  theme?: 'light' | 'dark';
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Article Content',
  placeholder = 'Write or paste your article content here...',
  minHeight = '320px',
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const isDark = theme === 'dark';

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const replacement = `${before}${selected || 'text'}${after}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected.length || 4));
    }, 10);
  };

  const renderSimpleMarkdown = (text: string) => {
    // Basic Markdown renderer for instant preview
    const headingClassH3 = isDark ? 'text-lg font-bold text-white mt-4 mb-2' : 'text-lg font-bold text-slate-900 mt-4 mb-2';
    const headingClassH2 = isDark ? 'text-xl font-bold text-white mt-6 mb-3 border-b border-slate-800 pb-2' : 'text-xl font-bold text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-2';
    const headingClassH1 = isDark ? 'text-2xl font-black text-white mt-6 mb-4' : 'text-2xl font-black text-slate-900 mt-6 mb-4';
    const strongClass = isDark ? 'font-bold text-white' : 'font-bold text-slate-900';
    const bqClass = isDark ? 'border-l-4 border-emerald-500 pl-4 py-1 italic text-slate-300 my-4 bg-emerald-950/40 rounded-r' : 'border-l-4 border-emerald-600 pl-4 py-1 italic text-slate-700 my-4 bg-emerald-50/50 rounded-r';
    const liClass = isDark ? 'ml-6 list-disc text-slate-300 my-1' : 'ml-6 list-disc text-slate-700 my-1';
    const liDecClass = isDark ? 'ml-6 list-decimal text-slate-300 my-1' : 'ml-6 list-decimal text-slate-700 my-1';
    const linkClass = isDark ? 'text-emerald-400 underline font-medium hover:text-emerald-300' : 'text-emerald-700 underline font-medium hover:text-emerald-800';

    const html = text
      .replace(/^### (.*$)/gim, `<h3 class="${headingClassH3}">$1</h3>`)
      .replace(/^## (.*$)/gim, `<h2 class="${headingClassH2}">$1</h2>`)
      .replace(/^# (.*$)/gim, `<h1 class="${headingClassH1}">$1</h1>`)
      .replace(/\*\*(.*?)\*\*/g, `<strong class="${strongClass}">$1</strong>`)
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/^\> (.*$)/gim, `<blockquote class="${bqClass}">$1</blockquote>`)
      .replace(/^- (.*$)/gim, `<li class="${liClass}">$1</li>`)
      .replace(/^\d+\. (.*$)/gim, `<li class="${liDecClass}">$1</li>`)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="${linkClass}">$1</a>`)
      .replace(/\n\n/g, '<p class="mb-4 text-slate-600 dark:text-slate-300 leading-relaxed"></p>')
      .replace(/\n/g, '<br/>');

    return { __html: html };
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {label}
        </label>
        <div className={`flex items-center p-0.5 rounded-lg border ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeTab === 'write' 
                ? isDark ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'bg-white text-emerald-800 shadow-sm' 
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
              activeTab === 'preview' 
                ? isDark ? 'bg-slate-900 text-emerald-400 shadow-sm' : 'bg-white text-emerald-800 shadow-sm' 
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <div className={`border rounded-xl overflow-hidden shadow-sm transition-all ${
        isDark 
          ? 'border-slate-700 bg-slate-900 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500' 
          : 'border-slate-300 bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500'
      }`}>
        {activeTab === 'write' && (
          <div className={`flex flex-wrap items-center gap-1 p-2 border-b ${
            isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <button
              type="button"
              onClick={() => insertText('## ')}
              className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertText('### ')}
              className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Heading 3"
            >
              H3
            </button>
            <div className={`h-4 w-px mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <button
              type="button"
              onClick={() => insertText('**', '**')}
              className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Bold"
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => insertText('*', '*')}
              className={`px-2.5 py-1 text-xs italic font-serif rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Italic"
            >
              <em>I</em>
            </button>
            <div className={`h-4 w-px mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <button
              type="button"
              onClick={() => insertText('- ')}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Bullet List"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => insertText('1. ')}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Numbered List"
            >
              1. List
            </button>
            <button
              type="button"
              onClick={() => insertText('> ')}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Blockquote"
            >
              “ Quote
            </button>
            <button
              type="button"
              onClick={() => insertText('[Link Title](', ')')}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Hyperlink"
            >
              🔗 Link
            </button>
            <button
              type="button"
              onClick={() => insertText('![Image Description](', ')')}
              className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                isDark ? 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-white' : 'bg-white border-slate-200 rounded hover:bg-slate-100'
              }`}
              title="Embed Image"
            >
              🖼️ Image
            </button>
          </div>
        )}

        {activeTab === 'write' ? (
          <textarea
            id="rich-editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className={`w-full p-4 text-sm font-mono outline-none resize-y ${
              isDark ? 'bg-slate-900 text-slate-100 placeholder:text-slate-500' : 'bg-white text-slate-800 placeholder:text-slate-400'
            }`}
          />
        ) : (
          <div
            style={{ minHeight }}
            className={`p-6 max-w-none text-sm overflow-y-auto leading-relaxed ${
              isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-800'
            }`}
            dangerouslySetInnerHTML={renderSimpleMarkdown(value || '*No content to preview yet.*')}
          />
        )}
      </div>
      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Supports rich formatting (Markdown, Headings, Lists, Quotes, and Images).
      </p>
    </div>
  );
};

export default RichTextEditor;
