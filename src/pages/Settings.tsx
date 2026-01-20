import { useState } from 'react';
import { useSettingsManager } from '@sudobility/whisperly_lib';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';

export default function Settings() {
  const { baseUrl } = useApi();
  const { user, loading: authLoading, getIdToken } = useAuth();
  const userId = user?.uid ?? '';
  const { settings, isLoading, updateSettings, isUpdating } =
    useSettingsManager({ baseUrl, getIdToken, userId });

  const [isEditing, setIsEditing] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgPath, setOrgPath] = useState('');

  const handleEdit = () => {
    setOrgName(settings?.organization_name ?? '');
    setOrgPath(settings?.organization_path ?? '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateSettings({
      organization_name: orgName || undefined,
      organization_path: orgPath || undefined,
    });
    setIsEditing(false);
  };

  if (isLoading || authLoading || !user) {
    return <Loading />;
  }

  return (
    <>
      <Section spacing="lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account and organization settings
        </p>
      </Section>

      <Section spacing="lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Organization Settings
            </h2>
            {!isEditing && (
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                Edit
              </Button>
            )}
          </div>
          <div className="p-6 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={e => setOrgName(e.target.value)}
                    placeholder="My Company"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Organization Path
                  </label>
                  <input
                    type="text"
                    value={orgPath}
                    onChange={e => setOrgPath(e.target.value)}
                    placeholder="my-company"
                    pattern="[a-z0-9-]+"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    URL-safe identifier (lowercase letters, numbers, and hyphens)
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} isLoading={isUpdating}>
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Organization Name
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {settings?.organization_name || 'Not set'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Organization Path
                  </h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {settings?.organization_path || 'Not set'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">API Integration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Translation API Endpoint
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                POST /translate/{settings?.organization_path || '{org}'}/
                {'{project}'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Dictionary Callback URL
              </h3>
              <p className="mt-1 text-gray-900 dark:text-gray-100 font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                GET /dictionary/{settings?.organization_path || '{org}'}/
                {'{project}'}?term={'{term}'}&languages={'{lang1,lang2}'}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
