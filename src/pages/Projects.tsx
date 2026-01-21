import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectManager } from '@sudobility/whisperly_lib';
import { ItemList } from '@sudobility/components';
import type { Project } from '@sudobility/whisperly_types';
import { getFirebaseAuth } from '@sudobility/auth_lib';
import { useApi } from '../contexts/ApiContext';
import { useCurrentEntity } from '../hooks/useCurrentEntity';
import Loading from '../components/Loading';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

// Icons
const FolderIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export default function Projects() {
  const { baseUrl } = useApi();
  const { currentEntity, isLoading: entityLoading } = useCurrentEntity();
  const { entitySlug: routeEntitySlug } = useParams<{ entitySlug: string }>();
  const entitySlug = routeEntitySlug || currentEntity?.entitySlug || '';
  const { navigate } = useLocalizedNavigate();

  // Create getIdToken function from Firebase auth
  const getIdToken = useCallback(async () => {
    const auth = getFirebaseAuth();
    const currentUser = auth?.currentUser;
    if (!currentUser) return undefined;
    return currentUser.getIdToken();
  }, []);

  const {
    projects,
    isLoading,
    deleteProject,
    isDeleting,
  } = useProjectManager({ baseUrl, getIdToken, entitySlug });

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  const renderProjectCard = (project: Project) => (
    <div
      className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 cursor-pointer transition-colors group"
      onClick={() => navigate(`/dashboard/${entitySlug}/projects/${project.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {project.display_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono truncate">
            {project.project_name}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              project.is_active
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {project.is_active ? 'Active' : 'Inactive'}
          </span>
          <div
            className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleDeleteProject(project.id)}
              disabled={isDeleting}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded disabled:opacity-50"
              title="Delete"
            >
              <svg
                className="w-4 h-4 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>
          Created{' '}
          {project.created_at
            ? new Date(project.created_at).toLocaleDateString()
            : '-'}
        </span>
      </div>
    </div>
  );

  if (entityLoading || !currentEntity) {
    return <Loading />;
  }

  return (
    <ItemList
      title="Projects"
      items={projects}
      renderItem={renderProjectCard}
      keyExtractor={(project) => project.id}
      loading={isLoading && projects.length === 0}
      actions={[
        {
          id: 'create',
          label: 'Add Project',
          onClick: () => navigate(`/dashboard/${entitySlug}/projects/new`),
          icon: <PlusIcon />,
          variant: 'primary',
        },
      ]}
      emptyMessage="No projects yet. Create your first project to get started."
      emptyIcon={
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
          <FolderIcon />
        </div>
      }
      emptyAction={{
        label: 'Add Project',
        onClick: () => navigate(`/dashboard/${entitySlug}/projects/new`),
      }}
      spacing="md"
    />
  );
}
