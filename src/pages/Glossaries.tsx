import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGlossaryManager,
  useProjectDetail,
} from '@sudobility/whisperly_lib';
import type { GlossaryCreateRequest } from '@sudobility/whisperly_types';
import { useWhisperly } from '../contexts/WhisperlyContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Glossaries() {
  const { projectId } = useParams<{ projectId: string }>();
  const client = useWhisperly();
  const { project } = useProjectDetail(client, projectId!);
  const {
    glossaries,
    isLoading,
    createGlossary,
    deleteGlossary,
    isCreating,
    isDeleting,
  } = useGlossaryManager(client, projectId!);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGlossary, setNewGlossary] = useState<GlossaryCreateRequest>({
    term: '',
    translations: {},
    context: undefined,
  });
  const [newTranslationLang, setNewTranslationLang] = useState('');
  const [newTranslationValue, setNewTranslationValue] = useState('');

  const handleAddTranslation = () => {
    if (newTranslationLang && newTranslationValue) {
      setNewGlossary({
        ...newGlossary,
        translations: {
          ...newGlossary.translations,
          [newTranslationLang]: newTranslationValue,
        },
      });
      setNewTranslationLang('');
      setNewTranslationValue('');
    }
  };

  const handleRemoveTranslation = (lang: string) => {
    const { [lang]: _, ...rest } = newGlossary.translations;
    setNewGlossary({ ...newGlossary, translations: rest });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGlossary(newGlossary);
    setShowCreateModal(false);
    setNewGlossary({ term: '', translations: {}, context: undefined });
  };

  const handleDelete = async (glossaryId: string) => {
    if (confirm('Are you sure you want to delete this glossary entry?')) {
      await deleteGlossary(glossaryId);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/projects/${projectId}`}
              className="text-gray-400 hover:text-gray-500"
            >
              &larr;
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Glossaries</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {project?.display_name || 'Loading...'}
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Add Term</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Translations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Context
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {glossaries.map(glossary => (
              <tr key={glossary.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {glossary.term}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(glossary.translations).map(([lang, value]) => (
                      <span
                        key={lang}
                        className="px-2 py-1 text-xs bg-gray-100 rounded"
                      >
                        <span className="font-medium">{lang}:</span> {value}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {glossary.context || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => handleDelete(glossary.id)}
                    className="text-red-600 hover:text-red-500"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {glossaries.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No glossary entries yet. Add terms to help the translation AI
            maintain consistency.
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Add Glossary Term
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Term
                </label>
                <input
                  type="text"
                  required
                  value={newGlossary.term}
                  onChange={e =>
                    setNewGlossary({ ...newGlossary, term: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Translations
                </label>
                <div className="mt-2 space-y-2">
                  {Object.entries(newGlossary.translations).map(([lang, value]) => (
                    <div
                      key={lang}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <span>
                        <span className="font-medium">{lang}:</span> {value}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTranslation(lang)}
                        className="text-red-500 hover:text-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="text"
                    placeholder="Language (e.g., ja)"
                    value={newTranslationLang}
                    onChange={e => setNewTranslationLang(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Translation"
                    value={newTranslationValue}
                    onChange={e => setNewTranslationValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddTranslation}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Context (optional)
                </label>
                <textarea
                  value={newGlossary.context ?? ''}
                  onChange={e =>
                    setNewGlossary({
                      ...newGlossary,
                      context: e.target.value || undefined,
                    })
                  }
                  rows={2}
                  placeholder="Provide context for how this term should be used..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isCreating}
                  disabled={
                    !newGlossary.term ||
                    Object.keys(newGlossary.translations).length === 0
                  }
                >
                  Add Term
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
