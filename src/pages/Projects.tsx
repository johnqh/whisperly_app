import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectManager } from '@sudobility/whisperly_lib';
import type { ProjectCreateRequest } from '@sudobility/whisperly_types';
import { useWhisperly } from '../contexts/WhisperlyContext';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function Projects() {
  const client = useWhisperly();
  const {
    projects,
    isLoading,
    createProject,
    deleteProject,
    isCreating,
    isDeleting,
  } = useProjectManager(client);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState<ProjectCreateRequest>({
    project_name: '',
    display_name: '',
    description: undefined,
    instructions: undefined,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject(newProject);
    setShowCreateModal(false);
    setNewProject({
      project_name: '',
      display_name: '',
      description: undefined,
      instructions: undefined,
    });
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(projectId);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your localization projects
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>New Project</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map(project => (
              <tr key={project.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-primary-600 hover:text-primary-500 font-medium"
                  >
                    {project.display_name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {project.project_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      project.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {project.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                  <Link
                    to={`/projects/${project.id}/glossaries`}
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Glossaries
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
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
        {projects.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            No projects yet. Create your first project to get started.
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Create New Project
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={newProject.display_name}
                  onChange={e =>
                    setNewProject({ ...newProject, display_name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Name (URL-safe)
                </label>
                <input
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  value={newProject.project_name}
                  onChange={e =>
                    setNewProject({ ...newProject, project_name: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newProject.description ?? ''}
                  onChange={e =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value || undefined,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isCreating}>
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
