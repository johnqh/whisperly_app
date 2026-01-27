import { useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  useLanguagesManager,
  useProjectDetail,
} from '@sudobility/whisperly_lib';
import { getFirebaseAuth } from '@sudobility/auth_lib';
import { useApi } from '../contexts/ApiContext';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';
import { LocalizedLink } from '../components/layout/LocalizedLink';

export default function Languages() {
  const { entitySlug: routeEntitySlug, projectId } = useParams<{ entitySlug: string; projectId: string }>();
  const { baseUrl } = useApi();
  const { currentEntity, isLoading: entityLoading } = useCurrentEntity();
  const entitySlug = routeEntitySlug || currentEntity?.entitySlug || '';

  // Create getIdToken function from Firebase auth
  const getIdToken = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) return undefined;
    return currentUser.getIdToken();
  }, []);

  const { project } = useProjectDetail({ baseUrl, getIdToken, entitySlug, projectId: projectId! });
  const {
    projectLanguages,
    availableLanguages,
    isLoading,
    error,
    updateLanguages,
    isUpdating,
  } = useLanguagesManager({ baseUrl, getIdToken, entitySlug, projectId: projectId! });

  // Parse project languages into a Set for easy lookup
  const originalSelectedSet = useMemo(() => {
    if (!projectLanguages) return new Set<string>();
    return new Set(projectLanguages.split(',').filter(Boolean));
  }, [projectLanguages]);

  // Local state for selected languages
  const [selectedLanguages, setSelectedLanguages] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Initialize selected languages when data loads
  if (projectLanguages !== null && !initialized) {
    setSelectedLanguages(new Set(projectLanguages.split(',').filter(Boolean)));
    setInitialized(true);
  }

  // Check if there are changes
  const hasChanges = useMemo(() => {
    if (selectedLanguages.size !== originalSelectedSet.size) return true;
    for (const lang of selectedLanguages) {
      if (!originalSelectedSet.has(lang)) return true;
    }
    return false;
  }, [selectedLanguages, originalSelectedSet]);

  const handleToggleLanguage = (languageCode: string) => {
    setSelectedLanguages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(languageCode)) {
        newSet.delete(languageCode);
      } else {
        newSet.add(languageCode);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    const languagesString = Array.from(selectedLanguages).join(',');
    await updateLanguages(languagesString);
    // Reset to mark as saved
    setInitialized(false);
  };

  if (isLoading || entityLoading || !currentEntity) {
    return <Loading />;
  }

  if (error) {
    return (
      <Section spacing="lg">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </Section>
    );
  }

  return (
    <>
      <Section spacing="lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <LocalizedLink
                to={`/dashboard/${entitySlug}/projects/${projectId}`}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                &larr;
              </LocalizedLink>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Languages</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {project?.display_name || 'Loading...'}
            </p>
          </div>
          {hasChanges && (
            <Button onClick={handleSave} isLoading={isUpdating}>
              Save Changes
            </Button>
          )}
        </div>
      </Section>

      <Section spacing="lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Target Languages
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Select the languages you want to translate your content into.
            </p>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {availableLanguages.map(lang => (
              <label
                key={lang.language_code}
                className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.has(lang.language_code)}
                  onChange={() => handleToggleLanguage(lang.language_code)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <img
                  src={lang.flag}
                  alt={`${lang.language} flag`}
                  className="ml-4 h-5 w-7 object-cover rounded-sm"
                />
                <span className="ml-3 text-gray-900 dark:text-gray-100">
                  {lang.language}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({lang.language_code})
                </span>
              </label>
            ))}
          </div>
          {availableLanguages.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
              No languages available.
            </div>
          )}
        </div>
      </Section>

      {hasChanges && (
        <Section spacing="lg">
          <div className="flex justify-end">
            <Button onClick={handleSave} isLoading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </Section>
      )}
    </>
  );
}
