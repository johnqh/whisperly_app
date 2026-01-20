import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useDictionaryManager,
  useProjectDetail,
} from '@sudobility/whisperly_lib';
import type { DictionaryCreateRequest, DictionarySearchResponse } from '@sudobility/whisperly_types';
import { useWhisperly } from '../contexts/WhisperlyContext';
import { useEntity } from '../contexts/EntityContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';

export default function Glossaries() {
  const { projectId } = useParams<{ projectId: string }>();
  const client = useWhisperly();
  const { currentEntity, isLoading: entityLoading } = useEntity();
  const entitySlug = currentEntity?.entitySlug ?? '';
  const { project } = useProjectDetail(client, entitySlug, projectId!);
  const {
    dictionaries,
    isLoading,
    createDictionary,
    deleteDictionary,
    isCreating,
    isDeleting,
  } = useDictionaryManager(client, entitySlug, projectId!);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDictionary, setNewDictionary] = useState<DictionaryCreateRequest>({});
  const [newTranslationLang, setNewTranslationLang] = useState('');
  const [newTranslationValue, setNewTranslationValue] = useState('');

  const handleAddTranslation = () => {
    if (newTranslationLang && newTranslationValue) {
      setNewDictionary({
        ...newDictionary,
        [newTranslationLang]: newTranslationValue,
      });
      setNewTranslationLang('');
      setNewTranslationValue('');
    }
  };

  const handleRemoveTranslation = (lang: string) => {
    const { [lang]: _, ...rest } = newDictionary;
    setNewDictionary(rest);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDictionary(newDictionary);
    setShowCreateModal(false);
    setNewDictionary({});
  };

  const handleDelete = async (dictionaryId: string) => {
    if (confirm('Are you sure you want to delete this dictionary entry?')) {
      await deleteDictionary(dictionaryId);
    }
  };

  if (isLoading || entityLoading || !currentEntity) {
    return <Loading />;
  }

  return (
    <>
      <Section spacing="lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <Link
                to={`/projects/${projectId}`}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                &larr;
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dictionary</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {project?.display_name || 'Loading...'}
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>Add Entry</Button>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Translations
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {dictionaries.map((dictionary: DictionarySearchResponse) => (
                <tr key={dictionary.dictionary_id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">
                    {dictionary.dictionary_id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(dictionary.translations).map(([lang, value]) => (
                        <span
                          key={lang}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded"
                        >
                          <span className="font-medium">{lang}:</span> {value}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleDelete(dictionary.dictionary_id)}
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
          {dictionaries.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No dictionary entries yet. Add entries to help the translation AI
              maintain consistency.
            </div>
          )}
        </div>
      </Section>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Add Dictionary Entry
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Translations
                </label>
                <div className="mt-2 space-y-2">
                  {Object.entries(newDictionary).map(([lang, value]) => (
                    <div
                      key={lang}
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded"
                    >
                      <span className="text-gray-900 dark:text-gray-100">
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <input
                    type="text"
                    placeholder="Translation"
                    value={newTranslationValue}
                    onChange={e => setNewTranslationValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                  disabled={Object.keys(newDictionary).length === 0}
                >
                  Add Entry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
