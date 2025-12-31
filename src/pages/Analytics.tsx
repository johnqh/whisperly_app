import { useState } from 'react';
import { useAnalyticsManager, useProjectManager } from '@sudobility/whisperly_lib';
import { useWhisperly } from '../contexts/WhisperlyContext';
import Loading from '../components/Loading';

export default function Analytics() {
  const client = useWhisperly();
  const { projects } = useProjectManager(client);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    undefined
  );
  const [dateRange, setDateRange] = useState<{
    start?: string;
    end?: string;
  }>({});

  const { aggregate, byProject, byDate, isLoading } =
    useAnalyticsManager(client, {
      projectId: selectedProjectId,
      startDate: dateRange.start,
      endDate: dateRange.end,
    });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your translation usage and statistics
        </p>
      </div>

      <div className="flex space-x-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project
          </label>
          <select
            value={selectedProjectId ?? ''}
            onChange={e =>
              setSelectedProjectId(e.target.value || undefined)
            }
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start ?? ''}
            onChange={e =>
              setDateRange({ ...dateRange, start: e.target.value || undefined })
            }
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end ?? ''}
            onChange={e =>
              setDateRange({ ...dateRange, end: e.target.value || undefined })
            }
            className="mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>

      {aggregate && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {aggregate.total_requests.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">
              Strings Translated
            </h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {aggregate.total_strings.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Characters</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {aggregate.total_characters.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {(aggregate.success_rate * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Usage by Project</h2>
          </div>
          <div className="divide-y">
            {byProject.map(item => (
              <div key={item.project_id} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.project_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.request_count.toLocaleString()} requests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {item.string_count.toLocaleString()} strings
                    </p>
                    <p className="text-sm text-gray-500">
                      {(item.success_rate * 100).toFixed(0)}% success
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {byProject.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Usage by Date</h2>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {byDate.map(item => (
              <div key={item.date} className="px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">
                      {item.request_count.toLocaleString()} requests
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.string_count.toLocaleString()} strings
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {byDate.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
