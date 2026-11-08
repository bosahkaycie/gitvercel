import React, { useState } from 'react';
import {
  Campaign,
  CampaignForm,
  CampaignFormField,
  FormFieldType,
  FormFieldOption
} from '../../../types/campaign';
import { saveCampaignForm } from '../../../lib/campaignApi';
import {
  IconPlus,
  IconTrash,
  IconCheck,
  IconChevronDown,
  IconExternal
} from '../AdminIcons';

interface CampaignFormBuilderProps {
  campaign: Campaign;
  form: CampaignForm;
  onFormUpdated: (updatedForm: CampaignForm) => void;
}

const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  short_text: 'Short Text',
  long_text: 'Long Text (Textarea)',
  email: 'Corporate Email',
  phone: 'Telephone / Mobile',
  number: 'Number',
  dropdown: 'Dropdown Select',
  radio: 'Single Choice (Radio)',
  checkbox: 'Multi-select (Checkboxes)',
  date: 'Date Picker',
  file: 'File Upload (CV / RFP)',
  consent: 'Consent Checkbox',
  section_heading: 'Section Heading',
  descriptive_text: 'Descriptive Text'
};

export const CampaignFormBuilder: React.FC<CampaignFormBuilderProps> = ({
  campaign,
  form,
  onFormUpdated
}) => {
  const activeVersion = form.versions.find(v => v.versionNumber === form.activeVersion) || form.versions[0];
  const [fields, setFields] = useState<CampaignFormField[]>(() => {
    return activeVersion?.fields ? JSON.parse(JSON.stringify(activeVersion.fields)) : [];
  });
  const [formTitle, setFormTitle] = useState(form.title);
  const [formDesc, setFormDesc] = useState(form.description || '');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedField = fields.find(f => f.id === selectedFieldId) || null;

  // Add field
  const handleAddField = (type: FormFieldType) => {
    const newId = `f_${type}_${Date.now()}`;
    const newField: CampaignFormField = {
      id: newId,
      type,
      label: type === 'section_heading' ? 'New Section' : `New ${FIELD_TYPE_LABELS[type]}`,
      required: type === 'consent' || type === 'email',
      placeholder: '',
      order: fields.length + 1,
      options: ['dropdown', 'radio', 'checkbox'].includes(type)
        ? [
            { id: 'opt_1', label: 'Option 1', value: 'opt_1' },
            { id: 'opt_2', label: 'Option 2', value: 'opt_2' }
          ]
        : undefined
    };
    setFields(prev => [...prev, newField]);
    setSelectedFieldId(newId);
  };

  // Reorder
  const moveField = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const nextFields = [...fields];
    const [moved] = nextFields.splice(index, 1);
    nextFields.splice(targetIdx, 0, moved);
    // re-index order
    const updated = nextFields.map((f, i) => ({ ...f, order: i + 1 }));
    setFields(updated);
  };

  // Delete field
  const deleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id).map((f, i) => ({ ...f, order: i + 1 })));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  // Duplicate field
  const duplicateField = (field: CampaignFormField) => {
    const clone: CampaignFormField = {
      ...JSON.parse(JSON.stringify(field)),
      id: `f_${field.type}_${Date.now()}`,
      label: `${field.label} (Copy)`,
      order: fields.length + 1
    };
    setFields(prev => [...prev, clone]);
    setSelectedFieldId(clone.id);
  };

  // Update selected field property
  const updateFieldProperty = (fieldId: string, property: keyof CampaignFormField, value: any) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === fieldId) {
          return { ...f, [property]: value };
        }
        return f;
      })
    );
  };

  // Option management for selection fields
  const handleAddOption = (fieldId: string) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === fieldId) {
          const currentOpts = f.options || [];
          const newOpt: FormFieldOption = {
            id: `opt_${Date.now()}`,
            label: `Option ${currentOpts.length + 1}`,
            value: `option_${currentOpts.length + 1}`
          };
          return { ...f, options: [...currentOpts, newOpt] };
        }
        return f;
      })
    );
  };

  const handleUpdateOption = (fieldId: string, optId: string, label: string) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === fieldId) {
          return {
            ...f,
            options: (f.options || []).map(opt => (opt.id === optId ? { ...opt, label, value: label.toLowerCase().replace(/\s+/g, '_') } : opt))
          };
        }
        return f;
      })
    );
  };

  const handleDeleteOption = (fieldId: string, optId: string) => {
    setFields(prev =>
      prev.map(f => {
        if (f.id === fieldId) {
          return {
            ...f,
            options: (f.options || []).filter(opt => opt.id !== optId)
          };
        }
        return f;
      })
    );
  };

  // Save form
  const handleSaveForm = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await saveCampaignForm({
        formId: form.id,
        campaignId: campaign.id,
        title: formTitle,
        description: formDesc,
        fields
      });
      onFormUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save form changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dynamic Form Builder</h2>
            <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-800">
              Active Version: v{form.activeVersion}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Form assigned to: <strong className="text-slate-700 dark:text-slate-300">{campaign.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fadeIn">
              <IconCheck className="w-4 h-4" /> Form saved successfully!
            </span>
          )}
          <button
            onClick={handleSaveForm}
            disabled={isSaving}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? 'Publishing Version...' : 'Save & Publish Form'}
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio: Left Palette, Middle Canvas, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PALETTE: Available Field Types */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Add Form Elements
            </h3>
            <div className="space-y-1.5">
              {(Object.keys(FIELD_TYPE_LABELS) as FormFieldType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAddField(type)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 border border-transparent hover:border-emerald-200 dark:hover:border-slate-700 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>{FIELD_TYPE_LABELS[type]}</span>
                  <IconPlus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Form Metadata */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Form Header Configuration
            </h3>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Form Display Title
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Subtitle / Instructions
              </label>
              <textarea
                rows={2}
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* MIDDLE CANVAS: Form Structure & Reordering */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Form Fields ({fields.length})
            </span>
            <span className="text-xs text-slate-400">Click a field to inspect &amp; edit</span>
          </div>

          {fields.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 space-y-2">
              <p className="text-sm font-medium">This form has no fields yet.</p>
              <p className="text-xs">Select elements from the left palette to add questions.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {fields.map((field, idx) => {
                const isSelected = field.id === selectedFieldId;
                const isHeading = field.type === 'section_heading';
                return (
                  <div
                    key={field.id}
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                        : isHeading
                        ? 'bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 font-bold'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-400">#{idx + 1}</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {field.label || 'Untitled Field'}
                          </span>
                          {field.required && (
                            <span className="text-[10px] text-red-500 font-bold">*Required</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {FIELD_TYPE_LABELS[field.type]}
                        </p>
                      </div>

                      {/* Move / Duplicate / Delete Controls */}
                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            moveField(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 disabled:opacity-20 cursor-pointer text-xs"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            moveField(idx, 'down');
                          }}
                          disabled={idx === fields.length - 1}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 disabled:opacity-20 cursor-pointer text-xs"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            duplicateField(field);
                          }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 cursor-pointer text-xs"
                          title="Duplicate"
                        >
                          ⎘
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            deleteField(field.id);
                          }}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/60 rounded text-red-500 cursor-pointer"
                          title="Delete Field"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT INSPECTOR / LIVE PREVIEW TABBED */}
        <div className="lg:col-span-4 space-y-4">
          {/* Inspector Panel for Selected Field */}
          {selectedField ? (
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
                  Field Inspector
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                  {FIELD_TYPE_LABELS[selectedField.type]}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={e => updateFieldProperty(selectedField.id, 'label', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              {selectedField.type !== 'section_heading' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={selectedField.placeholder || ''}
                    onChange={e => updateFieldProperty(selectedField.id, 'placeholder', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Helper Description
                </label>
                <textarea
                  rows={2}
                  value={selectedField.description || ''}
                  onChange={e => updateFieldProperty(selectedField.id, 'description', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="req_checkbox"
                  checked={selectedField.required}
                  onChange={e => updateFieldProperty(selectedField.id, 'required', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="req_checkbox" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Mandatory (Required Field)
                </label>
              </div>

              {/* Options Editor for Choice Fields */}
              {['dropdown', 'radio', 'checkbox'].includes(selectedField.type) && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Options List
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAddOption(selectedField.id)}
                      className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {(selectedField.options || []).map(opt => (
                      <div key={opt.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={e => handleUpdateOption(selectedField.id, opt.id, e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(selectedField.id, opt.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              Select any field in the middle column to inspect and configure its rules.
            </div>
          )}

          {/* Quick Preview Toggle */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Live Preview
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    previewMode === 'desktop' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    previewMode === 'mobile' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Render mini preview */}
            <div className={`p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 mx-auto transition-all ${
              previewMode === 'mobile' ? 'max-w-[280px]' : 'w-full'
            }`}>
              <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{formTitle}</p>
                <p className="text-[10px] text-slate-500 truncate">{formDesc}</p>
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {fields.slice(0, 5).map(f => (
                  <div key={f.id} className="text-left">
                    <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {f.label} {f.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      disabled
                      placeholder={f.placeholder || ''}
                      className="w-full mt-1 px-2 py-1 text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-400"
                    />
                  </div>
                ))}
                {fields.length > 5 && (
                  <p className="text-[10px] text-center text-slate-400 italic">
                    + {fields.length - 5} more fields...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
