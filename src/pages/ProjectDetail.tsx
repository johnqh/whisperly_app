import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectDetail, useProjectManager } from '@sudobility/whisperly_lib';
import type { ProjectUpdateRequest } from '@sudobility/whisperly_types';
import { useWhisperly } from '../contexts/WhisperlyContext';
import { useEntity } from '../contexts/EntityContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Section } from '../components/layout/Section';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const client = useWhisperly();
  const { currentEntity, isLoading: entityLoading } = useEntity();
  const entitySlug = currentEntity?.entitySlug ?? '';
  const { project, isLoading, refetch } = useProjectDetail(client, entitySlug, projectId!);
  const { updateProject, isUpdating } = useProjectManager(client, entitySlug);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProjectUpdateRequest>({
    display_name: undefined,
    project_name: undefined,
    description: undefined,
    instructions: undefined,
    default_source_language: undefined,
    default_target_languages: undefined,
    ip_allowlist: undefined,
    is_active: undefined,
  });

  if (isLoading || entityLoading || !currentEntity || !project) {
    return <Loading />;
  }

  const handleEdit = () => {
    setEditData({
      display_name: project.display_name,
      project_name: project.project_name,
      description: project.description ?? undefined,
      instructions: project.instructions ?? undefined,
      default_source_language: project.default_source_language ?? undefined,
      default_target_languages: project.default_target_languages ?? undefined,
      ip_allowlist: project.ip_allowlist ?? undefined,
      is_active: project.is_active ?? true,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateProject(project.id, editData);
    setIsEditing(false);
    refetch();
  };

  return (
    <>
      <Section spacing="lg">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <Link to="/projects" className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                &larr;
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {project.display_name}
              </h1>
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
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.project_name}</p>
          </div>
          <div className="space-x-2">
            <Link to={`/projects/${project.id}/dictionary`}>
              <Button variant="secondary">Manage Dictionary</Button>
            </Link>
            {!isEditing && (
              <Button onClick={handleEdit}>Edit Project</Button>
            )}
          </div>
        </div>
      </Section>

      <Section spacing="lg">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Project Details</h2>
          </div>
          <div className="p-6 space-y-4">
            {isEditing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editData.display_name ?? ''}
                    onChange={e =>
                      setEditData({ ...editData, display_name: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={editData.project_name ?? ''}
                    onChange={e =>
                      setEditData({ ...editData, project_name: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={editData.description ?? ''}
                    onChange={e =>
                      setEditData({
                        ...editData,
                        description: e.target.value || undefined,
                      })
                    }
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instructions (for translation AI)
                  </label>
                  <textarea
                    value={editData.instructions ?? ''}
                    onChange={e =>
                      setEditData({
                        ...editData,
                        instructions: e.target.value || undefined,
                      })
                    }
                    rows={5}
                    placeholder="Provide context and instructions for the translation AI..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={editData.is_active ?? true}
                    onChange={e =>
                      setEditData({ ...editData, is_active: e.target.checked })
                    }
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Active
                  </label>
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
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {project.description || 'No description'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructions</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {project.instructions || 'No instructions provided'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString()
                      : 'Unknown'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
