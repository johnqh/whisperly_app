import { useState } from 'react';
import { useSettingsManager } from '@sudobility/whisperly_lib';
import { useWhisperly } from '../contexts/WhisperlyContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Settings() {
  const client = useWhisperly();
  const { settings, isLoading, updateSettings, isUpdating } =
    useSettingsManager(client);

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account and organization settings
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
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
                <label className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  placeholder="My Company"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organization Path
                </label>
                <input
                  type="text"
                  value={orgPath}
                  onChange={e => setOrgPath(e.target.value)}
                  placeholder="my-company"
                  pattern="[a-z0-9-]+"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL-safe identifier (lowercase letters, numbers, and hyphens)
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
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
                <h3 className="text-sm font-medium text-gray-500">
                  Organization Name
                </h3>
                <p className="mt-1 text-gray-900">
                  {settings?.organization_name || 'Not set'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Organization Path
                </h3>
                <p className="mt-1 text-gray-900">
                  {settings?.organization_path || 'Not set'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">API Integration</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Translation API Endpoint
            </h3>
            <p className="mt-1 text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
              POST /translate/{settings?.organization_path || '{org}'}/
              {'{project}'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Glossary Callback URL
            </h3>
            <p className="mt-1 text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
              GET /glossary/{settings?.organization_path || '{org}'}/
              {'{project}'}?glossary={'{term}'}&languages={'{lang1,lang2}'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
