import React, { useState } from 'react';
import { DEFAULT_CAMPAIGN_CATEGORIES } from '../../../constants/campaignDefaults';
import { IconCheck, IconSettings, IconShield } from '../AdminIcons';

export const CampaignSettings: React.FC = () => {
  const [categories, setCategories] = useState<string[]>(DEFAULT_CAMPAIGN_CATEGORIES);
  const [newCatInput, setNewCatInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim() || categories.includes(newCatInput.trim())) return;
    setCategories(prev => [...prev, newCatInput.trim()]);
    setNewCatInput('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemoveCategory = (cat: string) => {
    if (categories.length <= 1) return;
    setCategories(prev => prev.filter(c => c !== cat));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Campaign &amp; Lead Capture Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure event categories, default NDPA data protection wording, and export security rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Manager */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Configurable Event Categories
          </h3>
          <p className="text-xs text-slate-500">
            Administrators can tag campaigns with these categories when creating new conferences or seminars.
          </p>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Energy Summit, Trade Mission..."
              value={newCatInput}
              onChange={e => setNewCatInput(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              Add Category
            </button>
          </form>

          {savedSuccess && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <IconCheck className="w-3.5 h-3.5" /> Category updated successfully!
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {cat}
                {categories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCategory(cat)}
                    className="text-slate-400 hover:text-red-500 cursor-pointer ml-1"
                  >
                    &times;
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Data Protection & Privacy Notice */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <IconShield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Protection &amp; NDPA Compliance
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            All campaign submission endpoints strictly sanitize user inputs and provide explicit consent checkboxes in compliance with the Nigeria Data Protection Act (NDPA).
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white">Enterprise Security Highlights:</p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Formulas starting with <code>=</code>, <code>+</code>, <code>-</code>, <code>@</code> are escaped automatically on CSV export to prevent spreadsheet injection vulnerabilities.</li>
              <li>Public submissions are isolated from administrative telemetry and backend email credentials.</li>
              <li>Form versions are cryptographically anchored so past submissions preserve their original question context.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
