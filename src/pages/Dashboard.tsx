import { Link } from 'react-router-dom';
import { useProjectManager, useSubscriptionManager } from '@sudobility/whisperly_lib';
import { useWhisperly } from '../contexts/WhisperlyContext';
import Loading from '../components/Loading';

export default function Dashboard() {
  const client = useWhisperly();
  const { projects, isLoading: projectsLoading } = useProjectManager(client);
  const {
    tier,
    monthlyUsed,
    monthlyLimit,
    monthlyRemaining,
    isLoading: subscriptionLoading,
  } = useSubscriptionManager(client);

  if (projectsLoading || subscriptionLoading) {
    return <Loading />;
  }

  const usagePercent = monthlyLimit > 0 ? (monthlyUsed / monthlyLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome to Whisperly. Manage your localization projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Projects</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {projects.length}
          </p>
          <Link
            to="/projects"
            className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-500"
          >
            View all projects &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Subscription</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 capitalize">
            {tier || 'None'}
          </p>
          <Link
            to="/subscription"
            className="mt-4 inline-block text-sm text-primary-600 hover:text-primary-500"
          >
            Manage subscription &rarr;
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Monthly Usage</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {monthlyUsed.toLocaleString()}
          </p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{monthlyRemaining.toLocaleString()} remaining</span>
              <span>{monthlyLimit.toLocaleString()} limit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
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

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
        </div>
        <div className="divide-y">
          {projects.slice(0, 5).map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block px-6 py-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{project.display_name}</p>
                  <p className="text-sm text-gray-500">{project.project_name}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    project.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {project.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </Link>
          ))}
          {projects.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No projects yet.{' '}
              <Link to="/projects" className="text-primary-600 hover:underline">
                Create your first project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
