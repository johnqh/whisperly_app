import React from 'react';
import { Link } from 'react-router-dom';
import { useProjectManager } from '@sudobility/whisperly_lib';
import { useRateLimits } from '@sudobility/ratelimit_client';
import { useApi } from '../contexts/ApiContext';
import { useWhisperly } from '../contexts/WhisperlyContext';
import { useEntity } from '../contexts/EntityContext';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';

export default function Dashboard() {
  const client = useWhisperly();
  const { networkClient, baseUrl, token } = useApi();
  const { currentEntity, isLoading: entityLoading } = useEntity();
  const { user, loading: authLoading } = useAuth();
  const entitySlug = currentEntity?.entitySlug ?? '';
  const { projects, isLoading: projectsLoading } = useProjectManager(client, entitySlug);

  // Use rate limits for usage data
  const { config, isLoadingConfig, refreshConfig } = useRateLimits(networkClient, baseUrl);

  // Fetch rate limits config on mount
  React.useEffect(() => {
    if (token && entitySlug) {
      refreshConfig(token, entitySlug);
    }
  }, [token, entitySlug, refreshConfig]);

  if (projectsLoading || isLoadingConfig || entityLoading || authLoading || !currentEntity || !user) {
    return <Loading />;
  }

  // Extract usage data from rate limits config
  const tier = config?.currentEntitlement ?? 'free';
  const monthlyUsed = config?.currentUsage.monthly ?? 0;
  const monthlyLimit = config?.currentLimits.monthly ?? 0;
  const monthlyRemaining = monthlyLimit > 0 ? monthlyLimit - monthlyUsed : 0;
  const usagePercent = monthlyLimit > 0 ? (monthlyUsed / monthlyLimit) * 100 : 0;

  return (
    <>
      <Section spacing="lg">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome to Whisperly. Manage your localization projects.
        </p>
      </Section>

      <Section spacing="lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {projects.length}
            </p>
            <Link
              to="/projects"
              className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-500"
            >
              View all projects &rarr;
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {tier || 'None'}
            </p>
            <Link
              to="/subscription"
              className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-500"
            >
              Manage subscription &rarr;
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Usage</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {monthlyUsed.toLocaleString()}
            </p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{monthlyRemaining.toLocaleString()} remaining</span>
                <span>{monthlyLimit.toLocaleString()} limit</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    usagePercent > 90
                      ? 'bg-red-500'
                      : usagePercent > 70
                      ? 'bg-yellow-500'
                      : 'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recent Projects</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.slice(0, 5).map(project => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{project.display_name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.project_name}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.is_active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {project.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No projects yet.{' '}
                <Link to="/projects" className="text-primary-600 hover:underline">
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
