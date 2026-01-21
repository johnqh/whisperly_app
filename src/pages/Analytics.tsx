import { useState, useCallback } from 'react';
import { useAnalyticsManager, useProjectManager } from '@sudobility/whisperly_lib';
import { getFirebaseAuth } from '@sudobility/auth_lib';
import { useApi } from '../contexts/ApiContext';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';

export default function Analytics() {
  const { baseUrl } = useApi();
  const { currentEntity, isLoading: entityLoading } = useCurrentEntity();
  const entitySlug = currentEntity?.entitySlug ?? '';

  // Create getIdToken function from Firebase auth
  const getIdToken = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) return undefined;
    return currentUser.getIdToken();
  }, []);
  const { projects } = useProjectManager({ baseUrl, getIdToken, entitySlug });
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  const { aggregate, byProject, byDate, isLoading } =
    useAnalyticsManager({
      baseUrl,
      getIdToken,
      entitySlug,
      projectId: selectedProjectId,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

  if (isLoading || entityLoading || !currentEntity) {
    return <Loading />;
  }

  return (
    <>
      <Section spacing="lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View your translation usage and statistics
        </p>
      </Section>

      <Section spacing="lg">
        <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>
            <select
              value={selectedProjectId ?? ''}
              onChange={e =>
                setSelectedProjectId(e.target.value || undefined)
              }
              className="mt-1 block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.display_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start ?? ''}
              onChange={e =>
                setDateRange({ ...dateRange, start: e.target.value || undefined })
              }
              className="mt-1 block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end ?? ''}
              onChange={e =>
                setDateRange({ ...dateRange, end: e.target.value || undefined })
              }
              className="mt-1 block px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </Section>

      {aggregate && (
        <Section spacing="lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {aggregate.total_requests.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Strings Translated
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {aggregate.total_strings.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Characters</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {aggregate.total_characters.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {(aggregate.success_rate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Section>
      )}

      <Section spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Usage by Project</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {byProject.map(item => (
                <div key={item.project_id} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {item.project_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.request_count.toLocaleString()} requests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {item.string_count.toLocaleString()} strings
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(item.success_rate * 100).toFixed(0)}% success
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {byProject.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Usage by Date</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {byDate.map(item => (
                <div key={item.date} className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {item.request_count.toLocaleString()} requests
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.string_count.toLocaleString()} strings
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {byDate.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
